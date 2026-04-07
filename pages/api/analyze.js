export default async function handler(req, res) {
  const { url } = req.body;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `Give a simple AI visibility score (out of 100) for this website: ${url}. Respond with one sentence.`
        }
      ]
    })
  });

  const data = await response.json();

  const text = data.content?.[0]?.text || "Error getting result";

  res.status(200).json({ result: text });
}
