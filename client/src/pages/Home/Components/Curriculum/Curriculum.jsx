import React from "react";
import { Link } from "react-router-dom";
import "./Curriculum.css";

const Curriculum = () => {
  const curriculumData = [
    {
      title: "Kinder (3-5 Years)",
      icon: "fa-solid fa-child-reaching",
      description:
        "Early learning foundation focusing on creativity, social skills, and basic literacy.",
      link: "/curriculum?type=kinder",
      background: "rgba(173, 216, 230, 0.2)",
    },
    {
      title: "Elementary (Grades 1-5)",
      icon: "fa-solid fa-book-open-reader",
      description:
        "Core subjects with interactive learning to build a strong academic foundation.",
      link: "/curriculum?type=elementary",
      background: "rgba(255, 228, 196, 0.2)",
    },
    {
      title: "Middle School (Grades 6-10)",
      icon: "fa-solid fa-school",
      description:
        "Advanced studies with a focus on critical thinking and project-based learning.",
      link: "/curriculum?type=middle",
      background: "rgba(221, 160, 221, 0.2)",
    },
    {
      title: "Higher Secondary (Grades 11-12)",
      icon: "fa-solid fa-graduation-cap",
      description:
        "Specialized subjects and career guidance for higher education preparation.",
      link: "/curriculum?type=higher-secondary",
      background: "rgba(144, 238, 144, 0.2)",
    },
  ];

  return (
    <section className="curriculum-section">
      <h2 className="curriculum-title">
        Standard Curriculum
        <span className="naa-title-underline"></span>
      </h2>

      <div className="curriculum-cards">
        {curriculumData.map((item, index) => (
          <div
            key={index}
            className="curriculum-card"
            style={{ background: item.background }}
          >
            <div className="card-icon">
              <i className={item.icon}></i>
            </div>

            <h3 className="curriculum-card-title">{item.title}</h3>
            <p className="card-description">{item.description}</p>

            <Link to={item.link} className="card-link">
              Read More
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Curriculum;
