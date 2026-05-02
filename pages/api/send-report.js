export function generateEmail(result, formData) {
  const displayName = result.inferred_name || formData.businessName || "Your business";

  const labelColors = {
    Strong:    { bg: "#f0fdf4", color: "#16a34a" },
    Visible:   { bg: "#eff6ff", color: "#2563eb" },
    Emerging:  { bg: "#fffbeb", color: "#d97706" },
    Invisible: { bg: "#fef2f2", color: "#dc2626" },
  };
  const lc = labelColors[result.web_label] || labelColors.Emerging;

  // Confidence filtering — matches web version exactly
  const CONFIDENCE_THRESHOLD = 60;
  const visibleFixes = (result.priority_fixes || [])
    .filter(fix =>
      (fix.confidence === undefined || fix.confidence >= CONFIDENCE_THRESHOLD) &&
      (fix.impact === "High" || fix.impact === "Medium")
    )
    .slice(0, 5);
  const visibleIssues = (result.technical_issues || [])
    .filter(issue => issue.confidence === undefined || issue.confidence >= CONFIDENCE_THRESHOLD)
    .slice(0, 4);

  // ── Helpers ───────────────────────────────────────────────────────────────

  // Wraps content in a standalone white card row (with a spacer row before it)
  const card = (content) => `
    <tr><td style="height: 14px; line-height: 14px; font-size: 14px;">&nbsp;</td></tr>
    <tr><td style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px 28px;">
      ${content}
    </td></tr>`;

  // Section header label — matches web version style
  const sectionTitle = (text) =>
    `<div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 18px;">${text}</div>`;

  // ── Score bar (fixed) ─────────────────────────────────────────────────────
  // Uses margin-left offset instead of transform:translate (unsupported in many email clients)
  // Uses a table for the 0–100 axis labels instead of flexbox
  const pinPct = Math.min(Math.max(result.web_score, 2), 98);
  const scoreBar = `
    <div style="position: relative; height: 12px; border-radius: 99px; background: linear-gradient(to right, #1e3a8a, #d946ef); margin: 20px 0 6px;">
      <div style="position: absolute; left: ${pinPct}%; top: 50%; margin-left: -11px; margin-top: -11px; width: 22px; height: 22px; border-radius: 50%; background: #fff; border: 3px solid #1e3a8a;"></div>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 4px;">
      <tr>
        <td style="font-size: 11px; color: #94a3b8; text-align: left;">0</td>
        <td style="font-size: 11px; color: #94a3b8; text-align: center;">25</td>
        <td style="font-size: 11px; color: #94a3b8; text-align: center;">50</td>
        <td style="font-size: 11px; color: #94a3b8; text-align: center;">75</td>
        <td style="font-size: 11px; color: #94a3b8; text-align: right;">100</td>
      </tr>
    </table>`;

  // ── Recognition note — only shown for high-recognition businesses (>60), matching web ──
  const recognitionNote = result.recognition_score > 60 ? `
    <div style="margin-top: 16px; padding: 12px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #64748b; line-height: 1.6; text-align: left;">
      <strong style="color: #475569;">Worth noting:</strong> this business is well-established in AI training data — meaning AI systems are already broadly familiar with the brand. The score above reflects website signals only — the content and structure AI uses when deciding who to recommend in live searches.
    </div>` : "";

  // ── Target Query Test ─────────────────────────────────────────────────────
  const queryGroupsHtml = (result.query_groups || []).map((group, i) => {
    const isYes = group.would_recommend === true;
    const statusBg     = isYes ? "#f0fdf4" : "#fef2f2";
    const statusBorder = isYes ? "#bbf7d0" : "#fecaca";
    const statusColor  = isYes ? "#16a34a" : "#dc2626";
    return `
      <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 18px; margin-bottom: 10px;">
        <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px;">Query ${i + 1} of ${result.query_groups.length}</div>
        <div style="font-size: 14px; font-weight: 600; color: #0f172a; font-style: italic; margin-bottom: 12px;">"${group.intent}"</div>
        <div style="background: ${statusBg}; border: 1px solid ${statusBorder}; border-radius: 8px; padding: 10px 14px; margin-bottom: 12px;">
          <span style="font-weight: 700; font-size: 14px; color: ${statusColor};">${isYes ? "✓" : "✗"} ${group.likelihood}</span>
        </div>
        <div style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: ${group.confidence_driver || group.content_fix ? "10px" : "0"};">
          <strong>Why:</strong> ${group.reason}
        </div>
        ${group.confidence_driver ? `<div style="font-size: 13px; padding: 10px 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; color: #334155; line-height: 1.5; margin-bottom: 6px;"><strong>Confidence driver:</strong> ${group.confidence_driver}</div>` : ""}
        ${group.content_fix ? `<div style="font-size: 13px; padding: 10px 12px; background: ${statusBg}; border: 1px solid ${statusBorder}; border-radius: 6px; color: #334155; line-height: 1.5;"><strong>Quick fix:</strong> ${group.content_fix}</div>` : ""}
      </div>`;
  }).join("");

  const querySummaryHtml = result.query_groups?.length > 0 ? (() => {
    const positiveCount = result.query_groups.filter(g => g.would_recommend).length;
    const total = result.query_groups.length;
    return `
      <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 18px;">
        <div style="font-size: 11px; font-weight: 700; color: #1143cc; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px;">Overall Query Coverage</div>
        <p style="font-size: 14px; color: #334155; line-height: 1.7; margin: 0 0 6px;">You're <strong>strongly positioned in ${positiveCount} of ${total}</strong> key area${total !== 1 ? "s" : ""}.</p>
        <p style="font-size: 14px; color: #475569; line-height: 1.7; margin: 0;">The remaining opportunities are fixable — but currently limit how often AI will recommend you.</p>
      </div>`;
  })() : "";

  // ── Content gaps (now objects: title, impact, line1, line2) ───────────────
  const contentGapsHtml = (result.content_gaps || []).map((gap, i) => {
    if (typeof gap === "string") {
      return `<div style="padding: 12px 14px; background: #f8fafc; border-radius: 8px; font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 8px;">${gap}</div>`;
    }
    return `
      <div style="padding: 14px 16px; background: #f8fafc; border-radius: 10px; margin-bottom: 8px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 6px;">
          <tr>
            <td style="font-weight: 700; font-size: 14px; color: #0f172a;">${i + 1}. ${gap.title}</td>
            <td style="text-align: right; white-space: nowrap;">
              <span style="font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 99px; background: ${gap.impact === "High" ? "#fef2f2" : "#fffbeb"}; color: ${gap.impact === "High" ? "#dc2626" : "#d97706"};">${gap.impact} impact</span>
            </td>
          </tr>
        </table>
        <p style="font-size: 13px; color: #475569; line-height: 1.6; margin: 0 0 4px;">${gap.line1}</p>
        <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin: 0;">${gap.line2}</p>
      </div>`;
  }).join("");

  // ── Priority fixes (with confidence filtering + expected_result) ──────────
  const priorityFixesHtml = visibleFixes.map(fix => `
    <div style="background: #f8fafc; border-radius: 8px; padding: 14px 16px; margin-bottom: 10px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 6px;">
        <tr>
          <td style="font-weight: 700; font-size: 14px; color: #0f172a;">${fix.title}</td>
          <td style="text-align: right; white-space: nowrap;">
            <span style="font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 99px; background: ${fix.impact === "High" ? "#fef2f2" : "#fffbeb"}; color: ${fix.impact === "High" ? "#dc2626" : "#d97706"}; margin-right: 4px;">${fix.impact} impact</span>
            <span style="font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 99px; background: #f1f5f9; color: #64748b;">${fix.effort} effort</span>
          </td>
        </tr>
      </table>
      <div style="font-size: 13px; color: #475569; line-height: 1.5; margin-bottom: ${fix.expected_result ? "10px" : "0"};">${fix.detail}</div>
      ${fix.expected_result ? `<div style="font-size: 13px; padding: 8px 12px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; color: #1e40af; line-height: 1.5;"><strong>Expected result:</strong> ${fix.expected_result}</div>` : ""}
    </div>`).join("");

  // ── Technical issues (now objects: issue, effect — with confidence filtering) ──
  const technicalIssuesHtml = visibleIssues.map(issue => {
    const label = typeof issue === "string"
      ? issue
      : `<strong>${issue.issue}</strong> <span style="color: #64748b;">→ ${issue.effect}</span>`;
    return `<div style="padding: 10px 14px; background: #f8fafc; border-radius: 8px; margin-bottom: 8px; font-size: 14px; color: #334155; line-height: 1.6;">⚠️ ${label}</div>`;
  }).join("");

  // ── Full HTML ─────────────────────────────────────────────────────────────
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin: 0; padding: 0; background: #f3e7e7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 32px 16px; background: #f3e7e7;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px;">

        <!-- Header -->
        <tr><td style="background: #fcf6f6; border: 1px solid #e2e8f0; border-bottom: none; border-radius: 16px 16px 0 0; padding: 28px; text-align: center;">
          <img src="https://ai-visibility-score-green.vercel.app/AI-ScoreScout_logo.png" width="270" alt="AI Score Scout" style="display: block; margin: 0 auto;" />
        </td></tr>

        <!-- Score card -->
        <tr><td style="background: #fff; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px; padding: 32px 28px 24px; text-align: center;">
          ${result.favicon_url ? `<img src="${result.favicon_url}" width="36" height="36" alt="" style="display: block; margin: 0 auto 12px; border-radius: 6px;" />` : ""}
          <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">AI Visibility Report</div>
          <div style="font-size: 22px; font-weight: 800; color: #1143cc; margin-bottom: 16px; letter-spacing: -0.01em;">${displayName}</div>
          <div style="font-size: 64px; font-weight: 800; color: #0f172a; line-height: 1;">${result.web_score}<span style="font-size: 28px; font-weight: 600; color: #94a3b8;"> / 100</span></div>
          ${scoreBar}
          <div style="display: inline-block; background: ${lc.bg}; color: ${lc.color}; font-weight: 700; font-size: 15px; padding: 6px 20px; border-radius: 99px; margin-bottom: 16px;">${result.web_label}</div>
          <p style="font-size: 15px; color: #475569; line-height: 1.7; margin: 0; text-align: left;">${result.explanation}</p>
          ${recognitionNote}
        </td></tr>

        <!-- How You Compare in AI Visibility -->
        ${card(`
          ${sectionTitle("How You Compare in AI Visibility")}
          <p style="font-size: 14px; color: #334155; line-height: 1.7; margin: 0 0 14px;">${result.benchmark_note || ""}</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
            <tr>
              <td width="48%" style="background: #f8fafc; border-radius: 8px; padding: 16px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">Your Score</div>
                <div style="font-size: 32px; font-weight: 800; color: #0f172a; margin-top: 4px;">${result.web_score}</div>
              </td>
              <td width="4%"></td>
              <td width="48%" style="background: #f8fafc; border-radius: 8px; padding: 16px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">Industry Avg</div>
                <div style="font-size: 32px; font-weight: 800; color: #94a3b8; margin-top: 4px;">~${result.benchmark_avg || "—"}</div>
              </td>
            </tr>
          </table>
          <p style="font-size: 14px; color: #334155; line-height: 1.7; margin: 0 0 14px;">However, most competitors have the same weakness: they're not structured for AI understanding.</p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px 16px; font-size: 14px; color: #334155; line-height: 1.7;">
            <strong style="color: #15803d;">Opportunity:</strong> This means there's a real opportunity to move ahead quickly with the right changes.
          </div>
        `)}

        <!-- Target Query Test -->
        ${result.query_groups?.length > 0 ? card(`
          ${sectionTitle("Target Query Test")}
          ${queryGroupsHtml}
          ${querySummaryHtml}
        `) : ""}

        <!-- What AI Can't Clearly Understand (Yet) -->
        ${card(`
          ${sectionTitle("What AI Can't Clearly Understand (Yet)")}
          <p style="font-size: 14px; color: #475569; line-height: 1.7; margin: 0 0 14px;">These are the gaps preventing AI from confidently recommending your business:</p>
          ${contentGapsHtml}
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px 16px; margin-top: 14px; font-size: 14px; color: #334155; line-height: 1.7;">
            These gaps don't require a rebuild — just clearer structure and language.
          </div>
        `)}

        <!-- Priority Fix List -->
        ${card(`
          ${sectionTitle("Priority Fix List")}
          ${priorityFixesHtml || `<p style="font-size: 14px; color: #64748b; margin: 0;">No fixes available.</p>`}
        `)}

        <!-- Technical Signals Affecting AI Visibility -->
        ${visibleIssues.length > 0 ? card(`
          ${sectionTitle("Technical Signals Affecting AI Visibility")}
          ${technicalIssuesHtml}
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px 16px; margin-top: 14px; font-size: 14px; color: #334155; line-height: 1.7;">
            These are easy wins that support the broader content improvements above.
          </div>
        `) : ""}

        <!-- Footer -->
        <tr><td style="height: 14px; line-height: 14px; font-size: 14px;">&nbsp;</td></tr>
        <tr><td style="background: #fcf6f6; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px 28px; text-align: center;">
          <p style="font-size: 13px; color: #64748b; margin: 0 0 8px;">This report was generated by AI Score Scout</p>
          <a href="https://aiscorescout.com" style="font-size: 13px; color: #1143cc; text-decoration: none;">aiscorescout.com</a>
        </td></tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, result, formData } = req.body;
  if (!email || !result) return res.status(400).json({ error: "Missing email or result" });

  const html = generateEmail(result, formData || {});

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "AI Score Scout <report@mail.aiscorescout.com>",
      to: [email],
      subject: `Your AI Visibility Report${formData?.businessName ? ` — ${formData.businessName}` : ""}`,
      html,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    return res.status(500).json({ error: err.message || "Failed to send email" });
  }

  // ─── Self-notification (awaited to ensure Vercel doesn't kill it early) ─────
  await new Promise(r => setTimeout(r, 1000)); // 1s gap to respect rate limit
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "AI Score Scout <report@mail.aiscorescout.com>",
      to: ["payment@aiscorescout.com"],
      subject: `💳 New payment: ${formData?.businessName || email}`,
      html: `
        <div style="font-family: sans-serif; font-size: 15px; color: #0f172a; max-width: 480px;">
          <h2 style="margin: 0 0 16px;">New report unlocked</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 8px 0; color: #64748b; width: 140px;">URL</td><td style="padding: 8px 0;">${formData?.url || "—"}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Business name</td><td style="padding: 8px 0;">${formData?.businessName || "—"}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Email</td><td style="padding: 8px 0;">${email}</td></tr>
          </table>
        </div>
      `,
    }),
  }).catch(() => {});

  res.status(200).json({ success: true });
}
