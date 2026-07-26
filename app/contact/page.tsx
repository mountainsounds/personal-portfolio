import type { Metadata } from "next";
import Image from "next/image";

import ContactForm from "@/components/contact-form";
import SiteShell from "@/components/site-shell";
import yosemiteBackground from "@/public/background-yosemite.jpeg";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <SiteShell page="contact">
      <section id="contact">
        {/* next/image instead of a CSS background: AVIF/srcset + blur-up. */}
        <Image
          src={yosemiteBackground}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="hero-bg"
        />
        <ContactForm />
      </section>
    </SiteShell>
  );
}
