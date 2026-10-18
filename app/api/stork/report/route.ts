import { NextResponse } from "next/server";

import {
  clientIp,
  parseStorkReport,
  renderStorkEmail,
  REPORT_LIMITS,
  ReportRateLimiter,
} from "@/lib/stork-report";

/**
 * Problem reports from Stork, my Mac app.
 *
 * When something goes wrong, Stork can send a short report: what the user
 * wrote, the error they saw, a few facts about their Mac, and optionally a
 * cleaned-up transcript of the session. This route checks the report and
 * emails it to me through Resend, with the transcript attached as
 * transcript.txt. Nothing is stored.
 *
 * The app holds no secret. Anything shipped inside an app can be dug out of
 * it, so a key in Stork would really be a public key. The Resend key stays
 * here on the server. That means anyone can call this route, so it guards
 * itself instead:
 * - Bodies over 256 KiB get a 413.
 * - The User-Agent has to start with "Stork/". That's a cheap filter for
 *   drive-by bots, not security.
 * - 5 reports per IP per hour and 50 per day in total (ReportRateLimiter).
 * - The recipient and sender are constants below. The most a caller can do
 *   is send me an email.
 *
 * Env: RESEND_API_KEY only, the same key the contact form uses.
 */

/** Fixed on purpose. Never read from the request or env. */
const REPORT_TO = "mountainsounds15@gmail.com";
const REPORT_FROM = "Stork <reports@mtnsounds.com>";

// One limiter per server instance. Tests get a fresh one by re-importing
// this module.
const limiter = new ReportRateLimiter();

const fail = (error: string, status: number) =>
  NextResponse.json({ ok: false, error }, { status });

export async function POST(request: Request) {
  // When the client says the body is too big, refuse before reading it.
  const declaredBytes = Number(request.headers.get("content-length"));
  if (declaredBytes > REPORT_LIMITS.bodyBytes) {
    return fail("too_large", 413);
  }

  if (!request.headers.get("user-agent")?.startsWith("Stork/")) {
    return fail("not_stork", 400);
  }

  // Content-Length can be missing or wrong, so measure what arrived too.
  // Vercel caps request bodies at 4.5 MB, which bounds this read.
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return fail("invalid_json", 400);
  }
  if (Buffer.byteLength(raw, "utf8") > REPORT_LIMITS.bodyBytes) {
    return fail("too_large", 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail("invalid_json", 400);
  }

  const parsed = parseStorkReport(body);
  if (!parsed.ok) {
    return fail(parsed.error, 400);
  }

  // Checked after validation, so junk requests don't use up the budget.
  if (!limiter.allow(clientIp(request.headers))) {
    return fail("rate_limited", 429);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[stork-report] RESEND_API_KEY is not set");
    return fail("server_misconfigured", 500);
  }

  const { email } = parsed.data;
  const { subject, text, attachments } = renderStorkEmail(parsed.data);

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: REPORT_FROM,
        to: REPORT_TO,
        ...(email ? { reply_to: email } : {}),
        subject,
        text,
        ...(attachments ? { attachments } : {}),
      }),
    });
    if (!resp.ok) {
      // Status only. The report itself never goes in the logs.
      console.error(`[stork-report] Resend error (${resp.status})`);
      return fail("send_failed", 502);
    }
  } catch (err) {
    console.error(
      "[stork-report] send threw:",
      err instanceof Error ? err.message : "unknown error",
    );
    return fail("send_failed", 502);
  }

  return NextResponse.json({ ok: true });
}
