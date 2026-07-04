import type { Metadata } from "next";

import ProjectCard from "@/components/project-card";
import SiteShell from "@/components/site-shell";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <SiteShell page="projects">
      <section id="work">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>
    </SiteShell>
  );
}
