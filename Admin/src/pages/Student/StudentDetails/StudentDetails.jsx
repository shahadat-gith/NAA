import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminContext } from "../../../context/AdminContext";
import "./StudentDetails.css";
import axios from "axios";
import {
  capitalizeWords,
  capitalizeFirst,
} from "../../../utils/utility";
import Loader from "../../../components/Loader/Loader";
import StudentModal from "../Modals/StudentModal";

const StudentDetails = () => {
  const { id: studentId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);

  /* ================= FETCH STUDENT ================= */

  const fetchStudent = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/api/student/single/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (data.success) {
        setStudent(data.student);
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

  /* ================= DELETE STUDENT ================= */

  const handleDeleteStudent = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/student/delete/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (data.success) {
        navigate("/students");
      }
    } catch (error) {
      console.error("Delete student error:", error);
    }
  };

  /* ================= LOADING / ERROR ================= */

  if (loading) return <Loader text="loading student..." />;

  if (!student) {
    return <div className="naa-error">Student not found</div>;
  }

  /* ================= UI ================= */

  return (
    <div className="naa-student-details">
      {/* ================= HEADER ================= */}
      <div className="naa-student-header">
        <h3 className="naa-student-title">
          {capitalizeWords(student.name)}
        </h3>

        <div className="naa-action-buttons">
          <button
            className="naa-edit-student-btn"
            onClick={() => setShowEditModal(true)}
          >
            Edit
          </button>

          <button
            onClick={handleDeleteStudent}
            className="naa-delete-student-btn"
          >
            Delete Student
          </button>
        </div>
      </div>

      {/* ================= DETAILS ================= */}
      <div className="naa-details-container">
        {/* -------- Academic Information -------- */}
        <div className="naa-details-section">
          <h4>Academic Information</h4>
          <table className="naa-details-table">
            <tbody>
              <tr>
                <td>Class</td>
                <td>{student.class}</td>
                <td>Medium</td>
                <td>{capitalizeFirst(student.medium) || "N/A"}</td>
              </tr>
              <tr>
                <td>Stream</td>
                <td>{capitalizeFirst(student.stream) || "N/A"}</td>
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
                <td>{capitalizeWords(student.fatherName) || "N/A"}</td>
                <td>Mother's Name</td>
                <td>{capitalizeWords(student.motherName) || "N/A"}</td>
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
            </tbody>
          </table>
        </div>

        {/* -------- Address Information -------- */}
        <div className="naa-details-section">
          <h4>Address Information</h4>
          <table className="naa-details-table">
            <tbody>
              <tr>
                <td>Village</td>
                <td>{capitalizeFirst(student?.address?.village) || "N/A"}</td>
                <td>Post Office</td>
                <td>
                  {capitalizeFirst(student?.address?.postOffice) || "N/A"}
                </td>
              </tr>
              <tr>
                <td>Police Station</td>
                <td>
                  {capitalizeFirst(student?.address?.policeStation) || "N/A"}
                </td>
                <td>District</td>
                <td>
                  {capitalizeFirst(student?.address?.district) || "N/A"}
                </td>
              </tr>
              <tr>
                <td>Pincode</td>
                <td>{student?.address?.pincode || "N/A"}</td>
                <td>State</td>
                <td>
                  {capitalizeFirst(student?.address?.state) || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {showEditModal && (
        <StudentModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          student={student}
          setStudent={setStudent}
        />
      )}
    </div>
  );
};

export default StudentDetails;