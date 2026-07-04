import type { SkillCategory } from "@/content/skills";

function Skill({
  index,
  name,
  type,
}: {
  index: number;
  name: string;
  type: SkillCategory["type"];
}) {
  return (
    <>
      <h4> {name} </h4>
      <div className={`skills__${type}--progress`}>
        <span className={`skills__${type}--progress__${index + 1}`}></span>
      </div>
    </>
  );
}

export default function SkillSection({
  category,
}: {
  category: SkillCategory;
}) {
  const { type, title, skills } = category;

  return (
    <div className={`skills__${type}`}>
      <h3 className={`skills__${type}--title`}>{title}</h3>

      {skills.map((name, i) => (
        <Skill key={name} index={i} name={name} type={type} />
      ))}
    </div>
  );
}
