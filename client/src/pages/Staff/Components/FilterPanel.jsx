import React from 'react';

const FilterPanel = ({
  subjects,
  selectedSubject,
  setSelectedSubject,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  resetFilters,
}) => {
  return (
    <>
      <div className="filter-options">
        <div className="filter-group">
          <label htmlFor="subject-filter">Subject</label>
          <select
            id="subject-filter"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="filter-select"
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="sort-by">Sort By</label>
          <select
            id="sort-by"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="filter-select"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="subject-asc">Subject (A-Z)</option>
            <option value="subject-desc">Subject (Z-A)</option>
            <option value="experience-desc">Experience (High-Low)</option>
            <option value="experience-asc">Experience (Low-High)</option>
          </select>
        </div>
      </div>
      <div className="filter-actions">
        <button className="reset-btn" onClick={resetFilters}>
          Reset All Filters
        </button>
      </div>
    </>
  );
};

export default FilterPanel;