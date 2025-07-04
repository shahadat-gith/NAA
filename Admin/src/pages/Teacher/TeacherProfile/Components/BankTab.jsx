import React from 'react'

const BankTab = ({teacher}) => {
  return (
    <div>
        <div className="card bank-info-card">
        <h2 className="card-title">Bank Details</h2>
        <div className="card-content">
          <div className="info-table">
            <div className="info-row">
              <span className="info-label">Bank Name</span>
              <span className="info-value">{teacher.bankName || "Not provided"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Account Number</span>
              <span className="info-value">{teacher.accountNumber || "Not provided"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">IFSC Code</span>
              <span className="info-value">{teacher.ifscCode || "Not provided"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Account Holder</span>
              <span className="info-value">{teacher.accountHolderName || "Not provided"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BankTab