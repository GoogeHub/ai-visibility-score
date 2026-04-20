import { useRouter } from "next/router";
import { useState } from "react";

// ─── Shared visual helpers ─────────────────────────────────────────────────

function ScoreBar({ score }) {
  return (
    <div style={{ position: "relative", margin: "20px 0 8px" }}>
      <div style={{ height: 12, borderRadius: 99, background: "linear-gradient(to right, #1e3a8a, #d946ef)" }} />
      <div style={{
        position: "absolute", top: 6,
        left: `${Math.min(Math.max(score, 2), 98)}%`,
        transform: "translate(-50%, -50%)",
        width: 20, height: 20, borderRadius: "50%",
        backgroundColor: "#fff", border: "3px solid #1143cc",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "#94a3b8" }}>
        <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
      </div>
    </div>
  );
}

function SectionCard({ title, children }) {
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
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        overflow: "hidden",
        padding: "20px 24px 24px",
      }}>
        {children}
      </div>
    </div>
  );
}

function ImpactBadge({ level }) {
  const isHigh = level === "High";
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99,
      backgroundColor: isHigh ? "#fef2f2" : "#fffbeb",
      color: isHigh ? "#dc2626" : "#d97706",
    }}>{level} impact</span>
  );
}

function EffortBadge({ level }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99,
      backgroundColor: "#f1f5f9", color: "#64748b",
    }}>{level} effort</span>
  );
}

function Divider() {
  return <div style={{ borderTop: "1px solid #f1f5f9", margin: "20px 0" }} />;
}

function CalloutBox({ children, color = "#fffbeb", borderColor = "#fde68a" }) {
  return (
    <div style={{
      backgroundColor: color, border: `1px solid ${borderColor}`,
      borderRadius: 10, padding: "14px 16px", marginTop: 16,
      fontSize: 14, color: "#334155", lineHeight: 1.7,
    }}>
      {children}
    </div>
  );
}

// ─── Demo data ─────────────────────────────────────────────────────────────

const DEMO = {
  businessName: "Studio Bravo",
  score: 62,
  industry: "Digital Agency",
  benchmarkAvg: 55,
};

// ─── Sections ──────────────────────────────────────────────────────────────

function ScoreSummary() {
  return (
    <div style={{
      backgroundColor: "#fff", border: "1px solid #e2e8f0",
      borderRadius: 16, padding: "32px 24px 28px", textAlign: "center",
    }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>
        Your Score
      </div>
      <div style={{ fontSize: 72, fontWeight: 800, color: "#0f172a", lineHeight: 1, letterSpacing: "-0.03em" }}>
        {DEMO.score}
        <span style={{ fontSize: 32, fontWeight: 600, color: "#94a3b8" }}> / 100</span>
      </div>

      <ScoreBar score={DEMO.score} />

      <div style={{
        display: "inline-block", marginTop: 12, padding: "6px 20px",
        backgroundColor: "#fef2f2", color: "#dc2626",
        borderRadius: 99, fontWeight: 700, fontSize: 15,
      }}>
        At risk of being overlooked by AI
      </div>

      {/* Summary */}
      <div style={{ textAlign: "left", marginTop: 28, borderTop: "1px solid #f1f5f9", paddingTop: 24 }}>
        <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.8, margin: "0 0 16px" }}>
          Your site has solid technical foundations, but AI systems are unlikely to recommend you consistently.
        </p>
        <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.8, margin: "0 0 20px" }}>
          The main issue isn't SEO — it's clarity. Your services, expertise, and positioning aren't
          expressed in a way AI can reliably interpret and repeat.
        </p>

        <div style={{ backgroundColor: "#f8fafc", borderRadius: 10, padding: "16px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            What's holding you back
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
            <li style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>No structured definition of your services</li>
            <li style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>Weak alignment with real customer queries</li>
            <li style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>Limited signals that reinforce your expertise in key areas</li>
          </ul>
        </div>

        <div style={{ backgroundColor: "#fef2f2", borderRadius: 10, padding: "16px 20px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            What this means
          </div>
          <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0 }}>
            You may rank well on Google, but still be invisible in AI-driven recommendations —
            especially for high-intent searches.
          </p>
        </div>
      </div>
    </div>
  );
}

function IndustryBenchmark() {
  return (
    <SectionCard title="How you compare in AI visibility">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        <div style={{ backgroundColor: "#f8fafc", borderRadius: 8, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Your Score</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>{DEMO.score}</div>
        </div>
        <div style={{ backgroundColor: "#f8fafc", borderRadius: 8, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Industry Avg</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#94a3b8", marginTop: 4 }}>~{DEMO.benchmarkAvg}</div>
        </div>
      </div>

      <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, margin: "0 0 12px" }}>
        You're slightly ahead of typical digital agencies — mainly due to strong technical SEO.
      </p>
      <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, margin: "0 0 16px" }}>
        However, most competitors have the same weakness:{" "}
        <strong style={{ color: "#0f172a" }}>they're not structured for AI understanding.</strong>
      </p>

      <CalloutBox color="#f0fdf4" borderColor="#bbf7d0">
        <strong style={{ color: "#15803d" }}>Opportunity: </strong>
        <span style={{ color: "#334155" }}>This means there's a real opportunity to move ahead quickly with the right changes.</span>
      </CalloutBox>
    </SectionCard>
  );
}

const QUERIES = [
  {
    n: 1,
    total: 3,
    intent: "Find agencies that design websites for arts and cultural organisations",
    recommend: true,
    likelihood: "Very likely",
    why: "Your site clearly demonstrates experience in this niche through case studies and language that AI can confidently interpret.",
    confidenceDriver: "Repeated references to arts-focused work + strong contextual relevance",
  },
  {
    n: 2,
    total: 3,
    intent: "Find agencies that build digital products",
    recommend: null, // inconsistent
    likelihood: "Inconsistent",
    why: "While you mention digital products, the positioning is not clearly defined or reinforced across your site.",
    missing: [
      "Clear service definition",
      'Supporting examples framed as "product work"',
      "Consistent terminology AI can latch onto",
    ],
  },
  {
    n: 3,
    total: 3,
    intent: "Find branding or design agencies in Melbourne",
    recommend: false,
    likelihood: "Unlikely",
    why: "Your location and branding services aren't consistently stated. AI can't reliably place you in a geography or confirm branding as a core service.",
    missing: [
      "Explicit location references on key pages",
      "Clear branding service description",
      "Case studies labelled with location context",
    ],
  },
];

function QueryCard({ query }) {
  const isYes = query.recommend === true;
  const isInconsistent = query.recommend === null;

  const statusBg     = isYes ? "#f0fdf4" : isInconsistent ? "#fffbeb" : "#fef2f2";
  const statusBorder = isYes ? "#bbf7d0" : isInconsistent ? "#fde68a" : "#fecaca";
  const statusColor  = isYes ? "#16a34a" : isInconsistent ? "#d97706" : "#dc2626";
  const icon         = isYes ? "✅"       : isInconsistent ? "⚠️"      : "❌";

  const missingBg     = isInconsistent ? "#fffbeb" : "#fef2f2";
  const missingBorder = isInconsistent ? "#fde68a" : "#fecaca";

  return (
    <div style={{
      backgroundColor: "#fff", border: "1px solid #e2e8f0",
      borderRadius: 12, padding: "20px",
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
        Query {query.n} of {query.total}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 14, fontStyle: "italic" }}>
        "{query.intent}"
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 14px", backgroundColor: statusBg,
        border: `1px solid ${statusBorder}`, borderRadius: 8, marginBottom: 14,
      }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div style={{ fontWeight: 700, fontSize: 15, color: statusColor }}>
          AI Recommendation Likelihood: {query.likelihood}
        </div>
      </div>

      <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, marginBottom: query.confidenceDriver || query.missing ? 12 : 0 }}>
        <strong>Why: </strong>{query.why}
      </div>

      {query.confidenceDriver && (
        <div style={{ fontSize: 14, padding: "10px 14px", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, color: "#334155", lineHeight: 1.6 }}>
          <strong>Confidence driver: </strong>{query.confidenceDriver}
        </div>
      )}

      {query.missing && (
        <div style={{ fontSize: 14, padding: "10px 14px", backgroundColor: missingBg, border: `1px solid ${missingBorder}`, borderRadius: 8 }}>
          <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>What's missing:</div>
          <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
            {query.missing.map((m, i) => (
              <li key={i} style={{ color: "#475569", lineHeight: 1.6 }}>{m}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function TargetQueryTest() {
  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 18, color: "#1143cc", textAlign: "center", marginTop: 25, marginBottom: 16, letterSpacing: "-0.01em" }}>
        Target Query Test
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {QUERIES.map((q, i) => <QueryCard key={i} query={q} />)}
      </div>

      <div style={{
        marginTop: 12, backgroundColor: "#fff", border: "1px solid #e2e8f0",
        borderRadius: 12, padding: "18px 20px",
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#1143cc", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
          Overall Query Coverage
        </div>
        <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, margin: "0 0 6px" }}>
          You're <strong>strongly positioned in 1 of 3</strong> key areas.
        </p>
        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0 }}>
          The remaining opportunities are fixable — but currently limit how often AI will recommend you.
        </p>
      </div>
    </div>
  );
}

const GAPS = [
  {
    n: 1,
    title: "Service clarity",
    impact: "High",
    line1: "Your services are implied, not explicitly defined.",
    line2: "AI struggles to extract clear 'what you do' statements.",
  },
  {
    n: 2,
    title: "Industry positioning",
    impact: "High",
    line1: "Your arts focus is visible, but not consistently structured or reinforced across pages.",
    line2: "AI can't reliably categorise you as a specialist in this space.",
  },
  {
    n: 3,
    title: "Methodology and process",
    impact: "Medium",
    line1: "Limited explanation of how you work reduces perceived expertise and trust signals.",
    line2: "AI weights process descriptions when assessing credibility.",
  },
  {
    n: 4,
    title: "Technical context",
    impact: "Medium",
    line1: "Missing references to tools, platforms, and technologies limit visibility for technical queries.",
    line2: "Specific tool names are strong signals AI uses to match you to technical searches.",
  },
];

function ContentGapAnalysis() {
  return (
    <SectionCard title="What AI can't clearly understand (yet)">
      <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: "0 0 20px" }}>
        These are the gaps preventing AI from confidently recommending your business:
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {GAPS.map((gap) => (
          <div key={gap.n} style={{ padding: "14px 16px", backgroundColor: "#f8fafc", borderRadius: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
                {gap.n}. {gap.title}
              </div>
              <ImpactBadge level={gap.impact} />
            </div>
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: "0 0 4px" }}>{gap.line1}</p>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{gap.line2}</p>
          </div>
        ))}
      </div>

      <CalloutBox color="#eff6ff" borderColor="#bfdbfe">
        These gaps don't require a rebuild — just clearer structure and language.
      </CalloutBox>
    </SectionCard>
  );
}

function AiRecognition() {
  return (
    <SectionCard title='Are you "known" to AI?'>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
          Score: 0 / 100 — Not currently recognised
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.7 }}>
          <strong>Explanation: </strong>AI systems don't yet associate your brand with a clear set of services or
          expertise areas. This doesn't mean you're invisible — but it does mean you're not being
          actively recalled or prioritised.
        </div>

        <div style={{ padding: "12px 16px", backgroundColor: "#f8fafc", borderRadius: 8, fontSize: 14, color: "#334155", lineHeight: 1.7 }}>
          <strong>What this means: </strong>Most recommendations will come from general content
          interpretation, not brand recognition.
        </div>

        <CalloutBox color="#f0fdf4" borderColor="#bbf7d0">
          <strong style={{ color: "#15803d" }}>Opportunity: </strong>
          <span>As your content becomes more structured and consistent, this score can improve quickly —
          especially compared to competitors who haven't addressed this yet.</span>
        </CalloutBox>
      </div>
    </SectionCard>
  );
}

const FIXES = [
  {
    n: 1,
    title: "Create a dedicated llms.txt file",
    impact: "High",
    effort: "Low",
    detail: "Gives AI systems explicit guidance on how to interpret and prioritise your content.",
    result: "Increased consistency in how your business is described and recommended",
  },
  {
    n: 2,
    title: "Define your services clearly (UX, Design, Development)",
    impact: "High",
    effort: "Medium",
    detail: "Create structured service pages with clear descriptions, outcomes, and terminology.",
    result: "Higher likelihood of appearing in service-based queries",
  },
  {
    n: 3,
    title: "Add structured data (Schema markup)",
    impact: "High",
    effort: "Medium",
    detail: "Organisation, Service, and LocalBusiness schema give AI a machine-readable summary of who you are.",
    result: "Improved entity recognition and stronger signals for location-based queries",
  },
  {
    n: 4,
    title: "Align case study language with real customer queries",
    impact: "Medium",
    effort: "Low",
    detail: "Reframe project descriptions to match the language your customers actually search with.",
    result: "Better query-to-content matching across all three target queries",
  },
];

function PriorityFixList() {
  return (
    <SectionCard title="Priority Fix List">
      <style>{`
        @media (max-width: 480px) {
          .fix-header { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
          .fix-pills  { flex-direction: column !important; }
        }
      `}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {FIXES.map((fix) => (
          <div key={fix.n} style={{ padding: "14px 16px", backgroundColor: "#f8fafc", borderRadius: 10 }}>
            <div className="fix-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", paddingRight: 12 }}>
                {fix.n}. {fix.title}
              </div>
              <div className="fix-pills" style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <ImpactBadge level={fix.impact} />
                <EffortBadge level={fix.effort} />
              </div>
            </div>
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: "0 0 10px" }}>{fix.detail}</p>
            <div style={{ fontSize: 13, padding: "8px 12px", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, color: "#1e40af" }}>
              <strong>Expected result: </strong>{fix.result}
            </div>
          </div>
        ))}
      </div>

      {/* Score uplift summary */}
      <div style={{
        marginTop: 20, backgroundColor: "#1143cc", borderRadius: 12, padding: "20px 22px",
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
          Your potential
        </div>
        <div style={{ fontSize: 15, color: "#e0e7ff", lineHeight: 1.7, marginBottom: 14 }}>
          If you actioned these priorities, you could realistically move from
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>
          <span style={{ color: "#fca5a5" }}>62</span>
          {" → "}
          <span style={{ color: "#86efac" }}>75+</span>
        </div>
      </div>
    </SectionCard>
  );
}

const TECHNICAL_ISSUES = [
  { issue: "Missing llms.txt", effect: "reduces AI guidance" },
  { issue: "Limited schema markup", effect: "restricts content interpretation" },
  { issue: "Robots.txt unclear", effect: "may limit crawler access" },
];

function TechnicalAudit() {
  return (
    <SectionCard title="Technical signals affecting AI visibility">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {TECHNICAL_ISSUES.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", backgroundColor: "#f8fafc", borderRadius: 8 }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.6 }}>
              <strong>{t.issue}</strong>
              <span style={{ color: "#64748b" }}> → {t.effect}</span>
            </div>
          </div>
        ))}
      </div>
      <CalloutBox color="#eff6ff" borderColor="#bfdbfe">
        These are easy wins that support the broader content improvements above.
      </CalloutBox>
    </SectionCard>
  );
}

// ─── Share prompt ──────────────────────────────────────────────────────────

function SharePrompt() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareData = {
      title: "AI Score Scout",
      text: "Find out if AI is recommending your business — or ignoring you. Free score, takes 30 seconds.",
      url: "https://aiscorescout.com",
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        // user dismissed — do nothing
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText("https://aiscorescout.com");
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (e) {
        // clipboard also unavailable — silent fail
      }
    }
  }

  return (
    <div style={{
      marginTop: 12, textAlign: "center",
      padding: "32px 24px",
    }}>
      <p style={{ fontSize: 15, color: "#64748b", margin: "0 0 16px", lineHeight: 1.6 }}>
        Know someone who could use this tool?
      </p>
      <button
        onClick={handleShare}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "13px 28px",
          backgroundColor: "#1143cc", color: "#fff",
          border: "none", borderRadius: 10,
          fontSize: 15, fontWeight: 700, cursor: "pointer",
          transition: "background-color 0.15s ease",
        }}
      >
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

// ─── Page ──────────────────────────────────────────────────────────────────

export default function DemoReport() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#fcf6f6",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <nav style={{
        padding: "20px 40px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #f1f5f9",
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

      {/* Demo banner */}
      <div style={{
        backgroundColor: "#1143cc", padding: "10px 24px",
        textAlign: "center", fontSize: 13, color: "#bfdbfe", fontWeight: 500,
      }}>
        🧪 This is a <strong style={{ color: "#fff" }}>demo report</strong> — content is hardcoded for design review purposes
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px 80px" }}>

        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
            AI Visibility Report
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1143cc", margin: 0, letterSpacing: "-0.01em" }}>
            {DEMO.businessName}
          </h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <ScoreSummary />



          <IndustryBenchmark />
          <TargetQueryTest />
          <ContentGapAnalysis />
          <AiRecognition />
          <PriorityFixList />
          <TechnicalAudit />
          <SharePrompt />
        </div>

      </div>
    </div>
  );
}
