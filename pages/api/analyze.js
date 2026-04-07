export default async function handler(req, res) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "No URL provided" });
    }

    const scrapeResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"]
      })
    });

    const scrapeData = await scrapeResponse.json();

    const pageContent =
      scrapeData?.data?.markdown || "No website content could be retrieved.";

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
        messages: [
          {
            role: "user",
            content: `Analyze this website for AI visibility — meaning how well the site is optimized to be understood, cited, and recommended by AI systems like ChatGPT, Claude, and Perplexity.

Website URL: ${url}

Website content:
${pageContent}

Return ONLY a valid JSON object with exactly these fields:
{
  "score": (number 0-100),
  "label": (one of: "Poor", "Fair", "Good", "Excellent"),
  "explanation": (2-3 sentence summary of the site's AI visibility),
  "strengths": [array of 2-3 short strings of what the site does well],
  "recommendations": [array of 3-4 short actionable strings for improvement]
}

No extra text, just the JSON.`
          }
        ]
      })
    });

    const anthropicData = await anthropicResponse.json();
    const text = anthropicData?.content?.[0]?.text || "{}";

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
