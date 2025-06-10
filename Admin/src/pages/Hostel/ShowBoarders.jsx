import React, { useState } from "react";

const ShowBoarders = ({
  filteredAdmissions,
  searchTerm,
  setSearchTerm,
  fetchSingleAdmission,
  handleDeleteAdmission,
  handleAddDue,
  handleCashPayment,
  loading,
  fetchTransactions,
  setShowTransactionsFor,
  showCashPopupFor,
  setShowCashPopupFor,
  paymentAmount,
  setPaymentAmount,
  hostelFee,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const handleShowTransactions = (student) => {
    setShowTransactionsFor(student);
    fetchTransactions(student);
  };

  const handleRecordCashClick = (student) => {
    setShowCashPopupFor(student);
    setPaymentAmount("");
  };

  const totalPages = filteredAdmissions ? Math.ceil(filteredAdmissions.length / itemsPerPage) : 0;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAdmissions = filteredAdmissions ? filteredAdmissions.slice(indexOfFirstItem, indexOfLastItem) : [];

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Hostel Boarders</h3>
      </div>
      <div className="card-body">
        <div className="actions-row">
          <div className="search-box">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name"
              disabled={loading}
            />
          </div>
          <button onClick={handleAddDue} disabled={loading} className="btn-warning">
            {loading ? "Processing..." : `Add Monthly Due (₹${hostelFee})`}
          </button>
        </div>

        {loading && <div className="loading-indicator">Loading boarders...</div>}

        {!loading && (!filteredAdmissions || filteredAdmissions.length === 0) && (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No hostel boarders found</p>
          </div>
        )}

        {!loading && filteredAdmissions && filteredAdmissions.length > 0 && (
          <>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Due Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAdmissions.map((student) => (
                    <tr key={student._id}>
                      <td>{student.name}</td>
                      <td>₹{student.dues?.hostelDue?.amount || 0}</td>
                      <td className="actions">
                        <button onClick={() => fetchSingleAdmission(student._id)} className="btn-info" disabled={loading}>
                          View
                        </button>
                        <button onClick={() => handleDeleteAdmission(student._id)} disabled={loading} className="btn-danger">
                          Remove
                        </button>
                        <button onClick={() => handleShowTransactions(student)} disabled={loading} className="btn-primary">
                          Show Transactions
                        </button>
                        <button onClick={() => handleRecordCashClick(student)} disabled={loading} className="btn-success">
                          Record Cash
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || loading} className="btn-pagination">
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`btn-pagination ${currentPage === index + 1 ? "active" : ""}`}
                  disabled={loading}
                >
                  {index + 1}
                </button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || loading} className="btn-pagination">
                Next
              </button>
            </div>
          </>
        )}

        {showCashPopupFor && (
          <div className="hostel-modal-overlay">
            <div className="hostel-modal-content">
              <h3>Record Cash Payment for {showCashPopupFor.name}</h3>
              <form onSubmit={(e) => handleCashPayment(e, showCashPopupFor._id)} className="payment-form">
                <div className="form-group">
                  <label>Amount (₹):</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    min={0}
                    placeholder="Enter payment amount"
                    disabled={loading}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" disabled={loading} className="btn-success">
                    {loading ? "Processing..." : "Submit"}
                  </button>
                  <button type="button" onClick={() => setShowCashPopupFor(null)} disabled={loading} className="btn-warning">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowBoarders;