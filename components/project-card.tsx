import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/content/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const { id, imgSrc, imgAlt, title, description } = project;

  return (
    <div className="work__card">
      <div className="work__card--img">
        <Image src={imgSrc} alt={imgAlt} />
      </div>

      <div className="work__card--content">
        <h3 className="work__card--content__title"> {title} </h3>
        <p className="work__card--content__para"> {description} </p>
        <Link href={`/projects/${id}`} className="exploreBtn">
          Explore{" "}
        </Link>
      </div>
    </div>
  );
}
