export default async function handler(req, res) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ result: "No URL provided" });
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
        max_tokens: 400,
        messages: [
          {
            role: "user",
            content: `Analyze this website for AI visibility.

Website URL: ${url}

Return EXACTLY in this format:

Score: X/100

Explanation:
(2–3 sentences)

Recommendations:
- ...
- ...
- ...

Website content:
${pageContent}`
          }
        ]
      })
    });

    const anthropicData = await anthropicResponse.json();
    const text = anthropicData?.content?.[0]?.text || "Error getting result";

    res.status(200).json({ result: text });
  } catch (error) {
    res.status(500).json({ result: `Server error: ${error.message}` });
  }
}
