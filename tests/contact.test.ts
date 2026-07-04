import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/contact/route";
import {
  escapeHtml,
  isSpam,
  parseContactInput,
  renderContactEmail,
} from "@/lib/contact";

const VALID_BODY = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "Hello",
  message: "I have a project for you.",
};

function postRequest(body: unknown): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("parseContactInput", () => {
  it("accepts a valid submission and trims fields", () => {
    const result = parseContactInput({
      ...VALID_BODY,
      name: "  Ada Lovelace  ",
    });
    expect(result).toEqual({ ok: true, data: VALID_BODY });
  });

  it("rejects when required fields are missing", () => {
    expect(parseContactInput({ name: "Ada" })).toEqual({
      ok: false,
      error: "missing_required",
    });
    expect(parseContactInput(null)).toEqual({
      ok: false,
      error: "missing_required",
    });
    expect(parseContactInput("not an object")).toEqual({
      ok: false,
      error: "missing_required",
    });
  });

  it("rejects malformed email addresses", () => {
    const result = parseContactInput({ ...VALID_BODY, email: "not-an-email" });
    expect(result).toEqual({ ok: false, error: "invalid_email" });
  });

  it("treats non-string fields as empty", () => {
    const result = parseContactInput({ ...VALID_BODY, name: 42 });
    expect(result).toEqual({ ok: false, error: "missing_required" });
  });
});

describe("isSpam", () => {
  it("flags a filled honeypot", () => {
    expect(isSpam({ ...VALID_BODY, website: "http://spam.example" })).toBe(
      true,
    );
  });

  it("passes an empty or absent honeypot", () => {
    expect(isSpam({ ...VALID_BODY, website: "" })).toBe(false);
    expect(isSpam(VALID_BODY)).toBe(false);
  });
});

describe("renderContactEmail", () => {
  it("escapes HTML in every user-controlled field", () => {
    const { html } = renderContactEmail({
      name: "<script>alert(1)</script>",
      email: 'a"b@example.com',
      subject: "<b>bold</b>",
      message: "1 < 2 & 3 > 2",
    });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("&lt;b&gt;bold&lt;/b&gt;");
    expect(html).toContain("1 &lt; 2 &amp; 3 &gt; 2");
  });

  it("omits the subject row and suffix when subject is empty", () => {
    const rendered = renderContactEmail({ ...VALID_BODY, subject: "" });
    expect(rendered.subject).toBe("Portfolio contact from Ada Lovelace");
    expect(rendered.text).not.toContain("Subject:");
  });

  it("includes the subject when present", () => {
    const rendered = renderContactEmail(VALID_BODY);
    expect(rendered.subject).toBe(
      "Portfolio contact from Ada Lovelace — Hello",
    );
    expect(rendered.text).toContain("Subject: Hello");
  });
});

describe("escapeHtml", () => {
  it("escapes all five special characters", () => {
    expect(escapeHtml(`&<>"'`)).toBe("&amp;&lt;&gt;&quot;&#39;");
  });
});

describe("POST /api/contact", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv(
      "RESEND_FROM_EMAIL",
      "Zack Sawyer <notifications@mtnsounds.com>",
    );
    vi.stubEnv("CONTACT_NOTIFY_EMAIL", "inbox@example.com");
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("sends via Resend and returns ok for a valid submission", async () => {
    const res = await POST(postRequest(VALID_BODY));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers).toMatchObject({ Authorization: "Bearer re_test_key" });
    const payload = JSON.parse(init.body as string);
    expect(payload).toMatchObject({
      from: "Zack Sawyer <notifications@mtnsounds.com>",
      to: "inbox@example.com",
      reply_to: "ada@example.com",
      subject: "Portfolio contact from Ada Lovelace — Hello",
    });
  });

  it("silently accepts honeypot submissions without sending", async () => {
    const res = await POST(
      postRequest({ ...VALID_BODY, website: "http://spam.example" }),
    );
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON", async () => {
    const res = await POST(postRequest("{not json"));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      ok: false,
      error: "invalid_json",
    });
  });

  it("returns 400 for missing fields and invalid email", async () => {
    const missing = await POST(postRequest({ name: "Ada" }));
    expect(missing.status).toBe(400);
    await expect(missing.json()).resolves.toEqual({
      ok: false,
      error: "missing_required",
    });

    const badEmail = await POST(postRequest({ ...VALID_BODY, email: "nope" }));
    expect(badEmail.status).toBe(400);
    await expect(badEmail.json()).resolves.toEqual({
      ok: false,
      error: "invalid_email",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 500 when Resend env vars are absent", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const res = await POST(postRequest(VALID_BODY));
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({
      ok: false,
      error: "server_misconfigured",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 502 when Resend responds with an error", async () => {
    fetchMock.mockResolvedValue(new Response("boom", { status: 500 }));
    const res = await POST(postRequest(VALID_BODY));
    expect(res.status).toBe(502);
    await expect(res.json()).resolves.toEqual({
      ok: false,
      error: "send_failed",
    });
  });

  it("returns 502 when the network call throws", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));
    const res = await POST(postRequest(VALID_BODY));
    expect(res.status).toBe(502);
    await expect(res.json()).resolves.toEqual({
      ok: false,
      error: "send_failed",
    });
  });

  it("defaults the notification inbox when CONTACT_NOTIFY_EMAIL is unset", async () => {
    vi.stubEnv("CONTACT_NOTIFY_EMAIL", "");
    const res = await POST(postRequest(VALID_BODY));
    expect(res.status).toBe(200);
    const payload = JSON.parse(
      (fetchMock.mock.calls[0] as [string, RequestInit])[1].body as string,
    );
    expect(payload.to).toBe("mountainsounds15@gmail.com");
  });
});
