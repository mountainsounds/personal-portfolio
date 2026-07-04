import { NextResponse } from "next/server";

import { isSpam, parseContactInput, renderContactEmail } from "@/lib/contact";

/**
 * Contact form backend — sends one notification email via Resend.
 *
 * The visitor's message lands in my inbox with `reply_to` set to their
 * address, so replying in Gmail goes straight back to them. Nothing is
 * stored. Bots that fill the honeypot get a silent 200 so they don't learn
 * they were caught.
 *
 * Env (see .env.local.example): RESEND_API_KEY, RESEND_FROM_EMAIL, and
 * optionally CONTACT_NOTIFY_EMAIL to redirect notifications while testing.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  // Honeypot: silent accept-and-drop. Returns before any validation or send.
  if (isSpam(body)) {
    return NextResponse.json({ ok: true });
  }

  const parsed = parseContactInput(body);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, error: parsed.error },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const notifyTo =
    process.env.CONTACT_NOTIFY_EMAIL || "mountainsounds15@gmail.com";
  if (!apiKey || !from) {
    console.error("[contact] RESEND_API_KEY / RESEND_FROM_EMAIL is not set");
    return NextResponse.json(
      { ok: false, error: "server_misconfigured" },
      { status: 500 },
    );
  }

  const { subject, text, html } = renderContactEmail(parsed.data);

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: notifyTo,
        reply_to: parsed.data.email,
        subject,
        text,
        html,
      }),
    });
    if (!resp.ok) {
      const errBody = await resp.text().catch(() => "");
      console.error(`[contact] Resend error (${resp.status}):`, errBody);
      return NextResponse.json(
        { ok: false, error: "send_failed" },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[contact] send threw:", err);
    return NextResponse.json(
      { ok: false, error: "send_failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
