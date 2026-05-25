import React, { useState, useMemo } from 'react';
import './StudentPayments.css';

const StudentPayments = ({ chartData = {} }) => {
  const [sortBy, setSortBy] = useState('amount');
  const [filterMethod, setFilterMethod] = useState('all');

  const {
    monthlyInflowTrend = [],
    paymentMethodShare = []
  } = chartData;

  // Calculate max amount for bar chart scaling
  const maxAmount = useMemo(() => {
    const amounts = monthlyInflowTrend.map(item => item.amount || 0);
    return Math.max(...amounts, 1);
  }, [monthlyInflowTrend]);

  // Calculate method breakdown statistics
  const methodStats = useMemo(() => {
    return paymentMethodShare.map(method => ({
      ...method,
      icon: getMethodIcon(method._id)
    }));
  }, [paymentMethodShare]);

  // Calculate total statistics
  const totalCollected = useMemo(() => {
    return monthlyInflowTrend.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [monthlyInflowTrend]);

  const avgMonthly = useMemo(() => {
    return monthlyInflowTrend.length > 0 ? Math.round(totalCollected / monthlyInflowTrend.length) : 0;
  }, [monthlyInflowTrend, totalCollected]);

  function getMethodIcon(method) {
    const icons = {
      'Cash': '💵',
      'UPI': '📱',
      'Bank Transfer': '🏦',
      'Online': '💳',
      'Cheque': '🔏'
    };
    return icons[method] || '💰';
  }

  function formatCurrency(amount) {
    return `₹${(amount || 0).toLocaleString('en-IN')}`;
  }

  if (monthlyInflowTrend.length === 0 && paymentMethodShare.length === 0) {
    return (
      <div className="student-payments-container">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <div className="empty-text">No Student Payment Data</div>
          <div className="empty-subtext">Payment records will appear here once students make payments</div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-payments-container">
      {/* Section Header */}
      <div className="payment-section-header">
        <h2 className="section-title">
          <i className="fas fa-graduation-cap"></i>
          Student Payment Analytics
        </h2>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid-container">
        <div className="stat-card revenue">
          <span className="card-label">Total Collection</span>
          <h3>{formatCurrency(totalCollected)}</h3>
          <p className="sub-text">From all students</p>
        </div>

        <div className="stat-card revenue">
          <span className="card-label">Monthly Average</span>
          <h3>{formatCurrency(avgMonthly)}</h3>
          <p className="sub-text">Across {monthlyInflowTrend.length} months</p>
        </div>

        <div className="stat-card revenue">
          <span className="card-label">Payment Methods</span>
          <h3>{paymentMethodShare.length}</h3>
          <p className="sub-text">Different payment modes used</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Monthly Inflow Trend Chart */}
        <div className="chart-card">
          <div className="chart-title">
            <i className="fas fa-chart-line"></i>
            Monthly Inflow Trend
          </div>
          <div className="bar-chart">
            {monthlyInflowTrend.length > 0 ? (
              monthlyInflowTrend.map((item, idx) => (
                <div key={idx} className="chart-bar-item">
                  <div className="bar-label">{item.month}</div>
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${((item.amount || 0) / maxAmount) * 100}%`
                      }}
                    >
                      {((item.amount || 0) / maxAmount) * 100 > 15 && (
                        <span>{formatCurrency(item.amount)}</span>
                      )}
                    </div>
                  </div>
                  <div className="bar-value">{formatCurrency(item.amount)}</div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#95a5a6', padding: '20px' }}>
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Payment Method Breakdown */}
        <div className="chart-card">
          <div className="chart-title">
            <i className="fas fa-credit-card"></i>
            Payment Method Breakdown
          </div>
          <div className="method-breakdown">
            {methodStats.length > 0 ? (
              methodStats.map((method, idx) => (
                <div key={idx} className="method-card">
                  <div className="method-icon">{method.icon}</div>
                  <div className="method-name">{method._id}</div>
                  <div className="method-count">{method.count}</div>
                  <div className="method-amount">{formatCurrency(method.totalAmount)}</div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#95a5a6', gridColumn: '1/-1', padding: '20px' }}>
                No payment method data
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Table */}
      {monthlyInflowTrend.length > 0 && (
        <div className="payments-table-container">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Amount Collected</th>
                <th>Percentage of Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {monthlyInflowTrend.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <strong>{item.month}</strong>
                  </td>
                  <td>{formatCurrency(item.amount)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px', height: '6px', background: 'var(--bg-surface-2)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${((item.amount || 0) / totalCollected) * 100}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-bright) 100%)',
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </div>
                      <span>{((item.amount || 0) / totalCollected * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td>
                    <span className="status-badge status-paid">Completed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentPayments;