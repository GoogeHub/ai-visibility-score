import { useState } from "react";

const scoreColor = (score) => {
  if (score >= 71) return "#22c55e";
  if (score >= 41) return "#f59e0b";
  return "#ef4444";
};

const scoreBackground = (score) => {
  if (score >= 71) return "#f0fdf4";
  if (score >= 41) return "#fffbeb";
  return "#fef2f2";
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: "60px 20px",
    }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#0f172a", margin: 0 }}>
            AI Visibility Score
          </h1>
          <p style={{ color: "#64748b", marginTop: 10, fontSize: 16 }}>
            See how visible your website is to AI systems like ChatGPT, Claude, and Perplexity.
          </p>
        </div>

        {/* Input */}
        <div style={{ display: "flex", gap: 10, marginBottom: 40 }}>
          <input
            type="text"
            placeholder="https://yourwebsite.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={{
              flex: 1,
              padding: "12px 16px",
              fontSize: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              outline: "none",
              backgroundColor: "#fff",
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !url}
            style={{
              padding: "12px 24px",
              fontSize: 16,
              fontWeight: 600,
              backgroundColor: loading || !url ? "#94a3b8" : "#0f172a",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: loading || !url ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", color: "#64748b", fontSize: 15 }}>
            Scraping site and analyzing with AI...
          </div>
        )}

        {/* Results */}
        {result && !result.error && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Score Card */}
            <div style={{
              backgroundColor: scoreBackground(result.score),
              border: `1px solid ${scoreColor(result.score)}40`,
              borderRadius: 12,
              padding: 32,
              textAlign: "center",
            }}>
              <div style={{
                fontSize: 72,
                fontWeight: 800,
                color: scoreColor(result.score),
                lineHeight: 1,
              }}>
                {result.score}
              </div>
              <div style={{ fontSize: 18, color: "#475569", marginTop: 6 }}>out of 100</div>
              <div style={{
                display: "inline-block",
                marginTop: 12,
                padding: "4px 14px",
                backgroundColor: scoreColor(result.score),
                color: "#fff",
                borderRadius: 99,
                fontSize: 14,
                fontWeight: 600,
              }}>
                {result.label}
              </div>
            </div>

            {/* Explanation */}
            <div style={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: 24,
            }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px" }}>
                Summary
              </h2>
              <p style={{ margin: 0, color: "#334155", fontSize: 15, lineHeight: 1.7 }}>
                {result.explanation}
              </p>
            </div>

            {/* Strengths */}
            {result.strengths?.length > 0 && (
              <div style={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: 24,
              }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>
                  What's Working
                </h2>
                <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.strengths.map((s, i) => (
                    <li key={i} style={{ color: "#334155", fontSize: 15, lineHeight: 1.5 }}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations?.length > 0 && (
              <div style={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: 24,
              }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>
                  Recommendations
                </h2>
                <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.recommendations.map((r, i) => (
                    <li key={i} style={{ color: "#334155", fontSize: 15, lineHeight: 1.5 }}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        )}

        {result?.error && (
          <div style={{ color: "#ef4444", textAlign: "center" }}>
            Something went wrong. Please try again.
          </div>
        )}

      </div>
    </div>
  );
}
