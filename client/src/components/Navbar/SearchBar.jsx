import React, { useState, useRef, useEffect } from "react";
import "./SearchBar.css";
import { pages, highlight } from "./utils";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const navigate = useNavigate();

  // Filter pages
  const filteredPages = searchTerm
    ? pages.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "k"
      ) {
        e.preventDefault();

        setIsOpen(true);

        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown",handler);
    };
  }, []);

  // Input change
  const handleInputChange = (e) => {
    const value = e.target.value;

    setSearchTerm(value);
    setIsOpen(true);
    setActiveIndex(-1);
  };

  // Input focus
  const handleFocus = () => {
    setIsOpen(true);
  };

  // Navigate to selected page
  const handlePageClick = (path) => {
    navigate(path);

    setSearchTerm("");
    setIsOpen(false);
    setActiveIndex(-1);
  };

  // Clear search
  const handleClear = () => {
    setSearchTerm("");
    setIsOpen(false);
    setActiveIndex(-1);

    inputRef.current?.focus();
  };

  // Close dropdown
  const handleCloseDropdown = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();

      setActiveIndex((prev) => Math.min(prev + 1,filteredPages.length - 1));

    } else if (e.key === "ArrowUp") {
      e.preventDefault();

      setActiveIndex((prev) =>Math.max(prev - 1, -1));

    } else if (
      e.key === "Enter" &&
      activeIndex >= 0 &&
      filteredPages[activeIndex]
    ) {
      handlePageClick(
        filteredPages[activeIndex].path
      );

    } else if (e.key === "Escape") {
      handleCloseDropdown();

      inputRef.current?.blur();
    }
  };

  return (
    <div
      className="sb-container"
      ref={searchRef}
    >
      <div className="sb-input-wrap">
        <i
          className="fas fa-search sb-search-icon"
          aria-hidden="true"
        />

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
          aria-label="Search pages"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />

        {searchTerm ? (
          <button
            className="sb-clear-btn"
            onClick={handleClear}
            title="Clear"
          >
            <i className="fas fa-times" />
          </button>
        ) : (
          <span className="sb-kbd">
            ⌘K
          </span>
        )}
      </div>

      {isOpen && (
        <div
          className="sb-dropdown"
          role="listbox"
        >
          <div className="sb-dropdown-header">
            <span>
              {searchTerm
                ? filteredPages.length > 0
                  ? `${filteredPages.length} result${
                      filteredPages.length !== 1
                        ? "s"
                        : ""
                    }`
                  : "No results"
                : "Start typing to search"}
            </span>

            <button
              className="sb-close-btn"
              onClick={handleCloseDropdown}
              aria-label="Close results"
            >
              <i className="fas fa-times" />
            </button>
          </div>

          <div className="sb-results">
            {!searchTerm ? (
              <div
                className="sb-no-results"
                role="status"
              >
                Type something to search pages...
              </div>

            ) : filteredPages.length > 0 ? (
              filteredPages.map(
                (page, index) => (
                  <div
                    key={page.path}
                    className={`sb-result-item${
                      activeIndex === index
                        ? " active"
                        : ""
                    }`}
                    onClick={() =>
                      handlePageClick(
                        page.path
                      )
                    }
                    onMouseEnter={() =>
                      setActiveIndex(index)
                    }
                    role="option"
                    aria-selected={
                      activeIndex === index
                    }
                  >
                    <div className="sb-result-icon">
                      {page.icon}
                    </div>

                    <div className="sb-result-text">
                      <div className="sb-result-name">
                        {highlight(
                          page.name,
                          searchTerm
                        )}
                      </div>

                      <div className="sb-result-desc">
                        {page.desc}
                      </div>
                    </div>

                    <i
                      className="fas fa-chevron-right sb-result-arrow"
                      aria-hidden="true"
                    />
                  </div>
                )
              )
            ) : (
              <div
                className="sb-no-results"
                role="status"
              >
                No pages found for{" "}
                <strong>
                  "{searchTerm}"
                </strong>
              </div>
            )}
          </div>

          <div
            className="sb-footer"
            aria-label="Keyboard shortcuts"
          >
            <span className="sb-footer-hint">
              <i className="fas fa-arrow-up" />
              <i className="fas fa-arrow-down" />
              Navigate
            </span>

            <span className="sb-footer-hint">
              <kbd>↵</kbd> Open
            </span>

            <span className="sb-footer-hint">
              <kbd>Esc</kbd> Close
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;