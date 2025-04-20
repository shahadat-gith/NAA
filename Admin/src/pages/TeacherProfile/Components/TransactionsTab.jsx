import React, { useState } from "react";

const TransactionsTab = ({ transactions, setShowPayForm, setFormData, teacher }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  const totalItems = sortedTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleRecordPayment = (transaction) => {
    setFormData({
      amount: transaction.amount || teacher.salary || "",
      description: "Salary",
      date: transaction.paymentMonth,
      status: "Successful",
    });
    setShowPayForm(true);
  };

  return (
    <div className="transactions-tab">
      <div className="card">
        <h2 className="card-title">Transaction History</h2>
        <div className="card-content">
          {totalItems > 0 ? (
            <>
              <div className="table-responsive">
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Acknowledged</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTransactions.map((transaction) => (
                      <tr key={transaction._id}>
                        <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                        <td>₹{transaction.amount.toLocaleString()}</td>
                        <td>{transaction.description}</td>
                        <td>
                          <span className={`status-badge ${transaction.status.toLowerCase()}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td>{transaction.acknowledged ? "Yes" : "No"}</td>
                        <td>
                          <button
                            className="action-btn"
                            onClick={() => handleRecordPayment(transaction)}
                          >
                            Record Payment
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="pagination-controls">
                  <button
                    className="pagination-btn"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="pagination-btn"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="no-data">No transactions found for this teacher.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsTab;