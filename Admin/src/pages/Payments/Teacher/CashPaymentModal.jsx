import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './CashPaymentModal.css';
import { AdminContext } from '../../../context/AdminContext';

const CashPaymentModal = ({ 
  isOpen, 
  onClose, 
  onPaymentSuccess, 
  teacherId, 
  teacherName, 
  salaryMonth, 
  amountDue 
}) => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  
  const [payAmount, setPayAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync state whenever the admin opens a different contextual due month block
  useEffect(() => {
    if (isOpen && amountDue) {
      setPayAmount(amountDue.toString());
      setError('');
    }
  }, [isOpen, amountDue, salaryMonth]);

  if (!isOpen) return null;

  const handleAmountChange = (e) => {
    setPayAmount(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(payAmount);

    // Form field state validations
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid positive payment amount.');
      return;
    }

    if (numericAmount > amountDue) {
      setError(`Overpayment warning: Maximum due for this month is ₹${amountDue.toLocaleString('en-IN')}`);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/payments/teacher/pay-cash`,
        {
          teacherId,
          amount: numericAmount,
          salaryMonth,
        },
        {
          headers: { Authorization: `Bearer ${adminToken}` }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || 'Transaction recorded securely.');
        onPaymentSuccess?.(); 
      } else {
        toast.error(response.data.message || 'Failed to record payment.');
      }
    } catch (err) {
      console.error('Error recording payment:', err);
      toast.error(err.response?.data?.message || 'Server Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-modal-backdrop" onClick={onClose}>
      <div className="cp-modal-window" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="cp-modal-header">
          <h2 className="cp-modal-heading">
            <i className="fas fa-money-bill-wave"></i> Process Cash Disbursement
          </h2>
          <button 
            className="cp-modal-close-trigger" 
            onClick={onClose}
            disabled={loading}
            aria-label="Close modal"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Modal Body Form */}
        <div className="cp-modal-body">
          
          {/* Read-Only Context Summary Grid */}
          <div className="cp-summary-banner">
            <div className="cp-summary-item">
              <span className="cp-summary-label">Employee Name</span>
              <strong className="cp-summary-value">{teacherName}</strong>
            </div>
            <div className="cp-summary-item">
              <span className="cp-summary-label">Target Month</span>
              <strong className="cp-summary-value">{salaryMonth}</strong>
            </div>
            <div className="cp-summary-item">
              <span className="cp-summary-label">Outstanding Owed</span>
              <strong className="cp-summary-value cp-text-danger">₹{amountDue?.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="cp-payment-form">
            
            {/* Dynamic Editable Payment Input Field */}
            <div className="cp-form-group">
              <label htmlFor="payAmount" className="cp-form-label">
                Amount to Pay (₹) <span className="cp-form-required-indicator">*</span>
              </label>
              <div className="cp-input-wrapper-currency">
                <span className="cp-currency-addon">₹</span>
                <input
                  type="number"
                  id="payAmount"
                  placeholder="Enter custom distribution amount"
                  value={payAmount}
                  onChange={handleAmountChange}
                  className={`cp-form-input ${error ? 'cp-form-input-invalid' : ''}`}
                  min="0.01"
                  max={amountDue}
                  step="1"
                  disabled={loading}
                  required
                />
              </div>
              {error && <span className="cp-validation-error-msg"><i className="fas fa-circle-exclamation"></i> {error}</span>}
            </div>


            {/* Form Actions Footers Row */}
            <div className="cp-modal-actions-footer">
              <button
                type="button"
                className="cp-action-btn cp-action-btn-dismiss"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cp-action-btn-submit"
                disabled={loading}
              >
                {loading ? (
                  <><i className="fas fa-spinner fa-spin"></i> Processing...</>
                ) : (
                  <>Submit </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default CashPaymentModal;