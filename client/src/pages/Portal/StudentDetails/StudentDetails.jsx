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
  const [examIncharge, setExamIncharge] = useState(null);
  const [admitCard, setAdmitCard] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const fetchStudentDetails = async () => {
    setLoading(true)
    try {
      const res = await axios.get(
        `${backendUrl}/api/student/single/${id}?type=${type}`);

      if (!res.data.success) {
        throw new Error("Failed to load student details");
      }

      setStudent(res.data.student);
      console.log(res.data)

      if (type === "admit-card") {
        setPrincipal(res.data.principal || null);
        setExamIncharge(res.data.examIncharge || null);
        setAdmitCard(res.data.admitCard || null);
      }
    } catch (err) {
      console.error("StudentDetails error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!state) return <Navigate to="/portal" />;
  if(loading) return <Loader text="Loading student details..." />
  

  return (
    <div className="student-details-container">
      <div className="student-card">
        <h2>Student Details</h2>
        <div className="student-grid">
          <div><span>Name</span><p>{student?.name}</p></div>
          <div><span>Registration No</span><p>{student?.registrationNo}</p></div>
          <div><span>Class</span><p>{student?.class}</p></div>
          <div><span>Medium</span><p>{student?.medium}</p></div>
          <div><span>Father's Name</span><p>{student?.fatherName}</p></div>
          <div><span>Mother's Name</span><p>{student?.motherName}</p></div>
        </div>

        {type === "admit-card" && admitCard && (
          <button
            className="download-btn"
            onClick={() =>
              generateAdmitCard(
                student,
                admitCard,
                principal,
                examIncharge
              )
            }
          >
            Download Admit Card
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentDetails;
