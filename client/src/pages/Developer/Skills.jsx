import React from 'react';
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
    <div className="sk-grid-container">
      {Object.entries(skills).map(([categoryKey, skillList]) => {
        if (!skillList || skillList.length === 0) return null;

        return (
          <div key={categoryKey} className="sk-group-card">
            <h3 className="sk-group-title">
              {categoryLabels[categoryKey] || categoryKey}
            </h3>
            <div className="sk-pill-flex">
              {skillList.map((skill) => (
                <span key={skill} className="sk-pill-modern">
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