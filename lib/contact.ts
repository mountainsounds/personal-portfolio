/**
 * Pure logic for the contact endpoint: input parsing/validation and email
 * rendering. Kept free of I/O so it can be unit-tested directly; the route
 * handler owns HTTP and the Resend call.
 */

export type ContactSubmission = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ParseResult =
  | { ok: true; data: ContactSubmission }
  | { ok: false; error: "missing_required" | "invalid_email" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

const field = (body: unknown, key: string): string =>
  typeof body === "object" && body !== null
    ? str((body as Record<string, unknown>)[key])
    : "";

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Honeypot: any content in the hidden `website` field marks the sender as a bot. */
export function isSpam(body: unknown): boolean {
  return field(body, "website").length > 0;
}

export function parseContactInput(body: unknown): ParseResult {
  const name = field(body, "name");
  const email = field(body, "email");
  const subject = field(body, "subject");
  const message = field(body, "message");

  if (!name || !email || !message) {
    return { ok: false, error: "missing_required" };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "invalid_email" };
  }
  return { ok: true, data: { name, email, subject, message } };
}

export function renderContactEmail({
  name,
  email,
  subject,
  message,
}: ContactSubmission): {
  subject: string;
  text: string;
  html: string;
} {
  const detail = [
    `Name:    ${name}`,
    `Email:   ${email}`,
    subject ? `Subject: ${subject}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const text = `New message from mtnsounds.com.\n\n${detail}\n\n${message}\n\n— Reply to this email to respond to ${name} directly.\n`;

  const row = (label: string, value: string) =>
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

  return {
    subject: `Portfolio contact from ${name}${subject ? ` — ${subject}` : ""}`,
    text,
    html,
  };
}
