import BaseLayout from '@/components/layouts/BaseLayout';
import SkillSection from '@/components/SkillSection';

const frontendSkills = ['HTML5 & CSS3', 'JavaScript (ES5 /ES6+)', 'React & NextJS', 'Sass & Bootstrap', 'jQuery & Pug'];
const backendSkills = ['NodeJS & Express', 'MySQL', 'MongoDB'];
const otherSkills = ['Git & Github', 'Agile, Trello, Social Coding', 'VS Code', 'Webpack & Snowpack'];


const Skills = () => {
  return (
      <BaseLayout page='skills'>
      <section id="skills">
           {/* Frontend  */}
            <SkillSection skillsArray={frontendSkills} type='frontend' title='Frontend' />
           {/* Backend  */}
           <SkillSection skillsArray={backendSkills} type='backend' title='Backend' />
            {/* Tools & Workflows  */}
            <SkillSection skillsArray={otherSkills} type='other' title='Tools & Workflows' />

         </section>
      </BaseLayout>
  )
}

export default Skills;
