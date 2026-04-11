// Temporary preview route — visit /api/preview-email in your browser to see the email template
import { generateEmail } from "./send-report";

const dummyResult = {
  web_score: 62,
  web_label: "Visible",
  explanation:
    "Studio Bravo has a well-structured website with clear service descriptions and several strong trust signals. However, key content gaps around specific deliverables, pricing context, and client outcomes are limiting how confidently AI tools can recommend the business in response to direct service queries.",
  benchmark_note:
    "Digital agencies in Australia typically score between 55–75. You're sitting in the mid-range — a few targeted improvements could push you into the top tier.",
  benchmark_avg: 60,
  query_groups: [
    {
      intent: "Brand design agency Melbourne",
      likelihood: "Likely to recommend",
      would_recommend: true,
      reason:
        "The website clearly positions Studio Bravo as a brand design agency based in Melbourne with a portfolio and team page.",
      content_fix: null,
    },
    {
      intent: "Website redesign for small business",
      likelihood: "Unlikely to recommend",
      would_recommend: false,
      reason:
        "There's no explicit content targeting small business website redesign as a service. The work examples skew toward larger clients.",
      content_fix:
        "Add a services page section or case study specifically addressing small business website projects.",
    },
  ],
  recognition_score: 0,
  confidence: "Not recognised",
  known_for: null,
  content_gaps: [
    "No pricing context or starting-from rates mentioned anywhere on the site",
    "Case studies lack measurable outcomes (traffic, conversions, revenue impact)",
    "No FAQ or 'how we work' content that AI tools can surface for process queries",
    "Limited blog or thought leadership content to establish topical authority",
  ],
  priority_fixes: [
    {
      title: "Add a structured services page",
      impact: "High",
      effort: "Medium",
      detail:
        "Break out individual services with clear descriptions, typical deliverables, and timelines. This is the single highest-leverage change for AI discoverability.",
    },
    {
      title: "Publish 2–3 outcome-led case studies",
      impact: "High",
      effort: "High",
      detail:
        "AI tools favour businesses with specific, credible proof of results. Case studies with before/after context and measurable outcomes dramatically improve recommendation likelihood.",
    },
    {
      title: "Add schema.org markup",
      impact: "Medium",
      effort: "Low",
      detail:
        "No JSON-LD schema detected. Adding LocalBusiness and Service schema gives AI crawlers structured signals about what you do and where you operate.",
    },
  ],
  technical_issues: [
    "No schema.org / JSON-LD markup detected",
    "robots.txt does not reference a sitemap",
    "No llms.txt file found",
  ],
};

const dummyFormData = { businessName: "Studio Bravo" };

export { generateEmail };

export default function handler(req, res) {
  const html = generateEmail(dummyResult, dummyFormData);
  res.setHeader("Content-Type", "text/html");
  res.send(html);
}
