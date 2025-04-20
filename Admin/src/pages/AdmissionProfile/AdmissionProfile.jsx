import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import "./AdmissionProfile.css";
import { AppContext } from "../../context/AppContext";
import { AdminContext } from "../../context/AdminContext";
import generateFeeReceipt from "./utils/generateFeeReceipt";

const AdmissionProfile = () => {
  const { adminToken } = useContext(AdminContext);
  const { backendUrl } = useContext(AppContext);
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCashModal, setShowCashModal] = useState(false);
  const [cashAmount, setCashAmount] = useState("");
  const [paymentType, setPaymentType] = useState("admissionfee");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/students/${id}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        if (response.data.success) {
          console.log("Fetched student:", response.data.data);
          setStudent(response.data.data);
          setCashAmount(response.data.data.dueAmount > 0 ? response.data.data.dueAmount.toString() : "");
        } else {
          toast.error("Failed to fetch student data");
          navigate("/admin/admissions");
        }
      } catch (error) {
        toast.error("Error fetching student: " + error.message);
        navigate("/admin/admissions");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, backendUrl, navigate, adminToken]);

  const handleCashPayment = async () => {
    if (!student) return;

    const amount = parseFloat(cashAmount);
    if (!amount || amount <= 0) {
      toast.warn("Please enter a valid amount");
      return;
    }
    const dueField = paymentType.includes("hostel") ? "hostelDueAmount" : "dueAmount";
    if (amount > student[dueField]) {
      toast.warn(`Amount cannot exceed the due amount for ${paymentType}`);
      return;
    }

    const cashPaymentPromise = axios.post(
      `${backendUrl}/api/students/payment`,
      {
        studentId: student._id,
        amount,
        paymentType,
        month: paymentType.includes("monthly") ? `${new Date().toLocaleString("default", { month: "long" })} ${new Date().getFullYear()}` : undefined,
        paymentMode: "cash",
      },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    toast.promise(cashPaymentPromise, {
      pending: "Recording cash payment...",
      success: {
        render({ data }) {
          if (data.data.success) {
            setStudent((prev) => ({
              ...prev,
              [dueField]: Math.max(0, prev[dueField] - amount),
              payments: [...prev.payments, data.data.data.transaction],
              admissionStatus: prev.dueAmount + prev.hostelDueAmount - amount === 0 ? "Approved" : prev.admissionStatus,
            }));
            closeCashModal();
            return "Cash payment recorded successfully";
          }
          return "Failed to record cash payment";
        },
      },
      error: {
        render({ data }) {
          return `Error recording cash payment: ${data?.response?.data?.message || "Unknown error"}`;
        },
      },
    });
  };

  const openCashModal = () => setShowCashModal(true);

  const closeCashModal = () => {
    setShowCashModal(false);
    setCashAmount(student?.dueAmount > 0 ? student.dueAmount.toString() : "");
    setPaymentType("admissionfee");
  };

  const downloadReceipt = (transaction) => {
    if (!student || !transaction) return;
    const studentData = {
      firstName: student.firstName,
      lastName: student.lastName,
      guardianContact: student.guardianContact,
    };
    const feeType = transaction.paymentType === "admissionfee" ? "Admission Fee" : 
                    transaction.paymentType === "hosteladmissionfee" ? "Hostel Admission Fee" : 
                    transaction.paymentType === "monthlyfee" ? "Monthly Fee" : "Hostel Monthly Fee";
    generateFeeReceipt(studentData, transaction, feeType);
  };

  if (loading) {
    return (
      <div className="admission-loading">
        <div className="spinner"></div>
        <p>Loading student information...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="admission-not-found">
        <h2>Student Not Found</h2>
        <p>The requested student profile could not be found.</p>
        <button onClick={() => navigate("/admin/admissions")} className="back-btn">
          Return to Admissions
        </button>
      </div>
    );
  }

  return (
    <div className="admission-profile-container">
      {showCashModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Record Cash Payment</h3>
            <p>
              Enter the cash payment amount for{" "}
              <strong>{`${student.firstName} ${student.lastName}`}</strong>.
            </p>
            <p>Due Amount: ₹{student.dueAmount}</p>
            <p>Hostel Due Amount: ₹{student.hostelDueAmount}</p>
            <div className="modal-input">
              <label>Payment Type:</label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
              >
                <option value="admissionfee">Admission Fee</option>
                {student.hostel === "Yes" && <option value="hosteladmissionfee">Hostel Admission Fee</option>}
                <option value="monthlyfee">Monthly Fee</option>
                {student.hostel === "Yes" && <option value="hostelmonthlyfee">Hostel Monthly Fee</option>}
              </select>
            </div>
            <div className="modal-input">
              <label>Amount (₹):</label>
              <input
                type="number"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                min="0"
                placeholder="Enter amount"
              />
            </div>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={closeCashModal}>
                Cancel
              </button>
              <button className="delete-confirm-btn" onClick={handleCashPayment}>
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="profile-content">
        <div className="profile-main">
          <div className="profile-container-admission">
            <div className="profile-image-admission">
              {student.image ? (
                <img src={`${backendUrl}/${student.image}`} alt={`${student.firstName}'s profile`} />
              ) : (
                <div className="profile-image-placeholder">
                  {student.firstName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="profile-name-details">
              <h2>{`${student.firstName} ${student.lastName}`}</h2>
              <button
                onClick={openCashModal}
                className="action-btn cash-btn"
                disabled={student.dueAmount + student.hostelDueAmount <= 0}
              >
                Record Cash Payment
              </button>
            </div>
          </div>

          <div className="profile-section">
            <h3 className="profile-heading">Personal Information</h3>
            <div className="card">
              <table className="admission-info-table">
                <thead>
                  <tr>
                    <th>Guardian Contact</th>
                    <th>Gender</th>
                    <th>Date of Birth</th>
                    <th>Hostel</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{student.guardianContact}</td>
                    <td>{student.gender}</td>
                    <td>{new Date(student.dob).toLocaleDateString()}</td>
                    <td>{student.hostel}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="profile-sections">
          <div className="profile-section">
            <h3>Family Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Father's Name</span>
                <span className="info-value">{student.fatherName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Father's Occupation</span>
                <span className="info-value">{student.parentsOccupation}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Guardian Contact</span>
                <span className="info-value">{student.guardianContact}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Mother's Name</span>
                <span className="info-value">{student.motherName}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Address Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">District</span>
                <span className="info-value">{student.district}</span>
              </div>
              <div className="info-item">
                <span className="info-label">State</span>
                <span className="info-value">{student.state}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Pincode</span>
                <span className="info-value fee-total">{student.pincode}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Complete Address</span>
                <span className="info-value">{student.address || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Academic Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Class Applying for</span>
                <span className="info-value">{student.class}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Medium</span>
                <span className="info-value">{student.medium}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Payment Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Admission Fee</span>
                <span className="info-value">₹{student.admissionFee || "0"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Hostel Admission Fee</span>
                <span className="info-value">₹{student.hostelAdmissionFee || "0"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Total Due</span>
                <span className="info-value fee-total">₹{student.dueAmount + student.hostelDueAmount || "0"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Payment Amount</span>
                <span className="info-value">
                  ₹{student.payments.length > 0 ? student.payments[0].amount || "0" : "0"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Payment Date</span>
                <span className="info-value">
                  {student.lastPaymentDate ? new Date(student.lastPaymentDate).toLocaleString() : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Transaction History</h3>
            {student.payments.length > 0 ? (
              <div className="card">
                <table className="transaction-history-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Mode</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.payments
                      .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
                      .map((transaction) => (
                        <tr key={transaction._id}>
                          <td>{transaction.paymentType}</td>
                          <td>₹{transaction.amount}</td>
                          <td>{transaction.paymentMode}</td>
                          <td>{new Date(transaction.paymentDate).toLocaleString()}</td>
                          <td>
                            <span className={`status-badge ${transaction.status.toLowerCase()}`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => downloadReceipt(transaction)}
                              className="action-btn download-btn"
                              disabled={transaction.status !== "completed"}
                            >
                              Download Receipt
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No transaction history available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionProfile;