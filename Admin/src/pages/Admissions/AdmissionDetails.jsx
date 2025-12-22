import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import toast from "react-hot-toast";
import "./AdmissionDetails.css";
import Loader from "../../components/Loader/Loader";

const AdmissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [loading, setLoading] = useState(false);
  const [admission, setAdmission] = useState(null);
  const [dues, setDues] = useState([]);
  const [payments, setPayments] = useState([]);

  /* ===== MODAL STATE ===== */
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [registrationNo, setRegistrationNo] = useState("");

  useEffect(() => {
    fetchAdmissionDetails();
    // eslint-disable-next-line
  }, []);

  const fetchAdmissionDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/student/admission-data`,
        {
          params: { id },
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      if (!data.success) {
        toast.error("Failed to load admission details");
        return;
      }

      setAdmission(data.admission);
      setDues(data.dues || []);
      setPayments(data.payments || []);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching admission details");
    } finally {
      setLoading(false);
    }
  };

  /* ===== VERIFY + ASSIGN REG NO ===== */
  const handleVerifySubmit = async () => {
    if (!registrationNo.trim()) {
      toast.error("Registration number is required");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/student/verify-admission`,
        {
          admissionId: id,
          studentId: admission.student._id || admission.student,
          registrationNo,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (!data.success) {
        toast.error(data.message || "Failed to verify admission");
        return;
      }

      toast.success("Admission verified successfully");
      await fetchAdmissionDetails();
      setShowVerifyModal(false);
      setRegistrationNo("");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Error verifying admission"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===== ACCEPT CASH PAYMENT (PLACEHOLDER) ===== */
  const handleCashPayment = () => {
    // TODO: API → accept cash payment
    toast.success("Accept cash payment clicked");
  };

  if (loading) {
    return <Loader text="Fetching admission details..." />;
  }

  if (!admission) {
    return <div className="loading-text">No admission found</div>;
  }

  const { student } = admission;

  return (
    <div className="admission-details-page">
      {/* ================= HEADER & ACTIONS ================= */}
      <div className="page-header">
        <h2>Admission Details</h2>

        <div className="admin-actions">
          <button
            className="action-btn verify"
            onClick={() => setShowVerifyModal(true)}
          >
            {admission.status !== "verified"
              ? "Verify Admission"
              : "Update Reg No"}
          </button>

          <button
            className="action-btn assign"
            onClick={handleCashPayment}
          >
            Accept Cash Payment
          </button>

          <button
            className="action-btn delete"
            onClick={() => toast("deleteAdmission() called")}
          >
            Delete Admission
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
          <div><span className="label">Name</span><span className="value">{student.name}</span></div>
          <div><span className="label">Registration No</span><span className="value">{student.registrationNo || "—"}</span></div>
          <div><span className="label">Class</span><span className="value">{student.class}</span></div>
          <div><span className="label">Medium</span><span className="value">{student.medium}</span></div>
          {student.stream && (
            <div><span className="label">Stream</span><span className="value">{student.stream}</span></div>
          )}
        </div>
      </div>

      {/* ================= ADMISSION INFO ================= */}
      <div className="details-card">
        <h3>Admission Information</h3>
        <div className="details-grid">
          <div><span className="label">Academic Session</span><span className="value">{admission.academicSession}</span></div>
          <div>
            <span className="label">Status</span>
            <span className={`badge ${admission.status}`}>{admission.status}</span>
          </div>
          <div>
            <span className="label">Admission Fee Paid</span>
            <span className={`badge ${admission.isAdmissionFeePaid ? "paid" : "unpaid"}`}>
              {admission.isAdmissionFeePaid ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>

      {/* ================= DUES TABLE ================= */}
      <div className="details-card">
        <h3>Dues</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {dues.length === 0 ? (
              <tr>
                <td colSpan="2" className="empty-cell">No dues found</td>
              </tr>
            ) : (
              dues.map((d) => (
                <tr key={d._id}>
                  <td>{d.type}</td>
                  <td>{d.dueAmount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAYMENTS TABLE ================= */}
      <div className="details-card">
        <h3>Payments</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Fee Type</th>
              <th>Amount (₹)</th>
              <th>Mode</th>
              <th>Transaction ID</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-cell">No payments found</td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p._id}>
                  <td>{p.feeType}</td>
                  <td>{p.amount}</td>
                  <td>{p.paymentMode}</td>
                  <td>{p.razorpayPaymentId}</td>
                  <td>{new Date(p.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= VERIFY MODAL ================= */}
      {showVerifyModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{admission.status !== "verified" ? "Verify Admission" : "Update Registration No" }</h3>

            <label className="modal-label">Assign Registration Number</label>
            <input
              type="text"
              className="modal-input"
              value={registrationNo}
              onChange={(e) => setRegistrationNo(e.target.value)}
              placeholder="Enter registration number"
            />

            <div className="modal-actions">
              <button className="action-btn verify" onClick={handleVerifySubmit}>
                Verify & Save
              </button>
              <button
                className="action-btn back"
                onClick={() => setShowVerifyModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionDetails;
