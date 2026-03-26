import { useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import "./Styles/StudentPortal.css";
import { CLASS_OPTIONS } from "../../Utils/utility";
import { FiStar, FiTrendingUp } from "react-icons/fi";
import { useNavigate } from "react-router-dom";


const ALL_CLASS_ORDER = [
  ...CLASS_OPTIONS.english,
  ...CLASS_OPTIONS.assamese.filter(c => !CLASS_OPTIONS.english.includes(c))
];

const sortByClassOrder = (a, b) => {
  const ia = ALL_CLASS_ORDER.indexOf(a.class.toLowerCase());
  const ib = ALL_CLASS_ORDER.indexOf(b.class.toLowerCase());
  return (ia === -1 ? 1 : ib === -1 ? -1 : ia - ib);
};

const classLabel = (cls) => {
  const lower = cls.toLowerCase();
  const specials = ["nursery", "kg", "ankur", "mukul"];
  return specials.includes(lower)
    ? lower.toUpperCase()
    : `Class ${cls}`;
};

const StudentPortal = () => {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ toppers: [], schoolToppers: [] });

  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);


  const handleSearch = async (e) => {
    e.preventDefault();

    const registrationNo = query.replace(/\s+/g, "");

    if (!registrationNo) {
      return toast.error("Please enter registration number");
    }

    setSearching(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/student/search`,
        { registrationNo }
      );

      if (res.data.success) {
        navigate(`/student/dashboard/${res.data.studentId}`);
      } else {
        toast.error(res.data.message || "Student not found");
      }

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    const fetchToppers = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/results/student/toppers`);
        if (res.data.success) setData(res.data);
      } catch {
        toast.error("Network error fetching toppers");
      } finally {
        setLoading(false);
      }
    };
    fetchToppers();
  }, [backendUrl]);

  const assameseToppers = data.toppers
    .filter(t => t.medium === "assamese")
    .sort(sortByClassOrder);

  const englishToppers = data.toppers
    .filter(t => t.medium === "english")
    .sort(sortByClassOrder);

  return (
    <div className="sp-container">

      {/* HEADER */}
      <div className="sp-header">
        <div className="sp-header-content">
          <h1 className="sp-title">
            Hall of <span>Excellence</span>
          </h1>
          <h3 style={{ fontSize: "20px", color: "#e95560" }}>
            {data.toppers.length > 0 && `Session - ${data.toppers[0].session}`}
          </h3>
          <p className="sp-subtitle">
            Honoring our brightest minds and their remarkable academic journeys.
          </p>


          <div className="sp-header-search">
            <form className="sp-search-bar" onSubmit={handleSearch}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value.toUpperCase())}
                placeholder="Enter Registration No."
                className="sp-search-input"
              />

              <button type="submit" className="sp-search-btn" disabled={searching}>
                {searching ? "..." : "Search"}
              </button>
            </form>

          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="sp-content">
        {loading ? (
          <div className="sp-loader-skeleton">
            Checking the records...
          </div>
        ) : (
          <>
            {/* SCHOOL TOPPERS */}
            <div className="sp-section">
              <div className="sp-section-head">
                <FiStar className="head-icon gold" />
                <h2>Overall School Toppers</h2>
              </div>

              <div className="sp-podium-layout">
                {data.schoolToppers.map((group, gi) =>
                  group.students.map((s, si) => (
                    <div key={si} className={`sp-winner-card rank-${gi + 1}`}>
                      <div className="sp-card-rank-tag">
                        {gi + 1}
                      </div>

                      <div className="sp-image-frame">
                        <img src={s.image?.url} alt={s.name} />
                      </div>

                      <div className="sp-winner-info">
                        <h3>{(s.name).toUpperCase()}</h3>
                        <p>
                          {classLabel(s.class)} • {s.medium}
                        </p>
                        <div className="sp-winner-score">
                          {s.percentage}%
                        </div>
                        <div className="sp-winner-rank">
                          Class Rank : {s.rank}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* CLASS TOPPERS */}
            <div className="sp-section">
              <div className="sp-section-head">
                <FiTrendingUp className="head-icon" />
                <h2>Class Wise Toppers</h2>
              </div>

              {/* ENGLISH */}
              <div className="sp-medium-group">
                <h3 className="sp-medium-title">English Medium</h3>

                <div className="sp-class-grid">
                  {englishToppers.map((t, i) => (
                    <div key={i} className="sp-class-card">
                      <img src={t.image?.url} alt={t.name} />

                      <div className="sp-class-info">
                        <h4>{t.name.toUpperCase()}</h4>

                        <span className="sp-class-label">
                          {classLabel(t.class)} • English
                        </span>
                      </div>

                      <div className="sp-class-score">
                        {t.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ASSAMESE */}
              <div className="sp-medium-group">
                <h3 className="sp-medium-title">Assamese Medium</h3>

                <div className="sp-class-grid">
                  {assameseToppers.map((t, i) => (
                    <div key={i} className="sp-class-card">
                      <img src={t.image?.url} alt={t.name} />

                      <div className="sp-class-info">
                        <h4>{t.name.toUpperCase()}</h4>

                        <span className="sp-class-label">
                          {classLabel(t.class)} • Assamese
                        </span>
                      </div>

                      <div className="sp-class-score">
                        {t.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentPortal;