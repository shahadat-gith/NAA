import React, { useState } from "react";
import generateFeeReceipt from "../utils/generateFeeReceipt";
import { fetchLatestTransactionDetails } from "./api";

const PaymentHistory = ({ selectedStudent, currentPage, setCurrentPage, currentConfig, backendUrl }) => {
  const [receiptLoading, setReceiptLoading] = useState(false);
  const paymentsPerPage = 3;

  const getPaginatedPayments = () => {
    if (!selectedStudent || !selectedStudent.payments?.length) return [];
    const relevantPayments = selectedStudent.payments.filter((p) => p.paymentType === currentConfig.paymentType);
    const sortedPayments = [...relevantPayments].sort(
      (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
    );
    const indexOfLastPayment = currentPage * paymentsPerPage;
    const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
    return sortedPayments.slice(indexOfFirstPayment, indexOfLastPayment);
  };

  const totalPages = Math.ceil(
    (selectedStudent?.payments?.filter((p) => p.paymentType === currentConfig.paymentType).length || 0) /
      paymentsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const downloadReceipt = async (payment) => {
    setReceiptLoading(true);
    try {
      const latestTransaction = await fetchLatestTransactionDetails(backendUrl, selectedStudent._id);
      const latestPayment =
        latestTransaction &&
        (!payment._id || new Date(latestTransaction.paymentDate) > new Date(payment.paymentDate || payment.createdAt))
          ? latestTransaction
          : payment;
      generateFeeReceipt(selectedStudent, latestPayment, currentConfig.receiptLabel);
    } catch (err) {
      console.error("Failed to download receipt:", err);
    } finally {
      setReceiptLoading(false);
    }
  };

  return (
    <div className="payment-history">
      <h3>{currentConfig.title.split(" ")[0]} Payment History</h3>
      {selectedStudent.payments?.some((p) => p.paymentType === currentConfig.paymentType) ? (
        <div className="history-content">
          <table className="payment-table">
            <thead>
              <tr>
                {currentConfig.historyFields.map((field) => (
                  <th key={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</th>
                ))}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {getPaginatedPayments().map((payment) => (
                <tr key={payment._id || payment.paymentId}>
                  {currentConfig.historyFields.map((field) => (
                    <td key={field}>
                      {field === "amount"
                        ? `₹${payment[field]}`
                        : field === "paymentDate"
                        ? formatDate(payment[field])
                        : payment[field] || "-"}
                    </td>
                  ))}
                  <td>
                    {payment.status === "completed" && (
                      <button
                        onClick={() => downloadReceipt(payment)}
                        className="download-button"
                        disabled={receiptLoading}
                      >
                        {receiptLoading ? "Downloading..." : "Download Receipt"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={handlePrevPage} disabled={currentPage === 1} className="pagination-button">
              Previous
            </button>
            <span className="page-info">Page {currentPage} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-button">
              Next
            </button>
          </div>
        </div>
      ) : (
        <p className="no-history">No payment history available</p>
      )}
    </div>
  );
};

export default PaymentHistory;