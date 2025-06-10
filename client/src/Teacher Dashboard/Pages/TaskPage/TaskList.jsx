import React, { useContext } from 'react';
import { AppContext } from '../../../context/AppContext';

const TaskList = ({
  isLoading,
  filteredTasks,
  searchQuery,
  filterStatus,
  getTimeRemaining,
  formatDate,
  expandedTaskId,
  handleFileUpload,
  handleTaskCompletion,
  toggleExpandTask
}) => {
  const { backendUrl } = useContext(AppContext);

  return (
    <div className="tasks-container">
      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="no-tasks">
          <div className="empty-illustration">📋</div>
          <h3>No tasks found</h3>
          <p>
            {searchQuery || filterStatus !== 'All'
              ? 'Try adjusting your filters or search query'
              : 'You have no assigned tasks at the moment'}
          </p>
        </div>
      ) : (
        <div className="tasks-list">
          {filteredTasks.map(task => (
            <div
              key={task._id}
              className={`task-card ${task.status.toLowerCase()}`}
            >
              <div className="task-card-header">
                <h3 className="task-name">{task.taskName}</h3>
                <div className="task-meta">
                  <span className={`task-status status-${task.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {task.status}
                  </span>
                </div>
              </div>

              <div className="task-dates">
                <div className="task-due-date">
                  <span className="due-label">
                    {getTimeRemaining(task.dueDate)}
                  </span>
                  <span className="date-value">{formatDate(task.dueDate)}</span>
                </div>
                <div className="task-assigned">
                  <span className="assigned-label">Assigned by:</span>
                  <span className="assigned-value">{task.assignedBy}</span>
                </div>
              </div>

              <div className={`task-details ${expandedTaskId === task._id ? 'expanded' : ''}`}>
                {expandedTaskId === task._id && (
                  <>
                    <div className="task-description">
                      <h4>Description</h4>
                      <p>{task.taskDescription || 'No description provided.'}</p>
                    </div>
                    <div className="task-dates-detailed">
                      <div className="date-item">
                        <span className="date-label">Created:</span>
                        <span className="date-value">{formatDate(task.createdAt)}</span>
                      </div>
                      {task.status === 'Completed' && task.completedAt && (
                        <div className="date-item">
                          <span className="date-label">Completed:</span>
                          <span className="date-value">{formatDate(task.completedAt)}</span>
                        </div>
                      )}
                    </div>
                    <div className="task-file-section">
                      {task.file ? (
                        <div className="task-file">
                          <span className="file-icon">📎</span>
                          <span className="file-name">{task.fileName || 'Attached file'}</span>
                          <a
                            href={`${backendUrl}${task.file}`}
                            className="file-action"
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            Download
                          </a>
                        </div>
                      ) : (
                        <div className="file-upload">
                          <label className="upload-label">
                            <span className="upload-icon">📤</span>
                            <span>Upload File</span>
                            <input
                              type="file"
                              onChange={(e) => handleFileUpload(task._id, e)}
                              className="upload-input"
                            />
                          </label>
                          <span className="upload-help">file max size: 10MB</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="task-actions-container">
                <button
                  className="toggle-details-btn"
                  onClick={() => toggleExpandTask(task._id.toString())}
                >
                  {expandedTaskId === task._id ? 'Hide Details' : 'Show Details'}
                </button>
                {task.status !== 'Completed' && (
                  <button
                    className="complete-task-btn"
                    onClick={() => handleTaskCompletion(task._id.toString())}
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;