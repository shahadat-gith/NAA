import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { TbArrowLeft } from "react-icons/tb";
import AdmitCardPdf from "./admitCardPdf";
import "./AdmitCardDownload.css";
import capitalizeWords from "../../../../Utils/utility";

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

  return `${day}${getOrdinal(day)} ${month} ${year} ( ${weekday} )`;
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

const capitaliseStudentData = { ...student };

for (const key in capitaliseStudentData) {
  if (typeof capitaliseStudentData[key] === 'string' && key !== "registrationNo") {
    capitaliseStudentData[key] = capitalizeWords(capitaliseStudentData[key]);
  }
}
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
    <div className="adc-dl-page">

      <div className="adc-dl-actions-wrapper">
        <PDFDownloadLink
          className="adc-dl-download-btn"
          document={
            <AdmitCardPdf
              student={capitaliseStudentData}
              admitCard={admitCard}
              examDetails={examDetails}
              principal={principal}
            />
          }
          fileName={`admit_card_${student?.registrationNo || "student"}.pdf`}
        >
          {({ loading }) => loading ? "Generating Document..." : "Download"}
        </PDFDownloadLink>
      </div>

      <div className="adc-dl-card-container">
        <div className="adc-dl-outer-border">
          <div className="adc-dl-inner-border">

            {/* ================= HEADER ================= */}
            <div className="adc-dl-header">
              <img src={SCHOOL_DETAILS.logo} alt="school logo" className="adc-dl-school-logo" />
              <h1 className="adc-dl-school-name">{SCHOOL_DETAILS.name}</h1>

              <div className="adc-dl-divider-wrapper">
                <span className="adc-dl-line"></span>
                <span className="adc-dl-exam-name">{examDetails?.examName || "Annual Examination"}</span>
                <span className="adc-dl-line"></span>
              </div>

              <h2 className="adc-dl-title">ADMIT CARD</h2>

              <div className="adc-dl-session-wrapper">
                <span className="adc-dl-line adc-dl-short"></span>
                <p className="adc-dl-session-text">SESSION: {examDetails?.academicSession || "2025 - 2026"}</p>
                <span className="adc-dl-line adc-dl-short"></span>
              </div>
            </div>

            {/* ================= STUDENT DETAILS ================= */}
            <div className="adc-dl-student-section">
              <div className="adc-dl-student-info">
                <p><strong>Name:</strong> <span className="adc-dl-data-text">{capitaliseStudentData?.name}</span></p>
                <p><strong>Father's Name:</strong> <span className="adc-dl-data-text">{capitaliseStudentData?.fatherName}</span></p>
                <p><strong>Mother's Name:</strong> <span className="adc-dl-data-text">{capitaliseStudentData?.motherName}</span></p>
                <p><strong>Class:</strong> <span className="adc-dl-data-text">{capitaliseStudentData?.class}</span></p>
                <p><strong>Medium:</strong> <span className="adc-dl-data-text">{capitaliseStudentData?.medium}</span></p>
                {capitaliseStudentData?.stream && (
                  <p><strong>Stream:</strong> <span className="adc-dl-data-text">{capitaliseStudentData.stream}</span></p>
                )}
                <p><strong>Registration No:</strong> <span className="adc-dl-data-text">{capitaliseStudentData?.registrationNo}</span></p>
              </div>
              <div className="adc-dl-photo-frame">
                <img src={student?.image?.url || "/user.png"} alt="student profile" />
              </div>
            </div>

            {/* ================= EXAM DETAILS TABLE ================= */}
            <div className="adc-dl-exam-section">
              <div className="adc-dl-table-header-box">Exam Details</div>
              <table className="adc-dl-exam-table">
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>MORNING <br />( <span className="adc-dl-time-sub">{examDetails?.time?.morning || "9:00 AM - 12:00 PM"}</span> )</th>
                    <th>AFTERNOON <br />( <span className="adc-dl-time-sub">{examDetails?.time?.afternoon || "1:00 PM - 4:00 PM"}</span> )</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(groupedExams).length > 0 ? (
                    Object.keys(groupedExams).map((date, index) => (
                      <tr key={index}>
                        <td>{date}</td>
                        <td className="adc-dl-subject-cell">{groupedExams[date].morning}</td>
                        <td className="adc-dl-subject-cell">{groupedExams[date].afternoon}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="3" className="adc-dl-empty-table-cell">No exams scheduled</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ================= INSTRUCTIONS ================= */}
            <div className="adc-dl-instruction-section">
              <h4>Instructions:</h4>
              <ul className="adc-dl-instruction-list">
                <li>This admit card must be brought to the examination hall every day.</li>
                <li>Students must be in the examination hall 15 minutes prior to the exam time.</li>
                <li>All students must bring their own pens, pencils, and other necessary stationery.</li>
                <li>Any form of cheating or malpractice will result in immediate disqualification.</li>
                <li>Maintain discipline and follow the invigilator's instructions at all times.</li>
              </ul>
            </div>

            {/* ================= FOOTER / AUTHORIZATIONS ================= */}
            <div className="adc-dl-footer-layout">
              <div className="adc-dl-signature-container">
                <div className="adc-dl-signature-wrapper">
                  {principal?.signature?.url ? (
                    <img src={principal.signature.url} alt="Principal Signature" className="adc-dl-signature-img" />
                  ) : (
                    <div className="adc-dl-signature-placeholder"></div>
                  )}
                  <div className="adc-dl-signature-labels">
                    <p className="adc-dl-principal-label">Principal</p>
                    <p className="adc-dl-principal-name">({principal?.name || "Abdul Mozid Mondol"})</p>
                  </div>
                </div>
              </div>

              <div className="adc-dl-school-contact-area">
                <div className="adc-dl-footer-school-line">
                  <span className="adc-dl-line"></span>
                  <span className="adc-dl-footer-school-name">{SCHOOL_DETAILS.name}</span>
                  <span className="adc-dl-line"></span>
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