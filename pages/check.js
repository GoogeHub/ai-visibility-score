import { useState } from "react";
import { useRouter } from "next/router";

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  fontSize: 16,
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
        border: "3px solid #1143cc",
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

function LockedCard({ title, teaser, children, unlocked }) {
  return (
    <div style={{
      backgroundColor: "#fff",
      border: `1px solid ${unlocked ? "#d946ef" : "#e2e8f0"}`,
      borderRadius: 12,
      overflow: "hidden",
      transition: "border-color 0.3s",
    }}>
      <div style={{
        padding: "20px 20px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#1143cc", marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{teaser}</div>
        </div>
        <span style={{ fontSize: 18, marginLeft: 12, flexShrink: 0 }}>
          {unlocked ? "🔓" : "🔒"}
        </span>
      </div>

      {unlocked ? (
        <div style={{ padding: "0 20px 20px", borderTop: "1px solid #f1f5f9", marginTop: 0 }}>
          <div style={{ marginTop: 16 }}>{children}</div>
        </div>
      ) : (
        <div style={{ padding: "0 20px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {[80, 60, 45].map((w, i) => (
            <div key={i} style={{ height: 10, width: `${w}%`, borderRadius: 99, backgroundColor: "#f1f5f9" }} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmailModal({ onClose, onSent, prefillEmail, result, formData }) {
  const [email, setEmail] = useState(prefillEmail || "");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  function formatCardNumber(val) {
    return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }
  function formatExpiry(val) {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + " / " + digits.slice(2);
    return digits;
  }

  async function handlePay() {
    if (!email || !cardNumber || !expiry || !cvv || !nameOnCard) return;
    setSending(true);
    setError(null);
    // Fake processing delay
    await new Promise(r => setTimeout(r, 1800));
    try {
      const res = await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, result, formData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setDone(true);
      setTimeout(() => onSent(email), 2000);
    } catch (err) {
      setError(err.message);
      setSending(false);
    }
  }

  const stripeInput = (extraStyle = {}) => ({
    width: "100%",
    padding: "11px 14px",
    border: "1px solid #e3e8ee",
    borderRadius: 6,
    fontSize: 16,
    color: "#0f172a",
    outline: "none",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    ...extraStyle,
  });

  const displayName = formData?.businessName || result?.business_name || "Your business";

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(15,23,42,0.65)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: 20,
    }}>
      <div style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        maxWidth: 420,
        width: "100%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        overflow: "hidden",
      }}>
        {!done ? (
          <>
            {/* Header stripe */}
            <div style={{ backgroundColor: "#f6f9fc", padding: "20px 24px 16px", borderBottom: "1px solid #e3e8ee" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 13, color: "#697386", marginBottom: 2 }}>AI Score Scout</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>$49.00</div>
                  <div style={{ fontSize: 13, color: "#697386", marginTop: 2 }}>Full AI Visibility Report — {displayName}</div>
                </div>
                <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#aab7c4", padding: 0, lineHeight: 1 }}>✕</button>
              </div>
            </div>

            {/* Form body */}
            <div style={{ padding: "20px 24px 24px" }}>

              {/* Email */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#697386", marginBottom: 5 }}>Email</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={stripeInput()}
                />
              </div>

              {/* Card info section */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#697386", marginBottom: 5 }}>Card information</label>
                {/* Card number */}
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="1234 1234 1234 1234"
                  value={cardNumber}
                  onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                  style={stripeInput({ borderRadius: "6px 6px 0 0", borderBottom: "none" })}
                />
                {/* Expiry + CVV row */}
                <div style={{ display: "flex" }}>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="MM / YY"
                    value={expiry}
                    onChange={e => setExpiry(formatExpiry(e.target.value))}
                    style={stripeInput({ borderRadius: "0 0 0 6px", width: "50%", borderRight: "none" })}
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="CVV"
                    value={cvv}
                    onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    style={stripeInput({ borderRadius: "0 0 6px 0", width: "50%" })}
                  />
                </div>
              </div>

              {/* Name on card */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#697386", marginBottom: 5 }}>Name on card</label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={nameOnCard}
                  onChange={e => setNameOnCard(e.target.value)}
                  style={stripeInput()}
                />
              </div>

              {error && (
                <div style={{ marginBottom: 12, fontSize: 13, color: "#dc2626" }}>{error}</div>
              )}

              {/* Pay button */}
              <button
                onClick={handlePay}
                disabled={sending || !email || !cardNumber || !expiry || !cvv || !nameOnCard}
                style={{
                  width: "100%",
                  padding: "13px",
                  backgroundColor: sending ? "#6772e5" : (!email || !cardNumber || !expiry || !cvv || !nameOnCard) ? "#aab7c4" : "#635bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: sending || !email || !cardNumber || !expiry || !cvv || !nameOnCard ? "not-allowed" : "pointer",
                  transition: "background-color 0.15s",
                  letterSpacing: "0.01em",
                }}
              >
                {sending ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Processing…
                  </span>
                ) : "Pay $49"}
              </button>

              {/* Stripe badge */}
              <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, color: "#aab7c4" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.25 3.75 10.15 9 11.35C17.25 21.15 21 16.25 21 11V5l-9-4z"/></svg>
                <span style={{ fontSize: 12 }}>Powered by</span>
                <svg width="40" height="16" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.8 10.9c0-.9.7-1.2 1.9-1.2 1.7 0 3.8.5 5.5 1.4V6.6C12.4 5.9 10.6 5.6 8.7 5.6c-4 0-6.7 2.1-6.7 5.5 0 5.4 7.4 4.5 7.4 6.8 0 1-.9 1.4-2.1 1.4-1.8 0-4.2-.8-6-1.8v4.6c2 .9 4 1.3 6 1.3 4.1 0 6.9-2 6.9-5.5-.1-5.8-7.3-4.8-7.3-7z" fill="#aab7c4"/>
                  <path d="M28.8 5.9l-.3 1.4c-.9-.5-2.1-.8-3.3-.8-2.8 0-4.8 2.1-4.8 5.2s2 5.2 4.8 5.2c1.2 0 2.4-.3 3.3-.8l.3 1.4h3.4V5.9h-3.4zm-.3 8.5c-.6.4-1.3.6-2.1.6-1.7 0-2.8-1.2-2.8-2.9s1.1-2.9 2.8-2.9c.8 0 1.5.2 2.1.6v4.6z" fill="#aab7c4"/>
                  <path d="M35.7 2.2h3.8v21h-3.8z" fill="#aab7c4"/>
                  <path d="M51.8 5.6c-3.5 0-5.9 2.5-5.9 5.9 0 3.9 2.7 5.8 6.1 5.8 1.8 0 3.4-.4 4.7-1.3v-3.3c-1.3.8-2.7 1.2-4.1 1.2-1.6 0-2.9-.6-3.2-2.1h8v-1.4c0-3.3-1.8-4.8-5.6-4.8zm-2.4 4.7c.2-1.4 1.1-2.1 2.3-2.1s2 .7 2.1 2.1h-4.4z" fill="#aab7c4"/>
                </svg>
              </div>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "48px 24px" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div style={{ fontWeight: 700, fontSize: 20, color: "#0f172a", marginBottom: 8 }}>Payment successful!</div>
            <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>Your full report is on its way to<br /><strong>{email}</strong></div>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultsView({ result, formData, onReset }) {
  const [showModal, setShowModal] = useState(false);
  const [reportSentTo, setReportSentTo] = useState(null);
  const [showFull, setShowFull] = useState(false);
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
      {showModal && (
        <EmailModal
          onClose={() => setShowModal(false)}
          onSent={(email) => { setReportSentTo(email); setShowModal(false); }}
          prefillEmail={formData.email}
          result={result}
          formData={formData}
        />
      )}

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
        unlocked={showFull}
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
        unlocked={showFull}
        title="Target Query Test"
        teaser={
          formData.targetQueries?.filter(Boolean).length > 0
            ? `Does AI recommend you for the ${formData.targetQueries.filter(Boolean).length} search${formData.targetQueries.filter(Boolean).length > 1 ? "es" : ""} you care about?`
            : "Does AI recommend you for the searches that matter most to your business?"
        }
      >
        {result.query_groups?.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {result.query_groups.map((group, i) => (
              <div key={i}>
                {result.query_groups.length > 1 && (
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                    Query {i + 1} of {result.query_groups.length}
                  </div>
                )}
                {/* Intent label */}
                <div style={{ marginBottom: 10, fontSize: 13, color: "#64748b" }}>
                  <span style={{ fontWeight: 600, color: "#0f172a" }}>Intent: </span>
                  "{group.intent}"
                  {group.queries?.length > 1 && (
                    <span style={{ marginLeft: 6, color: "#94a3b8" }}>
                      (merged {group.queries.length} similar queries)
                    </span>
                  )}
                </div>
                {/* Result */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                  padding: "12px 14px",
                  backgroundColor: group.would_recommend ? "#f0fdf4" : "#fef2f2",
                  borderRadius: 8,
                }}>
                  <span style={{ fontSize: 20 }}>{group.would_recommend ? "✅" : "❌"}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{group.likelihood}</div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>
                      {group.would_recommend ? "AI would recommend you" : "AI would not recommend you"} based on your website content
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, marginBottom: group.content_fix ? 10 : 0 }}>
                  <strong>Why:</strong> {group.reason}
                </div>
                {group.content_fix && (
                  <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, padding: "10px 14px", backgroundColor: "#fffbeb", borderRadius: 8, borderLeft: "3px solid #f59e0b" }}>
                    <strong>Quick fix:</strong> {group.content_fix}
                  </div>
                )}
                {i < result.query_groups.length - 1 && (
                  <div style={{ borderTop: "1px solid #f1f5f9", marginTop: 20 }} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 14, color: "#64748b" }}>
            No queries were provided. Add up to 3 target searches in the form to see this test.
          </div>
        )}
      </LockedCard>

      <LockedCard
        unlocked={showFull}
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
        unlocked={showFull}
        title="AI Recognition"
        teaser="Is your business already known by AI — and does it matter for you?"
      >
        {aiRecognitionContent()}
      </LockedCard>

      <LockedCard
        unlocked={showFull}
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

      {/* Email CTA */}
      {!reportSentTo ? (
        <div style={{
          backgroundColor: "#1143cc",
          borderRadius: 16,
          padding: "28px 24px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#93c5fd", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Unlock Full Report
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 8 }}>$49</div>
          <p style={{ fontSize: 14, color: "#93c5fd", margin: "0 0 20px", lineHeight: 1.6 }}>
            Industry benchmark · Target query tests · Content gaps · Priority fixes · AI Recognition
          </p>
          <button
            onClick={() => setShowModal(true)}
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: "#fff",
              color: "#1143cc",
              border: "none",
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            🔓 Unlock Full Report — $49
          </button>
        </div>
      ) : (
        <div style={{
          backgroundColor: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: 16,
          padding: "28px 24px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📬</div>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#15803d", marginBottom: 6 }}>Report sent!</div>
          <div style={{ fontSize: 14, color: "#166534" }}>Check your inbox at <strong>{reportSentTo}</strong></div>
        </div>
      )}


    </div>
  );
}

export default function Check() {
  const router = useRouter();
  const [form, setForm] = useState({
    businessName: "",
    url: "",
    industry: "",
    targetQueries: ["", "", ""],
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
          targetQueries: form.targetQueries,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError("Something went wrong. Please try again.");
      } else {
        setResult(data);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  function handleReset() {
    setResult(null);
    setForm({ businessName: "", url: "", industry: "", targetQueries: ["", "", ""], email: "" });
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#fcf6f6",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>

      {/* Nav */}
      <nav style={{
        padding: "20px 40px",
        borderBottom: "none",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <img
          src="/AI-ScoreScout_logo.png"
          alt="AI Score Scout"
          style={{ width: 375, cursor: "pointer" }}
          onClick={() => router.push("/")}
        />
      </nav>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "60px 24px 80px" }}>

        {!result ? (
          <>
            <div style={{ marginBottom: 40 }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1143cc", margin: "0 0 8px", letterSpacing: "-0.01em" }}>
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
                <label style={{ display: "block", fontWeight: 600, color: "#1143cc", marginBottom: 6, fontSize: 15 }}>
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
                <label style={{ display: "block", fontWeight: 600, color: "#1143cc", marginBottom: 6, fontSize: 15 }}>
                  Business Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Co."
                  value={form.businessName}
                  onChange={(e) => updateForm("businessName", e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#1143cc", marginBottom: 6, fontSize: 15 }}>
                  Industry
                </label>
                <input
                  type="text"
                  placeholder="e.g. Legal, Architecture, Retail, Finance"
                  value={form.industry}
                  onChange={(e) => updateForm("industry", e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#1143cc", marginBottom: 4, fontSize: 15 }}>
                  What do you want AI to recommend you for?
                </label>
                <p style={{ color: "#94a3b8", fontSize: 13, margin: "0 0 12px", lineHeight: 1.5 }}>
                  Add up to 3 searches your ideal customers might use.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {form.targetQueries.map((q, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", width: 16, flexShrink: 0 }}>{i + 1}</span>
                      <input
                        type="text"
                        placeholder={i === 0 ? "e.g. Accountant in Sydney" : i === 1 ? "e.g. Small business tax advice" : "e.g. Optional third query"}
                        value={q}
                        onChange={(e) => {
                          const updated = [...form.targetQueries];
                          updated[i] = e.target.value;
                          updateForm("targetQueries", updated);
                        }}
                        style={inputStyle}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#1143cc", marginBottom: 6, fontSize: 15 }}>
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
                    backgroundColor: loading || !form.url ? "#cbd5e1" : "#1143cc",
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
