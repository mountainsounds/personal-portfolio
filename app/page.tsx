import Image from "next/image";

import NavLink from "@/components/nav-link";
import SiteShell from "@/components/site-shell";
import TypingEffect from "@/components/typing-effect";
import homeHero from "@/public/homeHero.jpg";

export default function HomePage() {
  return (
    <SiteShell page="home">
      <section id="showcase">
        {/* next/image instead of a CSS background: AVIF/srcset + blur-up. */}
        <Image
          src={homeHero}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="hero-bg"
        />
        <div className="showcase__content">
          <h1 className="showcase__content--title">Zack Sawyer</h1>
          <TypingEffect />
          <NavLink
            src="/projects"
            name="My Work"
            className="showcase__content--link"
          />
        </div>
      </section>
    </SiteShell>
  );
}
