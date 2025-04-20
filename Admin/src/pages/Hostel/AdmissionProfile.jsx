import React from "react";

const AdmissionProfile = ({
  selectedAdmission,
  paymentAmount,
  setPaymentAmount,
  handleCashPayment,
  loading,
  setSelectedAdmission,
}) => {
  return (
    <div className="card profile-card">
      <div className="card-header">
        <h3>{`${selectedAdmission.firstName} ${selectedAdmission.lastName}`}'s Profile</h3>
      </div>
      <div className="card-body">
        <div className="profile-details">
          <div className="detail-row">
            <div className="detail-item">
              <span className="label">Phone:</span>
              <span className="value">{selectedAdmission.phone}</span>
            </div>
            <div className="detail-item">
              <span className="label">Due Amount:</span>
              <span className="value due-amount">₹{selectedAdmission.hostelDueAmount || 0}</span>
            </div>
          </div>

          <div className="detail-section">
            <h4>Family Information</h4>
            <div className="detail-row">
              <div className="detail-item">
                <span className="label">Father's Name:</span>
                <span className="value">{selectedAdmission.fatherName}</span>
              </div>
              <div className="detail-item">
                <span className="label">Mother's Name:</span>
                <span className="value">{selectedAdmission.motherName}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-section">
          <h4>Record Cash Payment</h4>
          <form onSubmit={(e) => handleCashPayment(e, selectedAdmission._id)} className="payment-form">
            <div className="form-group">
              <label>Amount (₹):</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                min={0}
                disabled={loading || (selectedAdmission.hostelDueAmount || 0) === 0}
                placeholder="Enter payment amount"
              />
            </div>
            <button
              type="submit"
              disabled={loading || (selectedAdmission.hostelDueAmount || 0) === 0}
              className={(selectedAdmission.hostelDueAmount || 0) === 0 ? "btn-disabled" : "btn-success"}
            >
              {loading ? "Processing..." : (selectedAdmission.hostelDueAmount || 0) === 0 ? "No Payment Due" : "Record Cash Payment"}
            </button>
          </form>
        </div>

        <button onClick={() => setSelectedAdmission(null)} className="btn-warning" style={{ marginTop: "10px" }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AdmissionProfile;