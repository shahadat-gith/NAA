import React from "react";

const OverViewTab = ({ teacher, attendance, monthlyAttendance }) => {
  const presentCount = monthlyAttendance.filter((att) => att.status === "Present" || att.status === "Late").length;
  const absentCount = monthlyAttendance.filter((att) => att.status === "Absent").length;
  const lateCount = monthlyAttendance.filter((att) => att.status === "Late").length;
  const totalDays = presentCount + absentCount;
  const attendancePercentage = totalDays > 0 ? (presentCount / totalDays) * 100 : 0;

  const overallPresent = attendance.filter((att) => att.status === "Present" || att.status === "Late").length;
  const overallAbsent = attendance.filter((att) => att.status === "Absent").length;
  const overallTotal = overallPresent + overallAbsent;
  const overallPercentage = overallTotal > 0 ? (overallPresent / overallTotal) * 100 : 0;

  // Format subjectClassMappings for display
  const formatSubjectClassMappings = (mappings) => {
    if (!mappings || mappings.length === 0) return "N/A";
    return mappings.map((mapping) => (
      `${mapping.subject} (${mapping.classes.join(", ")})`
    )).join("; ");
  };

  return (
    <div className="overview-tab">
      <div className="card teacher-info-card">
        <h2 className="card-title">Teacher Information</h2>
        <div className="card-content">
          <div className="info-table">
            <div className="info-row">
              <span className="info-label">Subjects & Classes</span>
              <span className="info-value">{formatSubjectClassMappings(teacher.subjectClassMappings)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Degree</span>
              <span className="info-value">{teacher.degree || "N/A"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Experience</span>
              <span className="info-value">{teacher.experience ? `${teacher.experience} years` : "N/A"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Salary</span>
              <span className="info-value">₹{teacher.salary?.toLocaleString() || "N/A"} per month</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{teacher.email || "N/A"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Contact</span>
              <span className="info-value">{teacher.contact || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="card stats-card">
          <span className="stats-card-title">Attendance</span>
          <span className="stats-card-value">{attendancePercentage.toFixed(2)}%</span>
          <span className="stats-card-label">This Month</span>
        </div>
        <div className="card stats-card">
          <span className="stats-card-title">Present Days</span>
          <span className="stats-card-value">{presentCount}</span>
          <span className="stats-card-label">This Month</span>
        </div>
        <div className="card stats-card">
          <span className="stats-card-title">Absent Days</span>
          <span className="stats-card-value">{absentCount}</span>
          <span className="stats-card-label">This Month</span>
        </div>
        <div className="card stats-card">
          <span className="stats-card-title">Late Days</span>
          <span className="stats-card-value">{lateCount}</span>
          <span className="stats-card-label">This Month</span>
        </div>
        <div className="card stats-card">
          <span className="stats-card-title">Overall Attendance</span>
          <span className="stats-card-value">{overallPercentage.toFixed(2)}%</span>
          <span className="stats-card-label">Since Joining</span>
        </div>
      </div>
    </div>
  );
};

export default OverViewTab;