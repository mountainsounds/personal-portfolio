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
        <div className="cover-container">
          <main role="main" className="inner page-cover">
                <h1 className="cover-heading">{project.title}</h1>
                <p className="technologies">{project.technologies}</p>

                <div id='projectDescription'>
                    <p>{project.descriptionLong}</p>
                    <p>{project.userFeatures}</p>
                    <p>{project.developmentFeatures}</p>
                </div>

                <div className="projectLinks">
                  <a href={project.link} target="_blank" rel="noreferrer" >View Application</a>
                  <a href={project.sourceCode} target="_blank" rel="noreferrer" >View Source Code</a>
                </div>
            </main>
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