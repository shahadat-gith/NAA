import React, { useState } from 'react';
import './TeacherPayments.css';
import CashPaymentModal from './CashPaymentModal';
import UpdateDuesModal from './UpdateDuesModal';

const TeacherPayments = ({ teacherDues = [], onPaymentSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDuesModalOpen, setIsDuesModalOpen] = useState(false); 
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedMonthData, setSelectedMonthData] = useState(null);
  const [expandedTeacherRow, setExpandedTeacherRow] = useState(null);

  // Use the backend list directly under a cleaner naming scheme
  const teachersList = teacherDues;

  const initiatePayoutWorkflow = (teacher, targetMonthObj) => {
    setSelectedTeacher(teacher);
    setSelectedMonthData(targetMonthObj);
    setIsModalOpen(true);
  };

  const toggleTeacherRowExpansion = (teacherId) => {
    setExpandedTeacherRow(prevId => (prevId === teacherId ? null : teacherId));
  };

  function formatCurrency(amount) {
    return `₹${(amount || 0).toLocaleString('en-IN')}`;
  }

  return (
    <div className="teacher-payments-container">
      {/* 1. Component Header Block */}
      <div className="teacher-payment-section-header">
        <h2 className="teacher-section-title">
          <i className="fas fa-wallet"></i> Payroll Management
        </h2>
        <div className="header-action-button-group">
          <button 
            className="teacher-create-dues-btn"
            style={{ marginBottom: "15px" }}
            onClick={() => setIsDuesModalOpen(true)}
          >
            <i className="fas fa-calendar-plus"></i> Update Due
          </button>
        </div>
      </div>

      {/* 2. MASTER PAYROLL WORKSHEET TABLE */}
      <div className="teacher-payments-table-container">
        <div className="table-header-titleblock">
          <h3><i className="fas fa-list-alt"></i> Payroll Worksheet</h3>
          <p>Click on a teacher with an outstanding balance to view monthly details and issue manual cash disbursements.</p>
        </div>
        
        <table className="teacher-payments-table">
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Outstanding Liability</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {teachersList.length > 0 ? (
              teachersList.map((teacher) => {
                const isExpanded = expandedTeacherRow === teacher._id;
                const hasDues = teacher.totalDue > 0;

                return (
                  <React.Fragment key={teacher._id}>
                    <tr 
                      className={`teacher-master-row ${hasDues ? 'has-liabilities' : 'cleared'} ${isExpanded ? 'row-expanded' : ''}`}
                      onClick={() => hasDues && toggleTeacherRowExpansion(teacher._id)}
                    >
                      <td>
                        <div className="teacher-profile-cell-block">
                          <span className="teacher-display-name">{teacher.name}</span>
                          <span className="teacher-display-subtext"><i className="fas fa-envelope"></i> {teacher.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`balance-text ${hasDues ? 'due-alert' : 'clean-settled'}`}>
                          {formatCurrency(teacher.totalDue)}
                        </span>
                      </td>
                      <td>
                        {hasDues ? (
                          <span className="due-months-count-badge">
                            {(teacher.dueMonths || []).length} Month(s) Pending
                          </span>
                        ) : (
                          <span className="payment-status-badge teacher-status-paid">Fully Settled</span>
                        )}
                      </td>
                    </tr>

                    {/* Collapsible Due Month Breakdowns */}
                    {hasDues && isExpanded && (
                      <tr className="collapsible-subtable-nested-row">
                        <td colSpan="3">
                          <div className="nested-due-months-wrapper">
                            <div className="due-months-grid-flex">
                              {(teacher.dueMonths || []).map((dueBlock, keyIdx) => (
                                <div key={keyIdx} className="nested-month-action-card">
                                  <div className="month-metadata">
                                    <span className="cal-month">
                                      <i className="fas fa-calendar-alt"></i> {dueBlock.month}
                                    </span>
                                    <span className="cal-amount">
                                      {formatCurrency(dueBlock.amount)}
                                    </span>
                                  </div>
                                  {dueBlock.description && (
                                    <p className="due-block-desc">"{dueBlock.description}"</p>
                                  )}
                                  <button 
                                    className="disburse-cash-cta-btn"
                                    onClick={(e) => {
                                      e.stopPropagation(); 
                                      initiatePayoutWorkflow(teacher, dueBlock);
                                    }}
                                  >
                                    <i className="fas fa-money-bill-wave"></i> Pay
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="3" className="empty-table-fallback">No employee profiles found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Centralized Cash Payment Action Modal Context Hook */}
      {isModalOpen && selectedTeacher && selectedMonthData && (
        <CashPaymentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTeacher(null);
            setSelectedMonthData(null);
          }}
          onPaymentSuccess={() => {
            setIsModalOpen(false);
            setSelectedTeacher(null);
            setSelectedMonthData(null);
            onPaymentSuccess?.(); 
          }}
          teacherId={selectedTeacher._id}
          teacherName={selectedTeacher.name}
          salaryMonth={selectedMonthData.month}
          amountDue={selectedMonthData.amount}
        />
      )}

      {/* 4. Dynamic Create Dues Context Modal Hook */}
      {isDuesModalOpen && (
        <UpdateDuesModal
          isOpen={isDuesModalOpen}
          onClose={() => setIsDuesModalOpen(false)}
          onDuesCreatedSuccess={() => {
            setIsDuesModalOpen(false);
            onPaymentSuccess?.(); 
          }}
          teachersList={teachersList} 
        />
      )}
    </div>
  );
};

export default TeacherPayments;