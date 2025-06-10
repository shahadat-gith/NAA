import React from "react";

const TransactionDetails = ({ transactions, fetchTransactions, selectedAdmission, loading, setShowTransactionsFor }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3>Transaction Details for {selectedAdmission.name}</h3>
      </div>
      <div className="card-body">
        {loading ? (
          <div className="loading-indicator">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💸</div>
            <p>No hostel transactions found</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Amount</th>
                  <th>Payment Type</th>
                  <th>Status</th>
                  <th>Payment Mode</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>
                      {transaction.paymentDate
                        ? new Date(transaction.paymentDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })
                        : 'N/A'}
                    </td>
                    <td>₹{transaction.amount}</td>
                    <td>{transaction.paymentType}</td>
                    <td>{transaction.status}</td>
                    <td>{transaction.paymentMode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button onClick={() => setShowTransactionsFor(null)} className="btn-warning" style={{ marginTop: "10px" }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TransactionDetails;