import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { generateRoutinePdf } from "./generateRoutinePdf";
import "../Styles/RoutinePreviewModal.css";

const RoutinePreviewModal = ({ open, onClose, routine, examDetails, authorities }) => {

  /* ================= SAFE EARLY RETURN ================= */
  if (!open || !routine) return null;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const handleDownload = () => {
    if (!authorities?.principal) {
      toast.error("Authorities not configured properly");
      return;
    }

    generateRoutinePdf(routine, authorities, examDetails);
  };

  return (
    <div className="rpm-overlay">
      <div className="rpm-modal">
        {/* HEADER */}
        <div className="rpm-header">
          <h3>Examination Routine</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* DETAILS */}
        <div className="rpm-details">
          <div>
            <strong>Class:</strong> {routine.class}
          </div>
          <div>
            <strong>Stream:</strong> {routine.stream || "—"}
          </div>
          <div>
            <strong>Medium:</strong>{" "}
            {routine.medium
              ? routine.medium.charAt(0).toUpperCase() +
                routine.medium.slice(1)
              : "—"}
          </div>
          <div>
            <strong>Exam Center:</strong> {routine.examCenter}
          </div>
        </div>

        {/* TABLE */}
        <div className="rpm-table-wrapper">
          <table className="rpm-table">
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
        </div>

        {/* ACTIONS */}
        <div className="rpm-actions">
          <button
            className="rpm-download-btn"
            onClick={handleDownload}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoutinePreviewModal;