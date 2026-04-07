export default async function handler(req, res) {
  const response = await fetch("https://api.anthropic.com/v1/models", {
    method: "GET",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    }
  });

  const data = await response.json();

  res.status(200).json({
    result: JSON.stringify(data, null, 2)
  });
}
