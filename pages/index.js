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

const scoreBorder = (score) => {
  if (score >= 71) return "#bbf7d0";
  if (score >= 41) return "#fde68a";
  return "#fecaca";
};

const confidenceColor = (confidence) => {
  if (confidence === "High") return "#22c55e";
  if (confidence === "Medium") return "#f59e0b";
  if (confidence === "Low") return "#ef4444";
  return "#94a3b8";
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
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

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
            Scraping site and checking AI signals...
          </div>
        )}

        {/* Results */}
        {result && !result.error && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Two Score Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

              {/* Web Signals Score */}
              <div style={{
                backgroundColor: scoreBackground(result.web_score),
                border: `1px solid ${scoreBorder(result.web_score)}`,
                borderRadius: 12,
                padding: "24px 16px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                  Web Signals
                </div>
                <div style={{ fontSize: 56, fontWeight: 800, color: scoreColor(result.web_score), lineHeight: 1 }}>
                  {result.web_score}
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>out of 100</div>
                <div style={{
                  display: "inline-block",
                  marginTop: 10,
                  padding: "3px 12px",
                  backgroundColor: scoreColor(result.web_score),
                  color: "#fff",
                  borderRadius: 99,
                  fontSize: 13,
                  fontWeight: 600,
                }}>
                  {result.web_label}
                </div>
              </div>

              {/* AI Recognition Score */}
              <div style={{
                backgroundColor: scoreBackground(result.recognition_score),
                border: `1px solid ${scoreBorder(result.recognition_score)}`,
                borderRadius: 12,
                padding: "24px 16px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                  AI Recognition
                </div>
                <div style={{ fontSize: 56, fontWeight: 800, color: scoreColor(result.recognition_score), lineHeight: 1 }}>
                  {result.recognition_score}
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>out of 100</div>
                <div style={{
                  display: "inline-block",
                  marginTop: 10,
                  padding: "3px 12px",
                  backgroundColor: confidenceColor(result.confidence),
                  color: "#fff",
                  borderRadius: 99,
                  fontSize: 13,
                  fontWeight: 600,
                }}>
                  {result.confidence}
                </div>
              </div>

            </div>

            {/* What AI knows */}
            <div style={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: 24,
            }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" }}>
                What AI Already Knows
              </h2>
              {result.business_name && (
                <div style={{ fontWeight: 600, color: "#0f172a", marginBottom: 6 }}>{result.business_name}</div>
              )}
              <p style={{ margin: 0, color: "#334155", fontSize: 15, lineHeight: 1.7 }}>
                {result.known_for}
              </p>
            </div>

            {/* Web Summary */}
            <div style={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: 24,
            }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px" }}>
                Website Signal Summary
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
