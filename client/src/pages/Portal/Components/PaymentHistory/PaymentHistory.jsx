import React, { useMemo } from "react";
import "./PaymentHistory.css";
import generateFeeReceipt from "../../Utils/generateFeeReceipt";

const PaymentHistory = ({
  selectedStudent,
  currentPage,
  setCurrentPage,
  currentConfig,
}) => {
  const paymentsPerPage = 10;
  const payments = selectedStudent?.payments || [];

  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;

  const currentPayments = useMemo(() => {
    return payments.slice(indexOfFirstPayment, indexOfLastPayment);
  }, [payments, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(payments.length / paymentsPerPage);
  }, [payments]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatFieldValue = (value, field) => {
    if (field === "paymentDate") {
      const date = new Date(value);
      return isNaN(date) ? "N/A" : date.toLocaleDateString();
    }
    if (field === "amount") return `₹${Number(value).toLocaleString()}`;
    if (field === "status") return value ? value.charAt(0).toUpperCase() + value.slice(1) : "N/A";
    if (field === "paymentMode") return value === "online" ? "Online" : value === "offline" ? "Offline" : "N/A";
    if (field === "paymentType") {
      switch (value) {
        case "admissionfee": return "Admission Fee";
        case "hosteladmissionfee": return "Hostel Admission Fee";
        case "monthlyfee": return "Monthly Fee";
        case "hostelmonthlyfee": return "Hostel Monthly Fee";
        default: return value || "N/A";
      }
    }
    return value || "N/A";
  };

  const renderField = (payment, field, student) => {
    if (typeof field === "object" && field.render) {
      return field.render(payment, student);
    }
    return formatFieldValue(payment[field], field);
  };

  return (
    <div className="payment-history-container">
      <h3>Payment History</h3>
      {payments.length === 0 ? (
        <p className="payment-history-message">No payment history available.</p>
      ) : (
        <>
          <div className="table-scroll-wrapper">
            <table className="payment-history-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  {currentConfig.historyFields.map((field, index) => (
                    <th key={field.label || field || index}>
                      {field.label ||
                        (field === "paymentType"
                          ? "Payment Type"
                          : field.charAt(0).toUpperCase() + field.slice(1))}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentPayments.map((payment, index) => (
                  <tr key={payment._id || index}>
                    <td>{indexOfFirstPayment + index + 1}</td>
                    {currentConfig.historyFields.map((field, fIdx) => (
                      <td
                        key={field.label || field || fIdx}
                        className={field === "amount" ? "due-amount" : ""}
                      >
                        {renderField(payment, field, selectedStudent)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="payment-history-pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`pagination-button ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentHistory;