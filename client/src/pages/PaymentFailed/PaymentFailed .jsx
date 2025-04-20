import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./PaymentFailed.css";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referenceId = searchParams.get("reference") || "N/A";
  const paymentType = searchParams.get("type") || "unknown"; // Get payment type from query params
  const reason = searchParams.get("reason") || "Unknown error"; // Optional: Get reason from query params

  // Determine the failure message based on payment type
  const getFailureMessage = () => {
    switch (paymentType) {
      case "admission":
        return (
          <>
            We're sorry, but your payment could not be processed. Your admission form has not been submitted.
            Please try again or contact our support team for assistance.
          </>
        );
      case "salary":
        return (
          <>
            We're sorry, but the salary payment could not be processed. The transaction has not been recorded.
            Please retry the payment or contact support for assistance.
          </>
        );
      default:
        return (
          <>
            We're sorry, but your payment could not be processed.
            Please try again or contact support for assistance.
          </>
        );
    }
  };

  // Adjust retry navigation based on payment type
  const handleRetry = () => {
    if (paymentType === "admission") {
      navigate("/admission-portal/admission-form");
    } else if (paymentType === "salary") {
      navigate("/teacher-profile"); // Adjust this to your teacher profile route
    } else {
      navigate("/"); // Default to home for unknown types
    }
  };

  return (
    <div className="failed-page">
      <div className="failed-container">
        <div className="failed-icon">
          <svg viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
        <h1 className="failed-title">Payment Failed</h1>
        <p className="failed-message">{getFailureMessage()}</p>
        <div className="failed-details">
          <p className="detail-item">
            <span className="detail-label">Error Reference:</span>
            <span className="detail-value">{referenceId}</span>
          </p>
          <p className="detail-item">
            <span className="detail-label">Reason:</span>
            <span className="detail-value">{reason}</span>
          </p>
          <p className="detail-item">
            <span className="detail-label">Date:</span>
            <span className="detail-value">{new Date().toLocaleDateString()}</span>
          </p>
        </div>
        <div className="button-group">
          <button className="retry-button" onClick={handleRetry}>
            Try Again
          </button>
          <button className="support-button" onClick={() => navigate("/contact")}>
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;