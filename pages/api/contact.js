/**
 * Contact form backend — sends one notification email via Resend.
 *
 * Replaces the old client-side EmailJS flow. The visitor's message lands in
 * my inbox with `reply_to` set to their address, so replying in Gmail goes
 * straight back to them. Nothing is stored.
 *
 * The honeypot (`website` must be empty) is checked before anything else:
 * bots that fill it get a silent 200 so they don't learn they were caught.
 *
 * Env (see .env.local.example): RESEND_API_KEY, RESEND_FROM_EMAIL, and
 * optionally CONTACT_NOTIFY_EMAIL to redirect notifications while testing.
 */

const NOTIFY_TO = process.env.CONTACT_NOTIFY_EMAIL || "mountainsounds15@gmail.com";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const str = (v) => (typeof v === "string" ? v.trim() : "");

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  let body = req.body ?? {};
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ ok: false, error: "invalid_json" });
    }
  }

  // Honeypot: silent accept-and-drop. Returns before any validation or send.
  if (str(body.website).length > 0) {
    return res.status(200).json({ ok: true });
  }

  const name = str(body.name);
  const email = str(body.email);
  const subject = str(body.subject);
  const message = str(body.message);

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: "missing_required" });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: "invalid_email" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("[contact] RESEND_API_KEY / RESEND_FROM_EMAIL is not set");
    return res.status(500).json({ ok: false, error: "server_misconfigured" });
  }

  const detail = [
    `Name:    ${name}`,
    `Email:   ${email}`,
    subject ? `Subject: ${subject}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const text = `New message from mtnsounds.com.\n\n${detail}\n\n${message}\n\n— Reply to this email to respond to ${name} directly.\n`;

  const row = (label, value) =>
    `<tr><td style="padding:2px 14px 2px 0;color:#666;vertical-align:top">${label}</td><td>${value}</td></tr>`;
  const html = `<div style="font-family:system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.5;color:#222">
  <p style="margin:0 0 14px">New message from <strong>mtnsounds.com</strong>.</p>
  <table style="border-collapse:collapse;margin:0 0 16px">
    ${row("Name", escapeHtml(name))}
    ${row("Email", `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`)}
    ${subject ? row("Subject", escapeHtml(subject)) : ""}
  </table>
  <p style="white-space:pre-wrap;margin:0">${escapeHtml(message)}</p>
  <p style="margin:18px 0 0;color:#666;font-size:13px">Reply directly to this email to respond to ${escapeHtml(name)}.</p>
</div>`;

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: NOTIFY_TO,
        reply_to: email,
        subject: `Portfolio contact from ${name}${subject ? ` — ${subject}` : ""}`,
        text,
        html,
      }),
    });
    if (!resp.ok) {
      const errBody = await resp.text().catch(() => "");
      console.error(`[contact] Resend error (${resp.status}):`, errBody);
      return res.status(502).json({ ok: false, error: "send_failed" });
    }
  } catch (err) {
    console.error("[contact] send threw:", err);
    return res.status(502).json({ ok: false, error: "send_failed" });
  }

  return res.status(200).json({ ok: true });
}
