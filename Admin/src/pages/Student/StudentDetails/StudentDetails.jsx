import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminContext } from "../../../context/AdminContext";
import "./StudentDetails.css";
import DeleteConfirmPopup from "../DeleteConfirmModal/DeleteConfirmPopup";
import { formatClassName } from "../../../utils/formatclass";

const StudentDetails = () => {
  const { state } = useLocation();
  const student = state?.student;
  const navigate = useNavigate();
  const { backendUrl, adminToken } = useContext(AdminContext);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  if (!student) {
    return <div className="naa-error">Student not found</div>;
  }

  return (
    <div className="naa-student-details">
      <h3 className="naa-student-title">{student.name}</h3>

      {/* ================= Summary ================= */}
      <div className="naa-student-summary">
        <div className="naa-summary-info">
          <div className="naa-summary-item">
            <strong>Class:</strong> {formatClassName(student.class)}
          </div>
          <div className="naa-summary-item">
            <strong>Medium:</strong> {student.medium || "N/A"}
          </div>
          <div className="naa-summary-item">
            <strong>Stream:</strong> {student.stream || "N/A"}
          </div>
        </div>
      </div>

      {/* ================= Details ================= */}
      <div className="naa-details-container">
        <div className="naa-details-row">
          <div className="naa-details-column">
            <div className="naa-details-section">
              <h4>Academic Information</h4>
              <table className="naa-details-table">
                <tbody>
                  <tr>
                    <td>Class</td>
                    <td>{formatClassName(student.class)}</td>
                  </tr>
                  <tr>
                    <td>Medium</td>
                    <td>{student.medium || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Stream</td>
                    <td>{student.stream || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Registration No</td>
                    <td>{student.registrationNo}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="naa-details-column">
            <div className="naa-details-section">
              <h4>Personal Information</h4>
              <table className="naa-details-table">
                <tbody>
                  <tr>
                    <td>Father's Name</td>
                    <td>{student.fatherName || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Mother's Name</td>
                    <td>{student.motherName || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Phone</td>
                    <td>{student.phone || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td>{student.isActive ? "Active" : "Inactive"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Actions ================= */}
      <div className="naa-action-buttons">
        <button className="naa-admit-card-btn">
          Generate Admit Card
        </button>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="naa-delete-student-btn"
        >
          Delete Student
        </button>
      </div>

      {/* ================= Delete Confirmation ================= */}
      {showDeleteConfirm && (
        <DeleteConfirmPopup
          student={student}
          backendUrl={backendUrl}
          adminToken={adminToken}
          onConfirm={() => {
            setShowDeleteConfirm(false);
            navigate("/students");
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};

export default StudentDetails;
