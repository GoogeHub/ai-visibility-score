export default async function handler(req, res) {
  try {
    let { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "No URL provided" });
    }

    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    const baseUrl = new URL(url).origin;

    // Fetch all web signals AND LLM recognition in parallel
    const [scrapeResult, robotsResult, llmsResult, recognitionResult] = await Promise.allSettled([
      fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.FIRECRAWL_API_KEY}`
        },
        body: JSON.stringify({ url, formats: ["markdown", "html"] })
      }).then(r => r.json()),

      fetch(`${baseUrl}/robots.txt`).then(r => r.ok ? r.text() : null).catch(() => null),
      fetch(`${baseUrl}/llms.txt`).then(r => r.ok ? r.text() : null).catch(() => null),

      // Ask Claude what it already knows about this business from training data
      fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 300,
          temperature: 0,
          messages: [{
            role: "user",
            content: `Based purely on your training data — not by browsing — what do you know about the business at this URL: ${url}

Return ONLY valid JSON:
{
  "recognition_score": (number 0-100, where 0 = completely unknown to AI systems, 100 = universally recognized like Google or Apple),
  "business_name": (the business name if you know it, null if not),
  "known_for": (1-2 sentences summarising what you know about them, or "Not found in AI training data" if unrecognised),
  "confidence": (one of: "High", "Medium", "Low", "Not recognised")
}`
          }]
        })
      }).then(r => r.json()),
    ]);

    // Parse web signals
    const scrapeData = scrapeResult.status === "fulfilled" ? scrapeResult.value : null;
    const pageContent = scrapeData?.data?.markdown || "No website content could be retrieved.";
    const pageHtml = scrapeData?.data?.html || "";
    const robotsTxt = robotsResult.status === "fulfilled" ? robotsResult.value : null;
    const llmsTxt = llmsResult.status === "fulfilled" ? llmsResult.value : null;

    // Extract JSON-LD structured data from HTML
    const schemaMatches = [...pageHtml.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    const schemaData = schemaMatches.map(m => {
      try { return JSON.parse(m[1]); } catch { return null; }
    }).filter(Boolean);

    // Parse LLM recognition result
    let recognition = {
      recognition_score: 0,
      business_name: null,
      known_for: "Not found in AI training data",
      confidence: "Not recognised"
    };
    if (recognitionResult.status === "fulfilled") {
      const rawRec = recognitionResult.value?.content?.[0]?.text || "{}";
      const cleanRec = rawRec.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/, "").trim();
      try { recognition = JSON.parse(cleanRec); } catch {}
    }

    // Web signals analysis
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 800,
        temperature: 0,
        messages: [{
          role: "user",
          content: `Analyze this website's signals for AI visibility — how well is it technically optimised for AI systems to find, understand, and cite it?

Website URL: ${url}

--- PAGE CONTENT ---
${pageContent.slice(0, 3000)}

--- STRUCTURED DATA (schema.org JSON-LD) ---
${schemaData.length > 0 ? JSON.stringify(schemaData, null, 2).slice(0, 1000) : "None detected"}

--- ROBOTS.TXT ---
${robotsTxt ? robotsTxt.slice(0, 600) : "Not found"}

--- LLMS.TXT ---
${llmsTxt ? llmsTxt.slice(0, 600) : "Not present"}

Return ONLY valid JSON:
{
  "web_score": (number 0-100, based purely on website signals: content quality, schema markup, AI crawler access, llms.txt presence),
  "web_label": (one of: "Poor", "Fair", "Good", "Excellent"),
  "explanation": (2-3 sentences about the website's AI optimisation),
  "strengths": [2-3 short strings of what the site does well],
  "recommendations": [3-4 short actionable improvements for the website]
}

No extra text, just the JSON.`
        }]
      })
    });

    const anthropicData = await anthropicResponse.json();
    const rawText = anthropicData?.content?.[0]?.text || "{}";
    const text = rawText.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/, "").trim();

    let webAnalysis;
    try {
      webAnalysis = JSON.parse(text);
    } catch {
      return res.status(500).json({ error: "Failed to parse AI response" });
    }

    res.status(200).json({
      ...webAnalysis,
      recognition_score: recognition.recognition_score,
      business_name: recognition.business_name,
      known_for: recognition.known_for,
      confidence: recognition.confidence,
    });

  } catch (error) {
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
}
