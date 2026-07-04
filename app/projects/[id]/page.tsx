import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SiteShell from "@/components/site-shell";
import { getProject, projects } from "@/content/projects";

type ProjectDetailProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ id: String(project.id) }));
}

export async function generateMetadata({
  params,
}: ProjectDetailProps): Promise<Metadata> {
  const { id } = await params;
  const project = getProject(id);
  return { title: project ? project.title : "Projects" };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailProps) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  return (
    <SiteShell page="projects-detail">
      <section className="project-detail">
        <div className="cover-container">
          <main role="main" className="inner page-cover">
            <h1 className="cover-heading">{project.title}</h1>
            <p className="technologies">{project.technologies}</p>

            <div id="projectDescription">
              <p>{project.descriptionLong}</p>
              <p>{project.userFeatures}</p>
              <p>{project.developmentFeatures}</p>
            </div>

            <div className="projectLinks">
              <a href={project.link} target="_blank" rel="noreferrer">
                View Application
              </a>
              <a href={project.sourceCode} target="_blank" rel="noreferrer">
                View Source Code
              </a>
            </div>
          </main>
        </div>

        {project.videoOverview && (
          <div className="videoOverview">
            <div className="videoContainer">
              <iframe
                src={project.videoOverview}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
