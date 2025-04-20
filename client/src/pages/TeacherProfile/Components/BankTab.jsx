import React from "react";
import Loader from "../../../components/Loader/Loader"; // Import Loader

const BankTab = ({ bankDetails, handleBankInputChange, handleBankDetailsUpdate, isUpdatingBank }) => {
  return (
    <div className="teacher-tab-content">
      {isUpdatingBank && <Loader message="Updating bank details..." />}
      <div className="teacher-bank-section">
        <h3>Bank Details</h3>
        <form className="teacher-bank-form" onSubmit={handleBankDetailsUpdate}>
          <div className="teacher-info-item">
            <label className="teacher-info-label">Bank Name</label>
            <input
              type="text"
              name="bankName"
              value={bankDetails.bankName}
              onChange={handleBankInputChange}
              className="teacher-input"
              placeholder="Enter bank name"
              required
            />
          </div>
          <div className="teacher-info-item">
            <label className="teacher-info-label">Account Number</label>
            <input
              type="text"
              name="accountNumber"
              value={bankDetails.accountNumber}
              onChange={handleBankInputChange}
              className="teacher-input"
              placeholder="Enter account number"
              required
            />
          </div>
          <div className="teacher-info-item">
            <label className="teacher-info-label">IFSC Code</label>
            <input
              type="text"
              name="ifscCode"
              value={bankDetails.ifscCode}
              onChange={handleBankInputChange}
              className="teacher-input"
              placeholder="Enter IFSC code (e.g., ABCD1234567)"
              required
            />
          </div>
          <div className="teacher-info-item">
            <label className="teacher-info-label">Account Holder Name</label>
            <input
              type="text"
              name="accountHolderName"
              value={bankDetails.accountHolderName}
              onChange={handleBankInputChange}
              className="teacher-input"
              placeholder="Enter account holder name"
              required
            />
          </div>
          <button type="submit" className="teacher-action-button" disabled={isUpdatingBank}>
            {isUpdatingBank ? "Updating..." : "Update Bank Details"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BankTab;