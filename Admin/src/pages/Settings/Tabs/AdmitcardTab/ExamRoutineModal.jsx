import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { formatClassName } from "../../../../utils/formatclass";
import { generateRoutinePdf } from "./generateRoutinePdf";
import { AdminContext } from "../../../../context/AdminContext";
import "./ExamRoutineModal.css";


const ExamRoutineModal = ({ open, onClose, routine, examDetails }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [signatories, setSignatories] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH AUTHORITIES ================= */
  useEffect(() => {
    if (!open) return;

    const fetchAuthorities = async () => {
      try {
        setLoading(true);

        const res = await axios.post(`${backendUrl}/api/settings/authorities`,);

        if (res.data.success) {
          const authorities = res.data.authorities || [];

          const principal = authorities.find(
            (a) => a.role.toLowerCase() === "principal"
          );

          setSignatories({
            principal: principal
              ? {
                  name: principal.name,
                  designation: "Principal",
                  signature: principal.signature?.url,
                }
              : null,
          });
        }
      } catch (error) {
        toast.error("Failed to load authorities");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorities();
  }, [open, backendUrl, adminToken]);

  /* ================= SAFE EARLY RETURN ================= */
  if (!open || !routine) return null;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const handleDownload = () => {
    if (!signatories?.principal) {
      toast.error("Authorities not configured properly");
      return;
    }

    generateRoutinePdf(routine, signatories, examDetails);
  };

  return (
    <div className="erm-overlay">
      <div className="erm-modal">
        {/* HEADER */}
        <div className="erm-header">
          <h3>Examination Routine</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* DETAILS */}
        <div className="erm-details">
          <div>
            <strong>Class:</strong>{" "}
            {formatClassName(routine.class)}
          </div>
          <div>
            <strong>Stream:</strong>{" "}
            {routine.stream || "—"}
          </div>
          <div>
            <strong>Medium:</strong>{" "}
            {routine.medium
              ? routine.medium.charAt(0).toUpperCase() +
                routine.medium.slice(1)
              : "—"}
          </div>
          <div>
            <strong>Exam Center:</strong>{" "}
            {routine.examCenter}
          </div>
        </div>

        {/* TABLE */}
        <table className="erm-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Shift</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {routine.exams.map((exam, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{exam.subject}</td>
                <td>{formatDate(exam.date)}</td>
                <td>
                  {exam.shift.charAt(0).toUpperCase() +
                    exam.shift.slice(1)}
                </td>
                <td>{exam.time}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ACTIONS */}
        <div className="erm-actions">
          <button
            className="erm-download-btn"
            onClick={handleDownload}
            disabled={loading}
          >
            {loading ? "Preparing..." : "⬇ Download PDF"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamRoutineModal;
