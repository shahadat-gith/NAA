import React, { useContext, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import "./Search.css";
import SearchResults from "../SearchResults/SearchResults";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-hot-toast";
import axios from "axios";

const Search = () => {
  const { backendUrl } = useContext(AppContext);
  const { state } = useLocation();

  const type = state?.type;

  const [query, setQuery] = useState("");
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [error, setError] = useState("");

  // 🚫 Prevent direct access without type
  if (!type) {
    return <Navigate to="/portal" />;
  }

  

  const handleSearch = async () => {
    const trimmedTerm = query.trim();

    if (!trimmedTerm) {
      setError("Please enter a student name");
      toast.error("Please enter a student name");
      return;
    }

    setLoading(true);
    setError("");
    setStudents([]);
    setIsSearched(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/student/search`,
        { name: trimmedTerm }
      );

      if (!res.data.success) {
        throw new Error(res.data.message || "No students found");
      }

      setStudents(res.data.students || []);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong";

      setError(message);
      toast.error(message);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="searchbar-container">
      <div className="search-container-title">
        <h2>Search Your Name</h2>
      </div>

      <div className="searchbar-input-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your name..."
          className="searchbar-input"
        />
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      {error && <div className="search-error">{error}</div>}

      <SearchResults
        students={students}
        type={type}
        loading={loading}
        isSearched={isSearched}
      />
    </div>
  );
};

export default Search;
