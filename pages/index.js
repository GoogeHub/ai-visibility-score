import { useRouter } from "next/router";
import { useState } from "react";

export default function Landing() {
  const router = useRouter();
  const [btnHover, setBtnHover] = useState(false);

  const ctaButton = (dark = true) => ({
    padding: "16px 36px",
    backgroundColor: dark ? (btnHover ? "#0d35a8" : "#1143cc") : "#fff",
    color: dark ? "#fff" : "#1143cc",
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
      <style>{`@media (min-width: 768px) { .hero-logo { width: 500px !important; } }`}</style>

      {/* Nav */}
      <nav style={{
        padding: "20px 40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderBottom: "none",
      }}>
        <img src="/AI-ScoreScout_logo.png" alt="AI Score Scout" style={{ width: 375 }} className="hero-logo" />
      </nav>

      {/* Hero */}
      <div style={{
        maxWidth: 820,
        margin: "0 auto",
        padding: "50px 40px 80px",
        textAlign: "center",
      }}>

        <h1 style={{
          fontSize: 54,
          fontWeight: 800,
          color: "#1143cc",
          lineHeight: 1.1,
          margin: "0 0 24px",
          letterSpacing: "-0.02em",
        }}>
          AI is the first place people search. Does your business show up?
        </h1>

        <p style={{
          fontSize: 19,
          color: "#475569",
          lineHeight: 1.7,
          maxWidth: 560,
          margin: "0 auto 40px",
        }}>
          ChatGPT, Claude, and Perplexity are now the first stop for finding businesses.
          Find out how visible yours is — and exactly what to do about it.
        </p>

        <button
          onClick={() => router.push("/check")}
          style={ctaButton(true)}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
        >
          Check Your AI Visibility →
        </button>

        <div style={{ marginTop: 16, fontSize: 14, color: "#94a3b8" }}>
          No account required · Results in under 30 seconds
        </div>
      </div>

      {/* Problem Section */}
      <div style={{ backgroundColor: "#e6eaf5", padding: "80px 40px" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <h2 style={{
            fontSize: 38,
            fontWeight: 800,
            color: "#1143cc",
            lineHeight: 1.15,
            margin: "0 0 24px",
            letterSpacing: "-0.01em",
          }}>
            SEO got you found on Google.<br />
            AI doesn't work the same way.
          </h2>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.8, margin: "0 0 18px" }}>
            Search engines crawl pages and rank links. AI systems learn from the entire web — and when
            someone asks for a recommendation, they surface businesses they understand, trust, and can
            describe clearly.
          </p>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.8, margin: 0 }}>
            If your website doesn't clearly explain who you are, what you do, and who you serve —
            in language AI can parse and repeat — you're invisible to a fast-growing source of new business.
            Most businesses have no idea this gap exists.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: "80px 40px" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <h2 style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#1143cc",
            margin: "0 0 48px",
            textAlign: "center",
            letterSpacing: "-0.01em",
          }}>
            How it works
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40 }}>
            {[
              {
                step: "01",
                title: "Tell us about your business",
                desc: "Share your website URL and a little context about what you do and who you serve.",
              },
              {
                step: "02",
                title: "We scan the signals AI looks for",
                desc: "We check your site content, structure, schema markup, robots settings, and more.",
              },
              {
                step: "03",
                title: "Get your score + what to fix",
                desc: "See how AI systems perceive your business today — and exactly what to improve.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step}>
                <div style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#94a3b8",
                  marginBottom: 12,
                  letterSpacing: "0.08em",
                }}>
                  {step}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1143cc", margin: "0 0 8px" }}>
                  {title}
                </h3>
                <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scout mascot — straddles the light/dark boundary */}
      <div style={{
        backgroundColor: "#0f172a",
        display: "flex",
        justifyContent: "center",
        overflow: "visible",
      }}>
        <img
          src="/Scout.png"
          alt=""
          style={{
            width: 500,
            maxWidth: "80%",
            marginTop: -150,
            display: "block",
            position: "relative",
            zIndex: 1,
          }}
        />
      </div>

      {/* CTA Repeat */}
      <div style={{
        backgroundColor: "#0f172a",
        padding: "20px 40px 80px",
        textAlign: "center",
      }}>
        <h2 style={{
          fontSize: 34,
          fontWeight: 800,
          color: "#fff",
          margin: "0 0 16px",
          letterSpacing: "-0.01em",
        }}>
          Free. Fast. No account needed.
        </h2>
        <p style={{ fontSize: 17, color: "#94a3b8", margin: "0 0 36px" }}>
          Find out where you stand in under 30 seconds.
        </p>
        <button onClick={() => router.push("/check")} style={ctaButton(false)}>
          Check Your AI Visibility →
        </button>
      </div>

    </div>
  );
}
