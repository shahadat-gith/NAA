import React, { useState } from "react"; // Added useState
import { toast } from "react-toastify";
import generateAdmitCard from "../utils/generateAdmitCard";

const StudentDetails = ({ student, admitCardConfig }) => {
  const [loading, setLoading] = useState(false); // Added loading state

  const formatClassName = (cls) => {
    if (/^\d+$/.test(cls)) return `Class ${cls}`;
    return cls.charAt(0).toUpperCase() + cls.slice(1);
  };

  const handleDownloadAdmitCard = async () => {
    if (!student) {
      toast.error("Please select a student first.");
      return;
    }
    if (student.dueAmount > 0) {
      toast.error("Admit card cannot be downloaded until all monthly dues are cleared.");
      return;
    }
    if (!admitCardConfig?.isEnabled) {
      toast.error("Admit card download is currently disabled.");
      return;
    }
    try {
      setLoading(true);
      await generateAdmitCard(student, admitCardConfig); // Assume async for consistency
    } catch (err) {
      toast.error("Failed to download admit card.");
    } finally {
      setLoading(false);
    }
  };

  if (!student) return null;

  return (
    <div className="student-details">
      <h4>{`${student.firstName} ${student.lastName}`}'s Details</h4>
      <div className="student-info">
        <p>Class: {formatClassName(student.class)}</p>
        <p>Medium: {student.medium}</p>
        {student.stream && <p>Stream: {student.stream}</p>}
        <p>Phone: {student.phone || "Not available"}</p>
        <p>Total Monthly Due: ₹{student.dueAmount}</p>
        {student.dueAmount > 0 ? (
          <p className="due-warning">Please clear your dues to download the admit card.</p>
        ) : (
          <p className="due-clear">No dues pending. You can download your admit card.</p>
        )}
      </div>
      <button
        onClick={handleDownloadAdmitCard}
        className="download-btn"
        disabled={student.dueAmount > 0 || loading}
      >
        {loading ? "Downloading..." : "Download Admit Card"}
      </button>
    </div>
  );
};

export default StudentDetails;