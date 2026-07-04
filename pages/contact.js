import BaseLayout from '@/components/layouts/BaseLayout';
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — humans never see or fill this
  const [sending, setSending] = useState(false);

  function notify(isSuccess) {
    let successMsg = "Your message has been successfully sent. I look forward to connecting soon!";
    let errorMsg = "Apologies, your message was unsuccessfully sent. Try connecting by email: mountainsounds15@gmail.com";

    isSuccess ? toast.success(successMsg) : toast.error(errorMsg);
  }

  async function sendEmail(e) {
    e.preventDefault();
    if (sending) return;
    setSending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, website }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        notify(true);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        notify(false);
      }
    } catch (error) {
      notify(false);
    } finally {
      setSending(false);
    }
  }

  return (
      <BaseLayout page='contact'>
      <section id="contact">
        <form onSubmit={sendEmail} id="contact-form" className="contact__form">
            <input type="text" placeholder="Name" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="Email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="text" placeholder="Subject" name="subject" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <textarea name="message" id="message" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
            <div style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
            <input type="submit" name="" id="" value={sending ? "Sending..." : "Submit"} disabled={sending} />
          </form>

        </section>
        <ToastContainer />
      </BaseLayout>
  )
}

export default Contact;
