import React from "react";

const SalaryTab = ({
  transactions,
  currentPage,
  transactionsPerPage,
  handleAcknowledgeSalary,
  handlePageChange,
  error,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalTransactionPages = Math.ceil(transactions.length / transactionsPerPage);

  return (
    <div className="teacher-tab-content">
      <div className="teacher-salary-section">
        <h3>Salary Transactions</h3>
        {error && <p className="error-message">{error}</p>}
        {currentTransactions.length > 0 ? (
          <>
            <table className="teacher-salary-table">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Acknowledged</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>₹{transaction.amount || "N/A"}</td>
                    <td>{transaction.createdAt ? formatDate(transaction.createdAt) : "N/A"}</td>
                    <td>{transaction.description || "No description"}</td>
                    <td className={`teacher-transaction-status ${transaction.status ? transaction.status.toLowerCase() : "unknown"}`}>
                      {transaction.status || "Unknown"}
                    </td>
                    <td>{transaction.acknowledged ? "Yes" : "No"}</td>
                    <td>
                      <button
                        onClick={() => handleAcknowledgeSalary(transaction._id)}
                        className="teacher-acknowledge-button"
                        disabled={transaction.acknowledged || !transaction.status || transaction.status.toLowerCase() !== "successful"}
                        title={
                          transaction.acknowledged
                            ? "Already acknowledged"
                            : !transaction.status || transaction.status.toLowerCase() !== "successful"
                            ? "Can only acknowledge Successful transactions"
                            : ""
                        }
                      >
                        <i className="fas fa-check"></i> Acknowledge
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalTransactionPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalTransactionPages || totalTransactionPages === 0}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default SalaryTab;