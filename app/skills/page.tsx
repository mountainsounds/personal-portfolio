import type { Metadata } from "next";
import Link from "next/link";

import SiteShell from "@/components/site-shell";
import { personalStack, pipelineStages } from "@/content/skills";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "What Zack Sawyer works with — full-stack engineering at HubSpot, and self-built apps on the side.",
};

export default function SkillsPage() {
  return (
    <SiteShell page="skills">
      <section id="skills">
        <header className="skills__intro">
          <p className="skills__intro--eyebrow">What I work with</p>
          <h1 className="skills__intro--title">Skills</h1>
          <p className="skills__intro--lede">
            I&apos;ve spent the last four-plus years as a full-stack engineer
            at HubSpot, and I build and run a few apps of my own on the side.
            This is the stack I use most days.
          </p>
        </header>

        <div className="skills__block">
          <h2 className="skills__block--heading">The day job</h2>
          <p className="skills__block--sub">
            Roughly how a feature moves through the stack I work in.
          </p>
          <ol className="pipeline">
            {pipelineStages.map((stage) => (
              <li className="pipeline__stage" key={stage.name}>
                <p className="pipeline__stage--step">{stage.step}</p>
                <h3 className="pipeline__stage--name">{stage.name}</h3>
                <p className="pipeline__stage--blurb">{stage.blurb}</p>
                <ul className="stack-chips">
                  {stage.techs.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        <div className="skills__block">
          <h2 className="skills__block--heading">Nights &amp; weekends</h2>
          <p className="skills__block--sub">
            The tools I reach for on my own projects.
          </p>
          <div className="personal">
            {personalStack.map((group) => (
              <div className="personal__group" key={group.label}>
                <h3 className="personal__group--label">{group.label}</h3>
                <ul className="stack-chips">
                  {group.techs.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="personal__proof">
              Most recently:{" "}
              <Link
                href="/projects/wolk-for-senate"
                className="personal__proof--link"
              >
                Wolk for Senate
              </Link>
              , a full-stack campaign site.
            </p>
          </div>
        </div>

        <p className="skills__outro">
          Away from the desk, I&apos;m usually climbing &mdash; more on that
          over on the{" "}
          <Link href="/about" className="skills__outro--link">
            about page
          </Link>
          .
        </p>
      </section>
    </SiteShell>
  );
}
