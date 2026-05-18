import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { TbSearch, TbLoaderQuarter } from "react-icons/tb";
import "./Search.css";

const Search = ({ 
  title = "Enter Your Registration No", 
  onSearch, 
  searching 
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Trim spaces and force absolute uppercase serialization before running validations
    const registrationNo = query.replace(/\s+/g, "").toUpperCase();
    
    if (!registrationNo) {
      return toast.error("Please enter a valid registration number");
    }
    
    if (onSearch) {
      onSearch(registrationNo);
    }
  };

  return (
    <div className="search-card-wrapper">
      <div className="search-card-header">
        <h2 className="search-card-title">{title}</h2>
        <p className="search-card-subtitle">
          Provide your institutional Registration No.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="search-card-form">
        <div className="search-field-group">
          <span className="search-field-icon">
            <TbSearch />
          </span>
          <input
            type="text"
            className="search-field-input"
            placeholder="E.G. REG-2026-8941"
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            disabled={searching}
            autoFocus
          />
        </div>

        <button 
          type="submit" 
          className="search-prime-btn" 
          disabled={searching}
        >
          {searching ? (
            <>
              <TbLoaderQuarter className="search-spinner" />
              <span>Searching...</span>
            </>
          ) : (
            <span>Search</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default Search;