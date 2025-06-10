import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { fetchStudentDetails, processPayment } from "../../Utils/api";
import "./StudentDetails.css";
import { AppContext } from "../../../../context/AppContext";
import PaymentHistory from "../PaymentHistory/PaymentHistory";
import generateAdmitCard from "../../Utils/generateAdmitCard";
import generateFeeReceipt from "../../Utils/generateFeeReceipt";
import axios from "axios";

// Shared profile fields to reduce duplication
const baseProfileFields = [
  { label: "Name", path: "name" },
  { label: "Class", path: "class" },
  { label: "Medium", path: "medium" },
  { label: "Registration No", path: "registrationNo" },
];

// Mapping for payment types to receipt labels
const paymentTypeToReceiptLabel = {
  monthlyfee: "Monthly Fee",
  hostelmonthlyfee: "Hostel Monthly Fee",
  admissionfee: "Admission Fee",
  hosteladmissionfee: "Hostel Admission Fee",
};

// Shared history fields generator to avoid duplication
const generateHistoryFields = (paymentType) => [
  "paymentType",
  "amount",
  "status",
  "paymentMode",
  "paymentDate",
  {
    label: "Download",
    // Render function for payment history table; expects PaymentHistory to call it with payment and student
    render: (payment, student) => (
      <button
        onClick={() =>
          generateFeeReceipt(
            student,
            payment,
            paymentTypeToReceiptLabel[payment?.paymentType] || "Unknown Fee"
          )
        }
        className="payment-history-download-button"
        aria-label={`Download receipt for payment ${payment._id || "unknown"}`}
      >
        Download Receipt
      </button>
    ),
  },
];

const configMap = {
  monthly: {
    title: "Monthly Fee Details",
    paymentType: "monthlyfee",
    dueField: "dues.monthlyDue.amount",
    recordUrl: "/api/students/:id/payments",
    verifyUrl: "/api/students/:id/payment/verify",
    profileFields: baseProfileFields,
    historyFields: generateHistoryFields("monthlyfee"),
    receiptLabel: "Monthly Fee",
  },
  hostel: {
    title: "Hostel Fee Details",
    paymentType: "hostelmonthlyfee",
    dueField: "dues.hostelDue.amount",
    recordUrl: "/api/students/:id/payments",
    verifyUrl: "/api/students/:id/payment/verify",
    profileFields: baseProfileFields,
    historyFields: generateHistoryFields("hostelmonthlyfee"),
    receiptLabel: "Hostel Monthly Fee",
  },
  admission: {
    options: [
      {
        label: "Admission Fee",
        title: "Admission Fee Details",
        paymentType: "admissionfee",
        dueField: "admissionfees.admissionFee",
      },
      {
        label: "Hostel Admission Fee",
        title: "Hostel Admission Fee Details",
        paymentType: "hosteladmissionfee",
        dueField: "admissionfees.hostelAdmissionFee",
      },
    ],
    recordUrl: "/api/students/:id/payments",
    verifyUrl: "/api/students/:id/payment/verify",
    profileFields: baseProfileFields,
    historyFields: generateHistoryFields("admissionfee"),
    receiptLabel: "Admission Fee",
  },
  "admit-card": {
    title: "Admit Card Details",
    profileFields: [...baseProfileFields, { label: "Roll Number", path: "rollNumber" }],
    historyFields: [],
    receiptLabel: "Admit Card",
  },
  "id-card": {
    title: "ID Card Details",
    profileFields: baseProfileFields,
    historyFields: [],
    receiptLabel: "ID Card",
  },
};

const StudentDetails = () => {
  const { id, type } = useParams();
  const { backendUrl, adminToken } = useContext(AppContext);
  const config = configMap[type] || configMap.monthly;
  const [student, setStudent] = useState(null);
  const [admitConfig, setAdmitConfig] = useState({
    isEnabled: false,
    examName: "",
    examDate: null,
    examCenter: "Nashib Ali Academy Campus",
  });
  const [isAdmitConfigLoading, setIsAdmitConfigLoading] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAdmissionOption, setSelectedAdmissionOption] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStudentDetails(backendUrl, id, adminToken);
        if (!data) {
          throw new Error("No student data found");
        }
        setStudent(data);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error(error.message || "Failed to fetch student details");
      }
    };

    const getAdmitConfig = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/settings/settings`);
        if (response.data.success ) {
          setAdmitConfig({
            isEnabled: response.data.data.admitCardConfig.isEnabled ?? false,
            examName: response.data.data.admitCardConfig.examName ?? "",
            examDate: response.data.data.admitCardConfig.examDate ?? null,
            examCenter: response.data.data.admitCardConfig.examCenter ?? "Nashib Ali Academy Campus",
          });
        } else {
          throw new Error("Invalid admit card configuration response");
        }
      } catch (error) {
        console.error("Admit config error:", error);
        toast.error("Failed to fetch admit card configuration");
        // Preserve default state on failure
        setAdmitConfig({
          isEnabled: false,
          examName: "",
          examDate: null,
          examCenter: "Nashib Ali Academy Campus",
        });
      } finally {
        setIsAdmitConfigLoading(false);
      }
    };

    fetchData();
    getAdmitConfig();
  }, [backendUrl, id, adminToken]);

  const getNestedValue = (obj, path) => {
    if (!obj || !path) return "N/A";
    return path.split(".").reduce((acc, part) => acc?.[part] ?? "N/A", obj);
  };

  const getDueAmount = (student, feeType) => {
    if (!student) return 0;
    if (feeType === "monthly") return Number(getNestedValue(student, "dues.monthlyDue.amount")) || 0;
    if (feeType === "hostel") return Number(getNestedValue(student, "dues.hostelDue.amount")) || 0;
    if (feeType === "admission") {
      return (
        (Number(getNestedValue(student, "admissionfees.admissionFee")) || 0) +
        (Number(getNestedValue(student, "admissionfees.hostelAdmissionFee")) || 0)
      );
    }
    return 0;
  };

  const getTotalDue = (student) => {
    if (!student) return 0;
    return (
      getDueAmount(student, "monthly") +
      getDueAmount(student, "hostel") +
      getDueAmount(student, "admission")
    );
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    const dynamicConfig =
      type === "admission" ? { ...config.options[selectedAdmissionOption], ...config } : config;

    const currentDue = getNestedValue(student, dynamicConfig.dueField);
    const numericAmount = parseFloat(paymentAmount);

    if (!paymentAmount || isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid numeric amount");
      return;
    }

    if (numericAmount > parseFloat(currentDue)) {
      toast.error("Payment amount cannot exceed due amount");
      return;
    }

    try {
      setIsLoading(true);
      const updatedStudent = await processPayment(
        backendUrl,
        student,
        numericAmount,
        { ...dynamicConfig, feeType: dynamicConfig.paymentType },
        adminToken
      );
      setStudent(updatedStudent);
      setPaymentAmount("");
      toast.success("Payment processed successfully!");
    } catch (error) {
      toast.error(error.message || "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdmitCardDownload = () => {
    const monthlyDue = getDueAmount(student, "monthly");
    if (monthlyDue > 0) {
      toast.error("Please clear monthly dues to download admit card");
      return;
    }
    generateAdmitCard(student, admitConfig);
  };

  const dynamicConfig =
    type === "admission" ? { ...config.options[selectedAdmissionOption], ...config } : config;

  if (!student || isAdmitConfigLoading) {
    return (
      <div className="sd-spinner-container">
        <div className="sd-spinner"></div>
        <span className="sd-spinner-text">Loading your details...</span>
      </div>
    );
  }

  const isPaymentType = ["monthly", "hostel", "admission"].includes(type);
  const currentDue = isPaymentType ? getNestedValue(student, dynamicConfig.dueField) : 0;

  const monthlyDue = getDueAmount(student, "monthly");
  const hostelDue = getDueAmount(student, "hostel");
  const admissionDue = getDueAmount(student, "admission");
  const totalDue = getTotalDue(student);

  return (
    <div className="sd-container">
      <h2>{student.name || "Student"}'s Details</h2>

      <div className="sd-profile">
        {config.profileFields.map(({ label, path }) => (
          <div key={label} className="sd-field">
            <strong>{label}:</strong>
            <span>{getNestedValue(student, path)}</span>
          </div>
        ))}
        {isPaymentType && (
          <div className="sd-field">
            <strong>Last Payment Date:</strong>
            <span>
              {student.payments?.length
                ? new Date(
                    [...student.payments].sort(
                      (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
                    )[0].paymentDate
                  ).toLocaleDateString()
                : "Never"}
            </span>
          </div>
        )}
        <div className="sd-field">
          <strong>Monthly Due:</strong>
          <span>₹{monthlyDue.toFixed(2)}</span>
        </div>
        <div className="sd-field">
          <strong>Hostel Due:</strong>
          <span>₹{hostelDue.toFixed(2)}</span>
        </div>
        <div className="sd-field">
          <strong>Admission Due:</strong>
          <span>₹{admissionDue.toFixed(2)}</span>
        </div>
        <div className="sd-field">
          <strong>Total Due:</strong>
          <span>₹{totalDue.toFixed(2)}</span>
        </div>
      </div>

      {type === "admission" && (
        <div className="sd-tabs">
          {config.options.map((option, index) => (
            <button
              key={option.label}
              className={`sd-tab ${index === selectedAdmissionOption ? "active" : ""}`}
              onClick={() => setSelectedAdmissionOption(index)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {isPaymentType && (
        <div className="sd-payment-container">
          <h3>{dynamicConfig.title}</h3>
          {currentDue === "N/A" || parseFloat(currentDue) === 0 ? (
            <p className="sd-zero-message">
              You have no balance amount for {type} fees.
            </p>
          ) : (
            <div className="sd-payment-form">
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                disabled={isLoading}
                placeholder="Enter amount"
                min="0"
                step="0.01"
              />
              <button
                onClick={handlePaymentSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Pay Now"}
              </button>
            </div>
          )}
        </div>
      )}

      {type === "admit-card" && (
        <div className="sd-action-container">
          <h3>Download Admit Card</h3>
          <button
            onClick={handleAdmitCardDownload}
            className="sd-action-button"
            disabled={monthlyDue > 0 || !admitConfig.isEnabled}
            aria-label={
              monthlyDue > 0
                ? "Clear monthly dues to download admit card"
                : !admitConfig.isEnabled
                ? "Admit card downloading is not available"
                : "Download admit card"
            }
          >
            Download Admit Card
          </button>
          {monthlyDue > 0 ? (
            <div className="info-msg">
              Your monthly fees are not cleared, please pay your fees and then download admit card
            </div>
          ) : !admitConfig.isEnabled ? (
            <div className="info-msg">
              Admit Card downloading is not available currently, it will be open soon.
            </div>
          ) : (
            <div className="info-msg">Admit card is available for download.</div>
          )}
        </div>
      )}

      {isPaymentType && (
        <PaymentHistory
          selectedStudent={student}
          currentPage={1}
          setCurrentPage={() => {}}
          currentConfig={dynamicConfig}
          backendUrl={backendUrl}
          adminToken={adminToken}
        />
      )}
    </div>
  );
};

export default StudentDetails;