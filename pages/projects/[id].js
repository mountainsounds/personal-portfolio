import BaseLayout from '@/components/layouts/BaseLayout';
import data from '@/projectData/cardData';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const getPortfolio = pageId => data.find(project => project.id === +pageId);

const ProjectDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  console.log("id: ", id);

  const project = getPortfolio(id);
  if (id) console.log("project", project);


  return (
    <BaseLayout page='projects-detail'>

      <section className="project-detail">
      {id &&
          <div className="project-overview">
              <h1 className="cover-heading">{project.title}</h1>
              <p className="lead">{project.description}</p>
              <p className="projectLinks">
                  <a href={project.companyWebsite} target="_" className="projectLinks">Visit App</a>
                  <a href={project.companyWebsite} target="_" className="projectLinks">Source Code</a>
              </p>
          </div>
      }

      { project && project.videoOverview &&
          <div className='videoOverview'>
              <div className='videoContainer'>
                  <iframe src={project.videoOverview} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
        </div>

      }
        </section>

    </BaseLayout>
  )
}

export default ProjectDetail;