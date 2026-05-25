import React, { useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import "./Payments.css";
import TeacherPayments from './Teacher/TeacherPayments';
import StudentPayments from './Student/StudentPayments';
import { AdminContext } from '../../context/AdminContext';

const Payments = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [activeTab, setActiveTab] = useState('students');
  const [dashboard, setDashboard] = useState(null); // Holds response.data.dashboard
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Centralized dashboard data fetch handler
  const fetchDashboardData = useCallback(async (showLoadingCursor = false) => {
    if (!backendUrl || !adminToken) return;
    try {
      if (showLoadingCursor) setLoading(true);
      
      const response = await axios.get(`${backendUrl}/api/payments/admin/dashboard-data`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      if (response.data.success) {
        // Maps directly to the backend's "dashboard" property wrapper
        setDashboard(response.data.dashboard);
      } else {
        setError(response.data.message || "Failed to load financial data summaries.");
      }
    } catch (err) {
      console.error("Dashboard engine data load failure:", err);
      setError(err.response?.data?.message || "Internal server connection failure.");
    } finally {
      if (showLoadingCursor) setLoading(false);
    }
  }, [backendUrl, adminToken]);

  // Initial load hook
  useEffect(() => {
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  // Post-payment success data sync handler
  const handlePaymentSuccess = async () => {
    await fetchDashboardData(false); // Refreshes data dynamically in the background
  };

  if (loading) {
    return (
      <div className="payments-loading-container">
        <div className="spinner"></div>
        <p>Loading financial records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payments-error-container">
        <p className="error-badge"><i className="fas fa-exclamation-triangle"></i> Error</p>
        <p className="error-text">{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">Reload Page</button>
      </div>
    );
  }

  // Destructure the stats object safely from backend blueprint
  const { 
    totalIncome = 0, 
    totalExpense = 0, 
    totalPendingFees = 0, 
    totalTeacherDue = 0, 
    balance = 0 
  } = dashboard?.stats || {};

  return (
    <div className="payments-dashboard-container">
      {/* 1. Dynamic Control Navigation Tabs on Top */}
      <div className="navigation-tabs-wrapper">
        <button 
          className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`} 
          onClick={() => setActiveTab('students')}
        >
          <i className="fas fa-graduation-cap"></i> Student Payments
        </button>
        <button 
          className={`tab-btn ${activeTab === 'teachers' ? 'active' : ''}`} 
          onClick={() => setActiveTab('teachers')}
        >
          <i className="fas fa-chalkboard-teacher"></i> Teacher Payments
        </button>
      </div>

      {/* 2. KPI Summary Banner Grid */}
      <div className="stats-grid-container">
        <div className="stat-card revenue">
          <span className="card-label">Total Student Revenue</span>
          <h3>₹{totalIncome.toLocaleString('en-IN')}</h3>
          <p className="sub-text text-pending">₹{totalPendingFees.toLocaleString('en-IN')} Pending Invoice Rows</p>
        </div>

        <div className="stat-card expenses">
          <span className="card-label">Salaries Paid Out</span>
          <h3>₹{totalExpense.toLocaleString('en-IN')}</h3>
          <p className="sub-text text-outstanding">₹{totalTeacherDue.toLocaleString('en-IN')} Unresolved Liability</p>
        </div>

        <div className="stat-card margin">
          <span className="card-label">Net Liquidity Margin</span>
          <h3 className={balance >= 0 ? "positive-cash" : "negative-cash"}>
            ₹{balance.toLocaleString('en-IN')}
          </h3>
          <p className="sub-text">Inflow vs Outflow Balance</p>
        </div>
      </div>

      {/* 3. Active Panel Component Rendering */}
      <div className="dynamic-view-panel">
        {activeTab === 'students' && (
          <StudentPayments incomeData={dashboard?.income || { monthlyCollection: [], recentPayments: [] }} />
        )}

        {activeTab === 'teachers' && (
          <TeacherPayments 
            expenseData={dashboard?.expense || { monthlySalary: [], recentPayments: [] }} 
            teacherDues={dashboard?.teacherDues || []}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default Payments;