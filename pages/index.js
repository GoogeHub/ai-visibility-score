import { useRouter } from "next/router";
import { useState } from "react";

export default function Landing() {
  const router = useRouter();
  const [btnHover, setBtnHover] = useState(false);

  const ctaButton = (hover) => ({
    padding: "16px 36px",
    backgroundColor: hover ? "#0d35a8" : "#1143cc",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 17,
    fontWeight: 700,
    cursor: "pointer",
    display: "inline-block",
    transition: "background-color 0.15s ease",
  });

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#fcf6f6",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <style>{`
        @media (min-width: 768px) { .hero-logo { width: 500px !important; } }
        @media (max-width: 600px) { .proof-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 420px) { .proof-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Nav */}
      <nav style={{ padding: "20px 40px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <img src="/AI-ScoreScout_logo.png" alt="AI Score Scout" style={{ width: 375 }} className="hero-logo" />
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "50px 40px 80px", textAlign: "center" }}>
        <h1 style={{
          fontSize: 54, fontWeight: 800, color: "#1143cc",
          lineHeight: 1.1, margin: "0 0 24px", letterSpacing: "-0.02em",
        }}>
          See if AI actually recommends your business.
        </h1>
        <p style={{ fontSize: 19, color: "#475569", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 40px" }}>
          We test how ChatGPT, Claude, and Perplexity interpret your website — and whether you show up when it matters.
        </p>
        <button
          onClick={() => router.push("/check")}
          style={ctaButton(btnHover)}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
        >
          Check Your AI Visibility →
        </button>
        <div style={{ marginTop: 16, fontSize: 14, color: "#94a3b8", lineHeight: 1.8 }}>
          Free score · Full report $49<br />
          No account required · Results in 30 seconds
        </div>
      </div>

      {/* Proof / Transparency Strip */}
      <div style={{ backgroundColor: "#fff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "48px 40px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{
            fontSize: 14, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase",
            letterSpacing: "0.1em", textAlign: "center", margin: "0 0 36px",
          }}>
            What we actually check
          </h2>
          <div className="proof-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
            {[
              { icon: "💬", title: "Content clarity", desc: "Can AI clearly understand what you do and who you serve?" },
              { icon: "🏗️", title: "Structured signals", desc: "Schema, metadata, and technical signals AI relies on" },
              { icon: "🔍", title: "Real query testing", desc: "We simulate the searches your customers would make" },
              { icon: "🧠", title: "Entity recognition", desc: "Whether AI systems recognise and \"trust\" your business" },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEO vs AI — Problem Section */}
      <div style={{ backgroundColor: "#e6eaf5", padding: "80px 40px" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <h2 style={{
            fontSize: 38, fontWeight: 800, color: "#1143cc",
            lineHeight: 1.15, margin: "0 0 24px", letterSpacing: "-0.01em",
          }}>
            SEO got you ranked. AI needs you understood.
          </h2>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.8, margin: "0 0 18px" }}>
            Search engines rank pages.<br />
            AI systems recommend businesses they can clearly interpret and explain.
          </p>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.8, margin: "0 0 18px" }}>
            That means your site needs to do more than exist — it needs to communicate:
          </p>
          <ul style={{ fontSize: 17, color: "#475569", lineHeight: 2, margin: "0 0 18px", paddingLeft: 24 }}>
            <li>what you do</li>
            <li>who you help</li>
            <li>why you're credible</li>
          </ul>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.8, margin: 0 }}>
            If that's unclear, AI simply won't mention you.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: "80px 40px 60px" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <h2 style={{
            fontSize: 28, fontWeight: 800, color: "#1143cc",
            margin: "0 0 48px", textAlign: "center", letterSpacing: "-0.01em",
          }}>
            How it works
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40 }}>
            {[
              {
                step: "01",
                title: "Tell us about your business",
                desc: "Your website + a few example searches your customers might use",
              },
              {
                step: "02",
                title: "We analyse how AI sees you",
                desc: "Content, structure, and real-world query responses",
              },
              {
                step: "03",
                title: "Get your score + what's holding you back",
                desc: "Clear insights and specific actions to improve",
              },
            ].map(({ step, title, desc }) => (
              <div key={step}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 12, letterSpacing: "0.08em" }}>
                  {step}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1143cc", margin: "0 0 8px" }}>{title}</h3>
                <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sample Result Preview */}
      <div style={{ backgroundColor: "#fff", borderTop: "1px solid #e2e8f0", padding: "80px 40px" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <h2 style={{
            fontSize: 28, fontWeight: 800, color: "#1143cc",
            margin: "0 0 12px", textAlign: "center", letterSpacing: "-0.01em",
          }}>
            What you'll get
          </h2>
          <p style={{ fontSize: 16, color: "#64748b", textAlign: "center", margin: "0 0 48px", lineHeight: 1.6 }}>
            A clear score with actionable insights — not a vague audit.
          </p>

          {/* Mock report card — fades out to suggest more content */}
          <div style={{ position: "relative" }}>
            <div style={{
              border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden",
              boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
            }}>
              {/* Score header */}
              <div style={{ backgroundColor: "#fcf6f6", padding: "32px 28px", textAlign: "center", borderBottom: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>Spacely Space Sprockets</div>
                <div style={{ fontSize: 72, fontWeight: 800, color: "#0f172a", lineHeight: 1, letterSpacing: "-0.03em" }}>
                  47<span style={{ fontSize: 32, fontWeight: 600, color: "#94a3b8" }}> / 100</span>
                </div>
                <div style={{ marginTop: 12, display: "inline-block", background: "#fffbeb", color: "#d97706", fontWeight: 700, fontSize: 14, padding: "5px 16px", borderRadius: 99 }}>Emerging</div>
                {/* Score bar */}
                <div style={{ position: "relative", height: 10, borderRadius: 99, background: "linear-gradient(to right, #1e3a8a, #d946ef)", margin: "20px auto 4px", maxWidth: 360 }}>
                  <div style={{ position: "absolute", left: "47%", top: "50%", transform: "translate(-50%, -50%)", width: 18, height: 18, borderRadius: "50%", background: "#fff", border: "3px solid #1e3a8a", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                </div>
              </div>

              {/* Explanation paragraph — same as real report */}
              <div style={{ padding: "28px 28px 40px", backgroundColor: "#fff" }}>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, margin: 0 }}>
                  Spacely Space Sprockets has an established web presence, but AI systems are struggling to position you as a commercial supplier. Your product range, manufacturing capabilities, and customer applications aren't structured in a way AI can confidently extract and repeat in a buying context. Until that changes, competitors with better-structured content will be recommended ahead of you.
                </p>
              </div>
            </div>

            {/* Fade-out overlay — bleeds past the card border + shadow */}
            <div style={{
              position: "absolute", bottom: -32, left: -32, right: -32, height: 160,
              background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 65%)",
              pointerEvents: "none",
            }} />
          </div>

          <div style={{ textAlign: "center", marginTop: 28, position: "relative", zIndex: 1 }}>
            <a
              href="/sample-report"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "14px 32px",
                backgroundColor: "#e6eaf5",
                color: "#1143cc",
                border: "none",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "none",
                transition: "background-color 0.15s ease",
              }}
            >
              See Sample Report →
            </a>
          </div>
        </div>
      </div>

      {/* Who this is for */}
      <div style={{ backgroundColor: "#e6eaf5", padding: "80px 40px" }}>
        <div style={{ maxWidth: 740, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontSize: 28, fontWeight: 800, color: "#1143cc",
            margin: "0 0 36px", letterSpacing: "-0.01em",
          }}>
            Built for businesses that rely on being discovered
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
            {[
              { icon: "🧑‍💼", label: "Service businesses" },
              { icon: "🏢", label: "Agencies & consultancies" },
              { icon: "🛍️", label: "Ecommerce & product brands" },
            ].map(({ icon, label }) => (
              <div key={label} style={{
                backgroundColor: "#fff", borderRadius: 12, padding: "24px 20px",
                fontSize: 15, fontWeight: 600, color: "#0f172a",
              }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scout mascot */}
      <div style={{ backgroundColor: "#0f172a", display: "flex", justifyContent: "center", overflow: "visible" }}>
        <img src="/Scout.png" alt="" style={{ width: 250, maxWidth: "80%", marginTop: -100, display: "block", position: "relative", zIndex: 1 }} />
      </div>

      {/* Final CTA */}
      <div style={{ backgroundColor: "#0f172a", padding: "0px 40px 80px", textAlign: "center" }}>
        <h2 style={{ fontSize: 34, fontWeight: 800, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.01em" }}>
          Find out if AI is recommending you — or ignoring you.
        </h2>
        <p style={{ fontSize: 17, color: "#94a3b8", margin: "0 0 36px", lineHeight: 1.8 }}>
          Free score · Full report $49<br />
          No account required · Results in 30 seconds
        </p>
        <button onClick={() => router.push("/check")} style={ctaButton(false)}>
          Check Your AI Visibility →
        </button>
      </div>

    </div>
  );
}
