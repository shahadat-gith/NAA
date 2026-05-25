import React, { useState, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'; 
import { AdminContext } from '../../../context/AdminContext';
import './UpdateDuesModal.css'; 

const UpdateDuesModal = ({ isOpen, onClose, onDuesCreatedSuccess, teachersList = [] }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [teacherId, setTeacherId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;


  const parseBillingMonthLabel = (dateString) => {
    if (!dateString) return "";
    const [year, month] = dateString.split('-');
    const dateObj = new Date(year, parseInt(month, 10) - 1);
    return dateObj.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    const databaseMonthLabel = parseBillingMonthLabel(selectedMonth);

    if (!teacherId || !databaseMonthLabel || isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please select a teacher and fill all mandatory fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/payments/teacher/create-dues`,
        {
          teacherId,
          month: databaseMonthLabel, 
          amount: parsedAmount,
        },
        {
          headers: { Authorization: `Bearer ${adminToken}` }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Teacher liability log generated successfully.");
        setTeacherId('');
        setSelectedMonth('');
        setAmount('');
        onDuesCreatedSuccess();
      }
    } catch (error) {
      console.error("Dues submission failure block:", error);
      toast.error(error.response?.data?.message || "Failed to push outstanding month data rows.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ud-modal-backdrop" onClick={onClose}>
      <div className="ud-modal-window" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="ud-modal-header">
          <h2 className="ud-modal-heading">
            <i className="fas fa-calendar-plus"></i> Generate Outstanding Due
          </h2>
          <button className="ud-modal-close-trigger" onClick={onClose} disabled={loading} aria-label="Close modal">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Modal Body Form */}
        <div className="ud-modal-body">
          <form onSubmit={handleSubmit} className="ud-dues-form">
            
            {/* Horizontally Scrollable Teacher Selection List Row */}
            <div className="ud-form-group">
              <label className="ud-form-label">
                Select Target Staff Profile <span className="ud-form-required-indicator">*</span>
              </label>
              
              <div className="ud-teacher-scroller-container">
                {teachersList.length > 0 ? (
                  teachersList.map((staff) => {
                    const isSelected = teacherId === staff._id;
                    return (
                      <div 
                        key={staff._id}
                        className={`ud-teacher-scroll-card ${isSelected ? 'ud-card-selected' : ''} ${loading ? 'ud-card-disabled' : ''}`}
                        onClick={() => !loading && setTeacherId(staff._id)}
                      >
                        <div className="ud-avatar-wrapper">
                          {staff.image ? (
                            <img src={staff.image} alt={staff.name} className="ud-teacher-scroll-img" />
                          ) : (
                            <div className="ud-teacher-scroll-placeholder">
                              <i className="fas fa-user"></i>
                            </div>
                          )}
                          {isSelected && (
                            <div className="ud-selected-check-badge">
                              <i className="fas fa-check-circle"></i>
                            </div>
                          )}
                        </div>
                        <span className="ud-teacher-scroll-name" title={staff.name}>
                          {staff.name}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="ud-empty-scroller-fallback">No teacher profiles available.</div>
                )}
              </div>
            </div>

            {/* Month Input Selection */}
            <div className="ud-form-group">
              <label className="ud-form-label">Billing Cycle Target Month <span className="ud-form-required-indicator">*</span></label>
              <input
                type="month" 
                className="ud-form-input"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Base Due Liability Amount Input */}
            <div className="ud-form-group">
              <label className="ud-form-label">Assigned Due Balance Amount (₹) <span className="ud-form-required-indicator">*</span></label>
              <div className="ud-input-wrapper-currency">
                <span className="ud-currency-addon">₹</span>
                <input
                  type="number"
                  className="ud-form-input ud-form-input-currency"
                  placeholder="e.g. 25000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Form Action Submits Row */}
            <div className="ud-modal-actions-footer">
              <button type="button" className="ud-action-btn ud-action-btn-dismiss" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="ud-action-btn ud-action-btn-submit" disabled={loading || !teacherId}>
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Processing...</> : <>Submit</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateDuesModal;