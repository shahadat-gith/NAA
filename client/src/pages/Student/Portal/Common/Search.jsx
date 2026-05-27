import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { TbSearch, TbLoaderQuarter } from "react-icons/tb";
import "./Search.css";
import Loader from "../../../../components/Loader/Loader";

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
    <div className="sch-card-wrapper">
      <div className="sch-card-header">
        <h2 className="sch-card-title">{title}</h2>
        <p className="sch-card-subtitle">
          Provide your institutional Registration No.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="sch-card-form">
        <div className="sch-field-group">
          <span className="sch-field-icon">
            <TbSearch />
          </span>
          <input
            type="text"
            className="sch-field-input"
            placeholder="E.G. REG-2026-8941"
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            disabled={searching}
            autoFocus
          />
        </div>

        <button 
          type="submit" 
          className="sch-prime-btn" 
          disabled={searching}
        >
          {searching ? (
            <div>
             <Loader/>
            </div>
          ) : (
            <span>Search</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default Search;