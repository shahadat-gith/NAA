import React from 'react';

const TaskSummary = ({ tasks }) => {
  return (
      <div className="tasks-summary">
        <div className="summary-item">
          <span className="summary-count">{tasks.filter(t => t.status !== 'Completed').length}</span>
          <span className="summary-label">Pending Tasks</span>
        </div>
        
        <div className="summary-item">
          <span className="summary-count">{tasks.filter(t => t.status === 'Completed').length}</span>
          <span className="summary-label">Completed</span>
        </div>
        
        <div className="summary-item">
          <span className="summary-count">{tasks.length}</span>
          <span className="summary-label">Total Tasks</span>
        </div>
      </div>
  );
};

export default TaskSummary;
