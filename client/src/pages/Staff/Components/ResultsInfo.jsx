// src/components/Staff/ResultsInfo.jsx
import React from 'react';

const ResultsInfo = ({
  currentTeachers,
  filteredTeachers,
  selectedDepartment,
  searchTerm,
}) => {
  return (
    <div className="results-info">
      <p>
        Showing {currentTeachers.length} of {filteredTeachers.length} teachers
        {selectedDepartment !== 'All' && ` in ${selectedDepartment}`}
        {searchTerm && ` matching "${searchTerm}"`}
      </p>
    </div>
  );
};

export default ResultsInfo;