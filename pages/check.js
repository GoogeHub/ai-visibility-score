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

const labelConfig = {
  Strong:    { color: "#16a34a", bg: "#f0fdf4" },
  Visible:   { color: "#2563eb", bg: "#eff6ff" },
  Emerging:  { color: "#d97706", bg: "#fffbeb" },
  Invisible: { color: "#dc2626", bg: "#fef2f2" },
};

const subScoreColor = (score) => {
  if (score >= 71) return "#16a34a";
  if (score >= 41) return "#d97706";
  return "#dc2626";
};

function ScoreBar({ score }) {
  return (
    <div style={{ position: "relative", margin: "20px 0 8px" }}>
      <div style={{
        height: 12,
        borderRadius: 99,
        background: "linear-gradient(to right, #1e3a8a, #d946ef)",
      }} />
      <div style={{
        position: "absolute",
        top: 6,
        left: `${Math.min(Math.max(score, 2), 98)}%`,
        transform: "translate(-50%, -50%)",
        width: 20,
        height: 20,
        borderRadius: "50%",
        backgroundColor: "#fff",
        border: "3px solid #0f172a",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "#94a3b8" }}>
        <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
      </div>
    </div>
  );
}

function SubScoreRow({ label, score, description }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: "#0f172a" }}>{label}</span>
        <span style={{ fontWeight: 700, fontSize: 15, color: subScoreColor(score) }}>{score} / 100</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, backgroundColor: "#f1f5f9", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${score}%`,
          borderRadius: 99,
          background: "linear-gradient(to right, #1e3a8a, #d946ef)",
          transition: "width 0.6s ease",
        }} />
      </div>
      {description && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{description}</div>}
    </div>
  );
}

function LockedCard({ title, teaser, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      backgroundColor: "#fff",
      border: `1px solid ${open ? "#d946ef" : "#e2e8f0"}`,
      borderRadius: 12,
      overflow: "hidden",
      transition: "border-color 0.2s",
    }}>
      {/* Header — always visible, clickable */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: "20px 20px 16px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{teaser}</div>
        </div>
        <span style={{ fontSize: 18, marginLeft: 12, flexShrink: 0 }}>
          {open ? "🔓" : "🔒"}
        </span>
      </div>

      {/* Revealed content */}
      {open ? (
        <div style={{ padding: "0 20px 20px", borderTop: "1px solid #f1f5f9" }}>
          <div style={{
            marginTop: 14,
            padding: "10px 12px",
            backgroundColor: "#fdf4ff",
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 600,
            color: "#a21caf",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}>
            Demo preview — this is what unlocking reveals
          </div>
          {children}
        </div>
      ) : (
        /* Fake placeholder rows */
        <div style={{ padding: "0 20px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {[80, 60, 45].map((w, i) => (
            <div key={i} style={{ height: 10, width: `${w}%`, borderRadius: 99, backgroundColor: "#f1f5f9" }} />
          ))}
        </div>
      )}
    </div>
  );
}

function ResultsView({ result, formData, onReset }) {
  const labelCfg = labelConfig[result.web_label] || labelConfig.Emerging;
  const displayName = formData.businessName || result.business_name || "Your business";

  const aiRecognitionContent = () => {
    if (result.recognition_score === 0) {
      return (
        <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.8 }}>
          <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
            Score: 0 / 100 — Not in AI training data
          </div>
          <p style={{ margin: "0 0 12px" }}>
            {displayName} doesn't appear in AI training data — and that's completely normal for the vast majority of businesses. AI models only "memorise" brands that appear repeatedly across the web in their training dataset: think Google, Atlassian, major law firms.
          </p>
          <p style={{ margin: 0 }}>
            The good news: it doesn't stop AI from recommending you. Most AI tools people actually use — Perplexity, ChatGPT with browsing, Google AI Overviews — search the web in real time, not from memory. Your Web Signals score is what drives those recommendations. Training data recognition builds naturally as your online presence grows, and for most businesses, there's no shortcut needed — or available.
          </p>
        </div>
      );
    }
    return (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, alignItems: "center", marginBottom: 14 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 42, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{result.recognition_score}</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>/ 100</div>
          </div>
          <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.6 }}>
            <div style={{ fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>Confidence: {result.confidence}</div>
            {result.known_for}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Main Score */}
      <div style={{
        backgroundColor: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        padding: "32px 24px 24px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>
          {displayName}
        </div>
        <div style={{ fontSize: 72, fontWeight: 800, color: "#0f172a", lineHeight: 1, letterSpacing: "-0.03em" }}>
          {result.web_score}
          <span style={{ fontSize: 32, fontWeight: 600, color: "#94a3b8" }}> / 100</span>
        </div>

        <ScoreBar score={result.web_score} />

        <div style={{
          display: "inline-block",
          marginTop: 12,
          padding: "6px 20px",
          backgroundColor: labelCfg.bg,
          color: labelCfg.color,
          borderRadius: 99,
          fontWeight: 700,
          fontSize: 15,
        }}>
          {result.web_label}
        </div>

        <p style={{
          fontSize: 15,
          color: "#475569",
          lineHeight: 1.7,
          margin: "16px 0 0",
          textAlign: "left",
        }}>
          {result.explanation}
        </p>
      </div>

      {/* Locked sections */}
      <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", padding: "4px 0 0 2px" }}>
        Full Report
      </div>

      <LockedCard
        title="Industry Benchmark"
        teaser={`How does ${displayName} compare to other ${formData.industry || "businesses"} in AI visibility?`}
      >
        <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.7 }}>
          {result.benchmark_note || `Most businesses in this industry score between 25–55 on AI visibility. ${displayName}'s score of ${result.web_score} places them ${result.web_score >= 50 ? "above" : "below"} the typical range.`}
        </div>
        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ backgroundColor: "#f8fafc", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Your Score</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", marginTop: 2 }}>{result.web_score}</div>
          </div>
          <div style={{ backgroundColor: "#f8fafc", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Industry Avg</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#94a3b8", marginTop: 2 }}>
              {result.benchmark_avg ? `~${result.benchmark_avg}` : "—"}
            </div>
          </div>
        </div>
      </LockedCard>

      <LockedCard
        title="Target Query Test"
        teaser={
          formData.targetQuery
            ? `Does AI recommend you when someone searches for "${formData.targetQuery}"?`
            : "Does AI recommend you for the searches that matter most to your business?"
        }
      >
        {result.query_test ? (
          <div>
            {result.query_test.interpreted_intent && (
              <div style={{ marginBottom: 12, fontSize: 13, color: "#64748b" }}>
                <span style={{ fontWeight: 600, color: "#0f172a" }}>Interpreted as: </span>
                "{result.query_test.interpreted_intent}"
              </div>
            )}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
              padding: "12px 14px",
              backgroundColor: result.query_test.would_recommend ? "#f0fdf4" : "#fef2f2",
              borderRadius: 8,
            }}>
              <span style={{ fontSize: 22 }}>{result.query_test.would_recommend ? "✅" : "❌"}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{result.query_test.likelihood}</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>
                  {result.query_test.would_recommend ? "AI would recommend you" : "AI would not recommend you"} based on your website content
                </div>
              </div>
            </div>
            <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, marginBottom: result.query_test.content_fix ? 10 : 0 }}>
              <strong>Why:</strong> {result.query_test.reason}
            </div>
            {result.query_test.content_fix && (
              <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, padding: "10px 14px", backgroundColor: "#fffbeb", borderRadius: 8, borderLeft: "3px solid #f59e0b" }}>
                <strong>Quick fix:</strong> {result.query_test.content_fix}
              </div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: 14, color: "#64748b" }}>
            No target query was provided. Add one to the form to see this test.
          </div>
        )}
      </LockedCard>

      <LockedCard
        title="Content Gap Analysis"
        teaser="The specific language and topics AI is missing from your site — and exactly how to add them."
      >
        {result.content_gaps?.length > 0 ? (
          <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 10 }}>
            {result.content_gaps.map((gap, i) => (
              <li key={i} style={{ fontSize: 14, color: "#334155", lineHeight: 1.6 }}>{gap}</li>
            ))}
          </ul>
        ) : (
          <div style={{ fontSize: 14, color: "#64748b" }}>No content gaps detected.</div>
        )}
      </LockedCard>

      <LockedCard
        title="AI Recognition"
        teaser="Is your business already known by AI — and does it matter for you?"
      >
        {aiRecognitionContent()}
      </LockedCard>

      <LockedCard
        title="Priority Fix List"
        teaser="Your highest-impact improvements ranked by effort, with step-by-step guidance."
      >
        {result.priority_fixes?.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {result.priority_fixes.map((fix, i) => (
              <div key={i} style={{ padding: "12px 14px", backgroundColor: "#f8fafc", borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{fix.title}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99,
                      backgroundColor: fix.impact === "High" ? "#fef2f2" : "#fffbeb",
                      color: fix.impact === "High" ? "#dc2626" : "#d97706",
                    }}>{fix.impact} impact</span>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99,
                      backgroundColor: "#f1f5f9", color: "#64748b",
                    }}>{fix.effort} effort</span>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{fix.detail}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 14, color: "#64748b" }}>No fixes available.</div>
        )}
      </LockedCard>

      {/* Unlock CTA */}
      <div style={{
        backgroundColor: "#0f172a",
        borderRadius: 16,
        padding: "28px 24px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Unlock Full Report
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
          $49
        </div>
        <p style={{ fontSize: 14, color: "#94a3b8", margin: "0 0 20px", lineHeight: 1.6 }}>
          Industry benchmark · Target query test · Content gaps · Priority fixes
        </p>
        <button
          onClick={() => alert("Payment coming soon! We'll be in touch.")}
          style={{
            width: "100%",
            padding: "16px",
            backgroundColor: "#fff",
            color: "#0f172a",
            border: "none",
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          🔓 Unlock Full Report — $49
        </button>
        {formData.email && (
          <div style={{ marginTop: 12, fontSize: 12, color: "#64748b" }}>
            Report will be sent to {formData.email}
          </div>
        )}
      </div>

      {/* Run another */}
      <button
        onClick={onReset}
        style={{
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
        body: JSON.stringify({
          url: form.url,
          businessName: form.businessName,
          industry: form.industry,
          targetQuery: form.targetQuery,
        }),
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

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "60px 24px 80px" }}>

        {!result ? (
          <>
            <div style={{ marginBottom: 40 }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.01em" }}>
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

              <div style={{ borderTop: "1px solid #f1f5f9" }} />

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
          <ResultsView result={result} formData={form} onReset={handleReset} />
        )}

      </div>
    </div>
  );
}
