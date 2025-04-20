import React, { useState } from "react"; // Import useState
import generateTransactionReceipt from "./TransactionReceipt";
import { toast } from "react-toastify";
import { handleRazorpayPayment } from "./PaymentHandler";

const StudentProfileContent = ({
  activeTab,
  setActiveTab,
  student,
  transactions,
  showFullDetails,
  setShowFullDetails,
  backendUrl,
  studentToken,
  setModal,
  fetchTransactions,
}) => {
  const [isPaying, setIsPaying] = useState(false); // State to track payment loading

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const formatClassName = (classStr) => {
    return classStr
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" - ");
  };

  const handleGenerateTransactionReceipt = () => {
    if (transactions.length > 0 && transactions[0].status.toLowerCase() === "success") {
      generateTransactionReceipt(student, transactions[0]);
    } else {
      toast.warn("Please Pay your admission fees, before Downloading receipt!");
    }
  };

  const handlePaymentClick = async () => {
    setIsPaying(true); // Start loader
    try {
      await handleRazorpayPayment(student, studentToken, backendUrl, transactions, setModal, fetchTransactions);
    } finally {
      setIsPaying(false); // Stop loader regardless of success or failure
    }
  };

  const isPaymentSuccessful = transactions.length > 0 && transactions[0].status.toLowerCase() === "success";

  return (
    <div className="student-profile-content">
      <div className="student-profile-tabs">
        <button
          className={`student-tab-button ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <i className="fas fa-user"></i> Profile
        </button>
        <button
          className={`student-tab-button ${activeTab === "academic" ? "active" : ""}`}
          onClick={() => setActiveTab("academic")}
        >
          <i className="fas fa-graduation-cap"></i> Academic
        </button>
        <button
          className={`student-tab-button ${activeTab === "payment" ? "active" : ""}`}
          onClick={() => setActiveTab("payment")}
        >
          <i className="fas fa-credit-card"></i> Payment
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="student-tab-content">
          <div className="student-info-section">
            <div className="student-info-header">
              <h3>Personal Information</h3>
              <button
                className="student-toggle-details"
                onClick={() => setShowFullDetails(!showFullDetails)}
              >
                {showFullDetails ? "Hide Details" : "Show More"}
              </button>
            </div>
            <div className="student-info-grid">
              <div className="student-info-item">
                <span className="student-info-label">Full Name</span>
                <span className="student-info-value">{student.name}</span>
              </div>
              <div className="student-info-item">
                <span className="student-info-label">Email</span>
                <span className="student-info-value">{student.email}</span>
              </div>
              <div className="student-info-item">
                <span className="student-info-label">Phone</span>
                <span className="student-info-value">{student.phone || "N/A"}</span>
              </div>
              <div className="student-info-item">
                <span className="student-info-label">Gender</span>
                <span className="student-info-value">
                  {student.gender ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1) : "N/A"}
                </span>
              </div>
              <div className="student-info-item">
                <span className="student-info-label">Date of Birth</span>
                <span className="student-info-value">{student.dob ? formatDate(student.dob) : "N/A"}</span>
              </div>
              <div className="student-info-item">
                <span className="student-info-label">Address</span>
                <span className="student-info-value">{student.address || "N/A"}</span>
              </div>
              {showFullDetails && (
                <>
                  <div className="student-info-item">
                    <span className="student-info-label">District</span>
                    <span className="student-info-value">{student.district || "N/A"}</span>
                  </div>
                  <div className="student-info-item">
                    <span className="student-info-label">State</span>
                    <span className="student-info-value">{student.state || "N/A"}</span>
                  </div>
                  <div className="student-info-item">
                    <span className="student-info-label">Pincode</span>
                    <span className="student-info-value">{student.pincode || "N/A"}</span>
                  </div>
                  <div className="student-info-item">
                    <span className="student-info-label">Medium</span>
                    <span className="student-info-value">
                      {student.medium ? student.medium.charAt(0).toUpperCase() + student.medium.slice(1) : "N/A"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="student-info-section">
            <div className="student-info-header">
              <h3>Family Information</h3>
            </div>
            <div className="student-info-grid">
              <div className="student-info-item">
                <span className="student-info-label">Father's Name</span>
                <span className="student-info-value">{student.fatherName || "N/A"}</span>
              </div>
              <div className="student-info-item">
                <span className="student-info-label">Father's Occupation</span>
                <span className="student-info-value">
                  {student.fatherOccupation
                    ? student.fatherOccupation.charAt(0).toUpperCase() + student.fatherOccupation.slice(1)
                    : "N/A"}
                </span>
              </div>
              <div className="student-info-item">
                <span className="student-info-label">Mother's Name</span>
                <span className="student-info-value">{student.motherName || "N/A"}</span>
              </div>
              <div className="student-info-item">
                <span className="student-info-label">Mother's Occupation</span>
                <span className="student-info-value">
                  {student.motherOccupation
                    ? student.motherOccupation.charAt(0).toUpperCase() + student.motherOccupation.slice(1)
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "academic" && (
        <div className="student-tab-content">
          <div className="student-info-section">
            <div className="student-info-header">
              <h3>Academic Information</h3>
            </div>
            <div className="student-info-grid">
              <div className="student-info-item">
                <span className="student-info-label">Current Class</span>
                <span className="student-info-value">{formatClassName(student.class)}</span>
              </div>
              <div className="student-info-item">
                <span className="student-info-label">Previous School</span>
                <span className="student-info-value">{student.previousSchool || "N/A"}</span>
              </div>
              <div className="student-info-item">
                <span className="student-info-label">Previous Class</span>
                <span className="student-info-value">{student.previousClass || "N/A"}</span>
              </div>
              <div className="student-info-item">
                <span className="student-info-label">Medium of Instruction</span>
                <span className="student-info-value">
                  {student.medium ? student.medium.charAt(0).toUpperCase() + student.medium.slice(1) : "N/A"}
                </span>
              </div>
              <div className="student-info-item">
                <span className="student-info-label">Hostel Resident</span>
                <span className="student-info-value">{student.hostel === "yes" ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "payment" && (
        <div className="student-tab-content">
          <div className="student-payment-summary">
            <h3>Payment Summary</h3>
            <div
              className={`student-payment-badge ${transactions.length > 0 ? transactions[0].status.toLowerCase() : "pending"}`}
            >
              {transactions.length > 0 ? transactions[0].status : "Pending"}
            </div>
          </div>

          {transactions.length > 0 ? (
            <div className="student-fee-breakdown">
              <div className="student-fee-item">
                <span className="student-fee-label">Admission Fee</span>
                <span className="student-fee-value">₹{transactions[0].admissionFee || 0}</span>
              </div>
              <div className="student-fee-item">
                <span className="student-fee-label">Hostel Admission Fee</span>
                <span className="student-fee-value">₹{transactions[0].hostelAdmissionFee || 0}</span>
              </div>
              <div className="student-fee-item">
                <span className="student-fee-label">Razorpay Platform Fee (2% + GST)</span>
                <span className="student-fee-value">₹{transactions[0].razorpayFee || 0}</span>
              </div>
              <div className="student-fee-item total">
                <span className="student-fee-label">Total Amount</span>
                <span className="student-fee-value">₹{transactions[0].amount || 0}</span>
              </div>

              <div className="student-payment-action">
                <button
                  onClick={handlePaymentClick} // Use the new handler
                  className="student-action-button student-checkout-button"
                  disabled={isPaymentSuccessful || isPaying} // Disable when paying
                >
                  {isPaying ? (
                    <>
                      <span className="spinner"></span> Processing...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-credit-card"></i>
                      {isPaymentSuccessful ? "Payment Completed" : `Click to pay ₹${transactions[0].amount || 0}`}
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <p>No payment data available.</p>
          )}

          <div className="student-payment-details">
            <h3>Payment Details</h3>
            {transactions.length > 0 ? (
              <div className="student-info-grid">
                <div className="student-info-item">
                  <span className="student-info-label">Payment ID</span>
                  <span className="student-info-value">{transactions[0].paymentId || "N/A"}</span>
                </div>
                <div className="student-info-item">
                  <span className="student-info-label">Order ID</span>
                  <span className="student-info-value">{transactions[0].orderId || "N/A"}</span>
                </div>
                <div className="student-info-item">
                  <span className="student-info-label">Transaction Date</span>
                  <span className="student-info-value">
                    {transactions[0].transactionDate ? formatDate(transactions[0].transactionDate) : "N/A"}
                  </span>
                </div>
                <div className="student-info-item">
                  <span className="student-info-label">Payment Method</span>
                  <span className="student-info-value">Online (Razorpay)</span>
                </div>
                <div className="student-info-item">
                  <span className="student-info-label">Status</span>
                  <span className={`student-transaction-status ${transactions[0].status.toLowerCase()}`}>
                    {transactions[0].status}
                  </span>
                </div>
              </div>
            ) : (
              <p>No transaction details available.</p>
            )}
          </div>

          <div className="download-receipt-btn">
            <button
              onClick={handleGenerateTransactionReceipt}
              className="student-download-receipt student-action-button"
            >
              <i className="fas fa-download"></i> Download Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfileContent;