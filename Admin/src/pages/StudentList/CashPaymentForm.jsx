// frontend: CashPaymentForm.js
import React, { useState } from "react";
import toast from 'react-hot-toast';
import { recordCashPayment } from "./api";

const CashPaymentForm = ({ student, setStudent, fetchStudents, backendUrl, adminToken }) => {
  const [cashAmount, setCashAmount] = useState("");
  const [paymentType, setPaymentType] = useState("monthlyfee");
  const [loading, setLoading] = useState(false)

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
        fetchStudents,
        setLoading,
      );
      setStudent(updatedStudent);
      setCashAmount("");
    } catch (err) {
      console.error("Error recording payment:", err);
      toast.error(`Failed to record payment: ${err.message}`);
    }
  };

  const admissionFeePaid = student.payments.some((p) => p.paymentType === "admissionfee" && p.status === "completed");
  const hostelAdmissionFeePaid = student.payments.some((p) => p.paymentType === "hosteladmissionfee" && p.status === "completed");
  const isAdmissionFeeDisabled = (paymentType === "admissionfee" && admissionFeePaid) || (paymentType === "hosteladmissionfee" && hostelAdmissionFeePaid);

  return (
    <div className="cash-payment-section">
      <h4>Record Cash Payment</h4>
      <select
        value={paymentType}
        onChange={(e) => setPaymentType(e.target.value)}
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
      <input
        type="text"
        value={cashAmount}
        onChange={(e) => setCashAmount(e.target.value.replace(/[^0-9]/g, ''))}
        placeholder="Enter cash amount"
        disabled={(student.dues?.monthlyDue?.amount || 0) + (student.dues?.hostelDue?.amount || 0) === 0 || isAdmissionFeeDisabled}
      />
      <button
        onClick={handleRecordCashPayment}
        className="record-fee-btn"
        disabled={
          (student.dues?.monthlyDue?.amount || 0) + (student.dues?.hostelDue?.amount || 0) === 0 ||
          !cashAmount ||
          parseInt(cashAmount) <= 0 ||
          isAdmissionFeeDisabled
        }
      >
        {loading? "Recoding payment..." : "Record Cash Payment"}
      </button>
      {(admissionFeePaid || hostelAdmissionFeePaid) && (
        <p className="cleared-message">
          {admissionFeePaid && hostelAdmissionFeePaid ? "Admission and hostel admission fees cleared" : 
           admissionFeePaid ? "Admission fee cleared" : "Hostel admission fee cleared"}
        </p>
      )}
    </div>
  );
};

export default CashPaymentForm;
