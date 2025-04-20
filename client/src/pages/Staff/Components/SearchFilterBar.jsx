import React from 'react';
import FilterPanel from './FilterPanel';

const SearchFilterBar = ({
  searchTerm,
  setSearchTerm,
  isFilterOpen,
  setIsFilterOpen,
  departments,
  selectedDepartment,
  setSelectedDepartment,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  resetFilters,
}) => {
  return (
    <div className="search-filter-container">
      <div className="search-bar">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search for teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchTerm('')}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        <button
          className={`filter-toggle-btn ${isFilterOpen ? 'active' : ''}`}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <i className="fas fa-filter"></i>
          <span>Filter</span>
        </button>
      </div>

      {isFilterOpen && (
        <div className="filter-panel">
          <FilterPanel
            departments={departments}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            resetFilters={resetFilters}
          />
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;