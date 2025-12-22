import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { generateReceipt } from "./generateReceipt";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { payment, student } = location.state || {};

  if (!payment || !student) {
    toast.error("Invalid payment data");
    navigate("/portal");
    return null;
  }

  const handleDownloadReceipt = () => {
    const success = generateReceipt(payment, student);
    if (success) {
      toast.success("Receipt downloaded successfully!");
    } else {
      toast.error("Failed to generate receipt. Please try again.");
    }
  };

  return (
    <div className="payment-success-page">
      <div className="payment-success-container">
        {/* Success Icon & Header */}
        <div className="success-header">
          <div className="success-icon-wrapper">
            <i className="fas fa-check-circle success-icon"></i>
          </div>
          <h1 className="success-title">Payment Successful!</h1>
          <p className="success-subtitle">
            Your payment has been processed successfully
          </p>
        </div>

         {/* ACTION BUTTONS */}
        <div className="success-actions" style={{marginBottom:"30px"}}>
          <button className="success-btn primary" onClick={handleDownloadReceipt}>
            <i className="fas fa-download"></i>
            <span>Download Receipt</span>
          </button>

          <button
            className="success-btn secondary"
            onClick={() => navigate("/")}
          >
            <i className="fas fa-home"></i>
            <span>Go to Home page</span>
          </button>
        </div>

        {/* STUDENT DETAILS CARD */}
        <div className="info-card">
          <div className="card-header">
            <h2>
              <i className="fas fa-user"></i> Student Details
            </h2>
          </div>
          <div className="card-body">
            <div className="info-row">
              <span className="info-label">Name</span>
              <span className="info-value">{student.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Registration No</span>
              <span className="info-value registration-no">
                {student.registrationNo}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Class</span>
              <span className="info-value">{student.class}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Medium</span>
              <span className="info-value capitalize">{student.medium}</span>
            </div>
            {student.stream && (
              <div className="info-row">
                <span className="info-label">Stream</span>
                <span className="info-value capitalize">{student.stream}</span>
              </div>
            )}
          </div>
        </div>

        {/* PAYMENT DETAILS CARD */}
        <div className="info-card payment-details-card">
          <div className="card-header">
            <h2>
              <i className="fas fa-receipt"></i> Payment Details
            </h2>
          </div>
          <div className="card-body">
            <div className="info-row">
              <span className="info-label">Fee Type</span>
              <span className="info-value capitalize fee-type">
                {payment.feeType.replace(/([A-Z])/g, " $1").trim()}
              </span>
            </div>
            {payment.month && (
              <div className="info-row">
                <span className="info-label">Month</span>
                <span className="info-value">{payment.month}</span>
              </div>
            )}
            <div className="info-row">
              <span className="info-label">Academic Session</span>
              <span className="info-value">{payment.academicSession}</span>
            </div>
            <div className="info-row highlight">
              <span className="info-label">Amount Paid</span>
              <span className="info-value amount">₹{payment.amount}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Payment Mode</span>
              <span className="info-value capitalize">
                {payment.paymentMode}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Transaction ID</span>
              <span className="info-value transaction-id">
                {payment.razorpayPaymentId}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Paid On</span>
              <span className="info-value">
                {new Date(payment.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default PaymentSuccess;