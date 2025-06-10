import React, { useState } from "react";
import CashPaymentForm from "./CashPaymentForm";
import DeleteConfirmPopup from "./DeleteConfirmPopup";
import generateAdmitCard from "./utils/generateAdmitCard";
import { toast } from "react-hot-toast";

const StudentDetails = ({
  student,
  setSelectedStudent,
  fetchStudents,
  admitCardConfig,
  backendUrl,
  adminToken,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatClassName = (cls) => {
    if (/^\d+$/.test(cls)) return `Class ${cls}`;
    return cls.charAt(0).toUpperCase() + cls.slice(1);
  };

  const handleGenerateAdmitCard = () => {
    if (!admitCardConfig) {
      toast.error("Admit card configuration is not available.");
      return;
    }
    generateAdmitCard(student, admitCardConfig);
  };

  // Derive payment summary from payments array
  const admissionFeePaid = student.payments.some((p) => p.paymentType === "admissionfee" && p.status === "completed");
  const hostelAdmissionFeePaid = student.payments.some(
    (p) => p.paymentType === "hosteladmissionfee" && p.status === "completed"
  );

  return (
    <div className="student-details">
      <h3>{student.name}</h3>
      <div className="student-summary">
        <div className="summary-info">
          <div className="summary-item">
            <strong>Class:</strong> {formatClassName(student.class)}
          </div>
          <div className="summary-item">
            <strong>Medium:</strong> {student.medium || "N/A"}
          </div>
          <div className="summary-item">
            <strong>Monthly Due:</strong> ₹{student.dues?.monthlyDue?.amount || 0}
          </div>
          <div className="summary-item">
            <strong>Hostel Due:</strong> ₹{student.dues?.hostelDue?.amount || 0}
          </div>
        </div>
        <button
          className="toggle-details-btn"
          onClick={() => setShowDetails((prev) => !prev)}
        >
          {showDetails ? "Hide Details" : "Show All Details"}
        </button>
      </div>

      {showDetails && (
        <div className="details-container show">
          <div className="details-row">
            <div className="details-column">
              <div className="details-section">
                <h4>Academic Information</h4>
                <table className="details-table">
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
            <div className="details-column">
              <div className="details-section">
                <h4>Payment Summary</h4>
                <table className="details-table">
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

          <div className="payment-history">
            <h4>Payment History</h4>
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
                            className={`status-badge ${payment.status.toLowerCase()}`}
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

          <CashPaymentForm
            student={student}
            setStudent={setSelectedStudent}
            fetchStudents={fetchStudents}
            backendUrl={backendUrl}
            adminToken={adminToken}
          />
        </div>
      )}

      <div className="action-buttons">
        <button onClick={handleGenerateAdmitCard} className="admit-card-btn">
          Generate Admit Card
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="delete-student-btn"
        >
          Delete Student
        </button>
      </div>

      {showDeleteConfirm && (
        <DeleteConfirmPopup
          student={student}
          onConfirm={async () => {
            setShowDeleteConfirm(false);
            setSelectedStudent(null);
            await fetchStudents();
          }}
          onCancel={() => setShowDeleteConfirm(false)}
          backendUrl={backendUrl}
          adminToken={adminToken}
        />
      )}
    </div>
  );
};

export default StudentDetails;