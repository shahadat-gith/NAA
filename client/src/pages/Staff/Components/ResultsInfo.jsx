import React from 'react';

const ResultsInfo = ({
  currentTeachers,
  filteredTeachers,
  selectedSubject,
  searchTerm,
}) => {
  return (
    <div className="results-info">
      <p>
        Showing {currentTeachers.length} of {filteredTeachers.length} teachers
        {selectedSubject !== 'All' && ` teaching ${selectedSubject}`}
        {searchTerm && ` matching "${searchTerm}"`}
      </p>
    </div>
  );
};

export default ResultsInfo;