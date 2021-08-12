import Skill from './Skill';

const SkillSection = (props) => {
  const {title, skillsArray, type} = props;

  return (
    <div className={`skills__${type}`}>
      <h3 className={`skills__${type}--title`}>{title}</h3>

      {skillsArray.map((currentSkill, i) => {
        return <Skill key={i} index={i} skillName={currentSkill} type={type} />
      })}
</div>
  )
}

export default SkillSection;