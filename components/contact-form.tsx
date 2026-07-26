"use client";

import { useState } from "react";

import { FIELD_LIMITS } from "@/lib/contact";

type Status = "idle" | "sent" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — humans never see or fill this
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  async function sendEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, website }),
      });
      const data: unknown = await res.json().catch(() => ({}));
      const ok =
        res.ok &&
        typeof data === "object" &&
        data !== null &&
        (data as { ok?: boolean }).ok === true;

      if (ok) {
        setStatus("sent");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={sendEmail} id="contact-form" className="contact__form">
      <div className="contact__form--header">
        <h1>Get in touch</h1>
        <p>Send a note &mdash; it lands straight in my inbox.</p>
      </div>
      <label className="sr-only" htmlFor="name">
        Name
      </label>
      <input
        type="text"
        placeholder="Name"
        name="name"
        id="name"
        autoComplete="name"
        maxLength={FIELD_LIMITS.name}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <label className="sr-only" htmlFor="email">
        Email
      </label>
      <input
        type="email"
        placeholder="Email"
        name="email"
        id="email"
        autoComplete="email"
        maxLength={FIELD_LIMITS.email}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <label className="sr-only" htmlFor="subject">
        Subject
      </label>
      <input
        type="text"
        placeholder="Subject"
        name="subject"
        id="subject"
        maxLength={FIELD_LIMITS.subject}
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <label className="sr-only" htmlFor="message">
        Message
      </label>
      <textarea
        name="message"
        id="message"
        placeholder="Message"
        maxLength={FIELD_LIMITS.message}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      ></textarea>
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
        aria-hidden="true"
      >
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <input
        type="submit"
        value={sending ? "Sending..." : "Send message"}
        disabled={sending}
      />
      <p
        className={`contact__form--status${status === "error" ? " contact__form--status-error" : ""}`}
        role="status"
        aria-live="polite"
      >
        {status === "sent" &&
          "Message sent — thanks! I'll get back to you soon."}
        {status === "error" && (
          <>
            Something went wrong sending that. Email me instead:{" "}
            <a href="mailto:mountainsounds15@gmail.com">
              mountainsounds15@gmail.com
            </a>
          </>
        )}
      </p>
    </form>
  );
}
