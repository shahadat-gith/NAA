import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Styles/StudentPortal.css";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toppersData } from "./data";
import toast from "react-hot-toast";

const StudentPortal = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const registrationNo = query.replace(/\s+/g, "");
    if (!registrationNo) {
      toast.error("Please enter your registration number");
      return;
    }

    setSearching(true);

    try {
      const res = await axios.post(`${backendUrl}/api/student/search`, { registrationNo });
      if (res.data.success) {
        navigate(`/student/dashboard/${res.data.studentId}`);
      } else {
        toast.error(res.data.message || "Student not found");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setSearching(false);
    }
  };

  const grouped = toppersData.reduce((acc, item) => {
    const { session, medium } = item;

    if (!acc[session]) acc[session] = {};
    if (!acc[session][medium]) acc[session][medium] = [];

    acc[session][medium].push(item);
    return acc;
  }, {});

  return (
    <div className="sp-wrapper">

      {/* HERO + SEARCH */}
      <section className="sp-hero">
        <div className="sp-hero-top">
          <p className="sp-hero-tag">Hall of Excellence</p>

          <form className="sp-search-form sp-inline-search" onSubmit={handleSearch}>
            <input
              className="sp-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
              placeholder="Enter Reg. No."
            />

            <button className="sp-search-btn" type="submit" disabled={searching}>
              {searching ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                <i className="fa-solid fa-magnifying-glass"></i>
              )}
            </button>
          </form>
        </div>

        <h1 className="sp-hero-title">Academic Toppers</h1>

        <p className="sp-hero-desc">
          Celebrating the students who set the standard for academic excellence each session.
        </p>
      </section>

      {/* TOPPERS */}
      <main className="sp-toppers-container">
        {Object.keys(grouped).length === 0 && (
          <div className="sp-empty">No toppers data available.</div>
        )}

        {Object.keys(grouped).map((session) => (
          <div key={session} className="sp-session-block">
            <div className="sp-session-header">
              <span className="sp-session-tag">Session {session}</span>
              <div className="sp-session-rule" />
            </div>

            {Object.keys(grouped[session]).map((medium) => (
              <div key={medium} className="sp-medium-block">
                <p className="sp-medium-label">{medium} Medium</p>

                <div className="sp-toppers-grid">
                  {grouped[session][medium].map((t, i) => (
                    <div key={i} className="sp-topper-card">

                      <img
                        src={t.image}
                        alt={t.name}
                        className="sp-avatar"
                      />

                      <h4 className="sp-topper-name">{t.name}</h4>

                      <div className="sp-meta-row">
                        <span className="sp-meta-pill">
                          Class {t.class}
                        </span>

                        {t.stream && t.stream !== "General" && (
                          <span className="sp-meta-pill">
                            {t.stream}
                          </span>
                        )}
                      </div>

                      <div className="sp-pct-block">
                        <span className="sp-pct-num">
                          {t.percentage}
                        </span>
                        <span className="sp-pct-sym">%</span>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </main>
    </div>
  );
};

export default StudentPortal;