import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "../../Styles/Dashboard.css";
import generateAdmitCard from "../../../../Utils/generateAdmitCard";
import capitalizeWords from "../../../../Utils/utility";
import ImageUploadModal from "./ImageUploadModal";
import { AppContext } from "../../../../context/AppContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const { backendUrl } = useContext(AppContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageModalOpen, setImageModalOpen] = useState(false);

  /* ================= FETCH STUDENT ================= */

  useEffect(() => {
    if (!studentId) {
      navigate("/");
      return;
    }

    const fetchStudent = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${backendUrl}/api/student/single/${studentId}`
        );

        if (res.data?.success) {
          setData(res.data);
        } else {
          setError("Failed to load student data");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to load student data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId, backendUrl, navigate]);

  /* ================= LOADING STATE ================= */

  if (loading) {
    return (
      <div className="db-dashboard-page">
        <div className="db-container">
          <div className="db-loading-state">
            <div className="db-loading-spinner"></div>
            <p className="db-loading-text">Loading student details...</p>
          </div>
        </div>
      </div>
    );
  }

  /* ================= ERROR STATE ================= */

  if (error || !data) {
    return (
      <div className="db-dashboard-page">
        <div className="db-container">
          <div className="db-error-state">
            <div className="db-error-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <p className="db-error-text">{error || "Something went wrong"}</p>
            <p className="db-error-description">
              Unable to load student information. Please try again later or contact support if the problem persists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { student, principal, admitCard, examDetails, services } = data;

  /* ================= ADMIT CARD LOGIC ================= */

  const canDownload =
    student.canDownloadAdmitCard && Boolean(admitCard) && services?.admitCard;

  let badgeMessage = "";
  let badgeType = "";

  if (!services?.admitCard) {
    badgeMessage = "Not available. Contact Principal Sir.";
    badgeType = "warning";
  } else if (!admitCard) {
    badgeMessage = "Not released yet. Please come back later.";
    badgeType = "warning";
  } else if (!student.canDownloadAdmitCard) {
    badgeMessage = "Please pay the fee to download admit card";
    badgeType = "danger";
  }

  /* =================================================== */

  return (
    <div className="db-dashboard-page">
      <div className="db-container">

        {/* ================= Action Buttons ================= */}
        <div className="db-action-buttons">

          {/* ---- Admit Card Button ---- */}
          <div className="db-btn-wrapper">
            <button
              className={`db-action-btn ${!canDownload ? "disabled" : ""}`}
              disabled={!canDownload}
              onClick={() =>
                canDownload &&
                generateAdmitCard(
                  student,
                  admitCard,
                  principal,
                  examDetails
                )
              }
            >
              <i className="fas fa-download"></i>
              <span>Download Admit Card</span>
            </button>

            {!canDownload && badgeMessage && (
              <span className={`db-badge ${badgeType}`}>
                {badgeMessage}
              </span>
            )}
          </div>

          {/* <button className="db-action-btn">
            <i className="fas fa-money-bill"></i>
            <span>Pay Fees</span>
          </button>

          <button className="db-action-btn">
            <i className="fas fa-user-plus"></i>
            <span>Admission</span>
          </button>
          <button className="db-action-btn">
            <i className="fas fa-chart-bar"></i>
            <span>Result</span>
          </button> */}

        </div>

        {/* ================= Cards ================= */}
        <div className="db-cards-wrapper">

          {/* -------- Student Profile -------- */}
          <div className="db-card">
            <div className="db-card-header">
              <h2 className="db-card-title">Student Profile</h2>
            </div>

            <div className="db-profile-section">
              <div className="db-avatar-wrapper">
                <div className="db-avatar">
                  {student?.image?.url ? (
                    <img src={student.image.url} alt="Student" />
                  ) : (
                    <i className="fas fa-user"></i>
                  )}
                </div>

                {!student?.image?.url && (
                  <button
                    type="button"
                    className="db-avatar-edit"
                    onClick={() => setImageModalOpen(true)}
                    title="Upload photo"
                  >
                    <i className="fas fa-camera"></i>
                  </button>
                )}
              </div>

              <div className="db-student-name">
                {capitalizeWords(student.name)}
              </div>
            </div>

            <div className="db-info-grid">
              <div className="db-info-item">
                <div className="db-info-label">Class</div>
                <div className="db-info-value">
                  {capitalizeWords(student.class)}
                </div>
              </div>

              <div className="db-info-item">
                {student.stream ?
                  <>
                    <div className="db-info-label">Stream</div>
                    <div className="db-info-value">
                      {capitalizeWords(student.stream)}
                    </div>
                  </>
                  :
                  <>
                    <div className="db-info-label">Medium</div>
                    <div className="db-info-value">
                      {capitalizeWords(student.medium)}
                    </div>
                  </>
                }
              </div>

              <div className="db-info-item">
                <div className="db-info-label">Registration No</div>
                <div className="db-info-value">
                  {student.registrationNo}
                </div>
              </div>
            </div>
          </div>

          {/* -------- Family Details -------- */}
          <div className="db-card">
            <div className="db-card-header">
              <h2 className="db-card-title">Family Details</h2>
            </div>

            <div className="db-info-grid">
              <div className="db-info-item">
                <div className="db-info-label">Father's Name</div>
                <div className="db-info-value">
                  {capitalizeWords(student.fatherName)}
                </div>
              </div>

              <div className="db-info-item">
                <div className="db-info-label">Mother's Name</div>
                <div className="db-info-value">
                  {capitalizeWords(student.motherName)}
                </div>
              </div>
            </div>
          </div>

          {/* -------- Address Information -------- */}
          <div className="db-card">
            <div className="db-card-header">
              <h2 className="db-card-title">Address Information</h2>
            </div>

            <div className="db-info-grid">
              <div className="db-info-item">
                <div className="db-info-label">Village</div>
                <div className="db-info-value">
                  {capitalizeWords(student.address?.village || "-")}
                </div>
              </div>

              <div className="db-info-item">
                <div className="db-info-label">Police Station</div>
                <div className="db-info-value">
                  {capitalizeWords(student.address?.ps || "-")}
                </div>
              </div>

              <div className="db-info-item">
                <div className="db-info-label">Post Office</div>
                <div className="db-info-value">
                  {capitalizeWords(student.address?.po || "-")}
                </div>
              </div>

              <div className="db-info-item">
                <div className="db-info-label">District</div>
                <div className="db-info-value">
                  {capitalizeWords(student.address?.district || "-")}
                </div>
              </div>

              <div className="db-info-item">
                <div className="db-info-label">State</div>
                <div className="db-info-value">
                  {capitalizeWords(student.address?.state || "-")}
                </div>
              </div>

              <div className="db-info-item">
                <div className="db-info-label">Pincode</div>
                <div className="db-info-value">
                  {student.address?.pincode || "-"}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= Image Upload Modal ================= */}
      <ImageUploadModal
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        studentId={student._id}
      />
    </div>
  );
};

export default Dashboard;