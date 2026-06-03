import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import AttendanceHistoryByTeacher from './AttendanceHistoryByTeacher';
import './attendance.css'; // Importing your custom cyber-theme variables

const AttendanceDashboard = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const [overviewData, setOverviewData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);

  const fetchOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${backendUrl}/api/attendance/overview`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (data.success) {
        setOverviewData(data.overview);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to parse system attendance profiles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) fetchOverview();
  }, [adminToken]);

  const formatMonthName = (monthNum) => {
    return new Date(2026, monthNum - 1, 1).toLocaleString('default', { month: 'short' });
  };

  const filteredStaff = overviewData.filter(member => {
    if (activeTab === 'All') return true;
    return member.staffType === activeTab;
  });

  if (loading) {
    return (
      <div className="attendance-workspace" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (selectedTeacherId) {
    return (
      <AttendanceHistoryByTeacher
        teacherId={selectedTeacherId}
        onBack={() => setSelectedTeacherId(null)}
      />
    );
  }

  return (
    <div className="attendance-workspace">
      <div className="attendance-container">
        
        {/* Upper Navigation Header */}
        <header className="attendance-header">
          <div className="attendance-title">
            <h1>Attendance Workspace</h1>
            <p>Monitor daily tracking metrics across institutional cadres.</p>
          </div>
          <button onClick={fetchOverview} className="btn-action">
            Refresh Statistics
          </button>
        </header>

        {error && (
          <div style={{ color: 'var(--color-error)', backgroundColor: 'var(--color-error-bg)', borderColor: 'var(--color-error-border)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', borderWidth: '1px', borderStyle: 'solid', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {/* Segmented Filter Tabs */}
        <div className="segmented-controls">
          {['All', 'Teaching', 'Non-Teaching'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-trigger ${activeTab === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid Container for Staff List */}
        <div className="attendance-grid">
          {filteredStaff.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', border: '1px dashed var(--border-default)', borderRadius: 'var(--radius-lg)' }}>
              No active staff matches found in this category layer.
            </div>
          ) : (
            filteredStaff.map((member) => {
              const stats = member.currentMonthStats || { present: 0, absent: 0, total: 0 };
              const ratio = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

              return (
                <div key={member._id} className="staff-card">
                  
                  {/* Segment A: Profile Identity Details */}
                  <div className="meta-segment">
                    <img 
                      src={member.image?.url || 'https://via.placeholder.com/150'} 
                      alt={member.name}
                      className="avatar"
                    />
                    <div className="identity-info">
                      <h3>{member.name}</h3>
                      <p>{member.designation}</p>
                      <span className={`badge ${member.staffType === 'Teaching' ? 'badge-teaching' : 'badge-non-teaching'}`}>
                        {member.staffType}
                      </span>
                    </div>
                  </div>

                  {/* Segment B: Current Month Statistics */}
                  <div className="stats-segment">
                    <div className="ratio-display">
                      <div className="ratio-value">{ratio}%</div>
                      <div className="ratio-label">Ratio</div>
                    </div>
                    <div className="metrics-row">
                      <div className="metric-box present">
                        <div className="metric-num">{stats.present}</div>
                        <div className="metric-lbl">Present</div>
                      </div>
                      <div className="metric-box absent">
                        <div className="metric-num">{stats.absent}</div>
                        <div className="metric-lbl">Absent</div>
                      </div>
                      <div className="metric-box total">
                        <div className="metric-num">{stats.total}</div>
                        <div className="metric-lbl">Total</div>
                      </div>
                    </div>
                  </div>

                  {/* Segment C: Last 5 Months Rolling Summary */}
                  <div className="history-segment">
                    <h4>Rolling Historical Summary</h4>
                    <div className="timeline-track-grid">
                      {member.monthlyHistory?.slice(-5).map((history, idx) => {
                        const pct = history.totalCount > 0 ? Math.round((history.presentCount / history.totalCount) * 100) : 0;
                        return (
                          <div key={idx} className="timeline-pill">
                            <div className="pill-month">{formatMonthName(history.month)}</div>
                            <div className="pill-track">
                              <div className="pill-fill" style={{ width: `${pct}%` }} />
                            </div>
                            <div className="pill-percent">{pct}%</div>
                          </div>
                        );
                      })}
                      {(!member.monthlyHistory || member.monthlyHistory.length === 0) && (
                        <div style={{ gridColumn: 'span 5', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.25rem 0' }}>
                          No historical timeline points tracked yet.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Segment D: Navigation Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => setSelectedTeacherId(member._id)}
                      className="btn-primary"
                    >
                      Analyze Logs
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default AttendanceDashboard;