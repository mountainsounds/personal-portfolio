import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type MockInstance,
  vi,
} from "vitest";

import {
  cleanText,
  clientIp,
  countLines,
  parseStorkReport,
  RATE_LIMITS,
  renderStorkEmail,
  REPORT_LIMITS,
  ReportRateLimiter,
  reportSubject,
  type StorkReport,
} from "@/lib/stork-report";

const ABOUT = {
  stork: "1.0 (12)",
  macos: "26.0.1",
  chip: "Apple silicon",
  language: "en-US",
};

const VALID_BODY = {
  v: 1,
  message: "Uploads to my S3 bucket stall at 99%.",
  email: "ada@example.com",
  error: "Upload failed: connection reset by peer",
  about: ABOUT,
};

/** What parseStorkReport returns for VALID_BODY. */
const VALID_REPORT: StorkReport = {
  message: "Uploads to my S3 bucket stall at 99%.",
  email: "ada@example.com",
  error: "Upload failed: connection reset by peer",
  about: {
    stork: "1.0 (12)",
    macos: "26.0.1",
    chip: "Apple silicon",
    language: "en-US",
  },
  transcript: null,
};

const parse = (overrides: Record<string, unknown>) =>
  parseStorkReport({ ...VALID_BODY, ...overrides });

const parseAbout = (overrides: Record<string, unknown>) =>
  parse({ about: { ...ABOUT, ...overrides } });

const without = (obj: Record<string, unknown>, key: string) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => k !== key));

/** A valid address exactly `length` characters long. */
const emailOfLength = (length: number) =>
  `${"a".repeat(length - "@example.com".length)}@example.com`;

const linesOf = (n: number) =>
  Array.from({ length: n }, (_, i) => `line ${i + 1}`).join("\n");

describe("REPORT_LIMITS", () => {
  it("matches the limits the app was built against", () => {
    expect(REPORT_LIMITS).toEqual({
      bodyBytes: 262_144,
      message: 5_000,
      email: 254,
      error: 2_000,
      about: 40,
      transcript: 200_000,
      transcriptLines: 1_000,
    });
    expect(RATE_LIMITS).toEqual({ perIpPerHour: 5, totalPerDay: 50 });
  });
});

describe("parseStorkReport", () => {
  it("accepts a valid report", () => {
    expect(parseStorkReport(VALID_BODY)).toEqual({
      ok: true,
      data: VALID_REPORT,
    });
  });

  it("trims the message, email and error", () => {
    const result = parse({
      message: `  ${VALID_BODY.message}\n\n`,
      email: "  ada@example.com ",
      error: `\n${VALID_BODY.error}  `,
    });
    expect(result).toEqual({ ok: true, data: VALID_REPORT });
  });

  const LIMIT_CASES: [
    string,
    (n: number) => Record<string, unknown>,
    number,
  ][] = [
    ["message", (n) => ({ message: "x".repeat(n) }), REPORT_LIMITS.message],
    ["email", (n) => ({ email: emailOfLength(n) }), REPORT_LIMITS.email],
    ["error", (n) => ({ error: "x".repeat(n) }), REPORT_LIMITS.error],
    [
      "transcript characters",
      (n) => ({ transcript: "x".repeat(n) }),
      REPORT_LIMITS.transcript,
    ],
    [
      "transcript lines",
      (n) => ({ transcript: linesOf(n) }),
      REPORT_LIMITS.transcriptLines,
    ],
    [
      "about.stork",
      (n) => ({ about: { ...ABOUT, stork: "x".repeat(n) } }),
      REPORT_LIMITS.about,
    ],
    [
      "about.macos",
      (n) => ({ about: { ...ABOUT, macos: "x".repeat(n) } }),
      REPORT_LIMITS.about,
    ],
    [
      "about.language",
      (n) => ({ about: { ...ABOUT, language: "x".repeat(n) } }),
      REPORT_LIMITS.about,
    ],
  ];

  it.each(LIMIT_CASES)(
    "accepts %s just under and at the limit, rejects one over",
    (_, build, limit) => {
      expect(parse(build(limit - 1)).ok).toBe(true);
      expect(parse(build(limit)).ok).toBe(true);
      expect(parse(build(limit + 1))).toEqual({
        ok: false,
        error: "too_long",
      });
    },
  );

  it("doesn't count a trailing newline as an extra transcript line", () => {
    const result = parse({
      transcript: `${linesOf(REPORT_LIMITS.transcriptLines)}\n`,
    });
    expect(result.ok).toBe(true);
  });

  it.each([
    ["a null body", null],
    ["an array body", [VALID_BODY]],
    ["a string body", "report"],
    ["a string version", { ...VALID_BODY, v: "1" }],
    ["a missing version", without(VALID_BODY, "v")],
    ["a numeric message", { ...VALID_BODY, message: 42 }],
    ["a missing message", without(VALID_BODY, "message")],
    ["a null message", { ...VALID_BODY, message: null }],
    ["a numeric email", { ...VALID_BODY, email: 42 }],
    ["an object error", { ...VALID_BODY, error: { code: 1 } }],
    ["an array transcript", { ...VALID_BODY, transcript: ["line"] }],
    ["a string about", { ...VALID_BODY, about: "Stork 1.0" }],
    ["a missing about", without(VALID_BODY, "about")],
    [
      "a numeric about field",
      { ...VALID_BODY, about: { ...ABOUT, macos: 26 } },
    ],
  ])("rejects %s as invalid_report", (_, body) => {
    expect(parseStorkReport(body)).toEqual({
      ok: false,
      error: "invalid_report",
    });
  });

  it("rejects other versions as unsupported_version", () => {
    expect(parse({ v: 2 })).toEqual({
      ok: false,
      error: "unsupported_version",
    });
  });

  it.each(["stork", "macos", "chip", "language"])(
    "rejects a report missing about.%s",
    (key) => {
      expect(parse({ about: without(ABOUT, key) })).toEqual({
        ok: false,
        error: "invalid_report",
      });
    },
  );

  it.each(["M1", "apple silicon", "Intel ", "", 1])(
    "rejects chip %j",
    (chip) => {
      expect(parseAbout({ chip })).toEqual({
        ok: false,
        error: "invalid_report",
      });
    },
  );

  it("accepts both chip values", () => {
    expect(parseAbout({ chip: "Apple silicon" }).ok).toBe(true);
    expect(parseAbout({ chip: "Intel" }).ok).toBe(true);
  });

  it("accepts an empty message when there's an error", () => {
    const result = parse({ message: "" });
    expect(result).toEqual({
      ok: true,
      data: { ...VALID_REPORT, message: "" },
    });
  });

  it("rejects an empty message without an error", () => {
    const empty = { ok: false, error: "empty_report" };
    expect(parse({ message: "", error: undefined })).toEqual(empty);
    expect(parse({ message: "", error: null })).toEqual(empty);
    expect(parse({ message: "", error: "" })).toEqual(empty);
    expect(parse({ message: " \n\t ", error: "  " })).toEqual(empty);
  });

  it.each(["not-an-email", "ada@example", "ada lovelace@example.com", "@x.io"])(
    "rejects the email %j",
    (email) => {
      expect(parse({ email })).toEqual({ ok: false, error: "invalid_email" });
    },
  );

  it("treats a missing, null or empty email as no reply address", () => {
    const noEmail = { ok: true, data: { ...VALID_REPORT, email: null } };
    expect(parseStorkReport(without(VALID_BODY, "email"))).toEqual(noEmail);
    expect(parse({ email: null })).toEqual(noEmail);
    expect(parse({ email: "" })).toEqual(noEmail);
  });

  it("treats null optional fields as absent", () => {
    const result = parse({ error: null, transcript: null });
    expect(result).toEqual({
      ok: true,
      data: { ...VALID_REPORT, error: null, transcript: null },
    });
  });

  it("ignores unknown fields", () => {
    const result = parse({
      to: "someone@else.example",
      bcc: "list@else.example",
      html: "<b>hi</b>",
      extra: { nested: true },
      about: { ...ABOUT, serial: "C02XYZ" },
    });
    expect(result).toEqual({ ok: true, data: VALID_REPORT });
  });

  it("strips control characters from every text field", () => {
    const result = parse({
      message: "a\u0000b\u0007c\r\nd\te\u001b[31m\u009bf",
      error: "bad\u007f thing\rhappened",
      transcript: "one\r\ntwo\u0000\tthree\n",
      about: { ...ABOUT, stork: "1.0\u0000", language: "en\nUS" },
    });
    expect(result).toEqual({
      ok: true,
      data: {
        ...VALID_REPORT,
        message: "abc\nd\te[31mf",
        error: "bad thinghappened",
        transcript: "one\ntwo\tthree\n",
        about: { ...VALID_REPORT.about, stork: "1.0", language: "en US" },
      },
    });
  });
});

describe("cleanText", () => {
  it("keeps \\n and \\t and drops other control characters", () => {
    expect(cleanText("a\tb\nc\u0001d\u001fe\u0085f")).toBe("a\tb\ncdef");
  });

  it("turns \\r\\n into \\n and drops a lone \\r", () => {
    expect(cleanText("one\r\ntwo\rthree")).toBe("one\ntwothree");
  });
});

describe("countLines", () => {
  it("counts lines like an editor", () => {
    expect(countLines("")).toBe(0);
    expect(countLines("a")).toBe(1);
    expect(countLines("a\n")).toBe(1);
    expect(countLines("a\nb")).toBe(2);
    expect(countLines("a\nb\n")).toBe(2);
  });
});

describe("reportSubject", () => {
  it("uses the first line of the message", () => {
    const result = parse({ message: "Line one\r\nBcc: evil@example.com" });
    expect(result.ok && reportSubject(result.data)).toBe(
      "Stork report: Line one",
    );
  });

  it("keeps CR and LF out even when called with raw text", () => {
    for (const message of [
      "Hi\rBcc: evil@example.com",
      "Hi\nBcc: evil@example.com",
      "Hi\r\nBcc: evil@example.com",
      "Hi\u2028Bcc: evil@example.com",
      "\r\nHi",
    ]) {
      const subject = reportSubject({ message, error: null });
      expect(subject).toBe("Stork report: Hi");
      expect(subject).not.toMatch(/[\r\n]/);
    }
  });

  it("cuts a long first line to 60 characters with …", () => {
    expect(reportSubject({ message: "x".repeat(60), error: null })).toBe(
      `Stork report: ${"x".repeat(60)}`,
    );
    const cut = reportSubject({ message: "x".repeat(61), error: null });
    expect(cut).toBe(`Stork report: ${"x".repeat(59)}…`);
    expect(cut.length - "Stork report: ".length).toBe(60);
  });

  it("never cuts an emoji in half", () => {
    const subject = reportSubject({ message: "🏔".repeat(61), error: null });
    expect(subject).toBe(`Stork report: ${"🏔".repeat(59)}…`);
  });

  it("uses the first line of the error when there's no message", () => {
    expect(
      reportSubject({
        message: "",
        error: "Permission denied (publickey)\nat sftp.rs:88",
      }),
    ).toBe("Stork report: Permission denied (publickey)");
  });
});

describe("renderStorkEmail", () => {
  it("lays out a full report", () => {
    const rendered = renderStorkEmail({
      ...VALID_REPORT,
      transcript: "connect sftp.example.com\nauth ok\nupload a.txt failed\n",
    });
    expect(rendered.subject).toBe(
      "Stork report: Uploads to my S3 bucket stall at 99%.",
    );
    expect(rendered.text).toBe(
      [
        "Uploads to my S3 bucket stall at 99%.",
        "",
        "The error they saw:",
        "Upload failed: connection reset by peer",
        "",
        "Reply to: ada@example.com",
        "Stork 1.0 (12) · macOS 26.0.1 · Apple silicon · en-US",
        "",
        "Transcript: attached, 3 lines",
        "",
      ].join("\n"),
    );
  });

  it("lays out an error-only report with no reply address or transcript", () => {
    const rendered = renderStorkEmail({
      ...VALID_REPORT,
      message: "",
      email: null,
      about: { ...VALID_REPORT.about, chip: "Intel" },
    });
    expect(rendered.subject).toBe(
      "Stork report: Upload failed: connection reset by peer",
    );
    expect(rendered.text).toBe(
      [
        "(No message. They sent the error below.)",
        "",
        "The error they saw:",
        "Upload failed: connection reset by peer",
        "",
        "No reply address given.",
        "Stork 1.0 (12) · macOS 26.0.1 · Intel · en-US",
        "",
        "Transcript: not attached",
        "",
      ].join("\n"),
    );
  });

  it("leaves out the error section when there's no error", () => {
    const rendered = renderStorkEmail({ ...VALID_REPORT, error: null });
    expect(rendered.text).not.toContain("The error they saw:");
    expect(rendered.text).toBe(
      [
        "Uploads to my S3 bucket stall at 99%.",
        "",
        "Reply to: ada@example.com",
        "Stork 1.0 (12) · macOS 26.0.1 · Apple silicon · en-US",
        "",
        "Transcript: not attached",
        "",
      ].join("\n"),
    );
  });

  it("says 1 line, not 1 lines", () => {
    const rendered = renderStorkEmail({ ...VALID_REPORT, transcript: "one" });
    expect(rendered.text).toContain("Transcript: attached, 1 line\n");
  });

  it("attaches the transcript as base64 of the exact text", () => {
    const transcript = "héllo 🏔\n\tindented\nlast line, no newline";
    const { attachments } = renderStorkEmail({ ...VALID_REPORT, transcript });
    expect(attachments).toEqual([
      {
        filename: "transcript.txt",
        content: Buffer.from(transcript, "utf8").toString("base64"),
      },
    ]);
    const decoded = Buffer.from(attachments![0].content, "base64").toString(
      "utf8",
    );
    expect(decoded).toBe(transcript);
  });

  it("has no attachment without a transcript", () => {
    expect(renderStorkEmail(VALID_REPORT).attachments).toBeUndefined();
  });
});

describe("clientIp", () => {
  it("uses the first x-forwarded-for entry", () => {
    const headers = new Headers({
      "x-forwarded-for": " 203.0.113.7 , 10.0.0.1",
      "x-real-ip": "198.51.100.1",
    });
    expect(clientIp(headers)).toBe("203.0.113.7");
  });

  it("falls back to x-real-ip, then to unknown", () => {
    expect(clientIp(new Headers({ "x-real-ip": "198.51.100.1" }))).toBe(
      "198.51.100.1",
    );
    expect(clientIp(new Headers({ "x-forwarded-for": "" }))).toBe("unknown");
    expect(clientIp(new Headers())).toBe("unknown");
  });
});

describe("ReportRateLimiter", () => {
  const HOUR = 60 * 60 * 1000;
  const DAY = 24 * HOUR;
  const START = Date.UTC(2026, 9, 18, 12);
  let now = START;
  const clock = () => now;

  beforeEach(() => {
    now = START;
  });

  it("allows 5 per IP, limits the 6th, and frees up an hour later", () => {
    const limiter = new ReportRateLimiter(clock);
    for (let i = 0; i < 5; i++) {
      expect(limiter.allow("203.0.113.7")).toBe(true);
    }
    expect(limiter.allow("203.0.113.7")).toBe(false);

    now = START + HOUR - 1;
    expect(limiter.allow("203.0.113.7")).toBe(false);

    now = START + HOUR;
    expect(limiter.allow("203.0.113.7")).toBe(true);
  });

  it("counts different IPs separately", () => {
    const limiter = new ReportRateLimiter(clock);
    for (let i = 0; i < 5; i++) limiter.allow("203.0.113.7");
    expect(limiter.allow("203.0.113.7")).toBe(false);
    expect(limiter.allow("198.51.100.1")).toBe(true);
  });

  it("caps everyone at 50 per rolling 24 hours", () => {
    const limiter = new ReportRateLimiter(clock);
    for (let i = 0; i < 50; i++) {
      expect(limiter.allow(`10.0.0.${i}`)).toBe(true);
    }
    expect(limiter.allow("198.51.100.1")).toBe(false);

    // Past the hour, so no IP is at its own limit. Only the daily cap applies.
    now = START + DAY - 1;
    expect(limiter.allow("198.51.100.1")).toBe(false);

    now = START + DAY;
    expect(limiter.allow("198.51.100.1")).toBe(true);
  });

  it("doesn't let an IP's rejected reports use up the daily cap", () => {
    const limiter = new ReportRateLimiter(clock);
    for (let i = 0; i < 100; i++) limiter.allow("203.0.113.7");
    for (let i = 0; i < 45; i++) {
      expect(limiter.allow(`10.0.0.${i}`)).toBe(true);
    }
  });
});

describe("POST /api/stork/report", () => {
  const fetchMock = vi.fn();
  let POST: (request: Request) => Promise<Response>;
  let errorSpy: MockInstance<typeof console.error>;

  function reportRequest(
    body: unknown,
    headers: Record<string, string | null> = {},
  ): Request {
    const merged: Record<string, string | null> = {
      "Content-Type": "application/json",
      "User-Agent": "Stork/1.0 (Macintosh; macOS 26.0.1)",
      "X-Forwarded-For": "203.0.113.7",
      ...headers,
    };
    return new Request("http://localhost/api/stork/report", {
      method: "POST",
      headers: Object.entries(merged).filter(
        (entry): entry is [string, string] => entry[1] !== null,
      ),
      body: typeof body === "string" ? body : JSON.stringify(body),
    });
  }

  /** The JSON the route sent to Resend on the given call. */
  const sentPayload = (call = 0) =>
    JSON.parse(
      (fetchMock.mock.calls[call] as [string, RequestInit])[1].body as string,
    );

  const expectError = async (res: Response, status: number, error: string) => {
    expect(res.status).toBe(status);
    await expect(res.json()).resolves.toEqual({ ok: false, error });
  };

  beforeEach(async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    fetchMock.mockReset();
    fetchMock.mockImplementation(
      async () => new Response("{}", { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    // A fresh module means a fresh rate limiter for every test.
    vi.resetModules();
    ({ POST } = await import("@/app/api/stork/report/route"));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("sends the report through Resend and returns ok", async () => {
    const res = await POST(reportRequest(VALID_BODY));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({
      Authorization: "Bearer re_test_key",
      "Content-Type": "application/json",
    });
    expect(sentPayload()).toEqual({
      from: "Stork <reports@mtnsounds.com>",
      to: "mountainsounds15@gmail.com",
      reply_to: "ada@example.com",
      subject: "Stork report: Uploads to my S3 bucket stall at 99%.",
      text: renderStorkEmail(VALID_REPORT).text,
    });
  });

  it("attaches the transcript when there is one", async () => {
    const transcript = "connect sftp.example.com\nauth ok\n";
    await POST(reportRequest({ ...VALID_BODY, transcript }));
    expect(sentPayload().attachments).toEqual([
      {
        filename: "transcript.txt",
        content: Buffer.from(transcript, "utf8").toString("base64"),
      },
    ]);
  });

  it("leaves out reply_to when no email was given", async () => {
    await POST(reportRequest(without(VALID_BODY, "email")));
    expect(sentPayload()).not.toHaveProperty("reply_to");
  });

  it("won't let the body change the recipient, sender, reply-to or subject", async () => {
    const sneaky = {
      ...without(VALID_BODY, "email"),
      to: "victim@else.example",
      from: "CEO <ceo@else.example>",
      reply_to: "phisher@else.example",
      subject: "Urgent wire transfer",
      cc: "more@else.example",
      bcc: "list@else.example",
      html: "<a href='https://else.example'>click</a>",
      headers: { "X-Evil": "1" },
      attachments: [{ filename: "a.exe", content: "TVo=" }],
    };
    const res = await POST(reportRequest(sneaky));
    expect(res.status).toBe(200);

    const payload = sentPayload();
    expect(Object.keys(payload).sort()).toEqual([
      "from",
      "subject",
      "text",
      "to",
    ]);
    expect(payload.to).toBe("mountainsounds15@gmail.com");
    expect(payload.from).toBe("Stork <reports@mtnsounds.com>");
    expect(payload.subject).toBe(
      "Stork report: Uploads to my S3 bucket stall at 99%.",
    );
    expect(payload.text).not.toContain("else.example");

    // With a real email, reply_to is that email and nothing else.
    await POST(reportRequest({ ...sneaky, email: "ada@example.com" }));
    expect(sentPayload(1).reply_to).toBe("ada@example.com");
  });

  it("returns 413 from Content-Length without reading the body", async () => {
    const request = reportRequest(VALID_BODY, { "Content-Length": "262145" });
    await expectError(await POST(request), 413, "too_large");
    expect(request.bodyUsed).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 413 when the body is too big, measured in bytes", async () => {
    const json = JSON.stringify(VALID_BODY);
    const pad = (bytes: number) =>
      json + " ".repeat(bytes - Buffer.byteLength(json));

    // JSON allows trailing whitespace, so this is a valid report at the limit.
    const atLimit = reportRequest(pad(REPORT_LIMITS.bodyBytes));
    expect(atLimit.headers.get("content-length")).toBeNull();
    expect((await POST(atLimit)).status).toBe(200);

    const overLimit = reportRequest(pad(REPORT_LIMITS.bodyBytes + 1));
    await expectError(await POST(overLimit), 413, "too_large");

    // Fewer characters than the limit, but "é" is 2 bytes in UTF-8.
    const wide = JSON.stringify({
      ...VALID_BODY,
      padding: "é".repeat(131_100),
    });
    expect(wide.length).toBeLessThan(REPORT_LIMITS.bodyBytes);
    await expectError(await POST(reportRequest(wide)), 413, "too_large");

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["no User-Agent", null],
    ["curl", "curl/8.7.1"],
    ["lowercase stork", "stork/1.0"],
    ["Stork later in the string", "Mozilla/5.0 Stork/1.0"],
  ])("returns 400 not_stork for %s", async (_, userAgent) => {
    const res = await POST(
      reportRequest(VALID_BODY, { "User-Agent": userAgent }),
    );
    await expectError(res, 400, "not_stork");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON", async () => {
    await expectError(
      await POST(reportRequest("{not json")),
      400,
      "invalid_json",
    );
  });

  it("returns 400 with the validation error code", async () => {
    await expectError(
      await POST(
        reportRequest({ ...VALID_BODY, about: { ...ABOUT, chip: "M1" } }),
      ),
      400,
      "invalid_report",
    );
    await expectError(
      await POST(reportRequest({ ...VALID_BODY, v: 2 })),
      400,
      "unsupported_version",
    );
    await expectError(
      await POST(reportRequest({ ...VALID_BODY, email: "nope" })),
      400,
      "invalid_email",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 429 after 5 reports from one IP, counting only valid ones", async () => {
    for (let i = 0; i < 10; i++) {
      await POST(reportRequest({ ...VALID_BODY, v: "nope" }));
    }
    for (let i = 0; i < 5; i++) {
      expect((await POST(reportRequest(VALID_BODY))).status).toBe(200);
    }
    await expectError(
      await POST(reportRequest(VALID_BODY)),
      429,
      "rate_limited",
    );

    const other = reportRequest(VALID_BODY, {
      "X-Forwarded-For": "198.51.100.1",
    });
    expect((await POST(other)).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(6);
  });

  it("returns 500 when RESEND_API_KEY is unset", async () => {
    vi.stubEnv("RESEND_API_KEY", undefined);
    await expectError(
      await POST(reportRequest(VALID_BODY)),
      500,
      "server_misconfigured",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 502 when Resend answers with an error, logging only the status", async () => {
    fetchMock.mockImplementation(
      async () => new Response("resend says no", { status: 422 }),
    );
    await expectError(
      await POST(reportRequest(VALID_BODY)),
      502,
      "send_failed",
    );

    expect(errorSpy).toHaveBeenCalledWith("[stork-report] Resend error (422)");
    const logged = JSON.stringify(errorSpy.mock.calls);
    expect(logged).not.toContain(VALID_BODY.message);
    expect(logged).not.toContain(VALID_BODY.error);
    expect(logged).not.toContain("ada@example.com");
    expect(logged).not.toContain("resend says no");
  });

  it("returns 502 when fetch throws", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    await expectError(
      await POST(reportRequest(VALID_BODY)),
      502,
      "send_failed",
    );
    expect(JSON.stringify(errorSpy.mock.calls)).not.toContain(
      VALID_BODY.message,
    );
  });
});
