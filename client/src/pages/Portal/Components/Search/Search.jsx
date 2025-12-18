import React, { useContext, useState } from 'react';
import './Search.css';
import SearchResults from '../SearchResults/SearchResults';
import { AppContext } from '../../../../context/AppContext';
import { toast } from "react-hot-toast";
import axios from 'axios';

const Search = ({ type = "monthly" }) => {
  const { backendUrl, adminToken } = useContext(AppContext);
  const [query, setQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearched, setIsSearched] = useState(false)
  const [error, setError] = useState('');

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
      { name: trimmedTerm },
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
        {type === "admit-card" ? (
          <h2>Download Admit Card</h2>
        ) : type === "id-card" ? (
          <h2>Generate Your ID Card</h2>
        ) : (
          <h2>{`${type.charAt(0).toUpperCase()}${type.slice(1)} Fee Payment`}</h2>
        )}
      </div>

      <div className="searchbar-input-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by student name..."
          className="searchbar-input"
        />
        <button className="search-btn" onClick={handleSearch}>Search</button>
      </div>

      {error && <div className="search-error">{error}</div>}

      <SearchResults students={students} type={type} loading={loading} isSearched = {isSearched} />
    </div>
  );
};

export default Search;