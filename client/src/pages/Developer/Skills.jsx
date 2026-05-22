import "./Skills.css";

const Skills = ({ skills }) => {
  // Map internal keys to beautiful user-facing titles
  const categoryLabels = {
    languages: "Languages",
    frameworks: "Frameworks & Libraries",
    databases: "Databases",
    tools: "Tools & Ecosystem",
    softSkills: "Soft Skills",
  };

  return (
    <div className="skills-grid-container">
      {Object.entries(skills).map(([categoryKey, skillList]) => {
        if (!skillList || skillList.length === 0) return null;

        return (
          <div key={categoryKey} className="skills-group-card">
            <h3 className="skills-group-title">
              {categoryLabels[categoryKey] || categoryKey}
            </h3>
            <div className="skills-pill-flex">
              {skillList.map((skill) => (
                <span key={skill} className="skill-pill-modern">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Skills;