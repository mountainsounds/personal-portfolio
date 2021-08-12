

const Skill = (props) => {
  const {index, skillName, type} = props;

  return (
    <>
      <h4> {skillName} </h4>
      <div className={`skills__${type}--progress`}>
          <span className={`skills__${type}--progress__${index + 1}`}></span>
      </div>
    </>
  )
}

export default Skill;