import React from "react";

const OverViewTab = ({ teacher }) => {
  /* ================= HELPERS ================= */

  const formatSubjectClassMappings = (mappings) => {
    if (!mappings || mappings.length === 0) return "N/A";

    return mappings
      .map(
        (mapping) =>
          `${mapping.subject} (${mapping.classes.join(", ")})`
      )
      .join(" | ");
  };

  return (
    <div className="overview-tab">
      {/* ===== Teacher Information ===== */}
      <div className="card teacher-info-card">
        <h2 className="card-title">Teacher Information</h2>

        <div className="card-content">
          <div className="info-table">
            <div className="info-row">
              <span className="info-label">Subjects & Classes</span>
              <span className="info-value">
                {formatSubjectClassMappings(
                  teacher.subjectClassMappings
                )}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Qualification</span>
              <span className="info-value">
                {teacher.degree || "N/A"}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Experience</span>
              <span className="info-value">
                {teacher.experience
                  ? `${teacher.experience} years`
                  : "N/A"}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">
                {teacher.email && teacher.email !== "N/A"
                  ? teacher.email
                  : "Not Available"}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Contact</span>
              <span className="info-value">
                {teacher.contact || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Quick Summary ===== */}
      <div className="stats-grid">
        <div className="card stats-card">
          <span className="stats-card-title">Subjects</span>
          <span className="stats-card-value">
            {teacher.subjectClassMappings?.length || 0}
          </span>
          <span className="stats-card-label">Assigned</span>
        </div>

        <div className="card stats-card">
          <span className="stats-card-title">Handles</span>
          <span className="stats-card-value">
            {teacher.subjectClassMappings
              ?.reduce(
                (total, m) => total + m.classes.length,
                0
              ) || 0}
          </span>
          <span className="stats-card-label">Classes</span>
        </div>

        <div className="card stats-card">
          <span className="stats-card-title">Experience</span>
          <span className="stats-card-value">
            {teacher.experience || 0}
          </span>
          <span className="stats-card-label">Years</span>
        </div>
      </div>
    </div>
  );
};

export default OverViewTab;
