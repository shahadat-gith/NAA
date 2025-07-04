import React, { useState, useContext } from "react";
import { toast } from "react-hot-toast";
import { AdminContext } from "../../../context/AdminContext";
import { recordCashPayment } from "../api";
import "./PaymentFormModal.css";

const PaymentFormModal = ({ isOpen, onClose, student, onPaymentSuccess }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const [cashAmount, setCashAmount] = useState("");
  const [paymentType, setPaymentType] = useState("monthlyfee");
  const [loading, setLoading] = useState(false);

  const handleRecordCashPayment = async () => {
    const amount = parseInt(cashAmount);
    if (!cashAmount || isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid cash payment amount");
      return;
    }
    const dueField = paymentType.includes("hostel") ? "dues.hostelDue.amount" : "dues.monthlyDue.amount";
    const dueAmount = paymentType.includes("hostel") ? student.dues?.hostelDue?.amount || 0 : student.dues?.monthlyDue?.amount || 0;
    if (amount > dueAmount) {
      toast.error(`Cash payment cannot exceed due amount for ${paymentType}`);
      return;
    }

    try {
      const updatedStudent = await recordCashPayment(
        backendUrl,
        adminToken,
        student,
        amount,
        paymentType,
        () => {}, // Placeholder for fetchStudents, handled by parent
        setLoading
      );
      setCashAmount("");
      setPaymentType("monthlyfee");
      onPaymentSuccess(updatedStudent); // Notify parent of updated student
      onClose();
    } catch (err) {
      console.error("Error recording payment:", err);
    }
  };

  const admissionFeePaid = student?.payments?.some(
    (p) => p.paymentType === "admissionfee" && p.status === "completed"
  );
  const hostelAdmissionFeePaid = student?.payments?.some(
    (p) => p.paymentType === "hosteladmissionfee" && p.status === "completed"
  );
  const isAdmissionFeeDisabled = (paymentType === "admissionfee" && admissionFeePaid) || 
                                 (paymentType === "hosteladmissionfee" && hostelAdmissionFeePaid);

  if (!isOpen) return null;

  return (
    <div className="naa-modal-overlay" onClick={onClose}>
      <div className="naa-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="naa-modal-header">
          <div className="naa-modal-title">
            <div className="naa-payment-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-9H9v2h6v-2z" fill="currentColor"/>
              </svg>
            </div>
            <h2>Record Cash Payment</h2>
          </div>
          <button className="naa-close-button" onClick={onClose} aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="naa-modal-content">
          <div className="naa-form-section">
            <div className="naa-form-group">
              <label htmlFor="payment-type">Payment Type</label>
              <select
                id="payment-type"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                disabled={loading}
              >
                <option value="admissionfee" disabled={admissionFeePaid}>
                  Admission Fee
                </option>
                {student.hostel === "Yes" && (
                  <option value="hosteladmissionfee" disabled={hostelAdmissionFeePaid}>
                    Hostel Admission Fee
                  </option>
                )}
                <option value="monthlyfee">Monthly Fee</option>
                {student.hostel === "Yes" && <option value="hostelmonthlyfee">Hostel Monthly Fee</option>}
              </select>
            </div>
            <div className="naa-form-group">
              <label htmlFor="cash-amount">Cash Amount</label>
              <div className="naa-input-with-icon">
                <svg className="naa-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-9H9v2h6v-2z" fill="currentColor"/>
                </svg>
                <input
                  type="text"
                  id="cash-amount"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Enter cash amount"
                  disabled={(student.dues?.monthlyDue?.amount || 0) + (student.dues?.hostelDue?.amount || 0) === 0 || isAdmissionFeeDisabled || loading}
                />
              </div>
            </div>
            {(admissionFeePaid || hostelAdmissionFeePaid) && (
              <p className="naa-cleared-message">
                {admissionFeePaid && hostelAdmissionFeePaid ? "Admission and hostel admission fees cleared" : 
                 admissionFeePaid ? "Admission fee cleared" : "Hostel admission fee cleared"}
              </p>
            )}
          </div>
          <div className="naa-form-actions">
            <button
              onClick={handleRecordCashPayment}
              className="naa-submit-btn"
              disabled={
                (student.dues?.monthlyDue?.amount || 0) + (student.dues?.hostelDue?.amount || 0) === 0 ||
                !cashAmount ||
                parseInt(cashAmount) <= 0 ||
                isAdmissionFeeDisabled ||
                loading
              }
            >
              {loading ? (
                "processing..."
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-9H9v2h6v-2z" fill="currentColor"/>
                  </svg>
                  Record Cash Payment
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="naa-cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFormModal;