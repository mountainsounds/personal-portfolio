import NavLink from "@/components/nav-link";
import SiteShell from "@/components/site-shell";
import TypingEffect from "@/components/typing-effect";

export default function HomePage() {
  return (
    <SiteShell page="home">
      <section id="showcase">
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
