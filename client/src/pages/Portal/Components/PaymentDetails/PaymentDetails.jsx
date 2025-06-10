import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useContext } from "react";
import { toast } from "react-hot-toast";
import { AppContext } from "../../../../context/AppContext";
import { fetchPaymentDetails, fetchStudentDetails } from "../../Utils/api";
import Loader from "../../../../components/Loader/Loader";
import "../SearchResults/SearchResults.css"; // Base styles
import "./PaymentDetails.css"; 
import generateFeeReceipt from "../../Utils/generateFeeReceipt";

const PaymentDetails = () => {
  const { type, id, paymentId } = useParams();
  const { backendUrl, adminToken } = useContext(AppContext);
  const [payment, setPayment] = useState(null);
  const [student, setStudent] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [paymentData, studentData] = await Promise.all([
          fetchPaymentDetails(backendUrl, id, paymentId, adminToken),
          fetchStudentDetails(backendUrl, id, adminToken),
        ]);
        setPayment(paymentData);
        setStudent(studentData);
        setStudentName(studentData.name);
        console.log("Student data:", studentData); // Debug inside fetchData
      } catch (err) {
        setError(err.message || "Failed to fetch payment details");
        toast.error(err.message || "Failed to fetch payment details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [backendUrl, id, paymentId, adminToken]);

  const handleReceiptDownload = async () => {
    try {
      await generateFeeReceipt(student, payment, type);
      toast.success("Receipt download initiated");
    } catch (err) {
      toast.error("Failed to generate receipt");
      console.error("Receipt generation error:", err);
    }
  };

  const formatFieldValue = (value, field) => {
    if (field === "paymentDate") {
      const date = new Date(value);
      return isNaN(date) ? "N/A" : date.toLocaleDateString();
    }
    if (field === "amount") return `₹${value}`;
    if (field === "status") return value.charAt(0).toUpperCase() + value.slice(1);
    if (field === "paymentMode") return value === "online" ? "Online" : "Offline";
    if (field === "month") return value || "N/A";
    return value || "N/A";
  };

  const fields = [
    { label: "Amount", key: "amount" },
    { label: "Status", key: "status" },
    { label: "Payment Mode", key: "paymentMode" },
    { label: "Payment Date", key: "paymentDate" },
    { label: "Payment ID", key: "paymentId" },
    { label: "Order ID", key: "orderId" },
    { label: "Payment Type", key: "paymentType" },
    { label: "Month", key: "month" },
  ];

  if (isLoading) return <Loader text="Loading payment details..." />;
  if (error) return <div className="search-results-container"><p className="error-message">{error}</p></div>;

  return (
    <div className="payment-details-container">
      <div className="payment-details-card">
        <h2 className="payment-details-header">Payment Details</h2>
        <table className="search-results-table payment-details-table">
          <tbody>
            {fields.map(({ label, key }, index) => (
              <tr key={key} className={index % 2 === 0 ? "row-even" : "row-odd"}>
                <td className="label-cell">{label}</td>
                <td className={key === "amount" ? "due-amount value-cell" : "value-cell"}>
                  {formatFieldValue(payment[key], key)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="payment-details-actions">
          <Link
            to={`/portal/fee/${type}/${id}`}
            className="search-results-action-link"
          >
            Back to Student Details
          </Link>
          <button className="search-results-action-link" onClick={handleReceiptDownload}>
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;