import React, { useState } from 'react';

const TasksFilter = ({ searchQuery,
  filterStatus,
  handleSearchTasks,
  setFilterStatus,
  sortBy,
  handleSort,
  setSortOrder,
  sortOrder }) => {
  return (
    <div className="task-filters">
      <div className="search-container-tasks">
        <input
          type="text"
          placeholder="Search tasks..."
          className="search-bar-tasks"
          value={searchQuery}
          onChange={handleSearchTasks}
        />
        <i className="search-icon-tasks">🔍</i>
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="dueDate">Due Date</option>
            <option value="taskName">Task Name</option>
            <option value="status">Status</option>
            <option value="createdAt">Created Date</option>
          </select>
          <button
            className="sort-order-btn"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TasksFilter;
