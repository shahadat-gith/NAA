import React from 'react';
import { developerInfo } from "./data";
import "./Developer.css";
import Skills from "./Skills";

const { personalInfo, socialLinks, education, skills } = developerInfo;

/* ── Section wrapper ── */
const Section = ({ eyebrow, title, children, id }) => (
  <section className="dev-section" id={id}>
    <div className="dev-section-header">
      <span className="dev-eyebrow">{eyebrow}</span>
      <h2 className="dev-section-title">{title}</h2>
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
        <div className="dev-hero-bg-line" aria-hidden="true" />

        <div className="dev-container">
          <div className="dev-hero-inner">
            <div className="dev-hero-avatar-wrap">
              <img
                src={personalInfo.image}
                alt={personalInfo.name}
                className="dev-hero-avatar"
              />
              <span className="dev-hero-avatar-ring" aria-hidden="true" />
            </div>

            <div className="dev-hero-text">
              <span className="dev-eyebrow">Full Stack Web Developer</span>
              <h1 className="dev-hero-name">{personalInfo.name}</h1>

              <div className="dev-hero-socials">
                {socialLinks.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dev-social-btn"
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

      {/* ── MAIN CONTENT ── */}
      <main className="dev-container dev-main">
        {/* EDUCATION */}
        <Section eyebrow="Academic Background" title="Education" id="education">
          <div className="dev-timeline">
            {education.map((e, i) => (
              <div className="dev-timeline-item" key={i}>
                <div className="dev-timeline-marker" aria-hidden="true" />
                <div className="dev-timeline-card">
                  <div className="dev-timeline-card-top">
                    <div>
                      <h3 className="dev-timeline-institution">{e.institution}</h3>
                      <p className="dev-timeline-location">
                        <i className="fas fa-map-marker-alt" aria-hidden="true" />{" "}
                        {e.location}
                      </p>
                    </div>
                    <span className="dev-timeline-period">
                      {e.startDate} – {e.endDate}
                    </span>
                  </div>
                  <p className="dev-timeline-degree">
                    {e.degree || e.qualification}
                  </p>
                  
                  {e.cgpa && (
                    <div className="dev-timeline-stat">
                      <span className="dev-timeline-stat-label">CGPA</span>
                      <span className="dev-timeline-stat-value">
                        {e.cgpa} / 10
                      </span>
                    </div>
                  )}
                  {e.percentage && (
                    <div className="dev-timeline-stat">
                      <span className="dev-timeline-stat-label">Score</span>
                      <span className="dev-timeline-stat-value">
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