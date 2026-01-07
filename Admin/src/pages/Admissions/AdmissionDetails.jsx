import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import toast from "react-hot-toast";
import "./AdmissionDetails.css";
import Loader from "../../components/Loader/Loader";
import VerifyAdmissionModal from "./VerifyAdmissionModal";

const AdmissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [loading, setLoading] = useState(false);
  const [admission, setAdmission] = useState(null);

  /* ===== VERIFY MODAL ===== */
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  useEffect(() => {
    fetchAdmissionDetails();
    // eslint-disable-next-line
  }, []);

  /* ================= FETCH ADMISSION ================= */
  const fetchAdmissionDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${backendUrl}/api/admission/single/${id}`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (res.data?.success) {
        setAdmission(res.data.admission);
      } else {
        toast.error("Admission not found");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching admission details");
    } finally {
      setLoading(false);
    }
  };



  if (loading) return <Loader text="Fetching admission details..." />;
  if (!admission) return <div className="loading-text">No admission found</div>;

  return (
    <div className="admission-details-page">
      {/* ================= HEADER ================= */}
      <div className="page-header">
        <h2>Admission Details</h2>

        <div className="admin-actions">
          <button
            className="action-btn verify"
            onClick={() => setShowVerifyModal(true)}
          >
            Verify Admission
          </button>

          <button
            className="action-btn back"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>

      {/* ================= STUDENT INFO ================= */}
      <div className="details-card">
        <h3>Student Information</h3>
        <div className="details-grid">
          <div><span className="label">Name</span><span className="value">{admission.name || "N/A"}</span></div>
          <div><span className="label">Father Name</span><span className="value">{admission.fatherName || "N/A"}</span></div>
          <div><span className="label">Mother Name</span><span className="value">{admission.motherName || "N/A"}</span></div>
          <div><span className="label">DOB</span><span className="value">{admission.dob || "N/A"}</span></div>
          <div><span className="label">Gender</span><span className="value">{admission.gender || "N/A"}</span></div>
          <div><span className="label">Phone</span><span className="value">{admission.phone || "N/A"}</span></div>
          <div><span className="label">Aadhar</span><span className="value">{admission.aadhar || "N/A"}</span></div>
          <div><span className="label">PEN</span><span className="value">{admission.pen || "N/A"}</span></div>
        </div>
      </div>

      {/* ================= ACADEMIC INFO ================= */}
      <div className="details-card">
        <h3>Academic Information</h3>
        <div className="details-grid">
          <div><span className="label">Class</span><span className="value">{admission.class || "N/A"}</span></div>
          <div><span className="label">Medium</span><span className="value">{admission.medium || "N/A"}</span></div>
          <div><span className="label">Stream</span><span className="value">{admission.stream || "N/A"}</span></div>
        </div>
      </div>

      {/* ================= ADDRESS ================= */}
      <div className="details-card">
        <h3>Address Details</h3>
        <div className="details-grid">
          <div><span className="label">Village</span><span className="value">{admission.address?.village || "N/A"}</span></div>
          <div><span className="label">Post Office</span><span className="value">{admission.address?.postOffice || "N/A"}</span></div>
          <div><span className="label">Police Station</span><span className="value">{admission.address?.policeStation || "N/A"}</span></div>
          <div><span className="label">District</span><span className="value">{admission.address?.district || "N/A"}</span></div>
          <div><span className="label">State</span><span className="value">{admission.address?.state || "N/A"}</span></div>
          <div><span className="label">Pincode</span><span className="value">{admission.address?.pincode || "N/A"}</span></div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      <VerifyAdmissionModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        admissionId={id}
      />
    </div>
  );
};

export default AdmissionDetails;
