import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './ManageDuesModal.css';
import { AdminContext } from '../../../context/AdminContext';

const ManageDuesModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  initialTeacher = null,
  initialMonthBlock = null,
  defaultMode = 'clear' 
}) => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  
  const [activeMode, setActiveMode] = useState(defaultMode);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  // Converts "Month YYYY" (e.g., "August 2025") back to "YYYY-MM" for standard HTML input fields
  const convertLabelToMonthInput = (labelString) => {
    if (!labelString) return '';
    const date = new Date(Date.parse(labelString));
    if (isNaN(date)) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  // Converts standard input formatting "YYYY-MM" to readable "Month YYYY" string configurations
  const parseBillingMonthLabel = (dateString) => {
    if (!dateString) return "";
    if (dateString.includes(' ')) return dateString; 
    const [year, month] = dateString.split('-');
    const dateObj = new Date(year, parseInt(month, 10) - 1);
    return dateObj.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  };

  useEffect(() => {
    if (isOpen) {
      setActiveMode(defaultMode);

      if (defaultMode === 'clear' && initialMonthBlock) {
        setSelectedMonth(convertLabelToMonthInput(initialMonthBlock.month));
        setAmount((initialMonthBlock.amount || 0).toString());
      } else {
        setSelectedMonth('');
        setAmount('');
      }
    }
  }, [isOpen, initialMonthBlock, defaultMode]);

  if (!isOpen || !initialTeacher) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    
    if (isNaN(numericAmount) || numericAmount <= 0 || !selectedMonth) {
      toast.error("Please provide valid month and balance values.");
      return;
    }

    setLoading(true);
    try {
      let endpoint = '';
      let payload = {};

      if (activeMode === 'clear') {
        endpoint = `${backendUrl}/api/payments/teacher/pay-cash`;
        payload = {
          teacherId: initialTeacher._id,
          amount: numericAmount,
          salaryMonth: parseBillingMonthLabel(selectedMonth), 
        };
      } else {
        endpoint = `${backendUrl}/api/payments/teacher/create-dues`;
        payload = {
          teacherId: initialTeacher._id,
          month: parseBillingMonthLabel(selectedMonth),
          amount: numericAmount,
        };
      }

      const response = await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Ledger entry successfully updated.');
        onSuccess?.();
      } else {
        toast.error(response.data.message || 'Operation rejected by database.');
      }
    } catch (err) {
      console.error('Ledger Processing Fault:', err);
      toast.error(err.response?.data?.message || 'Database validation processing failure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mdm-modal-backdrop" onClick={onClose}>
      <div className="mdm-modal-window" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header Profile Context Section */}
        <div className="mdm-modal-header" style={{ padding: '20px 24px 15px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Teacher Image Avatar Rendering Block */}
          <div className="mdm-header-avatar-wrapper" style={{ width: '90px', height: '90px', flexShrink: 0 }}>
            <img 
                src={initialTeacher.image || "/user.png"} 
                alt={initialTeacher.name} 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-default)' }} 
              />
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
              {activeMode === 'clear' ? '🎉 Record Cash Disbursement' : 'Update Outstanding Dues'}
            </h3>
            <p style={{ margin: '3px 0 0', color: '#666', fontSize: '0.9rem' }}>
              Teacher: <strong>{initialTeacher.name}</strong> ({initialTeacher.contact || initialTeacher.email})
            </p>
          </div>
        </div>

        <div className="mdm-modal-body">
          <form onSubmit={handleSubmit} className="mdm-core-form">
            
            {/* Input Element: Month Picker */}
            <div className="mdm-form-group">
              <label className="mdm-form-label">Month <span className="mdm-required-indicator">*</span></label>
              <input
                type="month" 
                className="mdm-form-control-input"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                required
                disabled={loading || activeMode === 'clear'} 
              />
            </div>

            {/* Input Element: Amount Entry */}
            <div className="mdm-form-group">
              <label className="mdm-form-label">Amount <span className="mdm-required-indicator">*</span></label>
              <div className="mdm-currency-input-container">
                <span className="mdm-currency-prefix-icon">₹</span>
                <input
                  type="number"
                  placeholder="e.g. 25000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mdm-form-control-input mdm-currency-padded-input"
                  min="1"
                  step="1"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Actions Form Footer Panel Control Elements */}
            <div className="mdm-modal-actions-footer">
              <button type="button" className="mdm-btn mdm-btn-dismiss" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button 
                type="submit" 
                className={`mdm-btn ${activeMode === 'clear' ? 'mdm-btn-success' : 'mdm-btn-primary'}`}
                disabled={loading || !selectedMonth || !amount}
              >
                {loading ? (
                  <><i className="fas fa-spinner fa-spin"></i> Processing...</>
                ) : activeMode === 'clear' ? (
                  <>Disburse Payment</>
                ) : (
                  <><i className="fas fa-save"></i> Save Changes</>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default ManageDuesModal;