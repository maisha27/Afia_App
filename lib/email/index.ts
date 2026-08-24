import { Resend } from 'resend';

const resend = () => new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? 'Afia <info@afia.me>';
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://afia.app';

/* ─── Shared template shell ─── */
function shell(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Afia</title>
</head>
<body style="margin:0;padding:0;background:#F5F1EB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F1EB;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;" cellpadding="0" cellspacing="0">

        <!-- Logo -->
        <tr><td align="center" style="padding-bottom:28px;">
          <span style="font-size:22px;font-weight:700;color:#2F5049;letter-spacing:-0.02em;">afia</span>
          <div style="font-size:9px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:#6B827A;margin-top:3px;">calm in mind</div>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#FFFFFF;border-radius:18px;border:1px solid #EFE9E1;padding:36px 36px 32px;">
          ${body}
        </td></tr>

        <!-- Footer -->
        <tr><td align="center" style="padding-top:22px;font-size:12px;color:#9AA29C;line-height:1.6;">
          You're receiving this because you enabled gentle reminders in Afia.<br />
          <a href="${SITE}/settings" style="color:#2F6E7A;text-decoration:underline;">Manage your preferences</a>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ─── CTA button ─── */
function btn(label: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;background:#2F5049;color:#EAF3EF;font-size:14.5px;font-weight:600;text-decoration:none;padding:13px 28px;border-radius:11px;margin-top:24px;">${label}</a>`;
}

/* ─── Daily nudge ─── */
export async function sendDailyNudge(to: string, firstName: string): Promise<void> {
  const greeting = firstName ? `Hi ${firstName}` : 'Hi there';
  const body = `
    <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#2F6E7A;">Your plan · today</p>
    <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#1E2A26;letter-spacing:-0.02em;">${greeting} — your next step is ready.</h1>
    <p style="margin:0;font-size:15px;line-height:1.65;color:#4A524E;">
      A short exercise is waiting for you in your plan. It only takes a few minutes and it all adds up — one small step at a time.
    </p>
    <p style="margin:20px 0 0;font-size:14px;line-height:1.6;color:#767D79;">
      Going gently is still going forward. There's no pace you're supposed to keep.
    </p>
    ${btn('Continue your plan', `${SITE}/home`)}
  `;
  await resend().emails.send({ from: FROM, to, subject: `Your plan is here when you're ready, ${firstName || 'there'}`, html: shell(body) });
}

/* ─── Weekly check-in ─── */
export async function sendWeeklyCheckin(to: string, firstName: string): Promise<void> {
  const greeting = firstName ? `Hi ${firstName}` : 'Hi there';
  const body = `
    <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#2F6E7A;">Weekly check-in</p>
    <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#1E2A26;letter-spacing:-0.02em;">${greeting} — how has the week felt?</h1>
    <p style="margin:0;font-size:15px;line-height:1.65;color:#4A524E;">
      Taking a moment to notice how your week has gone is part of the practice. You don't need a perfect week to do a check-in — any week counts.
    </p>
    <p style="margin:20px 0 0;font-size:14px;line-height:1.6;color:#767D79;">
      Your journal is a quiet space, just for you. There's no right or wrong thing to write.
    </p>
    ${btn('Open my journal', `${SITE}/journal`)}
  `;
  await resend().emails.send({ from: FROM, to, subject: `A moment to check in, ${firstName || 'there'}`, html: shell(body) });
}

/* ─── Encouragement ─── */
const ENCOURAGEMENT_NOTES = [
  "You came back today. That's the whole thing — that's what this is built on.",
  "Being aware of your patterns is not the same as being stuck in them.",
  "Small and consistent beats large and occasional, every time.",
  "The goal isn't to stop worrying entirely. It's to let worry take up less of your day.",
  "Every time you sit with uncertainty instead of checking, you're rewiring something real.",
  "Rest is not falling behind. Rest is part of the plan.",
  "Courage with anxiety doesn't look dramatic. It looks like you, doing the next ordinary thing.",
  "It's okay if this feels hard. Hard and hopeless are not the same thing.",
  "Your worth is not measured by how anxious you are or aren't today.",
  "The days you don't feel like doing this and do it anyway — those are the important ones.",
  "One difficult week doesn't undo what you've already built. Progress doesn't disappear.",
  "Kindness toward yourself isn't weakness — it's the ground that recovery is built on.",
];

export async function sendEncouragement(to: string, firstName: string): Promise<void> {
  const greeting = firstName ? `Hi ${firstName}` : 'Hi there';
  const note = ENCOURAGEMENT_NOTES[Math.floor(Math.random() * ENCOURAGEMENT_NOTES.length)];
  const body = `
    <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#2F6E7A;">A thought for you</p>
    <h1 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#1E2A26;letter-spacing:-0.02em;">${greeting}.</h1>
    <blockquote style="margin:0;padding:20px 24px;background:#EAF3EF;border-radius:12px;border-left:3px solid #2F6E7A;">
      <p style="margin:0;font-size:16px;line-height:1.65;color:#2F5049;font-style:italic;">"${note}"</p>
    </blockquote>
    <p style="margin:20px 0 0;font-size:14px;line-height:1.6;color:#767D79;">
      Keep going. Afia is here whenever you need it.
    </p>
    ${btn('Open Afia', `${SITE}/home`)}
  `;
  await resend().emails.send({ from: FROM, to, subject: `A thought for you, ${firstName || 'there'}`, html: shell(body) });
}
