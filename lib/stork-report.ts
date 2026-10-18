/**
 * Pure logic for the Stork problem-report endpoint: parsing and validation,
 * the email, and a small rate limiter. No I/O here, so it can be unit-tested
 * directly. The route handler owns HTTP and the Resend call.
 */

import { EMAIL_RE } from "@/lib/contact";

/** Limits for a version 1 report. Lengths count UTF-16 code units, like `String.length`. */
export const REPORT_LIMITS = {
  bodyBytes: 262_144,
  message: 5_000,
  email: 254,
  error: 2_000,
  about: 40,
  transcript: 200_000,
  transcriptLines: 1_000,
} as const;

export const CHIPS = ["Apple silicon", "Intel"] as const;
export type Chip = (typeof CHIPS)[number];

export type StorkReport = {
  message: string;
  email: string | null;
  error: string | null;
  about: { stork: string; macos: string; chip: Chip; language: string };
  transcript: string | null;
};

export type ReportError =
  | "invalid_report"
  | "unsupported_version"
  | "too_long"
  | "invalid_email"
  | "empty_report";

export type ReportParseResult =
  { ok: true; data: StorkReport } | { ok: false; error: ReportError };

// C0 and C1 control characters, except \t (U+0009) and \n (U+000A).
const CONTROL_CHARS = /[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g;

/** Turns \r\n into \n, then drops every control character except \n and \t. */
export function cleanText(s: string): string {
  return s.replace(/\r\n/g, "\n").replace(CONTROL_CHARS, "");
}

/** For one-line fields: also folds newlines and tabs into single spaces. */
const cleanLine = (s: string): string =>
  cleanText(s).replace(/\s+/g, " ").trim();

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Optional fields may be missing or null. Rust's serde writes `None` as null. */
const isOptionalString = (v: unknown): v is string | null | undefined =>
  v === undefined || v === null || typeof v === "string";

const isChip = (v: unknown): v is Chip => CHIPS.some((chip) => chip === v);

/** Counts lines the way an editor does: a trailing newline doesn't add one. */
export function countLines(s: string): number {
  if (s === "") return 0;
  const breaks = s.split("\n").length - 1;
  return s.endsWith("\n") ? breaks : breaks + 1;
}

const fail = (error: ReportError): ReportParseResult => ({ ok: false, error });

export function parseStorkReport(body: unknown): ReportParseResult {
  if (!isObject(body)) return fail("invalid_report");
  if (body.v !== 1) {
    return fail(
      typeof body.v === "number" ? "unsupported_version" : "invalid_report",
    );
  }

  const about = body.about;
  if (
    typeof body.message !== "string" ||
    !isOptionalString(body.email) ||
    !isOptionalString(body.error) ||
    !isOptionalString(body.transcript) ||
    !isObject(about) ||
    typeof about.stork !== "string" ||
    typeof about.macos !== "string" ||
    typeof about.language !== "string" ||
    !isChip(about.chip)
  ) {
    return fail("invalid_report");
  }

  // Only these fields are copied out, so unknown fields never reach the email.
  const message = cleanText(body.message).trim();
  const email = cleanLine(body.email ?? "");
  const error = cleanText(body.error ?? "").trim();
  // The transcript is attached as-is, so it isn't trimmed.
  const transcript = cleanText(body.transcript ?? "");
  const stork = cleanLine(about.stork);
  const macos = cleanLine(about.macos);
  const language = cleanLine(about.language);

  if (
    message.length > REPORT_LIMITS.message ||
    email.length > REPORT_LIMITS.email ||
    error.length > REPORT_LIMITS.error ||
    transcript.length > REPORT_LIMITS.transcript ||
    countLines(transcript) > REPORT_LIMITS.transcriptLines ||
    stork.length > REPORT_LIMITS.about ||
    macos.length > REPORT_LIMITS.about ||
    language.length > REPORT_LIMITS.about
  ) {
    return fail("too_long");
  }
  // A report needs something to read: a message, the error, or both.
  if (!message && !error) return fail("empty_report");
  if (email && !EMAIL_RE.test(email)) return fail("invalid_email");

  return {
    ok: true,
    data: {
      message,
      email: email || null,
      error: error || null,
      about: { stork, macos, chip: about.chip, language },
      transcript: transcript || null,
    },
  };
}

const SUBJECT_PREFIX = "Stork report: ";
const SUBJECT_MAX = 60;

/**
 * "Stork report: " plus the first line of the message, or of the error when
 * there's no message. The line is cut to 60 characters, "…" included.
 *
 * It splits on every line break itself instead of trusting the parser, so
 * CR and LF can't reach the subject header even if this is called directly.
 */
export function reportSubject({
  message,
  error,
}: Pick<StorkReport, "message" | "error">): string {
  const source = message.trim() || (error ?? "").trim();
  const firstLine = source.split(/[\r\n\v\f\u0085\u2028\u2029]/)[0].trim();
  // Array.from splits by code point, so an emoji is never cut in half.
  const chars = Array.from(firstLine);
  if (chars.length <= SUBJECT_MAX) return SUBJECT_PREFIX + firstLine;
  const cut = chars
    .slice(0, SUBJECT_MAX - 1)
    .join("")
    .trimEnd();
  return `${SUBJECT_PREFIX}${cut}…`;
}

export type ResendAttachment = { filename: string; content: string };

/**
 * Plain text only. The transcript goes out as transcript.txt, base64-encoded
 * because that's how Resend's REST API takes attachment content.
 */
export function renderStorkEmail(report: StorkReport): {
  subject: string;
  text: string;
  attachments?: ResendAttachment[];
} {
  const { message, email, error, about, transcript } = report;
  const lines = transcript ? countLines(transcript) : 0;

  const sections = [
    message || "(No message. They sent the error below.)",
    error ? `The error they saw:\n${error}` : null,
    [
      email ? `Reply to: ${email}` : "No reply address given.",
      `Stork ${about.stork} · macOS ${about.macos} · ${about.chip} · ${about.language}`,
    ].join("\n"),
    transcript
      ? `Transcript: attached, ${lines} ${lines === 1 ? "line" : "lines"}`
      : "Transcript: not attached",
  ];
  const text = `${sections.filter(Boolean).join("\n\n")}\n`;

  return {
    subject: reportSubject(report),
    text,
    attachments: transcript
      ? [
          {
            filename: "transcript.txt",
            content: Buffer.from(transcript, "utf8").toString("base64"),
          },
        ]
      : undefined,
  };
}

/**
 * The caller's IP: the first entry of x-forwarded-for, else x-real-ip, else
 * "unknown". On Vercel both headers are set by the platform, which
 * overwrites whatever the client sent, so they can't be spoofed there.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded) return forwarded;
  return headers.get("x-real-ip")?.trim() || "unknown";
}

export const RATE_LIMITS = { perIpPerHour: 5, totalPerDay: 50 } as const;

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/**
 * Counts reports per client IP and in total, over rolling windows: 5 per IP
 * per hour, 50 per day across everyone.
 *
 * The counts live in memory, so each server instance keeps its own. Vercel
 * runs several instances and recycles them, so this is best effort. The real
 * limit is a Vercel Firewall rate-limit rule on /api/stork/report.
 *
 * Memory stays small. A timestamp is stored only for an accepted report, and
 * the daily cap means there are never more than 50 of them.
 */
export class ReportRateLimiter {
  private readonly now: () => number;
  private readonly byIp = new Map<string, number[]>();
  private lastDay: number[] = [];

  /** `now` is injectable so tests can move the clock instead of sleeping. */
  constructor(now: () => number = Date.now) {
    this.now = now;
  }

  /**
   * Returns true and counts the report when it's under both limits.
   * Returns false and counts nothing when it isn't.
   */
  allow(ip: string): boolean {
    const now = this.now();
    this.lastDay = this.lastDay.filter((t) => now - t < DAY_MS);
    for (const [key, times] of this.byIp) {
      const lastHour = times.filter((t) => now - t < HOUR_MS);
      if (lastHour.length > 0) this.byIp.set(key, lastHour);
      else this.byIp.delete(key);
    }

    const mine = this.byIp.get(ip) ?? [];
    if (
      mine.length >= RATE_LIMITS.perIpPerHour ||
      this.lastDay.length >= RATE_LIMITS.totalPerDay
    ) {
      return false;
    }
    mine.push(now);
    this.byIp.set(ip, mine);
    this.lastDay.push(now);
    return true;
  }
}
