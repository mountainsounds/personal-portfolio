import BaseLayout from '@/components/layouts/BaseLayout';
import emailjs from 'emailjs-com';
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function notify(isSuccess) {
    let successMsg = "Your message has been successfully sent. I look forward to connnecting soon!";
    let errorMsg = "Apologies, your message was unsuccessfully sent. Try connecting by email: mountainsounds15@gmail.com";

    isSuccess ? toast.success(successMsg) : toast.error(errorMsg);
  }


  function sendEmail(e) {
    e.preventDefault();

       emailjs.sendForm(process.env.NEXT_PUBLIC_SERVICE_ID, process.env.NEXT_PUBLIC_TEMPLATE_ID, e.target, process.env.NEXT_PUBLIC_USER_ID)
      .then((result) => {
         notify(true);
          setName("");
          setEmail("");
          setSubject("");
          setMessage("");

      }, (error) => {
          notify(false);
      });
  }

  return (
      <BaseLayout page='contact'>
      <section id="contact">
        <form onSubmit={sendEmail} action="" id="contact-form" className="contact__form">
            <input type="text" placeholder="Name" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="Email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="text" placeholder="Subject" name="subject" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <textarea name="message" id="message" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
            <input type="submit" name="" id="" value="Submit" />
          </form>

        </section>
        <ToastContainer />
      </BaseLayout>
  )
}

export default Contact;