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

    // Fetch all signals in parallel
    const [scrapeResult, robotsResult, llmsResult] = await Promise.allSettled([
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
    ]);

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
        messages: [
          {
            role: "user",
            content: `Analyze this website for AI visibility — how well would this business appear in results from AI systems like ChatGPT, Claude, and Perplexity? Consider the full picture of the business, not just the homepage.

Website URL: ${url}

--- PAGE CONTENT ---
${pageContent.slice(0, 3000)}

--- STRUCTURED DATA (schema.org JSON-LD) ---
${schemaData.length > 0 ? JSON.stringify(schemaData, null, 2).slice(0, 1000) : "None detected"}

--- ROBOTS.TXT ---
${robotsTxt ? robotsTxt.slice(0, 600) : "Not found"}

--- LLMS.TXT (LLM-specific content file) ---
${llmsTxt ? llmsTxt.slice(0, 600) : "Not present"}

Scoring guide:
- High score (70-100): Clear content, structured data present, AI crawlers allowed, llms.txt present, well-described business
- Mid score (40-69): Some content but missing key signals like schema or clear descriptions
- Low score (0-39): Thin content, AI crawlers blocked, no structured data, unclear what the business does

Return ONLY a valid JSON object with exactly these fields:
{
  "score": (number 0-100),
  "label": (one of: "Poor", "Fair", "Good", "Excellent"),
  "explanation": (2-3 sentence summary of the site's AI visibility),
  "strengths": [array of 2-3 short strings of what the site does well for AI visibility],
  "recommendations": [array of 3-4 short actionable strings for improvement]
}

No extra text, just the JSON.`
          }
        ]
      })
    });

    const anthropicData = await anthropicResponse.json();
    const rawText = anthropicData?.content?.[0]?.text || "{}";
    const text = rawText.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return res.status(500).json({ error: "Failed to parse AI response" });
    }

    res.status(200).json(parsed);
  } catch (error) {
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
}
