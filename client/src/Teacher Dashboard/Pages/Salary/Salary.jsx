import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../../../context/UserContext';
import { AppContext } from '../../../context/AppContext';
import Loader from '../../../components/Loader/Loader';
import './Salary.css';

const TeacherSalary = () => {
  const { teacherData: teacher, teacherToken } = useContext(UserContext);
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!teacherToken) {
      navigate('/login/teacher');
    } else if (teacher && teacher.transactions) {
      setTransactions(teacher.transactions);
    }
  }, [teacherToken, teacher, navigate]);

  const handleAcknowledgeSalary = async (transactionId) => {
    try {
      const response = await fetch(`${backendUrl}/api/teacher/acknowledge-salary/${transactionId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${teacherToken}` },
      });
      const data = await response.json();
      if (data.success) {
        setTransactions((prev) =>
          prev.map((transaction) =>
            transaction._id === transactionId
              ? { ...transaction, acknowledged: true, acknowledgedOn: new Date().toISOString() }
              : transaction
          )
        );
        toast.success('Salary transaction acknowledged successfully!');
      } else {
        toast.error('Failed to acknowledge salary: ' + data.message);
      }
    } catch (error) {
      console.error('Error acknowledging salary:', error);
      toast.error('Error acknowledging salary.');
    }
  };

  const formatMonth = (yearMonth) => {
    if (!yearMonth || !/^\d{4}-\d{2}$/.test(yearMonth)) {
      return 'N/A';
    }
    const [year, month] = yearMonth.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatFullDate = (isoDate) => {
    if (!isoDate) return 'N/A';
    return new Date(isoDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (!teacherToken) return null;
  if (!teacher) return <Loader message="Loading teacher data..." />;

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalTransactionPages = Math.ceil(transactions.length / transactionsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="teacher-salary-container">
      <div className="teacher-salary-card">
        <h2 className="teacher-salary-title">Salary Transactions</h2>
        {transactions.length === 0 ? (
          <p className="no-records-message">No salary transactions found.</p>
        ) : (
          <>
            <table className="teacher-salary-table">
              <thead>
                <tr>
                  <th scope="col">Month</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                  <th scope="col">Date</th>
                  <th scope="col">Acknowledged On</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{formatMonth(transaction.paymentMonth)}</td>
                    <td>₹{transaction.amount.toLocaleString()}</td>
                    <td>
                      <span
                        className={`teacher-transaction-status ${transaction.status.toLowerCase()}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td>{formatFullDate(transaction.createdAt)}</td>
                    <td>{formatFullDate(transaction.acknowledgedOn)}</td>
                    <td>
                      <button
                        className="teacher-acknowledge-button"
                        disabled={transaction.acknowledged}
                        onClick={() => handleAcknowledgeSalary(transaction._id)}
                      >
                        {transaction.acknowledged ? 'Acknowledged' : 'Acknowledge'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalTransactionPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {totalTransactionPages}
                </span>
                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalTransactionPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherSalary;
