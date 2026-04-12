export default async function handler(req, res) {
  try {
    let { url, businessName, industry, targetQueries } = req.body;

    if (!url) return res.status(400).json({ error: "No URL provided" });
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

    const baseUrl = new URL(url).origin;
    const bizContext = businessName ? `Business name: ${businessName}` : `Website: ${url}`;
    const indContext = industry ? `Industry: ${industry}` : "";
    const queries = Array.isArray(targetQueries)
      ? targetQueries.map(q => q?.trim()).filter(Boolean)
      : [];
    const goalContext = queries.length > 0
      ? `Their goal: Be recommended by AI for searches related to: ${queries.map(q => `"${q}"`).join(", ")} — interpret these charitably and broadly. Focus on underlying intent.`
      : "";

    // ─── PHASE 1: Fetch all web signals + recognition in parallel ───────────
    const [scrapeResult, robotsResult, llmsResult, rawHtmlResult, recognitionResult] = await Promise.allSettled([

      fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.FIRECRAWL_API_KEY}` },
        body: JSON.stringify({ url, formats: ["markdown"] })
      }).then(r => r.json()),

      fetch(`${baseUrl}/robots.txt`).then(r => r.ok ? r.text() : null).catch(() => null),

      fetch(`${baseUrl}/llms.txt`).then(r => r.ok ? r.text() : null).catch(() => null),

      fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; AIVisibilityBot/1.0)" } })
        .then(r => r.ok ? r.text() : null).catch(() => null),

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

Return ONLY valid JSON. Important rules:
- If you have no specific knowledge of this business, recognition_score MUST be 0 and confidence MUST be "Not recognised"
- Do not give a non-zero score as a hedge — only score above 0 if you can actually describe what the business does from training data
- The score and known_for text must be consistent with each other

{
  "recognition_score": (0-100, where 0 = no specific knowledge, 100 = universally recognised like Google or Apple),
  "known_for": (1-2 sentences of what you know about them, or "Not found in AI training data" if unrecognised),
  "confidence": ("High", "Medium", "Low", or "Not recognised")
}`
          }]
        })
      }).then(r => r.json()),

    ]);

    // Parse Phase 1 results
    const scrapeData = scrapeResult.status === "fulfilled" ? scrapeResult.value : null;
    const pageContent = scrapeData?.data?.markdown || "No content retrieved.";
    const robotsTxt = robotsResult.status === "fulfilled" ? robotsResult.value : null;
    const llmsTxt = llmsResult.status === "fulfilled" ? llmsResult.value : null;
    const rawHtml = rawHtmlResult.status === "fulfilled" ? rawHtmlResult.value : "";

    const schemaMatches = [...(rawHtml || "").matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    const schemaData = schemaMatches.map(m => { try { return JSON.parse(m[1]); } catch { return null; } }).filter(Boolean);

    let recognition = { recognition_score: 0, known_for: "Not found in AI training data", confidence: "Not recognised" };
    if (recognitionResult.status === "fulfilled") {
      const raw = recognitionResult.value?.content?.[0]?.text || "{}";
      const clean = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/, "").trim();
      try { recognition = JSON.parse(clean); } catch {}
    }
    if (recognition.confidence === "Not recognised" || recognition.known_for === "Not found in AI training data") {
      recognition.recognition_score = 0;
    }

    // ─── PHASE 2: Main analysis + query test in parallel (both use page content) ───
    const [analysisResult, queryTestResult] = await Promise.allSettled([

      // Main web signals analysis
      fetch("https://api.anthropic.com/v1/messages", {
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
  "content_gaps": [3-4 specific topics, language patterns, or information types that are missing from the site that AI needs to understand and recommend them],
  "priority_fixes": [
    { "title": "short fix title", "impact": "High or Medium", "effort": "Low, Medium, or High", "detail": "one sentence on what to do" },
    { "title": "...", "impact": "...", "effort": "...", "detail": "..." },
    { "title": "...", "impact": "...", "effort": "...", "detail": "..." },
    { "title": "...", "impact": "...", "effort": "...", "detail": "..." }
  ],
  "technical_issues": [2-3 specific technical findings about schema markup, robots.txt, llms.txt, or AI crawler access],
  "benchmark_note": (1 sentence estimating how this score compares to typical businesses in their industry — must be consistent with benchmark_avg),
  "benchmark_avg": (a single estimated average score number 0-100 for their industry — must match benchmark_note)
}

No extra text. Just the JSON.`
          }]
        })
      }).then(r => r.json()),

      // Query group test — clusters similar queries by intent, then tests each distinct group
      queries.length > 0
        ? fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
            body: JSON.stringify({
              model: "claude-haiku-4-5-20251001",
              max_tokens: 800,
              temperature: 0,
              messages: [{
                role: "user",
                content: `You are analysing a website to see if an AI-powered web search tool would recommend it for various searches.

${bizContext}
${indContext}

--- WEBSITE CONTENT ---
${pageContent.slice(0, 2000)}

---

The business wants to be found for these searches:
${queries.map((q, i) => `${i + 1}. "${q}"`).join("\n")}

Step 1 — Group by intent: Identify which queries represent meaningfully DIFFERENT search intents vs. essentially the same intent worded differently. Queries that are semantically the same (e.g. "build my website" and "develop my company website") should be merged into one group. Each distinct intent becomes its own group. Interpret each query charitably — typos or loose wording should be understood by intent.

Step 2 — For each distinct intent group: assess whether an AI web search tool that found this website would recommend this business for that type of search. Base this purely on the website content above — not training data.

Return ONLY valid JSON:
{
  "query_groups": [
    {
      "intent": (short plain-English phrase describing this group's search intent),
      "queries": [array of the original query strings belonging to this group],
      "would_recommend": (true or false),
      "likelihood": ("Very likely", "Somewhat likely", "Unlikely", or "Very unlikely"),
      "reason": (1-2 sentences based on what is or isn't evident in the website content),
      "content_fix": (single most impactful content change to improve this result — only include if would_recommend is false, otherwise null)
    }
  ]
}`
              }]
            })
          }).then(r => r.json())
        : Promise.resolve(null),

    ]);

    // Parse Phase 2 results
    const anthropicData = analysisResult.status === "fulfilled" ? analysisResult.value : null;
    const rawText = anthropicData?.content?.[0]?.text || "{}";
    const cleanText = rawText.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/, "").trim();

    let analysis;
    try { analysis = JSON.parse(cleanText); }
    catch { return res.status(500).json({ error: "Failed to parse AI response" }); }

    let queryGroups = [];
    if (queryTestResult.status === "fulfilled" && queryTestResult.value) {
      const raw = queryTestResult.value?.content?.[0]?.text || "{}";
      const clean = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/, "").trim();
      try { queryGroups = JSON.parse(clean)?.query_groups || []; } catch {}
    }

    // ─── Self-notification ───────────────────────────────────────────────────
    const queriesText = queries.length > 0
      ? queries.map((q, i) => `<li>Query ${i + 1}: ${q}</li>`).join("")
      : "<li>None entered</li>";

    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "AI Score Scout <report@mail.aiscorescout.com>",
        to: ["googe@studiobravo.com.au"],
        subject: `📊 New analysis: ${businessName || url}`,
        html: `
          <div style="font-family: sans-serif; font-size: 15px; color: #0f172a; max-width: 480px;">
            <h2 style="margin: 0 0 16px;">New analysis submitted</h2>
            <table style="border-collapse: collapse; width: 100%;">
              <tr><td style="padding: 8px 0; color: #64748b; width: 140px;">URL</td><td style="padding: 8px 0;"><a href="${url}">${url}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Business name</td><td style="padding: 8px 0;">${businessName || "—"}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Industry</td><td style="padding: 8px 0;">${industry || "—"}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Email</td><td style="padding: 8px 0;">${req.body.email || "—"}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;">Target queries</td><td style="padding: 8px 0;"><ul style="margin: 0; padding-left: 16px;">${queriesText}</ul></td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Score</td><td style="padding: 8px 0;"><strong>${analysis.web_score} / 100 — ${analysis.web_label}</strong></td></tr>
            </table>
          </div>
        `,
      }),
    }).catch(() => {}); // fire and forget — never block the main response

    res.status(200).json({
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
      query_groups: queryGroups,
      business_name: businessName || null,
      industry: industry || null,
    });

  } catch (error) {
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
}
