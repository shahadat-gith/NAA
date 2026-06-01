import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import Loader from "../../components/Loader/Loader";
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  TbReceiptOff, 
  TbReceipt2, 
  TbCalendarTime, 
  TbCreditCard, 
  TbCircleCheck,
  TbAlertCircle,
  TbCheck,
  TbLoaderQuarter
} from "react-icons/tb";

// Helper engine to convert "YYYY-MM" to user-facing strings (e.g., "Oct 2025")
const formatSalaryMonth = (monthStr) => {
  if (!monthStr || !monthStr.includes('-')) return monthStr;
  const [year, month] = monthStr.split('-');
  const date = new Date(year, parseInt(month) - 1);
  return date.toLocaleString('en-IN', { month: 'short', year: 'numeric' });
};

const Payments = () => {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null); // Track loader state for specific rows
  const [paymentData, setPaymentData] = useState({ payments: [], dues: null });

  const token = localStorage.getItem("teacher-token");

  const fetchPaymentDetails = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/payments/teacher/details`, {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      });
      
      if (data.success) {
        setPaymentData({
          payments: data.payments || [],
          dues: data.dues || null
        });
      } else {
        toast.error(data.message || "Failed to retrieve payment profiles.");
      }
    } catch (error) {
      console.error("Error fetching financial profiles:", error);
      toast.error(error.response?.data?.message || "Network system connection down.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (backendUrl) {
      fetchPaymentDetails();
    }
  }, [backendUrl, token]);

  /* ================= ACKNOWLEDGE DISBURSEMENT HANDLER ================= */
  const handleAcknowledge = async (paymentId) => {
    setSubmittingId(paymentId);
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/payments/teacher/acknowledge/${paymentId}`,
        {}, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (data.success) {
        toast.success(data.message || "Disbursement acknowledged successfully!");
        
        // Optimistic UI state update: rewrite updated record row in memory local cache state
        setPaymentData((prev) => ({
          ...prev,
          payments: prev.payments.map((p) => 
            p._id === paymentId ? { ...p, isAcknowledged: true } : p
          )
        }));
      } else {
        toast.error(data.message || "Failed to acknowledge receipt.");
      }
    } catch (error) {
      console.error("Acknowledgement call error:", error);
      toast.error(error.response?.data?.message || "An error occurred during submission.");
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) return <Loader />;

  const { payments, dues } = paymentData;

  return (
    <div className="pay-dashboard">
      
      {/* ─── SUMMARY OVERVIEW BLOCK ─── */}
      <div className="pay-summary-grid">
        <div className="pay-stat-card pay-card-danger">
          <div className="pay-stat-icon">
            <TbReceiptOff />
          </div>
          <div className="pay-stat-details">
            <span className="pay-stat-label">Outstanding Dues</span>
            <h2 className="pay-stat-value">₹{(dues?.totalDue || 0).toLocaleString('en-IN')}</h2>
          </div>
        </div>

        <div className="pay-stat-card pay-card-success">
          <div className="pay-stat-icon">
            <TbCircleCheck />
          </div>
          <div className="pay-stat-details">
            <span className="pay-stat-label">Total Transactions Run</span>
            <h2 className="pay-stat-value">{payments.length} Disbursed</h2>
          </div>
        </div>
      </div>

      {/* ─── MAIN ASYMMETRIC GRID WORKSPACE ─── */}
      <div className="pay-workspace">
        
        {/* LEFT COLUMN: ACTIVE DUES MATRIX */}
        <div className="pay-dues-column">
          <div className="pay-surface-card">
            <div className="pay-card-header">
              <TbAlertCircle className="pay-header-icon text-danger" />
              <h3>Unpaid Salary Months</h3>
            </div>
            
            <div className="pay-card-body">
              {!dues || !dues.dueMonths || dues.dueMonths.length === 0 ? (
                <div className="pay-empty-state">
                  <div className="pay-empty-icon text-success"><TbCircleCheck /></div>
                  <p>All clean! No pending outstanding salary months flagged.</p>
                </div>
              ) : (
                <div className="pay-dues-list">
                  {dues.dueMonths.map((due, idx) => (
                    <div className="pay-due-item" key={idx}>
                      <div className="pay-due-meta">
                        <TbCalendarTime className="pay-meta-icon" />
                        <div>
                          <p className="pay-due-month">{formatSalaryMonth(due.month)}</p>
                        </div>
                      </div>
                      <div className="pay-due-amount">
                        ₹{due.amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TRANSACTION HISTORY TABLE */}
        <div className="pay-history-column">
          <div className="pay-surface-card">
            <div className="pay-card-header">
              <TbReceipt2 className="pay-header-icon text-accent" />
              <h3>Disbursement History</h3>
            </div>

            <div className="pay-card-body pay-table-overflow">
              {payments.length === 0 ? (
                <div className="pay-empty-state">
                  <div className="pay-empty-icon"><TbCreditCard /></div>
                  <p>No historical transactions matching this record line found.</p>
                </div>
              ) : (
                <table className="pay-history-table">
                  <thead>
                    <tr>
                      <th>Salary Month</th>
                      <th>Payment Date</th>
                      <th>Payment Method</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Acknowledgement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((pay) => (
                      <tr key={pay._id}>
                        <td className="pay-table-month">
                          <strong>{formatSalaryMonth(pay.salaryMonth)}</strong>
                        </td>
                        <td>
                          {new Date(pay.paymentDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td>
                          <span className="pay-method-badge">{pay.paymentMethod}</span>
                        </td>
                        <td className="pay-table-amount">
                          ₹{pay.amount.toLocaleString('en-IN')}
                        </td>
                        <td>
                          <span className={`pay-status-pill pay-status-${pay.status.toLowerCase()}`}>
                            {pay.status}
                          </span>
                        </td>
                        <td>
                          {pay.isAcknowledged ? (
                            <div className="pay-verified-receipt">
                              <TbCheck /> <span>Acknowledged</span>
                            </div>
                          ) : (
                            <button
                              className="pay-ack-action-btn"
                              onClick={() => handleAcknowledge(pay._id)}
                              disabled={submittingId !== null || pay.status !== "Paid"}
                              title={pay.status !== "Paid" ? "Awaiting successful payment trace" : "Click to verify receipt"}
                            >
                              {submittingId === pay._id ? (
                                <>
                                  <TbLoaderQuarter className="pay-spin" />
                                  <span>Saving...</span>
                                </>
                              ) : (
                                <span>Acknowledge</span>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payments;