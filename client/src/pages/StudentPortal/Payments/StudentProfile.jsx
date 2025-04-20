import React from "react";
import { toast } from "react-toastify";
import { processPayment } from "./api";

const StudentProfile = ({
  selectedStudent,
  setSelectedStudent,
  paymentAmount,
  setPaymentAmount,
  loading,
  setLoading,
  currentConfig,
  backendUrl,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatClassName = (cls) => {
    if (/^\d+$/.test(cls)) return `Class ${cls}`;
    return cls.charAt(0).toUpperCase() + cls.slice(1);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!paymentAmount || paymentAmount <= 0) {
      toast.warn("Please enter a valid amount");
      return;
    }
    if (paymentAmount > selectedStudent[currentConfig.dueField]) {
      toast.warn("Amount cannot exceed total due");
      return;
    }

    try {
      setLoading(true);
      const updatedStudent = await processPayment(backendUrl, selectedStudent, paymentAmount, currentConfig);
      setSelectedStudent(updatedStudent);
      setPaymentAmount("");
      toast.success(`${currentConfig.title} successful!`);
    } catch (err) {
      toast.error(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const isAdmissionFeeDisabled =
    selectedStudent.isAdmissionFeesPaid &&
    (currentConfig.paymentType === "admissionfee" || currentConfig.paymentType === "hosteladmissionfee");

  return (
    <div className="student-profile">
      <h2>{`${selectedStudent.firstName} ${selectedStudent.lastName}'s Profile`}</h2>
      <div className="profile-info">
        <div className="profile-data">
          {currentConfig.profileFields.map((field) => {
            if (!selectedStudent[field] && field !== "isAdmissionFeesPaid") return null;
            return (
              <div key={field} className={`profile-field ${field === currentConfig.dueField ? "due-amount" : ""}`}>
                <span className="field-label">
                  {field === "isAdmissionFeesPaid"
                    ? "Admission Fees Paid"
                    : field === "admissionFee"
                    ? "Admission Fee"
                    : field === "hostelAdmissionFee"
                    ? "Hostel Admission Fee"
                    : field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
                  :
                </span>
                <span className="field-value">
                  {field === "class"
                    ? formatClassName(selectedStudent[field])
                    : field === "lastPaymentDate"
                    ? formatDate(selectedStudent[field])
                    : field === "isAdmissionFeesPaid"
                    ? selectedStudent[field]
                      ? "Yes"
                      : "No"
                    : field === "admissionFee" || field === "hostelAdmissionFee"
                    ? `₹${selectedStudent[field] || 0}`
                    : selectedStudent[field]}
                </span>
              </div>
            );
          })}
        </div>
        <form onSubmit={handlePayment} className="payment-form">
          <h3>Pay {currentConfig.title.split(" ")[0]} Fee</h3>
          <div className="form-group">
            <label htmlFor="payment-amount">Amount (₹):</label>
            <input
              id="payment-amount"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              min={0}
              disabled={loading || selectedStudent[currentConfig.dueField] === 0 || isAdmissionFeeDisabled}
            />
          </div>
          <button
            type="submit"
            className="pay-button"
            disabled={loading || selectedStudent[currentConfig.dueField] === 0 || isAdmissionFeeDisabled}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
          {isAdmissionFeeDisabled && (
            <p className="cleared-message">Admission fees cleared already</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;