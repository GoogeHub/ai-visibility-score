export function generateEmail(result, formData) {
  const displayName = formData.businessName || "Your business";
  const labelColors = {
    Strong: { bg: "#f0fdf4", color: "#16a34a" },
    Visible: { bg: "#eff6ff", color: "#2563eb" },
    Emerging: { bg: "#fffbeb", color: "#d97706" },
    Invisible: { bg: "#fef2f2", color: "#dc2626" },
  };
  const lc = labelColors[result.web_label] || labelColors.Emerging;

  const sectionTitle = (text) => `
    <tr><td style="padding: 28px 0 12px;">
      <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">${text}</div>
    </td></tr>`;

  const queryGroups = (result.query_groups || []).map(group => `
    <tr><td style="padding: 8px 0 16px;">
      <div style="background: ${group.would_recommend ? "#f0fdf4" : "#fef2f2"}; border-radius: 8px; padding: 14px 16px; margin-bottom: 8px;">
        <div style="font-weight: 700; color: ${group.would_recommend ? "#16a34a" : "#dc2626"}; font-size: 15px; margin-bottom: 4px;">
          ${group.would_recommend ? "✓" : "✗"} ${group.likelihood}
        </div>
        <div style="font-size: 13px; color: #475569;">Intent: <strong>${group.intent}</strong></div>
      </div>
      <div style="font-size: 14px; color: #334155; line-height: 1.6;"><strong>Why:</strong> ${group.reason}</div>
      ${group.content_fix ? `<div style="font-size: 14px; color: #475569; margin-top: 8px; padding: 10px 12px; background: #f8fafc; border-radius: 6px;"><strong>Fix:</strong> ${group.content_fix}</div>` : ""}
    </td></tr>
  `).join("");

  const contentGaps = (result.content_gaps || []).map(gap => `
    <tr><td style="padding: 4px 0;">
      <div style="font-size: 14px; color: #334155; line-height: 1.6; padding: 6px 0 6px 16px; border-left: 3px solid #1143cc;">• ${gap}</div>
    </td></tr>
  `).join("");

  const priorityFixes = (result.priority_fixes || []).map(fix => `
    <tr><td style="padding: 6px 0;">
      <div style="background: #f8fafc; border-radius: 8px; padding: 14px 16px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="font-weight: 700; font-size: 14px; color: #0f172a;">${fix.title}</span>
          <span style="font-size: 12px; color: ${fix.impact === "High" ? "#dc2626" : "#d97706"}; font-weight: 600; background: ${fix.impact === "High" ? "#fef2f2" : "#fffbeb"}; padding: 2px 8px; border-radius: 99px;">${fix.impact} impact</span>
        </div>
        <div style="font-size: 13px; color: #475569;">${fix.detail}</div>
      </div>
    </td></tr>
  `).join("");

  const aiRecognition = result.recognition_score === 0
    ? `<p style="font-size: 14px; color: #334155; line-height: 1.7; margin: 0;">
        ${displayName} doesn't appear in AI training data — and that's completely normal for the vast majority of businesses. AI models only "memorise" brands that appear repeatedly across the web in their training dataset.
        <br/><br/>
        The good news: it doesn't stop AI from recommending you. Most AI tools people actually use — Perplexity, ChatGPT with browsing, Google AI Overviews — search the web in real time, not from memory. Your Web Signals score is what drives those recommendations.
      </p>`
    : `<p style="font-size: 14px; color: #334155; line-height: 1.7; margin: 0;">
        <strong>Recognition score: ${result.recognition_score}/100</strong> (${result.confidence})<br/>
        ${result.known_for}
      </p>`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin: 0; padding: 0; background: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px;">

        <!-- Header -->
        <tr><td style="background: #0f172a; border-radius: 16px 16px 0 0; padding: 28px; text-align: center;">
          <img src="https://ai-visibility-score-green.vercel.app/AI-ScoreScout_logo.png" width="180" alt="AI Score Scout" style="display: block; margin: 0 auto;" />
        </td></tr>

        <!-- Score -->
        <tr><td style="background: #fff; padding: 36px 32px 24px; text-align: center;">
          <div style="font-size: 14px; font-weight: 700; color: #64748b; margin-bottom: 8px;">${displayName}</div>
          <div style="font-size: 64px; font-weight: 800; color: #0f172a; line-height: 1;">${result.web_score}<span style="font-size: 28px; color: #94a3b8;"> / 100</span></div>
          <div style="margin-top: 16px; display: inline-block; background: ${lc.bg}; color: ${lc.color}; font-weight: 700; font-size: 15px; padding: 6px 20px; border-radius: 99px;">${result.web_label}</div>
          <p style="font-size: 15px; color: #475569; line-height: 1.7; margin: 20px 0 0; text-align: left;">${result.explanation}</p>
        </td></tr>

        <!-- Full Report -->
        <tr><td style="background: #fff; padding: 0 32px 36px;">
          <table width="100%" cellpadding="0" cellspacing="0">

            ${sectionTitle("Industry Benchmark")}
            <tr><td>
              <p style="font-size: 14px; color: #334155; line-height: 1.7; margin: 0 0 16px;">${result.benchmark_note || ""}</p>
              <table width="100%" cellpadding="0" cellspacing="0">
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
            </td></tr>

            ${result.query_groups?.length ? sectionTitle("Target Query Test") : ""}
            ${queryGroups}

            ${sectionTitle("AI Recognition")}
            <tr><td>${aiRecognition}</td></tr>

            ${sectionTitle("Content Gap Analysis")}
            <table width="100%" cellpadding="0" cellspacing="0">${contentGaps}</table>

            ${sectionTitle("Priority Fix List")}
            <table width="100%" cellpadding="0" cellspacing="0">${priorityFixes}</table>

            ${result.technical_issues?.length ? sectionTitle("Technical Audit") : ""}
            ${(result.technical_issues || []).map(issue => `
              <tr><td style="padding: 4px 0;">
                <div style="font-size: 14px; color: #334155; line-height: 1.6; padding: 6px 0;">• ${issue}</div>
              </td></tr>
            `).join("")}

          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background: #0f172a; border-radius: 0 0 16px 16px; padding: 24px 32px; text-align: center;">
          <p style="font-size: 13px; color: #64748b; margin: 0 0 8px;">This report was generated by AI Score Scout</p>
          <a href="https://aiscorescout.com" style="font-size: 13px; color: #1143cc;">aiscorescout.com</a>
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

  res.status(200).json({ success: true });
}
