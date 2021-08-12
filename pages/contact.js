import BaseLayout from '@/components/layouts/BaseLayout';

const Contact = () => {
  return (
      <BaseLayout page='contact'>
      <section id="contact">
        <form action="" id="contact-form" className="contact__form">
            <input type="text" placeholder="Name" name="name" id="name" required />
            <input type="email" placeholder="Email" name="email" id="email" required />
            <input type="text" placeholder="Subject" name="subject" id="subject" />
            <textarea name="message" id="message" placeholder="Message"></textarea>
            <input type="submit" name="" id="" value="Submit" />
          </form>

        </section>
      </BaseLayout>
  )
}

export default Contact;