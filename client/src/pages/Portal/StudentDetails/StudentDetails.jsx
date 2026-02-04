import React, { useContext, useEffect, useState } from "react";
import { useParams, useLocation, Navigate } from "react-router-dom";
import "./StudentDetails.css";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import Loader from "../../../components/Loader/Loader";
import generateAdmitCard from "../../../Utils/generateAdmitCard";

const StudentDetails = () => {
  const { backendUrl } = useContext(AppContext);
  const { id } = useParams();
  const { state } = useLocation();
  const type = state?.type;

  const [student, setStudent] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [admitCard, setAdmitCard] = useState(null);
  const [examDetails, setExamDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudentDetails();
    // eslint-disable-next-line
  }, []);

  const fetchStudentDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${backendUrl}/api/student/single/${id}`
      );

      if (!res.data.success) {
        throw new Error("Failed to load student details");
      }

      setStudent(res.data.student);

      if (type === "admit-card") {
        setPrincipal(res.data.principal || null);
        setAdmitCard(res.data.admitCard || null);
        setExamDetails(res.data.examDetails || null)
      }
    } catch (err) {
      console.error("StudentDetails error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!state) return <Navigate to="/portal" />;
  if (loading) return <Loader text="Loading student details..." />;

  if (!student) {
    return <div className="loading-text">Student not found</div>;
  }

  return (
    <div className="student-details-container">
      <div className="student-card">
        <h2>Student Details</h2>

        {/* ================= BASIC DETAILS ================= */}
        <div className="student-grid">
          <div>
            <span>Name</span>
            <p>{student.name}</p>
          </div>

          <div>
            <span>Registration No</span>
            <p>{student.registrationNo}</p>
          </div>

          <div>
            <span>Class</span>
            <p>{student.class}</p>
          </div>

          <div>
            <span>Medium</span>
            <p>{student.medium}</p>
          </div>

          {student.stream && (
            <div>
              <span>Stream</span>
              <p>{student.stream}</p>
            </div>
          )}

          <div>
            <span>Father's Name</span>
            <p>{student.fatherName}</p>
          </div>

          <div>
            <span>Mother's Name</span>
            <p>{student.motherName}</p>
          </div>
        </div>

        {/* ================= ADMIT CARD SECTION ================= */}
        {type === "admit-card" && (
          <div className="admitcard-section">
            {student.canDownloadAdmitCard ? (
              admitCard ? (
                <button
                  className="download-btn"
                  onClick={() =>
                    generateAdmitCard(
                      student,
                      admitCard,
                      principal,
                      examDetails
                    )
                  }
                >
                  Download Admit Card
                </button>
              ) : (
                <p className="info-text">
                  Admit card is not available yet.
                </p>
              )
            ) : (
              <p className="blocked-text">
                ⚠️ Admit card download is disabled.  
                Please contact the school Principal.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetails;
