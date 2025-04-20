import React, { useState } from "react";
import { toast } from "react-toastify";
import { recordCashPayment } from "./api";

const CashPaymentForm = ({ student, setStudent, fetchStudents, backendUrl, adminToken }) => {
  const [cashAmount, setCashAmount] = useState("");
  const [paymentType, setPaymentType] = useState("monthlyfee");

  const handleRecordCashPayment = async () => {
    if (!cashAmount || cashAmount <= 0) {
      toast.warn("Please enter a valid cash payment amount");
      return;
    }
    const dueField = paymentType.includes("hostel") ? "hostelDueAmount" : "dueAmount";
    if (cashAmount > student[dueField]) {
      toast.warn(`Cash payment cannot exceed due amount for ${paymentType}`);
      return;
    }

    const updatedStudent = await recordCashPayment(
      backendUrl,
      adminToken,
      student,
      cashAmount,
      paymentType,
      fetchStudents
    );
    setStudent(updatedStudent);
    setCashAmount("");
  };

  const isAdmissionFeeDisabled = student.isAdmissionFeesPaid && ["admissionfee", "hosteladmissionfee"].includes(paymentType);

  return (
    <div className="cash-payment-section">
      <h4>Record Cash Payment</h4>
      <select
        value={paymentType}
        onChange={(e) => setPaymentType(e.target.value)}
        disabled={student.isAdmissionFeesPaid} // Disable entire select if admission fees are paid
      >
        <option value="admissionfee" disabled={student.isAdmissionFeesPaid}>
          Admission Fee
        </option>
        {student.hostel === "Yes" && (
          <option value="hosteladmissionfee" disabled={student.isAdmissionFeesPaid}>
            Hostel Admission Fee
          </option>
        )}
        <option value="monthlyfee">Monthly Fee</option>
        {student.hostel === "Yes" && <option value="hostelmonthlyfee">Hostel Monthly Fee</option>}
      </select>
      <input
        type="number"
        value={cashAmount}
        onChange={(e) => setCashAmount(e.target.value)}
        placeholder="Enter cash amount"
        min="0"
        disabled={student.dueAmount + student.hostelDueAmount === 0 || isAdmissionFeeDisabled}
      />
      <button
        onClick={handleRecordCashPayment}
        className="record-fee-btn"
        disabled={
          student.dueAmount + student.hostelDueAmount === 0 ||
          !cashAmount ||
          cashAmount <= 0 ||
          isAdmissionFeeDisabled
        }
      >
        Record Cash Payment
      </button>
      {student.isAdmissionFeesPaid && (
        <p className="cleared-message">Admission fees cleared already</p>
      )}
    </div>
  );
};

export default CashPaymentForm;