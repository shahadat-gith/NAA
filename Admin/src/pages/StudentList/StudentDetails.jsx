import React, { useState } from "react";
import CashPaymentForm from "./CashPaymentForm";
import DeleteConfirmPopup from "./DeleteConfirmPopup";
import generateAdmitCard from "./utils/generateAdmitCard";
import { toast } from "react-toastify";

const StudentDetails = ({ student, setSelectedStudent, fetchStudents, admitCardConfig, backendUrl, adminToken }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatClassName = (cls) => {
    if (/^\d+$/.test(cls)) return `Class ${cls}`;
    return cls.charAt(0).toUpperCase() + cls.slice(1);
  };

  const handleGenerateAdmitCard = () => {
    if (!admitCardConfig) {
      toast.warn("Admit card configuration is not available.");
      return;
    }
    generateAdmitCard(student, admitCardConfig);
  };

  return (
    <div className="student-details">
      <h3>
        {student.firstName} {student.lastName}
      </h3>
      <div className="student-summary">
        <div className="summary-info">
          <div className="summary-item">
            <strong>Class:</strong> {formatClassName(student.class)}
          </div>
          <div className="summary-item">
            <strong>Medium:</strong> {student.medium}
          </div>
          <div className="summary-item">
            <strong>Due:</strong> ₹{student.dueAmount || 0}
          </div>
        </div>
        <button className="toggle-details-btn" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide Details" : "Show All Details"}
        </button>
      </div>
      <div className={`details-container ${showDetails ? "show" : ""}`}>
        <div className="details-row">
          <div className="details-column">
            <div className="details-section">
              <h4>Personal Information</h4>
              <table className="details-table">
                <tbody>
                  <tr>
                    <td>Phone</td>
                    <td>{student.phone || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Gender</td>
                    <td>{student.gender || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Date of Birth</td>
                    <td>{student.dob ? new Date(student.dob).toLocaleDateString() : "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="details-section">
              <h4>Family Information</h4>
              <table className="details-table">
                <tbody>
                  <tr>
                    <td>Father's Name</td>
                    <td>{student.fatherName}</td>
                  </tr>
                  <tr>
                    <td>Parents' Occupation</td>
                    <td>{student.parentsOccupation || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Mother's Name</td>
                    <td>{student.motherName}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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
                    <td>{student.medium}</td>
                  </tr>
                  <tr>
                    <td>Stream</td>
                    <td>{student.stream || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Roll No</td>
                    <td>{student.rollNo || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="details-section">
              <h4>Payment Summary</h4>
              <table className="details-table">
                <tbody>
                  <tr>
                    <td>Admission Fee</td>
                    <td>₹{student.admissionFee || 0}</td>
                  </tr>
                  <tr>
                    <td>Due Amount</td>
                    <td>₹{student.dueAmount || 0}</td>
                  </tr>
                  <tr>
                    <td>Hostel Admission Fee</td>
                    <td>₹{student.hostelAdmissionFee || 0}</td>
                  </tr>
                  <tr>
                    <td>Hostel Due Amount</td>
                    <td>₹{student.hostelDueAmount || 0}</td>
                  </tr>
                  <tr>
                    <td>Admission Fees Paid</td>
                    <td>{student.isAdmissionFeesPaid ? "Yes" : "No"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="payment-history">
          <h4>Payment History</h4>
          {student.payments.length > 0 ? (
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
                  .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
                  .map((payment) => (
                    <tr key={payment._id}>
                      <td>{payment.paymentType}</td>
                      <td>{payment.month || "-"}</td>
                      <td>₹{payment.amount}</td>
                      <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                      <td>{payment.paymentMode}</td>
                      <td>
                        <span className={`status-badge ${payment.status.toLowerCase()}`}>
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
      <div className="action-buttons">
        <button onClick={handleGenerateAdmitCard} className="admit-card-btn">
          Generate Admit Card
        </button>
        <button onClick={() => setShowDeleteConfirm(true)} className="delete-student-btn">
          Delete Student
        </button>
      </div>
      {showDeleteConfirm && (
        <DeleteConfirmPopup
          student={student}
          onConfirm={() => {
            setShowDeleteConfirm(false);
            setSelectedStudent(null);
            fetchStudents();
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