import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./NoticeBoard.css";
import { AppContext } from "../../../../context/AppContext";
import Countdown from "../../../../components/Countdown/Countdown";

const NoticeBoard = () => {
  const { notices } = useContext(AppContext);


  const getNoticeIcon = (type) => {
    switch (type) {
      case "FILE": return "fa-file-pdf";
      case "INTERNAL_LINK": return "fa-door-open";
      case "EXTERNAL_LINK": return "fa-external-link-alt";
      default: return "fa-bullhorn";
    }
  };


  const sortedNotices = [...notices]
    .sort((a, b) => {
      const now = new Date();

      const aFuture = a.targetDate && new Date(a.targetDate) > now;
      const bFuture = b.targetDate && new Date(b.targetDate) > now;

      // future ones first
      if (aFuture && !bFuture) return -1;
      if (!aFuture && bFuture) return 1;

      // then latest created
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .slice(0, 5);

  const renderNoticeAction = (notice) => {
    switch (notice.noticeType) {
      case "FILE":
        const fileUrl = notice?.file?.url;
        return (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="notice-title-link"
            download={`${notice.title}.pdf`}
          >
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
        {notices.length === 0 ? (
          <div className="notice-status-msg">No recent updates.</div>
        ) : (
          <ul className="notice-list">
            {sortedNotices.map((notice) => {

              return (
                <li key={notice._id} className="notice-item">

                  <div className={`notice-icon-box ${notice.noticeType.toLowerCase()}`}>
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

                      {(new Date() - new Date(notice.createdAt)) / (1000 * 60 * 60 * 24) < 7 && (
                        <span className="new-badge">New</span>
                      )}

                      {/* 🔥 Countdown */}
                      {notice.targetDate && (
                        <Countdown targetDate={notice.targetDate} />
                      )}
                    </div>

                    {renderNoticeAction(notice)}

                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Link to="/notices" className="view-all-notices-btn">
        View All Notices <i className="fas fa-arrow-right"></i>
      </Link>
    </div>
  );
};

export default NoticeBoard;