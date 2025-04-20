import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referenceId = searchParams.get("reference") || "N/A";
  const paymentType = searchParams.get("type") || "unknown"; // Get payment type from query params

  // Determine the success message based on payment type
  const getSuccessMessage = () => {
    switch (paymentType) {
      case "admission":
        return (
          <>
            Your admission form has been submitted successfully, and it is under process.
            We will soon share the admission confirmation notification via email.
          </>
        );
      case "salary":
        return (
          <>
            The salary payment has been successfully recorded.
            Thank you for your service! A confirmation will be sent to the teacher's email.
          </>
        );
      default:
        return (
          <>
            Your payment has been successfully processed.
            Please contact support if you have any questions.
          </>
        );
    }
  };

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="success-icon">
          <svg viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        </div>
        <h1 className="confirmation-title">Payment Successful!</h1>
        <p className="confirmation-message">{getSuccessMessage()}</p>
        <div className="confirmation-details">
          <p className="detail-item">
            <span className="detail-label">Reference ID:</span>
            <span className="detail-value">{referenceId}</span>
          </p>
          <p className="detail-item">
            <span className="detail-label">Date:</span>
            <span className="detail-value">{new Date().toLocaleDateString()}</span>
          </p>
        </div>
        <button className="home-button" onClick={() => navigate("/")}>
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;