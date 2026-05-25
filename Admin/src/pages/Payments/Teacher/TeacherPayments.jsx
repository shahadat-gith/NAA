import React, { useState } from 'react';
import './TeacherPayments.css';
import ManageDuesModal from './ManageDuesModal';

const TeacherPayments = ({ teacherDues = [], onPaymentSuccess }) => {
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('clear'); // 'clear' or 'update'
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedMonthData, setSelectedMonthData] = useState(null);
  const [expandedTeacherRow, setExpandedTeacherRow] = useState(null);

  const teachersList = teacherDues;

  // Open modal in 'clear' mode when clicking a specific month's pay button
  const handleOpenForClear = (teacher, dueBlock) => {
    setSelectedTeacher(teacher);
    setSelectedMonthData(dueBlock);
    setModalMode('clear');
    setIsManageModalOpen(true);
  };

  // Open modal in 'update' mode for a specific teacher via the new action column
  const handleOpenForUpdate = (teacher) => {
    setSelectedTeacher(teacher);
    setSelectedMonthData(null);
    setModalMode('update');
    setIsManageModalOpen(true);
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
              <th>Actions</th>
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
                      style={{ cursor: hasDues ? 'pointer' : 'default' }}
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
                        <button 
                          className="teacher-create-dues-btn"
                          style={{ margin: 0, padding: "6px 12px", fontSize: "0.85rem" }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevents collapsing/expanding the row
                            handleOpenForUpdate(teacher);
                          }}
                        >
                          <i className="fas fa-calendar-plus"></i> Update Due
                        </button>
                      </td>
                    </tr>

                    {/* Collapsible Due Month Breakdowns */}
                    {hasDues && isExpanded && (
                      <tr className="collapsible-subtable-nested-row">
                        <td colSpan="4">
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
                                  <button 
                                    className="disburse-cash-cta-btn"
                                    onClick={(e) => {
                                      e.stopPropagation(); 
                                      handleOpenForClear(teacher, dueBlock);
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
                <td colSpan="4" className="empty-table-fallback">No employee profiles found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Unified Dues Management Modal Hook */}
      <ManageDuesModal
        isOpen={isManageModalOpen}
        onClose={() => {
          setIsManageModalOpen(false);
          setSelectedTeacher(null);
          setSelectedMonthData(null);
        }}
        onSuccess={() => {
          setIsManageModalOpen(false);
          setSelectedTeacher(null);
          setSelectedMonthData(null);
          onPaymentSuccess?.(); 
        }}
        teachersList={teachersList}
        initialTeacher={selectedTeacher}
        initialMonthBlock={selectedMonthData}
        defaultMode={modalMode}
      />
    </div>
  );
};

export default TeacherPayments;