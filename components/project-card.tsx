import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/content/projects";

// Show a few representative technologies on the card; the detail page lists all.
const CARD_STACK_COUNT = 4;

export default function ProjectCard({ project }: { project: Project }) {
  const { slug, title, tagline, year, cardImage, cardAlt, stack } = project;
  const shownStack = stack.slice(0, CARD_STACK_COUNT);
  const extraCount = stack.length - shownStack.length;

  return (
    <Link href={`/projects/${slug}`} className="work__card">
      <div className="work__card--media">
        <Image
          src={cardImage}
          alt={cardAlt}
          sizes="(max-width: 900px) 100vw, 45vw"
        />
      </div>

      <div className="work__card--body">
        <span className="work__card--year">{year}</span>
        <h2 className="work__card--title">{title}</h2>
        <p className="work__card--tagline">{tagline}</p>

        <ul className="work__card--stack" aria-label="Technologies">
          {shownStack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
          {extraCount > 0 && (
            <li className="work__card--stack__more">+{extraCount}</li>
          )}
        </ul>

        <span className="work__card--cta">
          View project <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
