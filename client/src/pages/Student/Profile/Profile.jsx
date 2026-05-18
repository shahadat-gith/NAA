import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import capitalizeWords from "../../../Utils/utility";
import { 
  TbUser,
  TbAlertTriangle,
  TbArrowLeft
} from "react-icons/tb";
import "./Profile.css"; // Renamed your CSS reference to look consistent
import Search from "../Portal/Common/Search";

const Profile = () => {
  const { backendUrl } = useContext(AppContext);
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= HANDLER PASSED TO REUSABLE SEARCH ================= */

  const handleStudentSearch = async (registrationNo) => {
    setError("");
    setData(null);
    setLoading(true);

    try {
      const res = await axios.post(`${backendUrl}/api/student/search`, { registrationNo });

      if (res.data?.success) {
        setData(res.data);
      } else {
        setError(res.data?.message || "Failed to find student records matching this registration number.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "An unexpected network error occurred while querying the records system."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= CONDITION A: LANDING SEARCH UI ================= */

  if (!data) {
    return (
      <div className="prof-page search-landing-context">
        <div className="prof-container">
          
          <Search 
            title="Find Your Details"
            onSearch={handleStudentSearch}
            searching={loading}
          />

          {error && (
            <div className="prof-inline-error">
              <TbAlertTriangle className="error-warn-icon" />
              <p>{error}</p>
            </div>
          )}

        </div>
      </div>
    );
  }

  /* ================= CONDITION B: RENDER PORTAL DATA ================= */

  const { student } = data;

  return (
    <div className="prof-page">
      <div className="prof-container">

        {/* ================= Cards Information Sections ================= */}
        <div className="prof-cards-wrapper">

          {/* -------- Student Profile Card -------- */}
          <div className="prof-card">
            <div className="prof-card-header">
              <h2 className="prof-card-title">Student Profile</h2>
            </div>

            <div className="prof-profile-section">
              <div className="prof-avatar-wrapper">
                <div className="prof-avatar">
                  {student?.image?.url ? (
                    <img src={student.image.url} alt="Profile" />
                  ) : (
                    <TbUser />
                  )}
                </div>
              </div>

              <div className="prof-student-name">
                {student?.name ? capitalizeWords(student.name) : "-"}
              </div>
            </div>

            <div className="prof-info-grid">
              <div className="prof-info-item">
                <div className="prof-info-label">Class</div>
                <div className="prof-info-value">
                  {student?.class ? capitalizeWords(student.class) : "-"}
                </div>
              </div>

              <div className="prof-info-item">
                {student?.stream ? (
                  <>
                    <div className="prof-info-label">Stream</div>
                    <div className="prof-info-value">
                      {capitalizeWords(student.stream)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="prof-info-label">Medium</div>
                    <div className="prof-info-value">
                      {student?.medium ? capitalizeWords(student.medium) : "-"}
                    </div>
                  </>
                )}
              </div>

              <div className="prof-info-item">
                <div className="prof-info-label">Registration No</div>
                <div className="prof-info-value">
                  {student?.registrationNo || "-"}
                </div>
              </div>
            </div>
          </div>

          {/* -------- Family Details Card -------- */}
          <div className="prof-card">
            <div className="prof-card-header">
              <h2 className="prof-card-title">Family Details</h2>
            </div>

            <div className="prof-info-grid">
              <div className="prof-info-item">
                <div className="prof-info-label">Father's Name</div>
                <div className="prof-info-value">
                  {student?.fatherName ? capitalizeWords(student.fatherName) : "-"}
                </div>
              </div>

              <div className="prof-info-item">
                <div className="prof-info-label">Mother's Name</div>
                <div className="prof-info-value">
                  {student?.motherName ? capitalizeWords(student.motherName) : "-"}
                </div>
              </div>
            </div>
          </div>

          {/* -------- Address Information Card -------- */}
          <div className="prof-card">
            <div className="prof-card-header">
              <h2 className="prof-card-title">Address Information</h2>
            </div>

            <div className="prof-info-grid">
              <div className="prof-info-item">
                <div className="prof-info-label">Village</div>
                <div className="prof-info-value">
                  {student?.address?.village ? capitalizeWords(student.address.village) : "-"}
                </div>
              </div>

              <div className="prof-info-item">
                <div className="prof-info-label">Police Station</div>
                <div className="prof-info-value">
                  {student?.address?.policeStation ? capitalizeWords(student.address.policeStation) : "-"}
                </div>
              </div>

              <div className="prof-info-item">
                <div className="prof-info-label">Post Office</div>
                <div className="prof-info-value">
                  {student?.address?.postOffice ? capitalizeWords(student.address.postOffice) : "-"}
                </div>
              </div>

              <div className="prof-info-item">
                <div className="prof-info-label">District</div>
                <div className="prof-info-value">
                  {student?.address?.district ? capitalizeWords(student.address.district) : "-"}
                </div>
              </div>

              <div className="prof-info-item">
                <div className="prof-info-label">State</div>
                <div className="prof-info-value">
                  {student?.address?.state ? capitalizeWords(student.address.state) : "-"}
                </div>
              </div>

              <div className="prof-info-item">
                <div className="prof-info-label">Pincode</div>
                <div className="prof-info-value">
                  {student?.address?.pincode || "-"}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;