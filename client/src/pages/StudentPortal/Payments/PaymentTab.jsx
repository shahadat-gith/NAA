import React from "react";
import SearchSection from "./SearchSection";
import StudentProfile from "./StudentProfile";
import PaymentHistory from "./PaymentHistory";

const config = {
  admission: {
    title: "Admission Fee Payment",
    searchUrl: "/api/students/search",
    recordUrl: "/api/students/payment",
    verifyUrl: "/api/students/payment/verify",
    dueField: "dueAmount",
    paymentField: "payments",
    idField: "studentId",
    lastPaymentField: "lastPaymentDate",
    receiptLabel: "Admission Fee",
    searchResultFields: ["firstName", "lastName", "dueAmount", "class"],
    profileFields: [
      "guardianContact",
      "class",
      "medium",
      "dueAmount",
      "lastPaymentDate",
      "admissionFee", // Added to show current admission fee
      "isAdmissionFeesPaid", // Added to show payment status
    ],
    historyFields: ["amount", "paymentDate", "status"],
    paymentType: "admissionfee",
  },
  hostel: {
    title: "Hostel Fee Payment",
    searchUrl: "/api/students/search",
    recordUrl: "/api/students/payment",
    verifyUrl: "/api/students/payment/verify",
    dueField: "hostelDueAmount",
    paymentField: "payments",
    idField: "studentId",
    lastPaymentField: "lastPaymentDate",
    receiptLabel: "Hostel Fee",
    searchResultFields: ["firstName", "lastName", "hostelDueAmount", "phone"],
    profileFields: [
      "phone",
      "hostelDueAmount",
      "lastPaymentDate",
      "hostelAdmissionFee", // Added to show current hostel admission fee
      "isAdmissionFeesPaid", // Added to show payment status
    ],
    historyFields: ["month", "amount", "paymentDate", "status"],
    paymentType: "hosteladmissionfee",
  },
  monthly: {
    title: "Monthly Fee Payment",
    searchUrl: "/api/students/search",
    recordUrl: "/api/students/payment",
    verifyUrl: "/api/students/payment/verify",
    dueField: "dueAmount",
    paymentField: "payments",
    idField: "studentId",
    lastPaymentField: "lastPaymentDate",
    receiptLabel: "Monthly Fee",
    searchResultFields: ["firstName", "lastName", "dueAmount", "class"],
    profileFields: [
      "class",
      "medium",
      "stream",
      "rollNo",
      "fatherName",
      "motherName",
      "dueAmount",
      "lastPaymentDate",
      "isAdmissionFeesPaid", // Optional: included for consistency, though less relevant for monthly tab
    ],
    historyFields: ["month", "amount", "paymentDate", "status"],
    paymentType: "monthlyfee",
  },
};

const PaymentTab = (props) => {
  const currentConfig = config[props.activeTab.toLowerCase()] || config.monthly;

  return (
    <div className="fee-payment-section">
      <h3>{currentConfig.title}</h3>
      <SearchSection {...props} currentConfig={currentConfig} />
      {props.selectedStudent && (
        <div className="student-details-container">
          <StudentProfile {...props} currentConfig={currentConfig} />
          <PaymentHistory {...props} currentConfig={currentConfig} />
        </div>
      )}
    </div>
  );
};

export default PaymentTab;