import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../../../context/AppContext";
import "./ToppersList.css";
import { CLASS_OPTIONS } from "../../../Utils/utility";
import { FiStar, FiTrendingUp } from "react-icons/fi";
import Loader from "../../../components/Loader/Loader";

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
  return specials.includes(lower) ? lower.toUpperCase() : `Class ${cls}`;
};

const ToppersList = () => {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ toppers: [], schoolToppers: [] });


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
    <div className="top-page-container">

      {/* HEADER HERO AREA */}
      <div className="top-header">
        <div className="top-header-content">
          <h1 className="top-title">
            Hall of <span>Excellence</span>
          </h1>
          {data.toppers.length > 0 && (
            <h3 className="top-session-badge">
              Session — {data.toppers[0].session}
            </h3>
          )}
          <p className="top-subtitle">
            Honoring our brightest minds and their remarkable academic journeys.
          </p>
        </div>
      </div>

      {/* MAIN LAYOUT CONTENT */}
      <div className="top-content">
        {loading ? (
          <Loader overlay={false} />
        ) : (
          <>
            {/* SCHOOL OVERALL TOPPERS SECTION */}
            <div className="top-section">
              <div className="top-section-head">
                <FiStar className="top-head-icon top-gold" />
                <h2>Overall School Toppers</h2>
              </div>

              <div className="top-podium-layout">
                {data.schoolToppers.map((group, gi) =>
                  group.students.map((s, si) => (
                    <div key={si} className={`top-winner-card top-rank-${gi + 1}`}>
                      <div className="top-card-rank-tag">
                        {gi + 1}
                      </div>

                      <div className="top-image-frame">
                        <img src={s.image?.url || "/user.png"} alt={s.name} className="top-profile-img" />
                      </div>

                      <div className="top-winner-info">
                        <h3>{s.name.toUpperCase()}</h3>
                        <p className="top-winner-meta">
                          {classLabel(s.class)} <span className="top-divider">•</span> {s.medium.charAt(0).toUpperCase() + s.medium.slice(1)}
                        </p>
                        <div className="top-winner-score">
                          {s.percentage}%
                        </div>
                        <div className="top-winner-rank">
                          Class Rank : {s.rank}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* CLASS WISE DIRECTORY TOPPERS */}
            <div className="top-section">
              <div className="top-section-head">
                <FiTrendingUp className="top-head-icon" />
                <h2>Class Wise Toppers</h2>
              </div>

              {/* ENGLISH MEDIUM COMPARTMENT */}
              <div className="top-medium-group">
                <h3 className="top-medium-title">English Medium</h3>

                <div className="top-class-grid">
                  {englishToppers.map((t, i) => (
                    <div key={i} className="top-class-card">
                      <img src={t.image?.url || "/user.png"} alt={t.name} className="top-class-img" />

                      <div className="top-class-info">
                        <h4>{t.name.toUpperCase()}</h4>
                        <span className="top-class-label">
                          {classLabel(t.class)} <span className="top-divider">•</span> English
                        </span>
                      </div>

                      <div className="top-class-score">
                        {t.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ASSAMESE MEDIUM COMPARTMENT */}
              <div className="top-medium-group">
                <h3 className="top-medium-title">Assamese Medium</h3>

                <div className="top-class-grid">
                  {assameseToppers.map((t, i) => (
                    <div key={i} className="top-class-card">
                      <img src={t.image?.url || "/user.png"} alt={t.name} className="top-class-img" />

                      <div className="top-class-info">
                        <h4>{t.name.toUpperCase()}</h4>
                        <span className="top-class-label">
                          {classLabel(t.class)} <span className="top-divider">•</span> Assamese
                        </span>
                      </div>

                      <div className="top-class-score">
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

export default ToppersList;