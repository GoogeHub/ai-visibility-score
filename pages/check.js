import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_live_51TMbDPBRTTnXjBcMwnoNNCmitY3XJlQIOxEmCVYo5BmpqKSMz7rtt0WgvbIY1HwuXN0sHZNhbjYLalbqG3p8HLdH00QM0yi9qe");
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
    <div>
      <div style={{
        fontWeight: 800, fontSize: 18, color: "#1143cc",
        textAlign: "center", marginTop: 25, marginBottom: 16, letterSpacing: "-0.01em",
      }}>
        {title}
      </div>
      <div style={{
        backgroundColor: "#fff",
        border: `1px solid ${unlocked ? "#d946ef" : "#e2e8f0"}`,
        borderRadius: 12,
        overflow: "hidden",
        transition: "border-color 0.3s",
      }}>
        {unlocked ? (
          <div style={{ padding: "20px" }}>
            {children}
          </div>
        ) : (
          <>
            <div style={{
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, flex: 1 }}>{teaser}</div>
              <span style={{ fontSize: 18, flexShrink: 0 }}>🔒</span>
            </div>
            <div style={{ padding: "0 20px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              {[80, 60, 45].map((w, i) => (
                <div key={i} style={{ height: 10, width: `${w}%`, borderRadius: 99, backgroundColor: "#f1f5f9" }} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const modalOverlay = {
  position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.65)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20,
};
const modalBox = {
  backgroundColor: "#fff", borderRadius: 12, maxWidth: 420, width: "100%",
  boxShadow: "0 20px 60px rgba(0,0,0,0.3)", overflow: "hidden",
};
const siStyle = (extra = {}) => ({
  width: "100%", padding: "11px 14px", border: "1px solid #e3e8ee",
  borderRadius: 6, fontSize: 16, color: "#0f172a", outline: "none",
  backgroundColor: "#fff", boxSizing: "border-box", ...extra,
});
const stripeElementContainer = (extra = {}) => ({
  padding: "11px 14px", border: "1px solid #e3e8ee", backgroundColor: "#fff", ...extra,
});
const cardElementOpts = {
  style: {
    base: {
      fontSize: "16px", color: "#0f172a",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      "::placeholder": { color: "#94a3b8" },
    },
    invalid: { color: "#dc2626" },
  },
};
const SuccessState = ({ email }) => (
  <div style={{ textAlign: "center", padding: "48px 24px" }}>
    <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    </div>
    <div style={{ fontWeight: 700, fontSize: 20, color: "#0f172a", marginBottom: 8 }}>Report on its way!</div>
    <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>Check your inbox at<br /><strong>{email}</strong></div>
  </div>
);
const ModalHeader = ({ displayName, onClose, isPromo }) => (
  <div style={{ backgroundColor: "#f6f9fc", padding: "20px 24px 16px", borderBottom: "1px solid #e3e8ee" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 13, color: "#697386", marginBottom: 2 }}>AI Score Scout</div>
        {!isPromo && <div style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>$49.00</div>}
        <div style={{ fontSize: 13, color: "#697386", marginTop: 2 }}>
          {isPromo ? "Full AI Visibility Report" : `Full AI Visibility Report — ${displayName}`}
        </div>
      </div>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#aab7c4", padding: 0, lineHeight: 1 }}>✕</button>
    </div>
  </div>
);
const StripeBadge = () => (
  <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#aab7c4"><path d="M12 1L3 5v6c0 5.25 3.75 10.15 9 11.35C17.25 21.15 21 16.25 21 11V5l-9-4z"/></svg>
    <span style={{ fontSize: 12, color: "#aab7c4" }}>Powered by</span>
    <span style={{ fontSize: 13, fontWeight: 700, color: "#635bff", letterSpacing: "-0.02em" }}>Stripe</span>
  </div>
);

// Promo flow — email only, no payment
function EmailModal({ onClose, onSent, prefillEmail, result, formData }) {
  const [email, setEmail] = useState(prefillEmail || "");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  async function handleSend() {
    if (!email) return;
    setSending(true);
    setError(null);
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

  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        {done ? <SuccessState email={email} /> : (
          <>
            <ModalHeader displayName={formData?.businessName || "Your business"} onClose={onClose} isPromo={true} />
            <div style={{ padding: "20px 24px 24px" }}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#697386", marginBottom: 5 }}>Email</label>
                <input type="email" placeholder="you@company.com" value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  style={siStyle()} />
              </div>
              {error && <div style={{ marginBottom: 12, fontSize: 13, color: "#dc2626" }}>{error}</div>}
              <button onClick={handleSend} disabled={sending || !email} style={{
                width: "100%", padding: "13px",
                backgroundColor: sending || !email ? "#aab7c4" : "#1143cc",
                color: "#fff", border: "none", borderRadius: 6, fontSize: 16, fontWeight: 600, cursor: "pointer",
              }}>
                {sending ? "Sending…" : "Send Me the Full Report →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Stripe card form — must be rendered inside <Elements>
function StripeForm({ onSent, prefillEmail, result, formData, onClose, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState(prefillEmail || "");
  const [nameOnCard, setNameOnCard] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const displayName = formData?.businessName || result?.business_name || "Your business";

  async function handlePay() {
    if (!stripe || !elements || !email || !nameOnCard) return;
    setSending(true);
    setError(null);
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: { name: nameOnCard, email },
      },
    });
    if (stripeError) {
      setError(stripeError.message);
      setSending(false);
      return;
    }
    if (paymentIntent.status === "succeeded") {
      try {
        const res = await fetch("/api/send-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, result, formData }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to send report");
        setDone(true);
        setTimeout(() => onSent(email), 2000);
      } catch (err) {
        setError(err.message);
        setSending(false);
      }
    }
  }

  const ready = stripe && elements && email && nameOnCard;

  return (
    <>
      <ModalHeader displayName={displayName} onClose={onClose} isPromo={false} />
      {done ? <SuccessState email={email} /> : (
        <div style={{ padding: "20px 24px 24px" }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#697386", marginBottom: 5 }}>Email</label>
            <input type="email" placeholder="you@company.com" value={email}
              onChange={e => setEmail(e.target.value)} style={siStyle()} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#697386", marginBottom: 5 }}>Card information</label>
            <div style={stripeElementContainer({ borderRadius: "6px 6px 0 0", borderBottom: "none" })}>
              <CardNumberElement options={cardElementOpts} />
            </div>
            <div style={{ display: "flex" }}>
              <div style={stripeElementContainer({ borderRadius: "0 0 0 6px", width: "50%", borderRight: "none" })}>
                <CardExpiryElement options={cardElementOpts} />
              </div>
              <div style={stripeElementContainer({ borderRadius: "0 0 6px 0", width: "50%" })}>
                <CardCvcElement options={cardElementOpts} />
              </div>
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#697386", marginBottom: 5 }}>Name on card</label>
            <input type="text" placeholder="Full name" value={nameOnCard}
              onChange={e => setNameOnCard(e.target.value)} style={siStyle()} />
          </div>
          {error && <div style={{ marginBottom: 12, fontSize: 13, color: "#dc2626" }}>{error}</div>}
          <button onClick={handlePay} disabled={sending || !ready} style={{
            width: "100%", padding: "13px",
            backgroundColor: sending ? "#6772e5" : !ready ? "#aab7c4" : "#635bff",
            color: "#fff", border: "none", borderRadius: 6, fontSize: 16, fontWeight: 600,
            cursor: sending || !ready ? "not-allowed" : "pointer", transition: "background-color 0.15s",
          }}>
            {sending ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Processing…
              </span>
            ) : "Pay $49"}
          </button>
          <StripeBadge />
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </>
  );
}

// Payment modal — fetches clientSecret, wraps StripeForm in Elements
function PaymentModal({ onClose, onSent, prefillEmail, result, formData }) {
  const [clientSecret, setClientSecret] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessName: formData?.businessName, url: formData?.url }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) setFetchError(data.error);
        else setClientSecret(data.clientSecret);
      })
      .catch(() => setFetchError("Failed to initialise payment"));
  }, []);

  return (
    <div style={modalOverlay}>
      <div style={modalBox}>
        {fetchError ? (
          <div style={{ padding: 32, textAlign: "center" }}>
            <div style={{ color: "#dc2626", fontSize: 14, marginBottom: 12 }}>{fetchError}</div>
            <button onClick={onClose} style={{ fontSize: 14, color: "#64748b", background: "none", border: "none", cursor: "pointer" }}>Close</button>
          </div>
        ) : !clientSecret ? (
          <div style={{ padding: 48, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>Loading payment…</div>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripeForm onClose={onClose} onSent={onSent} prefillEmail={prefillEmail}
              result={result} formData={formData} clientSecret={clientSecret} />
          </Elements>
        )}
      </div>
    </div>
  );
}

function SharePrompt() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareData = {
      title: "AI Score Scout",
      text: "Find out if AI is recommending your business — or ignoring you. Free score, takes 30 seconds.",
      url: "https://aiscorescout.com",
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (e) {}
    } else {
      try {
        await navigator.clipboard.writeText("https://aiscorescout.com");
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (e) {}
    }
  }

  return (
    <div style={{ marginTop: 12, textAlign: "center", padding: "32px 24px" }}>
      <p style={{ fontSize: 15, color: "#64748b", margin: "0 0 16px", lineHeight: 1.6 }}>
        Know someone who could use this tool?
      </p>
      <button onClick={handleShare} style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "13px 28px", backgroundColor: "#1143cc", color: "#fff",
        border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer",
      }}>
        {copied ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Link copied!
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Send it to someone
          </>
        )}
      </button>
    </div>
  );
}

function ResultsView({ result, formData, onReset }) {
  const [showModal, setShowModal] = useState(false);
  const [reportSentTo, setReportSentTo] = useState(null);
  const [showFull, setShowFull] = useState(false);
  const promoUnlocked = formData.promoValid === true;
  const labelCfg = labelConfig[result.web_label] || labelConfig.Emerging;
  const displayName = formData.businessName || result.business_name || "Your business";

  const aiRecognitionContent = () => {
    if (result.recognition_score === 0) {
      return (
        <div>
          <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>Score: 0 / 100 — Not currently recognised</div>
          <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, marginBottom: 12 }}>
            <strong>Explanation: </strong>AI systems don't yet associate your brand with a clear set of services or expertise areas. This doesn't mean you're invisible — but it does mean you're not being actively recalled or prioritised.
          </div>
          <div style={{ padding: "12px 16px", backgroundColor: "#f8fafc", borderRadius: 8, fontSize: 14, color: "#334155", lineHeight: 1.7, marginBottom: 12 }}>
            <strong>What this means: </strong>Most recommendations will come from general content interpretation, not brand recognition.
          </div>
          <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "14px 16px", fontSize: 14, color: "#334155", lineHeight: 1.7 }}>
            <strong style={{ color: "#15803d" }}>Opportunity: </strong>As your content becomes more structured and consistent, this score can improve quickly — especially compared to competitors who haven't addressed this yet.
          </div>
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
      {showModal && (promoUnlocked ? (
        <EmailModal
          onClose={() => setShowModal(false)}
          onSent={(email) => { setReportSentTo(email); setShowModal(false); setShowFull(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          prefillEmail={formData.email}
          result={result}
          formData={formData}
        />
      ) : (
        <PaymentModal
          onClose={() => setShowModal(false)}
          onSent={(email) => { setReportSentTo(email); setShowModal(false); setShowFull(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          prefillEmail={formData.email}
          result={result}
          formData={formData}
        />
      ))}

      {/* Success banner — shown after payment/send */}
      {reportSentTo && (
        <div style={{
          backgroundColor: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: 16,
          padding: "20px 24px",
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#15803d", marginBottom: 3 }}>
              {promoUnlocked ? "Report sent!" : "Payment confirmed — report sent!"}
            </div>
            <div style={{ fontSize: 13, color: "#166534", lineHeight: 1.5 }}>
              A copy has been emailed to <strong>{reportSentTo}</strong>. Your full report is unlocked below.
            </div>
          </div>
        </div>
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
          Your Score
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
      <LockedCard
        unlocked={showFull}
        title="How you compare in AI visibility"
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
        <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, margin: "16px 0 0" }}>
          However, most competitors have the same weakness: they're not structured for AI understanding.
        </p>
        <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "14px 16px", marginTop: 16, fontSize: 14, color: "#334155", lineHeight: 1.7 }}>
          <strong style={{ color: "#15803d" }}>Opportunity: </strong>This means there's a real opportunity to move ahead quickly with the right changes.
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
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {result.query_groups.map((group, i) => {
              const isYes = group.would_recommend === true;
              const statusBg = isYes ? "#f0fdf4" : "#fef2f2";
              const statusBorder = isYes ? "#bbf7d0" : "#fecaca";
              const statusColor = isYes ? "#16a34a" : "#dc2626";
              const icon = isYes ? "✅" : "❌";
              return (
                <div key={i} style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "20px", marginBottom: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                    Query {i + 1} of {result.query_groups.length}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 14, fontStyle: "italic" }}>
                    "{group.intent}"
                    {group.queries?.length > 1 && (
                      <span style={{ marginLeft: 6, color: "#94a3b8", fontWeight: 400, fontStyle: "normal" }}>
                        (merged {group.queries.length} similar queries)
                      </span>
                    )}
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "12px 14px", backgroundColor: statusBg,
                    border: `1px solid ${statusBorder}`, borderRadius: 8, marginBottom: 14,
                  }}>
                    <span style={{ fontSize: 20 }}>{icon}</span>
                    <div style={{ fontWeight: 700, fontSize: 15, color: statusColor }}>
                      {group.likelihood}
                    </div>
                  </div>
                  <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, marginBottom: group.confidence_driver || group.content_fix ? 12 : 0 }}>
                    <strong>Why:</strong> {group.reason}
                  </div>
                  {group.confidence_driver && (
                    <div style={{ fontSize: 14, padding: "10px 14px", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, color: "#334155", lineHeight: 1.6 }}>
                      <strong>Confidence driver: </strong>{group.confidence_driver}
                    </div>
                  )}
                  {group.content_fix && (
                    <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, padding: "10px 14px", backgroundColor: statusBg, border: `1px solid ${statusBorder}`, borderRadius: 8 }}>
                      <strong>Quick fix:</strong> {group.content_fix}
                    </div>
                  )}
                </div>
              );
            })}
            {(() => {
              const positiveCount = result.query_groups.filter(g => g.would_recommend).length;
              const total = result.query_groups.length;
              return (
                <div style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "18px 20px", marginTop: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#1143cc", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                    Overall Query Coverage
                  </div>
                  <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, margin: "0 0 6px" }}>
                    You're <strong>strongly positioned in {positiveCount} of {total}</strong> key area{total !== 1 ? "s" : ""}.
                  </p>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0 }}>
                    The remaining opportunities are fixable — but currently limit how often AI will recommend you.
                  </p>
                </div>
              );
            })()}
          </div>
        ) : (
          <div style={{ fontSize: 14, color: "#64748b" }}>
            No queries were provided. Add up to 3 target searches in the form to see this test.
          </div>
        )}
      </LockedCard>

      <LockedCard
        unlocked={showFull}
        title="What AI can't clearly understand (yet)"
        teaser="The specific language and topics AI is missing from your site — and exactly how to add them."
      >
        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: "0 0 16px" }}>
          These are the gaps preventing AI from confidently recommending your business:
        </p>
        {result.content_gaps?.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {result.content_gaps.map((gap, i) => (
              typeof gap === "string" ? (
                <div key={i} style={{ padding: "12px 14px", backgroundColor: "#f8fafc", borderRadius: 8, fontSize: 14, color: "#334155", lineHeight: 1.6 }}>{gap}</div>
              ) : (
                <div key={i} style={{ padding: "14px 16px", backgroundColor: "#f8fafc", borderRadius: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{i + 1}. {gap.title}</div>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99,
                      backgroundColor: gap.impact === "High" ? "#fef2f2" : "#fffbeb",
                      color: gap.impact === "High" ? "#dc2626" : "#d97706",
                    }}>{gap.impact} impact</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: "0 0 4px" }}>{gap.line1}</p>
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{gap.line2}</p>
                </div>
              )
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 14, color: "#64748b" }}>No content gaps detected.</div>
        )}
        <div style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "14px 16px", marginTop: 16, fontSize: 14, color: "#334155", lineHeight: 1.7 }}>
          These gaps don't require a rebuild — just clearer structure and language.
        </div>
      </LockedCard>

      <LockedCard
        unlocked={showFull}
        title='Are you "known" to AI?'
        teaser="Is your business already known by AI — and does it matter for you?"
      >
        {aiRecognitionContent()}
      </LockedCard>

      <LockedCard
        unlocked={showFull}
        title="Priority Fix List"
        teaser="Your highest-impact improvements ranked by effort, with step-by-step guidance."
      >
        <style>{`
          @media (max-width: 480px) {
            .fix-header { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
            .fix-pills  { flex-direction: column !important; }
          }
        `}</style>
        {result.priority_fixes?.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {result.priority_fixes.map((fix, i) => (
              <div key={i} style={{ padding: "12px 14px", backgroundColor: "#f8fafc", borderRadius: 8 }}>
                <div className="fix-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{fix.title}</div>
                  <div className="fix-pills" style={{ display: "flex", gap: 6 }}>
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
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.5, marginBottom: fix.expected_result ? 10 : 0 }}>{fix.detail}</div>
                {fix.expected_result && (
                  <div style={{ fontSize: 13, padding: "8px 12px", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, color: "#1e40af" }}>
                    <strong>Expected result: </strong>{fix.expected_result}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 14, color: "#64748b" }}>No fixes available.</div>
        )}
      </LockedCard>

      <LockedCard
        unlocked={showFull}
        title="Technical signals affecting AI visibility"
        teaser="Behind-the-scenes signals that affect how AI tools crawl and interpret your site."
      >
        {result.technical_issues?.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {result.technical_issues.map((issue, i) => (
              typeof issue === "string" ? (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", backgroundColor: "#f8fafc", borderRadius: 8 }}>
                  <span style={{ fontSize: 16 }}>⚠️</span>
                  <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.6 }}>{issue}</div>
                </div>
              ) : (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", backgroundColor: "#f8fafc", borderRadius: 8 }}>
                  <span style={{ fontSize: 16 }}>⚠️</span>
                  <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.6 }}>
                    <strong>{issue.issue}</strong>
                    <span style={{ color: "#64748b" }}> → {issue.effect}</span>
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 14, color: "#64748b" }}>No technical issues detected.</div>
        )}
        <div style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "14px 16px", marginTop: 16, fontSize: 14, color: "#334155" }}>
          These are easy wins that support the broader content improvements above.
        </div>
      </LockedCard>

      {/* Unlock CTA — only shown before payment */}
      {!reportSentTo && (
        <div style={{
          backgroundColor: "#1143cc",
          borderRadius: 16,
          padding: "28px 24px",
          textAlign: "center",
        }}>
          {promoUnlocked ? (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#93c5fd", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Promo Applied ✓</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Get Your Full Report</div>
              <p style={{ fontSize: 14, color: "#93c5fd", margin: "0 0 20px", lineHeight: 1.6 }}>
                Industry benchmark · Target query tests · Content gaps · Priority fixes · AI Recognition
              </p>
              <button onClick={() => setShowModal(true)} style={{ width: "100%", padding: "16px", backgroundColor: "#fff", color: "#1143cc", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
                📬 Send Me the Full Report
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#93c5fd", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Unlock Full Report</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 8 }}>$49</div>
              <p style={{ fontSize: 14, color: "#93c5fd", margin: "0 0 20px", lineHeight: 1.6 }}>
                Industry benchmark · Target query tests · Content gaps · Priority fixes · AI Recognition
              </p>
              <button onClick={() => setShowModal(true)} style={{ width: "100%", padding: "16px", backgroundColor: "#fff", color: "#1143cc", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
                🔓 Unlock Full Report — $49
              </button>
            </>
          )}
        </div>
      )}

      <SharePrompt />

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
    promoValid: false,
  });
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState(null); // null | "valid" | "invalid"
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState(null);

  const VALID_PROMO_CODES = ["SCOUT2025"];

  function applyPromo() {
    if (VALID_PROMO_CODES.includes(promoCode.trim().toUpperCase())) {
      setPromoStatus("valid");
      setForm(prev => ({ ...prev, promoValid: true }));
    } else {
      setPromoStatus("invalid");
    }
  }

  const loadingMessages = [
    { icon: "🔍", text: "Scanning your website…" },
    { icon: "🤖", text: "Testing AI recognition…" },
    { icon: "📊", text: "Running query tests…" },
    { icon: "🧠", text: "Analysing content signals…" },
    { icon: "📝", text: "Building your report…" },
  ];

  useEffect(() => {
    if (!loading) { setLoadingStep(0); return; }
    const interval = setInterval(() => {
      setLoadingStep(s => (s + 1) % loadingMessages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [loading]);

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

              {/* Promo code */}
              <div>
                <label style={{ display: "block", fontWeight: 600, color: "#1143cc", marginBottom: 6, fontSize: 15 }}>
                  Promo code{" "}
                  <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 13 }}>optional</span>
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={e => { setPromoCode(e.target.value); setPromoStatus(null); }}
                    onKeyDown={e => e.key === "Enter" && applyPromo()}
                    style={{ ...inputStyle, flex: 1, textTransform: "uppercase" }}
                    disabled={promoStatus === "valid"}
                  />
                  <button
                    onClick={applyPromo}
                    disabled={!promoCode || promoStatus === "valid"}
                    style={{
                      padding: "0 18px",
                      backgroundColor: promoStatus === "valid" ? "#f0fdf4" : "#f1f5f9",
                      color: promoStatus === "valid" ? "#16a34a" : "#475569",
                      border: `1px solid ${promoStatus === "valid" ? "#bbf7d0" : "#e2e8f0"}`,
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: !promoCode || promoStatus === "valid" ? "default" : "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {promoStatus === "valid" ? "✓ Applied" : "Apply"}
                  </button>
                </div>
                {promoStatus === "invalid" && (
                  <div style={{ marginTop: 6, fontSize: 13, color: "#dc2626" }}>Invalid promo code</div>
                )}
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
                  <div style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "#fcf6f6",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 999,
                    gap: 24,
                  }}>
                    <img src="/AI-ScoreScout_logo.png" alt="AI Score Scout" style={{ width: 220, marginBottom: 8 }} />
                    <div style={{ fontSize: 48 }}>{loadingMessages[loadingStep].icon}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                      {loadingMessages[loadingStep].text}
                    </div>
                    <div style={{ fontSize: 14, color: "#94a3b8" }}>This usually takes 15–30 seconds</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                      {loadingMessages.map((_, i) => (
                        <div key={i} style={{
                          width: i === loadingStep ? 20 : 6,
                          height: 6,
                          borderRadius: 99,
                          backgroundColor: i === loadingStep ? "#1143cc" : "#e2e8f0",
                          transition: "all 0.4s ease",
                        }} />
                      ))}
                    </div>
                  </div>
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
