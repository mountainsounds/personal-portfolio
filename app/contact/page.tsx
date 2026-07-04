import type { Metadata } from "next";

import ContactForm from "@/components/contact-form";
import SiteShell from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <SiteShell page="contact">
      <section id="contact">
        <ContactForm />
      </section>
    </SiteShell>
  );
}
