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
      model: "claude-3-5-haiku-latest",
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

  res.status(200).json({
    result: JSON.stringify(data, null, 2)
  });
}
