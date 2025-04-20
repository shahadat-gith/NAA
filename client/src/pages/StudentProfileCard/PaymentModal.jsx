import React from "react";
import "./StudentProfileCard.css";

const PaymentModal = ({ modal, closeModal }) => {
  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-modal-content">
          {modal.type === "success" ? (
            <>
              <div className="payment-modal-icon success">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#00cc00" strokeWidth="2" fill="#e6ffe6" />
                  <path d="M8 12l3 3 5-6" stroke="#00cc00" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <h2>Payment Successful</h2>
              <p>{modal.message}</p>
              <p className="payment-id">Payment ID: {modal.paymentId}</p>
            </>
          ) : (
            <>
              <div className="payment-modal-icon failure">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#ff0000" strokeWidth="2" fill="#ffe6e6" />
                  <path d="M8 8l8 8M16 8l-8 8" stroke="#ff0000" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <h2>Payment Failed</h2>
              <p>{modal.message}</p>
            </>
          )}
          <button className="payment-modal-close-btn" onClick={closeModal}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;