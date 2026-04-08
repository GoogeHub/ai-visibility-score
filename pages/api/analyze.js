export default async function handler(req, res) {
  try {
    let { url, businessName, industry, targetQuery } = req.body;

    if (!url) return res.status(400).json({ error: "No URL provided" });
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

    const baseUrl = new URL(url).origin;
    const bizContext = businessName ? `Business name: ${businessName}` : `Website: ${url}`;
    const indContext = industry ? `Industry: ${industry}` : "";
    const goalContext = targetQuery ? `Their goal: Be recommended by AI when someone searches for "${targetQuery}"` : "";

    // Run all fetches in parallel
    const [scrapeResult, robotsResult, llmsResult, rawHtmlResult, recognitionResult, queryTestResult] = await Promise.allSettled([

      // Firecrawl scrape
      fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.FIRECRAWL_API_KEY}` },
        body: JSON.stringify({ url, formats: ["markdown"] })
      }).then(r => r.json()),

      // robots.txt
      fetch(`${baseUrl}/robots.txt`).then(r => r.ok ? r.text() : null).catch(() => null),

      // llms.txt
      fetch(`${baseUrl}/llms.txt`).then(r => r.ok ? r.text() : null).catch(() => null),

      // Raw HTML for schema extraction
      fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; AIVisibilityBot/1.0)" } })
        .then(r => r.ok ? r.text() : null).catch(() => null),

      // LLM recognition — now uses business name + industry for accuracy
      fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 300,
          temperature: 0,
          messages: [{
            role: "user",
            content: `Based purely on your training data, what do you know about this business?

${bizContext}
${indContext}
Website: ${url}

Return ONLY valid JSON:
{
  "recognition_score": (0-100, where 0 = completely unknown, 100 = universally recognised like Google or Apple),
  "known_for": (1-2 sentences of what you know about them, or "Not found in AI training data" if unrecognised),
  "confidence": ("High", "Medium", "Low", or "Not recognised")
}`
          }]
        })
      }).then(r => r.json()),

      // Target query test — only runs if targetQuery was provided
      targetQuery
        ? fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
            body: JSON.stringify({
              model: "claude-haiku-4-5-20251001",
              max_tokens: 300,
              temperature: 0,
              messages: [{
                role: "user",
                content: `If someone asked you: "${targetQuery}"

Based on your training data, would you recommend or mention "${businessName || url}" in your response? Be honest.

Return ONLY valid JSON:
{
  "would_recommend": (true or false),
  "likelihood": ("Very likely", "Somewhat likely", "Unlikely", or "Very unlikely"),
  "reason": (1 sentence explaining why or why not)
}`
              }]
            })
          }).then(r => r.json())
        : Promise.resolve(null),

    ]);

    // Parse results
    const scrapeData = scrapeResult.status === "fulfilled" ? scrapeResult.value : null;
    const pageContent = scrapeData?.data?.markdown || "No content retrieved.";
    const robotsTxt = robotsResult.status === "fulfilled" ? robotsResult.value : null;
    const llmsTxt = llmsResult.status === "fulfilled" ? llmsResult.value : null;
    const rawHtml = rawHtmlResult.status === "fulfilled" ? rawHtmlResult.value : "";

    // Extract JSON-LD schema from raw HTML
    const schemaMatches = [...(rawHtml || "").matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    const schemaData = schemaMatches.map(m => { try { return JSON.parse(m[1]); } catch { return null; } }).filter(Boolean);

    // Parse recognition
    let recognition = { recognition_score: 0, known_for: "Not found in AI training data", confidence: "Not recognised" };
    if (recognitionResult.status === "fulfilled") {
      const raw = recognitionResult.value?.content?.[0]?.text || "{}";
      const clean = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/, "").trim();
      try { recognition = JSON.parse(clean); } catch {}
    }

    // Parse target query test
    let queryTest = null;
    if (queryTestResult.status === "fulfilled" && queryTestResult.value) {
      const raw = queryTestResult.value?.content?.[0]?.text || "{}";
      const clean = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/, "").trim();
      try { queryTest = JSON.parse(clean); } catch {}
    }

    // Main analysis — uses all signals + business context
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1200,
        temperature: 0,
        messages: [{
          role: "user",
          content: `Analyse this business's website for AI visibility.

${bizContext}
${indContext}
${goalContext}

--- PAGE CONTENT ---
${pageContent.slice(0, 3000)}

--- STRUCTURED DATA (schema.org) ---
${schemaData.length > 0 ? JSON.stringify(schemaData).slice(0, 800) : "None detected"}

--- ROBOTS.TXT ---
${robotsTxt ? robotsTxt.slice(0, 400) : "Not found"}

--- LLMS.TXT ---
${llmsTxt ? llmsTxt.slice(0, 400) : "Not present"}

Return ONLY valid JSON:
{
  "web_score": (0-100, based on website signals: content quality, schema markup, AI crawler access, llms.txt),
  "web_label": ("Poor", "Fair", "Good", or "Excellent"),
  "explanation": (2-3 plain-English sentences summarising their AI visibility situation, referring to them by business name if known),
  "content_gaps": [3-4 specific topics, language patterns, or information types that are missing from the site and that AI needs to understand and recommend them],
  "priority_fixes": [
    { "title": "short fix title", "impact": "High or Medium", "effort": "Low, Medium, or High", "detail": "one sentence on what to do" },
    { "title": "...", "impact": "...", "effort": "...", "detail": "..." },
    { "title": "...", "impact": "...", "effort": "...", "detail": "..." },
    { "title": "...", "impact": "...", "effort": "...", "detail": "..." }
  ],
  "technical_issues": [2-3 specific technical findings about schema markup, robots.txt, llms.txt, or AI crawler access],
  "benchmark_note": (1 sentence estimating how this score compares to typical businesses in their industry. Must be consistent with benchmark_avg. e.g. "Most branding agencies score around 35 on AI visibility, placing this business slightly above average."),
  "benchmark_avg": (a single estimated average score number 0-100 for their industry — must match what you say in benchmark_note)
}

No extra text. Just the JSON.`
        }]
      })
    });

    const anthropicData = await anthropicResponse.json();
    const rawText = anthropicData?.content?.[0]?.text || "{}";
    const cleanText = rawText.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/, "").trim();

    let analysis;
    try { analysis = JSON.parse(cleanText); }
    catch { return res.status(500).json({ error: "Failed to parse AI response" }); }

    const overall_score = Math.round((analysis.web_score + recognition.recognition_score) / 2);
    const overall_label =
      overall_score >= 75 ? "Strong" :
      overall_score >= 50 ? "Visible" :
      overall_score >= 25 ? "Emerging" : "Invisible";

    res.status(200).json({
      overall_score,
      overall_label,
      web_score: analysis.web_score,
      web_label: analysis.web_label,
      recognition_score: recognition.recognition_score,
      confidence: recognition.confidence,
      known_for: recognition.known_for,
      explanation: analysis.explanation,
      content_gaps: analysis.content_gaps || [],
      priority_fixes: analysis.priority_fixes || [],
      technical_issues: analysis.technical_issues || [],
      benchmark_note: analysis.benchmark_note || null,
      benchmark_avg: analysis.benchmark_avg || null,
      query_test: queryTest,
      business_name: businessName || null,
      industry: industry || null,
      target_query: targetQuery || null,
    });

  } catch (error) {
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
}
