import { useState } from "react";
import { useRouter } from "next/router";

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  fontSize: 15,
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  outline: "none",
  backgroundColor: "#fff",
  boxSizing: "border-box",
  color: "#0f172a",
};

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

function ResultsView({ result, onReset }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Two Score Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

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

      {/* What AI Knows */}
      <div style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
        <h2 style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" }}>
          What AI Already Knows
        </h2>
        {result.business_name && (
          <div style={{ fontWeight: 600, color: "#0f172a", marginBottom: 6 }}>{result.business_name}</div>
        )}
        <p style={{ margin: 0, color: "#334155", fontSize: 15, lineHeight: 1.7 }}>{result.known_for}</p>
      </div>

      {/* Website Signal Summary */}
      <div style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
        <h2 style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px" }}>
          Website Signal Summary
        </h2>
        <p style={{ margin: 0, color: "#334155", fontSize: 15, lineHeight: 1.7 }}>{result.explanation}</p>
      </div>

      {/* Strengths */}
      {result.strengths?.length > 0 && (
        <div style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>
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
        <div style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>
            Recommendations
          </h2>
          <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            {result.recommendations.map((r, i) => (
              <li key={i} style={{ color: "#334155", fontSize: 15, lineHeight: 1.5 }}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Run Another */}
      <button
        onClick={onReset}
        style={{
          marginTop: 8,
          padding: "14px",
          backgroundColor: "#f1f5f9",
          color: "#0f172a",
          border: "none",
          borderRadius: 10,
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        ← Check Another Website
      </button>

    </div>
  );
}

export default function Check() {
  const router = useRouter();
  const [form, setForm] = useState({
    businessName: "",
    url: "",
    industry: "",
    targetQuery: "",
    email: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: form.url }),
      });
      const data = await res.json();
      if (data.error) {
        setError("Something went wrong. Please try again.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  function handleReset() {
    setResult(null);
    setForm({ businessName: "", url: "", industry: "", targetQuery: "", email: "" });
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>

      {/* Nav */}
      <nav style={{
        padding: "20px 40px",
        borderBottom: "1px solid #e2e8f0",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <button
          onClick={() => router.push("/")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 800, fontSize: 17, color: "#0f172a" }}
        >
          AI Visibility Score
        </button>
      </nav>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "60px 24px" }}>

        {!result ? (
          <>
            <div style={{ marginBottom: 40 }}>
              <h1 style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#0f172a",
                margin: "0 0 8px",
                letterSpacing: "-0.01em",
              }}>
                Check your AI Visibility
              </h1>
              <p style={{ color: "#64748b", fontSize: 16, margin: 0, lineHeight: 1.6 }}>
                Tell us about your business and we'll analyse how AI systems currently see you.
              </p>
            </div>

            <div style={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 16,
              padding: "36px",
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}>

              {/* Business Name */}
              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#0f172a", marginBottom: 6, fontSize: 15 }}>
                  Business Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Studio Bravo"
                  value={form.businessName}
                  onChange={(e) => updateForm("businessName", e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* Website URL */}
              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#0f172a", marginBottom: 6, fontSize: 15 }}>
                  Website URL <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="https://yourbusiness.com"
                  value={form.url}
                  onChange={(e) => updateForm("url", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && form.url && handleSubmit()}
                  style={inputStyle}
                />
              </div>

              {/* Industry */}
              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#0f172a", marginBottom: 6, fontSize: 15 }}>
                  Industry
                </label>
                <input
                  type="text"
                  placeholder="e.g. Branding, Legal, Architecture, Finance"
                  value={form.industry}
                  onChange={(e) => updateForm("industry", e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* Target Query */}
              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#0f172a", marginBottom: 4, fontSize: 15 }}>
                  What do you want AI to recommend you for?
                </label>
                <p style={{ color: "#94a3b8", fontSize: 13, margin: "0 0 8px", lineHeight: 1.5 }}>
                  e.g. "Brand strategy agency in Melbourne" or "Commercial lawyer in Sydney"
                </p>
                <input
                  type="text"
                  placeholder="Your ideal AI recommendation..."
                  value={form.targetQuery}
                  onChange={(e) => updateForm("targetQuery", e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#0f172a", marginBottom: 6, fontSize: 15 }}>
                  Email{" "}
                  <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 13 }}>optional</span>
                </label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1px solid #f1f5f9" }} />

              {/* Submit */}
              <div>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !form.url}
                  style={{
                    width: "100%",
                    padding: "16px",
                    backgroundColor: loading || !form.url ? "#cbd5e1" : "#0f172a",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: loading || !form.url ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Analysing your AI visibility..." : "Get My AI Visibility Score →"}
                </button>

                {loading && (
                  <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 13, margin: "10px 0 0" }}>
                    This usually takes 15–30 seconds
                  </p>
                )}

                {error && (
                  <p style={{ textAlign: "center", color: "#ef4444", fontSize: 14, margin: "10px 0 0" }}>
                    {error}
                  </p>
                )}
              </div>

            </div>
          </>
        ) : (
          <ResultsView result={result} onReset={handleReset} />
        )}

      </div>
    </div>
  );
}
