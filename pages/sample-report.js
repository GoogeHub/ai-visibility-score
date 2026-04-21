import { useRouter } from "next/router";

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
  businessName: "Spacely Space Sprockets",
  score: 47,
  industry: "Space Manufacturing",
  benchmarkAvg: 52,
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
        backgroundColor: "#fffbeb", color: "#d97706",
        borderRadius: 99, fontWeight: 700, fontSize: 15,
      }}>
        Emerging
      </div>

      {/* Summary */}
      <div style={{ textAlign: "left", marginTop: 28, borderTop: "1px solid #f1f5f9", paddingTop: 24 }}>
        <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.8, margin: "0 0 16px" }}>
          Spacely Space Sprockets has an established web presence, but AI systems are struggling to position you as a commercial supplier.
        </p>
        <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.8, margin: "0 0 20px" }}>
          The core problem isn't awareness — it's commercial clarity. Your product range, manufacturing capabilities, and customer applications aren't structured in a way AI can confidently extract and repeat in a buying context.
        </p>

        <div style={{ backgroundColor: "#f8fafc", borderRadius: 10, padding: "16px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            What's holding you back
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
            <li style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>No product specifications AI can parse or reference</li>
            <li style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>Site reads as a brand presence, not a supplier</li>
            <li style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>Competitor Cogswell's Cogs has more structured, AI-readable content</li>
          </ul>
        </div>

        <div style={{ backgroundColor: "#fffbeb", borderRadius: 10, padding: "16px 20px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            What this means
          </div>
          <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0 }}>
            When buyers ask AI to recommend a sprocket supplier, Spacely is unlikely to be mentioned — despite being an established name in the industry.
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
        You're slightly below the space manufacturing average — largely because most competitors have basic product pages while Spacely's content remains thin and unstructured.
      </p>
      <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, margin: "0 0 16px" }}>
        However, most competitors share the same fundamental weakness:{" "}
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
    intent: "Find suppliers of precision sprockets for spacecraft",
    recommend: false,
    likelihood: "Unlikely",
    why: "Your site lacks the product specification language, material grades, and tolerances that AI looks for when matching industrial component suppliers to technical searches.",
    missing: [
      "Product spec pages with technical terminology",
      "Application context — which spacecraft or systems use your sprockets",
      "Industry certifications or quality standards",
    ],
  },
  {
    n: 2,
    total: 3,
    intent: "Industrial parts manufacturer in Orbit City",
    recommend: null,
    likelihood: "Inconsistent",
    why: "Your location is mentioned, but not consistently reinforced across pages. AI can place you in the region but isn't confident enough to recommend you for location-specific searches.",
    missing: [
      "Orbit City references on key service pages",
      "LocalBusiness schema markup",
      "Customer references from local spacecraft manufacturers",
    ],
  },
  {
    n: 3,
    total: 3,
    intent: "Who manufactures sprockets for the space economy?",
    recommend: true,
    likelihood: "Very likely",
    why: "Your brand name and core product are clearly associated in AI training data. For broad brand-awareness searches, Spacely is consistently surfaced as a known player in the space sprocket category.",
    confidenceDriver: "Strong brand-to-product association in AI training data + consistent use of 'space sprockets' terminology",
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
          You're <strong>strongly positioned in 1 of 3</strong> key areas — brand awareness, but not commercial intent.
        </p>
        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0 }}>
          The remaining gaps are fixable — but until addressed, AI will recognise Spacely without recommending it to buyers.
        </p>
      </div>
    </div>
  );
}

const GAPS = [
  {
    n: 1,
    title: "Product specifications",
    impact: "High",
    line1: "No technical product pages exist — materials, tolerances, and compatible spacecraft systems are absent.",
    line2: "AI cannot match Spacely to specific component searches without structured product data to reference.",
  },
  {
    n: 2,
    title: "Commercial intent signals",
    impact: "High",
    line1: "The site reads as a brand presence, not a supplier. Pricing context, lead times, and ordering information are missing.",
    line2: "AI prioritises suppliers that communicate clearly for buyers — not just brands that exist.",
  },
  {
    n: 3,
    title: "Customer application context",
    impact: "Medium",
    line1: "No case studies or testimonials showing which manufacturers or spacecraft use Spacely sprockets.",
    line2: "Without application examples, AI can't confidently recommend you for specific use-case queries.",
  },
  {
    n: 4,
    title: "Competitive differentiation",
    impact: "Medium",
    line1: "Nothing on the site explains why Spacely over Cogswell's Cogs — or any other supplier.",
    line2: "AI recommendations favour businesses with clear positioning. Undifferentiated suppliers are skipped.",
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
          Score: 18 / 100 — Limited AI recognition
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.7 }}>
          <strong>Explanation: </strong>Spacely Space Sprockets has a low recognition score — AI systems have little independent knowledge of the business beyond what's on the website. This is common for established businesses that haven't yet built a significant third-party footprint online.
        </div>

        <div style={{ padding: "12px 16px", backgroundColor: "#f8fafc", borderRadius: 8, fontSize: 14, color: "#334155", lineHeight: 1.7 }}>
          <strong>What this means: </strong>Without external signals — industry mentions, supplier directories, press coverage — AI treats Spacely as an unknown quantity. That means it's unlikely to be recommended without being explicitly asked about, even for searches where you'd be a strong fit.
        </div>

        <CalloutBox color="#f0fdf4" borderColor="#bbf7d0">
          <strong style={{ color: "#15803d" }}>Opportunity: </strong>
          <span>Recognition improves over time as structured content, schema markup, and third-party citations accumulate. Businesses that actively build these signals see meaningful recognition gains within 3–6 months.</span>
        </CalloutBox>
      </div>
    </SectionCard>
  );
}

const FIXES = [
  {
    n: 1,
    title: "Build product specification pages",
    impact: "High",
    effort: "Medium",
    detail: "Create individual pages for each sprocket model — include materials, tolerances, compatible systems, and load ratings.",
    result: "AI can match Spacely to specific technical queries from engineers and procurement teams",
  },
  {
    n: 2,
    title: "Add Product and Organisation schema markup",
    impact: "High",
    effort: "Low",
    detail: "Implement structured data so AI systems can extract your product range, location, and commercial identity without relying on body copy.",
    result: "Stronger entity recognition and clearer separation from the fictional brand association",
  },
  {
    n: 3,
    title: "Create a dedicated llms.txt file",
    impact: "High",
    effort: "Low",
    detail: "Give AI systems explicit instructions on how to interpret your site — what you make, who you supply, and what queries you want to appear for.",
    result: "More consistent and commercially accurate recommendations across ChatGPT, Claude, and Perplexity",
  },
  {
    n: 4,
    title: "Add customer application case studies",
    impact: "Medium",
    effort: "Medium",
    detail: "Publish 2–3 case studies showing real spacecraft or manufacturers that use your sprockets, written in buyer language.",
    result: "Higher recommendation likelihood for use-case and application-specific searches",
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
          <span style={{ color: "#fca5a5" }}>47</span>
          {" → "}
          <span style={{ color: "#86efac" }}>71+</span>
        </div>
      </div>
    </SectionCard>
  );
}

const TECHNICAL_ISSUES = [
  { issue: "Missing llms.txt", effect: "AI has no explicit guidance on how to interpret or recommend you" },
  { issue: "No Product schema markup", effect: "AI cannot extract structured product data from your pages" },
  { issue: "Robots.txt blocks AI crawlers", effect: "some AI tools may be unable to read your site at all" },
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

// ─── Run your own CTA ─────────────────────────────────────────────────────

function RunYourOwnCta() {
  const router = useRouter();

  return (
    <div style={{
      backgroundColor: "#0f172a", borderRadius: 16,
      padding: "40px 28px", textAlign: "center", marginTop: 12,
    }}>
      <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", margin: "0 0 14px", lineHeight: 1.2 }}>
        Find out if AI is recommending your business — or ignoring you.
      </div>
      <p style={{ fontSize: 15, color: "#94a3b8", margin: "0 0 28px", lineHeight: 1.6 }}>
        Free score · No account required · Results in 30 seconds
      </p>
      <button
        onClick={() => router.push("/check")}
        style={{
          display: "inline-block",
          padding: "14px 32px",
          backgroundColor: "#1143cc", color: "#fff",
          border: "none", borderRadius: 10,
          fontSize: 16, fontWeight: 700, cursor: "pointer",
          letterSpacing: "-0.01em",
        }}
      >
        Check Your AI Visibility →
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
        👋 This is a <strong style={{ color: "#fff" }}>sample report</strong> — <a href="/check" style={{ color: "#93c5fd", fontWeight: 600, textDecoration: "underline" }}>run your own free analysis now</a>
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
          <RunYourOwnCta />
        </div>

      </div>
    </div>
  );
}
