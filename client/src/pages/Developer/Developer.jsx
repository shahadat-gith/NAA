import React, { useState, useEffect } from 'react';
import "./Developer.css";
import Skills from "./Skills";

// Use the clean permanent URL path variant without version control strings
const GIST_RAW_URL = "https://gist.githubusercontent.com/shahadat-gith/712d93d6d4be21791ff4c6aacc75eb35/raw/shahadat.json";

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
  const [developerData, setDeveloperData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        const response = await fetch(GIST_RAW_URL);
        
        if (!response.ok) {
          throw new Error("Failed to receive valid portfolio metrics payload.");
        }
        
        const json = await response.json();
        setDeveloperData(json);
        setError(false);
      } catch (err) {
        console.error("[Web Gist Error]: Failed sync with remote endpoint:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  // 1. Structural Loading Fallback Shell
  if (loading) {
    return (
      <div className="dev-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="dev-loading-spinner" style={{ textAlign: 'center', color: '#6b7280', fontFamily: 'sans-serif' }}>
          <p style={{ fontSize: '14px', fontWeight: '500' }}>Fetching developer data...</p>
        </div>
      </div>
    );
  }

  // 2. Offline / Server Error Fallback Shell
  if (error || !developerData) {
    return (
      <div className="dev-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
          <h3 style={{ color: '#1f2937', marginBottom: '8px' }}>Handshake Synchronization Broken</h3>
          <p style={{ color: '#6b7280', fontSize: '13px' }}>Could not pull profile from active cloud repositories.</p>
        </div>
      </div>
    );
  }

  // Safely deconstruct values after data validation guards check out
  const { personalInfo, socialLinks, education, skills } = developerData;

  return (
    <div className="dev-page">
      {/* ── HERO ── */}
      <header className="dev-hero">
        <div className="dev-hero-bg-line" aria-hidden="true" />

        <div className="dev-container">
          <div className="dev-hero-inner">
            <div className="dev-hero-avatar-wrap">
              <img
                src={personalInfo.image || "/user.png"}
                alt={personalInfo.name}
                className="dev-hero-avatar"
              />
              <span className="dev-hero-avatar-ring" aria-hidden="true" />
            </div>

            <div className="dev-hero-text">
              <span className="dev-eyebrow">{personalInfo.title || "Full Stack Web Developer"}</span>
              <h1 className="dev-hero-name">{personalInfo.name}</h1>

              <div className="dev-hero-socials">
                {socialLinks.map(({ label, href, icon }) => {
                  const resolvedIconClass = icon.startsWith("fa") ? icon : `fab fa-${icon}`;
                  
                  return (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dev-social-btn"
                      aria-label={label}
                      title={label}
                    >
                      <i className={resolvedIconClass} aria-hidden="true" />
                    </a>
                  );
                })}
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
                      {e.timeline || `${e.startDate} – ${e.endDate}`}
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