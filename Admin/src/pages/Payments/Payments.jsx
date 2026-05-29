import React, { useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import "./Payments.css";
import TeacherPayments from './Teacher/TeacherPayments';
import StudentPayments from './Student/StudentPayments';
import { AdminContext } from '../../context/AdminContext';

const Payments = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [activeTab, setActiveTab] = useState('students');
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  const fetchDashboardData = useCallback(async (showLoadingCursor = false) => {
    if (!backendUrl || !adminToken) return;
    try {
      if (showLoadingCursor) setLoading(true);
      
      const response = await axios.get(`${backendUrl}/api/payments/admin/dashboard-data`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      if (response.data.success) {
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

  useEffect(() => {
    fetchDashboardData(true);
  }, [fetchDashboardData]);

 
  const handlePaymentSuccess = async () => {
    await fetchDashboardData(false);
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

  return (
    <div className="payments-dashboard-container">
      {/* 1. Dynamic Control Navigation Tabs on Top */}
      <div className="navigation-tabs-wrapper">
        <button 
          className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`} 
          onClick={() => setActiveTab('students')}
        >
          <i className="fas fa-graduation-cap"></i> Student
        </button>
        <button 
          className={`tab-btn ${activeTab === 'teachers' ? 'active' : ''}`} 
          onClick={() => setActiveTab('teachers')}
        >
          <i className="fas fa-chalkboard-teacher"></i> Teacher
        </button>
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