export default async function handler(req, res) {
  const { url } = req.body;

  res.status(200).json({
    result: `Fake score for ${url}: 72/100`,
  });
}
