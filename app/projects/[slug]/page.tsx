import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import SiteShell from "@/components/site-shell";
import { getProject, projects } from "@/content/projects";

type ProjectDetailProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Projects" };
  return { title: project.title, description: project.tagline };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <SiteShell page="projects-detail">
      <article className="project">
        <div className="project__inner">
          <Link href="/projects" className="project__back">
            <span aria-hidden="true">←</span> Back to projects
          </Link>

          <header className="project__hero">
            <p className="project__meta">
              <span>{project.year}</span>
              <span className="project__meta--dot" aria-hidden="true">
                ·
              </span>
              <span>{project.role}</span>
            </p>
            <h1 className="project__title">{project.title}</h1>
            <p className="project__tagline">{project.tagline}</p>

            <ul className="project__stack" aria-label="Tech stack">
              {project.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>

            <div className="project__links">
              {project.liveUrl && (
                <a
                  className="project__link project__link--primary"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit site <span aria-hidden="true">↗</span>
                </a>
              )}
              {project.sourceUrl && (
                <a
                  className="project__link"
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </header>

          <section className="project__section project__overview">
            <h2 className="project__section--heading">Overview</h2>
            <div className="project__prose">
              {project.overview.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="project__section project__highlights">
            <h2 className="project__section--heading">Highlights</h2>
            <ul className="project__highlight-list">
              {project.highlights.map((highlight) => (
                <li key={highlight.title} className="project__highlight">
                  <h3 className="project__highlight--title">
                    {highlight.title}
                  </h3>
                  <p className="project__highlight--body">{highlight.body}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="project__section project__gallery">
            <h2 className="project__section--heading">A closer look</h2>
            <div className="project__shots">
              {project.gallery.map((shot, i) => (
                <figure key={i} className="project__shot">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    sizes="(max-width: 1100px) 100vw, 1000px"
                    placeholder="blur"
                  />
                  <figcaption>{shot.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          {project.liveUrl && (
            <div className="project__outro">
              <a
                className="project__link project__link--primary"
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit {project.title} <span aria-hidden="true">↗</span>
              </a>
            </div>
          )}
        </div>
      </article>
    </SiteShell>
  );
}
