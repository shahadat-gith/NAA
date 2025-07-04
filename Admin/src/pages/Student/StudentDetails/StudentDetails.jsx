import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AdminContext } from "../../../context/AdminContext";
import generateAdmitCard from "../utils/generateAdmitCard";
import { fetchAdmitCardConfig } from "../api";
import "./StudentDetails.css";
import DeleteConfirmPopup from "../DeleteConfirmModal/DeleteConfirmPopup";
import PaymentFormModal from "../PaymentFormModal/PaymentFormModal";
import { formatClassName } from "../utils/formatclass";

const StudentDetails = () => {
  const { state } = useLocation();
  const student = state?.student;
  const navigate = useNavigate();
  const { backendUrl, adminToken } = useContext(AdminContext);
  const [admitCardConfig, setAdmitCardConfig] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await fetchAdmitCardConfig(backendUrl, adminToken, setAdmitCardConfig);
    };
    loadData();
  }, [backendUrl, adminToken]);



  const handleGenerateAdmitCard = () => {
    if (!admitCardConfig) {
      toast.error("Admit card configuration is not available.");
      return;
    }
    generateAdmitCard(student, admitCardConfig);
  };

  // Derive payment summary from payments array
  const admissionFeePaid = student?.payments?.some(
    (p) => p.paymentType === "admissionfee" && p.status === "completed"
  );
  const hostelAdmissionFeePaid = student?.payments?.some(
    (p) => p.paymentType === "hosteladmissionfee" && p.status === "completed"
  );

  const handlePaymentSuccess = (updatedStudent) => {
    // Update the student state with the new data
    state.student = updatedStudent;
    setShowPaymentModal(false);
  };

  if (!student) {
    return <div className="naa-error">Student not found</div>;
  }

  return (
    <div className="naa-student-details">
      <h3 className="naa-student-title">{student.name}</h3>
      <div className="naa-student-summary">
        <div className="naa-summary-info">
          <div className="naa-summary-item">
            <strong>Class:</strong> {formatClassName(student.class)}
          </div>
          <div className="naa-summary-item">
            <strong>Medium:</strong> {student.medium || "N/A"}
          </div>
          <div className="naa-summary-item">
            <strong>Monthly Due:</strong> ₹{student.dues?.monthlyDue?.amount || 0}
          </div>
          <div className="naa-summary-item">
            <strong>Hostel Due:</strong> ₹{student.dues?.hostelDue?.amount || 0}
          </div>
        </div>
      </div>

      <div className="naa-details-container">
        <div className="naa-details-row">
          <div className="naa-details-column">
            <div className="naa-details-section">
              <h4>Academic Information</h4>
              <table className="naa-details-table">
                <tbody>
                  <tr>
                    <td>Class</td>
                    <td>{formatClassName(student.class)}</td>
                  </tr>
                  <tr>
                    <td>Medium</td>
                    <td>{student.medium || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Stream</td>
                    <td>{student.stream || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Registration No</td>
                    <td>{student.registrationNo || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Hostel</td>
                    <td>{student.hostel || "No"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="naa-details-column">
            <div className="naa-details-section">
              <h4>Payment Summary</h4>
              <table className="naa-details-table">
                <tbody>
                  <tr>
                    <td>Admission Fee Paid</td>
                    <td>{admissionFeePaid ? "Yes" : "No"}</td>
                  </tr>
                  <tr>
                    <td>Monthly Due</td>
                    <td>₹{student.dues?.monthlyDue?.amount || 0}</td>
                  </tr>
                  <tr>
                    <td>Hostel Admission Fee Paid</td>
                    <td>{hostelAdmissionFeePaid ? "Yes" : "No"}</td>
                  </tr>
                  <tr>
                    <td>Hostel Due</td>
                    <td>₹{student.dues?.hostelDue?.amount || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="naa-payment-history">
          <h4>Payment History</h4>
          <div className="naa-payment-btn">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="naa-record-payment-btn"
            >
              Record Payment
            </button>
          </div>
          {student.payments && student.payments.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Month</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Mode</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {student.payments
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.paymentDate).getTime() -
                      new Date(a.paymentDate).getTime()
                  )
                  .map((payment) => (
                    <tr key={payment._id}>
                      <td>{payment.paymentType}</td>
                      <td>{payment.month || "-"}</td>
                      <td>₹{payment.amount}</td>
                      <td>
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </td>
                      <td>{payment.paymentMode}</td>
                      <td>
                        <span
                          className={`naa-status-badge ${payment.status.toLowerCase()}`}
                        >
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p>No payment history available</p>
          )}
        </div>
      </div>

      <div className="naa-action-buttons">
        <button onClick={handleGenerateAdmitCard} className="naa-admit-card-btn">
          Generate Admit Card
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="naa-delete-student-btn"
        >
          Delete Student
        </button>
      </div>

      {showDeleteConfirm && (
        <DeleteConfirmPopup
          student={student}
          onConfirm={async () => {
            setShowDeleteConfirm(false);
            navigate("/students");
          }}
          onCancel={() => setShowDeleteConfirm(false)}
          backendUrl={backendUrl}
          adminToken={adminToken}
        />
      )}

      {showPaymentModal && (
        <PaymentFormModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          student={student}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default StudentDetails;