import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./NoticeBoard.css";
import { AppContext } from "../../../../context/AppContext";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const NoticeBoard = () => {
  const { backendUrl } = useContext(AppContext);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notices
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/notices`);

        if (response.data.success) {
          setNotices(response.data.notices);
        }
      } catch (err) {
        console.error("Error fetching notices:", err);
        setError("Failed to load updates.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [backendUrl]);

  const getNoticeIcon = (type) => {
    switch (type) {
      case "FILE":
        return "fa-file-pdf";
      case "INTERNAL_LINK":
        return "fa-door-open";
      case "EXTERNAL_LINK":
        return "fa-external-link-alt";
      default:
        return "fa-bullhorn";
    }
  };

  const renderNoticeAction = (notice) => {
    switch (notice.noticeType) {
      case "FILE":
        const file = notice.file;

        return (
          <a className="notice-title-link">
            <span className="notice-text-content">{notice.title}</span>
            <div className="action-icons">
              <i className="fas fa-download download-mini"></i>
            </div>
          </a>
        );

      case "INTERNAL_LINK":
        return (
          <Link to={notice.linkedPage} className="notice-title-link">
            <span className="notice-text-content">{notice.title}</span>
            <i className="fas fa-chevron-right arrow-mini"></i>
          </Link>
        );

      case "EXTERNAL_LINK":
        return (
          <a
            href={notice.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="notice-title-link"
          >
            <span className="notice-text-content">{notice.title}</span>
            <i className="fas fa-external-link-alt link-mini"></i>
          </a>
        );

      default:
        return <span className="notice-title-text">{notice.title}</span>;
    }
  };

  return (
    <div className="notice-board-container">
      <div className="notice-board-header">
        <div className="header-main">
          <i className="fas fa-bullhorn announce-icon"></i>
          <h2 className="notice-board-title">Latest Updates</h2>
        </div>
        <div className="live-pulse"></div>
      </div>

      <div className="notice-scroll-area">
        {loading ? (
          <div className="notice-status-msg">
            <div className="spinner-mini"></div> Loading notices...
          </div>
        ) : error ? (
          <div className="notice-status-msg error">{error}</div>
        ) : notices.length === 0 ? (
          <div className="notice-status-msg">
            No recent updates available.
          </div>
        ) : (
          <ul className="notice-list">
            {notices.map((notice) => (
              <li key={notice._id} className="notice-item">
                <div
                  className={`notice-icon-box ${notice.noticeType.toLowerCase()}`}
                >
                  <i className={`fas ${getNoticeIcon(notice.noticeType)}`}></i>
                </div>

                <div className="notice-content">
                  <div className="notice-meta">
                    <span className="notice-date">
                      {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                    {(new Date() - new Date(notice.createdAt)) /
                      (1000 * 60 * 60 * 24) <
                      7 && <span className="new-badge">New</span>}
                  </div>

                  {renderNoticeAction(notice)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link to="/notices-archive" className="view-all-notices-btn">
        View All Archives <i className="fas fa-arrow-right"></i>
      </Link>
    </div>
  );
};

export default NoticeBoard;