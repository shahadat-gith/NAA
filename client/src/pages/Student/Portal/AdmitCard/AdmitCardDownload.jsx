import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { TbArrowLeft } from "react-icons/tb";
import AdmitCardPdf from "./admitCardPdf";
import "./AdmitCardDownload.css";

const formatDate = (dateInput) => {
  if (!dateInput) return "-";

  const date = new Date(dateInput);
  if (isNaN(date)) return "-";

  const day = date.getDate();

  const getOrdinal = (n) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();
  const weekday = date.toLocaleString("en-GB", { weekday: "long" });

  return `${day}${getOrdinal(day)} ${month} ${year} (${weekday})`;
};

const AdmitCardDownload = () => {
  const SCHOOL_DETAILS = {
    name: "NASHIB ALI ACADEMY",
    logo: "/logo.png",
    address: "Mahachara, Kachumara, Barpeta, Assam - 781127",
    contact: "+91-60014-16724",
    email: "nashibaliacademy.offl@gmail.com",
    website: "www.nashibaliacademy.in",
  };

  const location = useLocation();
  const navigate = useNavigate();
  
  const { admitCard, examDetails, principal, student } = location?.state?.data || {};

  // Force safety fallback redirection to prevent component crashes if user manually refreshes page empty
  useEffect(() => {
    if (!student) {
      navigate("/student/portal/admit-card");
    }
  }, [student, navigate]);

  if (!student) return null;

  const groupedExams = {};
  admitCard?.exams?.forEach((exam) => {
    const date = formatDate(exam.date);
    if (!groupedExams[date]) {
      groupedExams[date] = { morning: "X", afternoon: "X" };
    }
    groupedExams[date][exam.shift.toLowerCase()] = exam.subject;
  });

  return (
    <div className="admit-page">

      <div className="download-wrapper">
        <PDFDownloadLink
          className="download-btn"
          document={
            <AdmitCardPdf
              student={student}
              admitCard={admitCard}
              examDetails={examDetails}
              principal={principal}
            />
          }
          fileName={`admit_card_${student?.registrationNo || "student"}.pdf`}
        >
          {({ loading }) => loading ? "Generating Document..." : "Download Admit Card PDF"}
        </PDFDownloadLink>
      </div>

      <div className="admit-card-container">
        <div className="outer-border">
          <div className="inner-border">

            {/* ================= HEADER ================= */}
            <div className="admit-header">
              <img src={SCHOOL_DETAILS.logo} alt="logo" className="school-logo" />
              <h1 className="school-name">{SCHOOL_DETAILS.name}</h1>

              <div className="divider-wrapper">
                <span className="line"></span>
                <span className="exam-name">{examDetails?.examName || "Annual Examination"}</span>
                <span className="line"></span>
              </div>

              <h2 className="admit-title">ADMIT CARD</h2>

              <div className="session-wrapper">
                <span className="line short"></span>
                <p className="session-text">SESSION: {examDetails?.academicSession || "2025 - 2026"}</p>
                <span className="line short"></span>
              </div>
            </div>

            {/* ================= STUDENT DETAILS ================= */}
            <div className="student-section">
              <div className="student-info">
                <p><strong>Name:</strong> <span className="data-text">{student?.name}</span></p>
                <p><strong>Father's Name:</strong> <span className="data-text">{student?.fatherName}</span></p>
                <p><strong>Mother's Name:</strong> <span className="data-text">{student?.motherName}</span></p>
                <p><strong>Class:</strong> <span className="data-text">{student?.class}</span></p>
                <p><strong>Medium:</strong> <span className="data-text">{student?.medium}</span></p>
                {student?.stream && (
                  <p><strong>Stream:</strong> <span className="data-text">{student.stream}</span></p>
                )}
                <p><strong>Registration No:</strong> <span className="data-text">{student?.registrationNo}</span></p>
              </div>
              <div className="photo-frame">
                <img src={student?.image?.url || "/user.png"} alt="student profile" />
              </div>
            </div>

            {/* ================= EXAM DETAILS TABLE ================= */}
            <div className="exam-section">
              <div className="table-header-box">Exam Details</div>
              <table className="exam-table">
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>MORNING <br />( <span style={{ color: "#ddd" }}>{examDetails?.time?.morning || "9:00 AM - 12:00 PM"} )</span></th>
                    <th>AFTERNOON <br />( <span style={{ color: "#ddd" }}>{examDetails?.time?.afternoon || "1:00 PM - 4:00 PM"} )</span></th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(groupedExams).length > 0 ? (
                    Object.keys(groupedExams).map((date, index) => (
                      <tr key={index}>
                        <td>{date}</td>
                        <td className="subject-cell">{groupedExams[date].morning}</td>
                        <td className="subject-cell">{groupedExams[date].afternoon}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="3" style={{ textAlign: "center" }}>No exams scheduled</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ================= INSTRUCTIONS ================= */}
            <div className="instruction-section">
              <h4>Instructions:</h4>
              <ul className="instruction-list">
                <li>This admit card must be brought to the examination hall every day.</li>
                <li>Students must be in the examination hall 15 minutes prior to the exam time.</li>
                <li>All students must bring their own pens, pencils, and other necessary stationery.</li>
                <li>Any form of cheating or malpractice will result in immediate disqualification.</li>
                <li>Maintain discipline and follow the invigilator's instructions at all times.</li>
              </ul>
            </div>

            {/* ================= FOOTER ================= */}
            <div className="footer-layout">
              <div className="signature-container">
                <div className="signature-wrapper">
                  {principal?.signature?.url ? (
                    <img src={principal.signature.url} alt="Principal Signature" className="signature-img" />
                  ) : (
                    <div className="signature-placeholder"></div>
                  )}
                  <div className="signature-labels">
                    <p className="principal-label">Principal</p>
                    <p className="principal-name">({principal?.name || "Abdul Mozid Mondol"})</p>
                  </div>
                </div>
              </div>

              <div className="school-contact-area">
                <div className="footer-school-line">
                  <span className="line"></span>
                  <span className="footer-school-name">{SCHOOL_DETAILS.name}</span>
                  <span className="line"></span>
                </div>
                <p>{SCHOOL_DETAILS.address}</p>
                <p>{SCHOOL_DETAILS.website}</p>
                <p>{SCHOOL_DETAILS.email} | {SCHOOL_DETAILS.contact}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmitCardDownload;