import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminContext } from "../../../context/AdminContext";
import "./StudentDetails.css";
import DeleteConfirmPopup from "../DeleteConfirmModal/DeleteConfirmPopup";
import { formatClassName } from "../../../utils/formatclass";

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

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

      {/* ================= Details ================= */}
      <div className="naa-details-container">
        {/* -------- Academic Information -------- */}
        <div className="naa-details-section">
          <h4>Academic Information</h4>
          <table className="naa-details-table">
            <tbody>
              <tr>
                <td>Class</td>
                <td>{formatClassName(student.class)}</td>
                <td>Medium</td>
                <td>{student.medium || "N/A"}</td>
              </tr>
              <tr>
                <td>Stream</td>
                <td>{student.stream || "N/A"}</td>
                <td>Registration No</td>
                <td>{student.registrationNo}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* -------- Personal Information -------- */}
        <div className="naa-details-section">
          <h4>Personal Information</h4>
          <table className="naa-details-table">
            <tbody>
              <tr>
                <td>Father's Name</td>
                <td>{student.fatherName || "N/A"}</td>
                <td>Mother's Name</td>
                <td>{student.motherName || "N/A"}</td>
              </tr>
              <tr>
                <td>Date of Birth</td>
                <td>{formatDate(student.dob)}</td>
                <td>Gender</td>
                <td>{student.gender || "N/A"}</td>
              </tr>
              <tr>
                <td>Phone</td>
                <td>{student.phone || "N/A"}</td>
                <td>Aadhar</td>
                <td>{student.aadhar || "N/A"}</td>
              </tr>
              <tr>
                <td>Address</td>
                <td>{student.address || "N/A"}</td>
                <td>Status</td>
                <td>{student.isActive ? "Active" : "Inactive"}</td>
              </tr>
            </tbody>
          </table>
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
