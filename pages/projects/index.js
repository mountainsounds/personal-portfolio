import BaseLayout from '@/components/layouts/BaseLayout';
import data from '@/projectData/cardData';
import ProjectCard from '@/components/ProjectCard';

const displayProjects = () =>
  data.map(card => <ProjectCard key={card.id} card={card} />);

const Projects = () => {
  return (
    <BaseLayout page='projects'>
      <section id="work">
         {displayProjects()}
      </section>
    </BaseLayout>
  )
}

export default Projects;