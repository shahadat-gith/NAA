import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminContext } from "../../../context/AdminContext";
import "./StudentDetails.css";
import DeleteConfirmPopup from "../DeleteConfirmModal/DeleteConfirmPopup";
import generateAdmitCard from "../../../utils/generateAdmitCard";
import axios from "axios";
import { formatAddress, formatClassName } from "../../../utils/utility";


const StudentDetails = () => {
  const { id: studentId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [student, setStudent] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [examIncharge, setExamIncharge] = useState(null);
  const [admitCard, setAdmitCard] = useState(null);

  /* ================= FETCH STUDENT ================= */

  const fetchStudent = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/api/student/single/${studentId}?type=admit-card`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (data.success) {
        setStudent(data.student);
        setPrincipal(data.principal);
        setExamIncharge(data.examIncharge);
        setAdmitCard(data.admitCard);
      }
    } catch (error) {
      console.error("Fetch student error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) fetchStudent();
  }, [studentId]);

  /* ================= ADMIT CARD ================= */

  const handleAdmitCardDownload = () => {
    if (!admitCard) {
      toast.error("Admit card settings not found for this class/medium.");
      return;
    }

    generateAdmitCard(student,admitCard,principal, examIncharge )

  };

  /* ================= LOADING / ERROR ================= */

  if (loading) {
    return <div className="naa-loading">Loading student details...</div>;
  }

  if (!student) {
    return <div className="naa-error">Student not found</div>;
  }

  /* ================= UI ================= */

  return (
    <div className="naa-student-details">
      <h3 className="naa-student-title">{student.name}</h3>

      {/* ================= DETAILS ================= */}
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
                <td>{student.dob || "N/A"}</td>
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
                <td colSpan="3">{formatAddress(student.address)}</td>
              </tr>
              <tr>
                <td>Status</td>
                <td colSpan="3">
                  {student.isActive ? "Active" : "Inactive"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="naa-action-buttons">
        <button
          className="naa-admit-card-btn"
          onClick={handleAdmitCardDownload}
        >
          Generate Admit Card
        </button>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="naa-delete-student-btn"
        >
          Delete Student
        </button>
      </div>

      {/* ================= DELETE CONFIRM ================= */}
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
