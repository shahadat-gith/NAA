import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.css';
import { pages, highlight } from './utils';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({onClose}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const navigate = useNavigate()

  // Only filter when user types
  const filteredPages = searchTerm ? pages.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(!!value);
    setActiveIndex(-1);
  };

  const handleFocus = () => {
    if (searchTerm) setIsOpen(true);
  };

  const handlePageClick = (path) => {
    navigate(path)
    setSearchTerm('');
    setIsOpen(false);
    setActiveIndex(-1);
    onClose()
  };

  const handleClear = () => {
    setSearchTerm('');
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleCloseDropdown = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, filteredPages.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0 && filteredPages[activeIndex]) {
      handlePageClick(filteredPages[activeIndex].path);
    } else if (e.key === 'Escape') {
      handleCloseDropdown();
      inputRef.current?.blur();
    }
  };

  return (
    <div className="sb-container" ref={searchRef}>
      <div className="sb-input-wrap">

        {/* Search Icon */}
        <i className="fas fa-search sb-search-icon"></i>

        <input
          ref={inputRef}
          type="text"
          className="sb-input"
          placeholder="Search pages..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        {searchTerm ? (
          <button className="sb-clear-btn" onClick={handleClear} title="Clear">
            <i className="fas fa-times"></i>
          </button>
        ) : (
          <span className="sb-kbd">⌘K</span>
        )}
      </div>

      {/* Show dropdown ONLY when typing */}
      {isOpen && searchTerm && (
        <div className="sb-dropdown">

          {/* Header */}
          <div className="sb-dropdown-header">
            <span>
              {filteredPages.length > 0
                ? `${filteredPages.length} result${filteredPages.length !== 1 ? 's' : ''}`
                : 'No results'}
            </span>

            <button className="sb-close-btn" onClick={handleCloseDropdown}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Results */}
          <div className="sb-results">
            {filteredPages.length > 0 ? (
              filteredPages.map((page, index) => (
                <div
                  key={page.path}
                  className={`sb-result-item${activeIndex === index ? ' active' : ''}`}
                  onClick={() => handlePageClick(page.path)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <div className="sb-result-icon">{page.icon}</div>

                  <div className="sb-result-text">
                    <div className="sb-result-name">
                      {highlight(page.name, searchTerm)}
                    </div>
                    <div className="sb-result-desc">{page.desc}</div>
                  </div>

                  <i className="fas fa-chevron-right sb-result-arrow"></i>
                </div>
              ))
            ) : (
              <div className="sb-no-results">
                No pages found for &ldquo;<strong>{searchTerm}</strong>&rdquo;
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sb-footer">
            <span className="sb-footer-hint">
              <i className="fas fa-arrow-up"></i>
              <i className="fas fa-arrow-down"></i>
              Navigate
            </span>
            <span className="sb-footer-hint"><kbd>↵</kbd> Open</span>
            <span className="sb-footer-hint"><kbd>Esc</kbd> Close</span>
          </div>

        </div>
      )}
    </div>
  );
};

export default SearchBar;