import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import './Attendance.css'; // Importing your custom cyber-theme variables

const AttendanceHistoryByTeacher = ({ teacherId, onBack }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [monthSummary, setMonthSummary] = useState({ present: 0, absent: 0, leave: 0, total: 0, percentage: 0 });
  const [monthlyHistory, setMonthlyHistory] = useState([]);
  const [overallPercentage, setOverallPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  
  const [filter, setFilter] = useState({
    month: String(new Date().getMonth() + 1),
    year: String(new Date().getFullYear())
  });

  const fetchDetailedLogs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/attendance/staff/${teacherId}`, {
        params: { month: filter.month, year: filter.year },
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (data.success) {
        setProfile(data.teacher);
        setLogs(data.records);
        setMonthSummary(data.monthSummary || { present: 0, absent: 0, leave: 0, total: 0, percentage: 0 });
        setMonthlyHistory(data.lastFiveMonthsSummary || []);
        setOverallPercentage(data.overallPercentage || 0);
        setFetchError(null);
      } else {
        setFetchError(data.message || 'Unable to load teacher attendance logs.');
      }
    } catch (err) {
      console.error("Historical log parsing breakdown failure:", err);
      setFetchError(err.response?.data?.message || 'Failed to load teacher attendance history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teacherId && adminToken) fetchDetailedLogs();
  }, [teacherId, filter.month, filter.year, adminToken]);

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: new Date(2026, i, 1).toLocaleString('default', { month: 'long' })
  }));
  
  const years = ["2025", "2026", "2027"];

  if (loading && !profile) {
    return (
      <div className="attendance-workspace" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="attendance-workspace">
      <div className="attendance-container">
        
        {/* Breadcrumb back navigation tracking option */}
        <button onClick={onBack} className="back-link">
          ← Return to Overview
        </button>

        {/* Error notification for teacher history fetch */}
        {fetchError && (
          <div style={{ color: 'var(--color-error)', backgroundColor: 'var(--color-error-bg)', borderColor: 'var(--color-error-border)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', borderWidth: '1px', borderStyle: 'solid', fontSize: '0.875rem' }}>
            {fetchError}
          </div>
        )}

        {/* Teacher Profile Identity Panel Banner Card */}
        {profile && (
          <div className="history-banner-card">
            <div className="meta-segment">
              <img 
                src={profile.image?.url || 'https://via.placeholder.com/150'} 
                alt={profile.name}
                className="avatar"
              />
              <div className="identity-info">
                <h3>{profile.name}</h3>
                <p>{profile.designation} • ID: {profile.staffId || 'N/A'}</p>
              </div>
            </div>

            {/* Form Filter Dropdown Control Group */}
            <div className="filter-select-group">
              <select 
                value={filter.month}
                onChange={(e) => setFilter(prev => ({ ...prev, month: e.target.value }))}
                className="custom-select"
              >
                {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>

              <select 
                value={filter.year}
                onChange={(e) => setFilter(prev => ({ ...prev, year: e.target.value }))}
                className="custom-select"
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        )}

        <div className="ledger-card">
          <h3>Attendance Summary</h3>

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 0' }}>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem', borderRadius: '1rem', backgroundColor: 'rgba(56, 139, 253, 0.08)', border: '1px solid rgba(56, 139, 253, 0.16)' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Month</span>
                  <h4 style={{ margin: '0.5rem 0 0.25rem' }}>{months.find(m => m.value === filter.month)?.label} {filter.year}</h4>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>Monthly attendance snapshot</p>
                </div>
                <div style={{ padding: '1rem', borderRadius: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.16)' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Present</span>
                  <h2 style={{ margin: '0.5rem 0 0' }}>{monthSummary.present}</h2>
                </div>
                <div style={{ padding: '1rem', borderRadius: '1rem', backgroundColor: 'rgba(248, 113, 113, 0.08)', border: '1px solid rgba(248, 113, 113, 0.16)' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Absent</span>
                  <h2 style={{ margin: '0.5rem 0 0' }}>{monthSummary.absent}</h2>
                </div>
                <div style={{ padding: '1rem', borderRadius: '1rem', backgroundColor: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.16)' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Leave</span>
                  <h2 style={{ margin: '0.5rem 0 0' }}>{monthSummary.leave}</h2>
                </div>
                <div style={{ padding: '1rem', borderRadius: '1rem', backgroundColor: 'rgba(96, 165, 250, 0.08)', border: '1px solid rgba(96, 165, 250, 0.16)' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Attendance %</span>
                  <h2 style={{ margin: '0.5rem 0 0' }}>{monthSummary.percentage}%</h2>
                </div>
              </div>

              <div style={{ padding: '1rem', borderRadius: '1rem', backgroundColor: 'rgba(241, 245, 249, 1)', border: '1px solid rgba(148, 163, 184, 0.16)' }}>
                <h4 style={{ margin: '0 0 1rem' }}>Five-month performance</h4>
                {monthlyHistory.length === 0 ? (
                  <div style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>No historical attendance data available for the last 5 months.</div>
                ) : (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {monthlyHistory.map((item) => (
                      <div key={`${item.year}-${item.month}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid rgba(148, 163, 184, 0.12)' }}>
                        <div>
                          <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Month</span>
                          <strong>{months[item.month - 1]?.label} {item.year}</strong>
                        </div>
                        <div>
                          <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Present</span>
                          <strong>{item.present}</strong>
                        </div>
                        <div>
                          <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Absent</span>
                          <strong>{item.absent}</strong>
                        </div>
                        <div>
                          <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Leave</span>
                          <strong>{item.leave}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '1rem', backgroundColor: 'rgba(30, 64, 175, 0.08)', border: '1px solid rgba(37, 99, 235, 0.18)' }}>
                  <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Overall percentage (last 5 months)</span>
                  <h3 style={{ margin: '0.5rem 0 0' }}>{overallPercentage}%</h3>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default AttendanceHistoryByTeacher;