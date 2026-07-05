import type { Metadata } from "next";

import ProjectCard from "@/components/project-card";
import SiteShell from "@/components/site-shell";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected work by Zack Sawyer — full-stack web apps and interactive demos.",
};

export default function ProjectsPage() {
  return (
    <SiteShell page="projects">
      <section id="work">
        <header className="work__intro">
          <p className="work__intro--eyebrow">Selected work</p>
          <h1 className="work__intro--title">Projects</h1>
          <p className="work__intro--lede">
            A few things I&apos;ve designed and built — from a full-stack
            campaign platform to small interactive experiments.
          </p>
        </header>

        <div className="work__grid">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
