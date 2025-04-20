import React, { useState, useEffect } from 'react';
import './Pagination.css';

const Pagination = ({ items, onPageDataChange, itemsPerPage = 4 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Clamp page within valid bounds
  const validPage = Math.min(Math.max(1, currentPage), totalPages || 1);

  useEffect(() => {
    // Update currentPage if it exceeds totalPages (e.g., when items change)
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }

    const startIdx = (validPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const currentItems = items.slice(startIdx, endIdx);
    onPageDataChange(currentItems);
  }, [currentPage, items, itemsPerPage, onPageDataChange, totalPages]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (validPage > 1) handlePageChange(validPage - 1);
  };

  const handleNext = () => {
    if (validPage < totalPages) handlePageChange(validPage + 1);
  };

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (validPage <= 3) {
      pages.push(1, 2, 3, '...', totalPages);
    } else if (validPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', validPage - 1, validPage, validPage + 1, '...', totalPages);
    }

    return pages;
  };

  return (
    <nav className="pagination-container">
      <div className="pagination-nav">
        <button
          onClick={handlePrevious}
          disabled={validPage === 1}
          className="pagination-button"
          aria-label="Previous page"
        >
          Prev
        </button>

        <div className="pagination-numbers">
          {getPageNumbers().map((pageNumber, index) =>
            pageNumber === '...' ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                ...
              </span>
            ) : (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`pagination-number ${
                  validPage === pageNumber ? 'active' : ''
                }`}
                aria-label={`Page ${pageNumber}`}
                aria-current={validPage === pageNumber ? 'page' : null}
              >
                {pageNumber}
              </button>
            )
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={validPage === totalPages || totalPages === 0}
          className="pagination-button"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </nav>
  );
};

export default Pagination;