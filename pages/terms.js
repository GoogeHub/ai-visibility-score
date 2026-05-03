import Head from "next/head";
import { useRouter } from "next/router";

export default function Terms() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Terms of Service & Privacy Policy — AI Score Scout</title>
        <meta name="description" content="Terms of Service and Privacy Policy for AI Score Scout." />
      </Head>
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#fcf6f6",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#0f172a",
      }}>

        {/* Nav */}
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
            style={{ width: 200, cursor: "pointer" }}
            onClick={() => router.push("/")}
          />
        </nav>

        <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px 24px 100px" }}>

          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1143cc", letterSpacing: "-0.01em", margin: "0 0 8px" }}>
            Terms of Service & Privacy Policy
          </h1>
          <p style={{ fontSize: 14, color: "#94a3b8", margin: "0 0 48px" }}>
            Last updated: May 2026
          </p>

          <Section title="1. About This Service">
            <p>AI Score Scout ("we", "us", "our") is an online tool that analyses a business's website and produces an AI visibility report. The service is operated by AI Score Scout and is available at aiscorescout.com.</p>
            <p>By using this service — whether to generate a free score or to purchase a full report — you agree to these terms.</p>
          </Section>

          <Section title="2. The Service">
            <p>AI Score Scout analyses publicly accessible website content and uses AI language models to generate a visibility score and report. The free score is available immediately on screen. A detailed full report is available to purchase for a one-time fee of $49 AUD and is delivered by email.</p>
            <p>Reports are generated automatically and reflect the state of the website at the time of analysis. Results may vary between runs as website content and AI model behaviour changes over time.</p>
          </Section>

          <Section title="3. Accuracy & Limitations">
            <p>Reports are produced by AI systems and are intended as a guide only. They do not constitute professional advice of any kind — including legal, marketing, technical, or business advice.</p>
            <p>We make no guarantees about the accuracy, completeness, or fitness for purpose of any score, recommendation, or analysis produced by this service. You should use the results alongside your own judgement and, where appropriate, seek independent professional advice.</p>
          </Section>

          <Section title="4. Payment & Refunds">
            <p>The full report is sold as a one-time digital product for $49 AUD. Payment is processed securely via Stripe. By completing payment you authorise us to charge the amount shown.</p>
            <p>Because the report is delivered digitally and immediately upon payment, we do not offer refunds except where required by applicable consumer law. If you experience a technical issue that prevents delivery of your report, please contact us and we will make it right.</p>
          </Section>

          <Section title="5. Your Data & Privacy">
            <p>We collect the following information when you use our service:</p>
            <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
              <li>The website URL you submit for analysis</li>
              <li>Your email address, if you choose to provide it</li>
              <li>Business name and industry, if you choose to provide them</li>
              <li>Payment information (processed and stored by Stripe — we do not store card details)</li>
            </ul>
            <p>We use your email address solely to deliver your report. We will not send you marketing emails, add you to any mailing list, or share your address with third parties — ever.</p>
            <p>We may retain anonymised, aggregated usage data (e.g. scores and industries) to improve the service. This data cannot be used to identify you.</p>
          </Section>

          <Section title="6. Third-Party Services">
            <p>This service uses the following third-party providers to operate:</p>
            <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
              <li><strong>Anthropic</strong> — AI analysis (claude.ai)</li>
              <li><strong>Firecrawl</strong> — website content extraction</li>
              <li><strong>Stripe</strong> — payment processing</li>
              <li><strong>Resend</strong> — email delivery</li>
              <li><strong>Vercel</strong> — hosting</li>
            </ul>
            <p>Each provider is bound by their own privacy policy and terms of service. We only share the minimum information necessary for each service to function.</p>
          </Section>

          <Section title="7. Website Content & Intellectual Property">
            <p>The analysis we perform is based on publicly accessible content from the website you submit. You confirm that you have the right to request analysis of that website.</p>
            <p>The report generated is provided for your personal or business use. You may not resell or redistribute reports without our permission.</p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>To the maximum extent permitted by law, AI Score Scout will not be liable for any indirect, incidental, or consequential loss arising from your use of this service or reliance on any report generated by it.</p>
            <p>Our total liability to you in connection with this service will not exceed the amount you paid for the report.</p>
          </Section>

          <Section title="9. Changes to These Terms">
            <p>We may update these terms from time to time. The current version will always be available at aiscorescout.com/terms. Continued use of the service after changes are posted constitutes acceptance of the updated terms.</p>
          </Section>

          <Section title="10. Contact">
            <p>If you have any questions about these terms or your data, please contact us at <a href="mailto:hello@aiscorescout.com" style={{ color: "#1143cc" }}>hello@aiscorescout.com</a>.</p>
          </Section>

          <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid #e2e8f0" }}>
            <button
              onClick={() => router.back()}
              style={{ fontSize: 14, color: "#1143cc", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              ← Back
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 12px" }}>{title}</h2>
      <div style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  );
}
