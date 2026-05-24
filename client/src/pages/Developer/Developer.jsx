import React from "react";
import { developerInfo } from "./data";
import "./Developer.css";
import Skills from "./Skills";

const { personalInfo, socialLinks, education, skills } = developerInfo;

/* ── Section wrapper ── */
const Section = ({ eyebrow, title, children, id }) => (
  <section className="dev-section" id={id}>
    <div className="dev-section__header">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="dev-section__title">{title}</h2>
    </div>
    {children}
  </section>
);


/* ─────────────────────────────────────────── */
const Developer = () => {
  return (
    <div className="dev-page">
      {/* ── HERO ── */}
      <header className="dev-hero">
        <div className="dev-hero__bg-line" aria-hidden="true" />

        <div className="container">
          <div className="dev-hero__inner">
            <div className="dev-hero__avatar-wrap">
              <img
                src={personalInfo.image}
                alt={personalInfo.name}
                className="dev-hero__avatar"
              />
              <span className="dev-hero__avatar-ring" aria-hidden="true" />
            </div>

            <div className="dev-hero__text">
              <span className="eyebrow">Full Stack Web Developer</span>
              <h1 className="dev-hero__name">{personalInfo.name}</h1>

              <div className="dev-hero__socials">
                {socialLinks.map(({label,href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn"
                    aria-label={label}
                    title={label}
                  >
                    <i className={icon} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="container dev-main">
        {/* EDUCATION */}
        <Section eyebrow="Academic Background" title="Education" id="education">
          <div className="timeline">
            {education.map((e, i) => (
              <div className="timeline__item" key={i}>
                <div className="timeline__marker" aria-hidden="true" />
                <div className="timeline__card">
                  <div className="timeline__card-top">
                    <div>
                      <h3 className="timeline__institution">{e.institution}</h3>
                      <p className="timeline__location">
                        <i
                          className="fas fa-map-marker-alt"
                          aria-hidden="true"
                        />{" "}
                        {e.location}
                      </p>
                    </div>
                    <span className="timeline__period">
                      {e.startDate} – {e.endDate}
                    </span>
                  </div>
                  <p className="timeline__degree">
                    {e.degree || e.qualification}
                  </p>
                  {e.cgpa && (
                    <div className="timeline__stat">
                      <span className="timeline__stat-label">CGPA</span>
                      <span className="timeline__stat-value">
                        {e.cgpa} / 10
                      </span>
                    </div>
                  )}
                  {e.percentage && (
                    <div className="timeline__stat">
                      <span className="timeline__stat-label">Score</span>
                      <span className="timeline__stat-value">
                        {e.percentage}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* SKILLS */}
        <Section eyebrow="Technical Competencies" title="Skills" id="skills">
          <Skills skills={skills} />
        </Section>
      </main>
    </div>
  );
};

export default Developer;
