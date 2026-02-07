import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/StudentSearch.css";
import BG_IMAGE from "/search.webp";
import axios from "axios";
import { AppContext } from "../../../../context/AppContext";

const StudentSearch = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    const registrationNo = query.replace(/\s+/g, "");

    if (!registrationNo) {
      setError("Please enter your registration number");
      return;
    }

    setSearching(true);
    setError("");

    try {
      const res = await axios.post(
        `${backendUrl}/api/student/search`,
        { registrationNo }
      );

      if (res.data.success) {
        navigate(`/student/dashboard/${res.data.studentId}`);
      } else {
        setError(res.data.message || "Student not found");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Something went wrong"
      );
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="se-search-wrapper">
      {/* 🔹 Background Image */}
      <img
        src={BG_IMAGE}
        alt="Search background"
        className="se-bg-image"
      />

      {/* 🔹 Overlay Content */}
      <div className="se-search-overlay">
        <div className="se-search-content">
          <div className="se-search-box">
            <form onSubmit={handleSearch}>
              <div className="se-input-wrapper">
                <i className="fas fa-search se-search-icon"></i>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value.toUpperCase())}
                  className="se-search-input"
                  placeholder="Enter Registration No"
                  autoComplete="off"
                />
              </div>

              {error && <p className="se-error-text">{error}</p>}

              <button
                type="submit"
                className="se-search-btn"
                disabled={searching}
              >
                {searching ? (
                  <>
                    <i className="fas fa-spinner fa-spin se-spinner"></i>
                    Searching...
                  </>
                ) : (
                  <>
                    <i className="fas fa-search"></i> Search Student
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSearch;
