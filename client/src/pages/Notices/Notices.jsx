import "./Notices.css";
import Countdown from "../../components/Countdown/Countdown";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const Notices = () => {
  const { notices } = useContext(AppContext);

  const getNoticeIcon = (type) => {
    switch (type) {
      case "FILE": return "fa-file-pdf";
      case "INTERNAL_LINK": return "fa-door-open";
      case "EXTERNAL_LINK": return "fa-external-link-alt";
      default: return "fa-bullhorn";
    }
  };

  // Sort: future targetDate first, then latest
  const sortedNotices = [...notices].sort((a, b) => {
    const now = new Date();

    const aFuture = a.targetDate && new Date(a.targetDate) > now;
    const bFuture = b.targetDate && new Date(b.targetDate) > now;

    if (aFuture && !bFuture) return -1;
    if (!aFuture && bFuture) return 1;

    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Wrapper for full row click using the updated prefix namespace selector
  const NoticeWrapper = ({ notice, children }) => {
    if (notice.noticeType === "INTERNAL_LINK") {
      return (
        <Link to={notice.linkedPage} className="ntc-row">
          {children}
        </Link>
      );
    }

    if (notice.noticeType === "EXTERNAL_LINK") {
      return (
        <a
          href={notice.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ntc-row"
        >
          {children}
        </a>
      );
    }

    if (notice.noticeType === "FILE") {
      return (
        <a
          href={notice.file?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ntc-row"
          download={`${notice.title}.pdf`}
        >
          {children}
        </a>
      );
    }

    return <div className="ntc-row">{children}</div>;
  };

  return (
    <div className="ntc-page-container">

      {/* Header */}
      <div className="ntc-page-header">
        <h1>All Notices</h1>
        <p>Latest announcements and updates</p>
      </div>

      {/* List Container Container */}
      <div className="ntc-list-container">
        {sortedNotices.length === 0 ? (
          <div className="ntc-no-data">No notices available</div>
        ) : (
          <ul className="ntc-list">

            {sortedNotices.map((notice) => {
              const isNew =
                (new Date() - new Date(notice.createdAt)) /
                  (1000 * 60 * 60 * 24) < 7;

              return (
                <li key={notice._id}>

                  <NoticeWrapper notice={notice}>

                    {/* Dynamic Status Icon */}
                    <div className="ntc-icon">
                      <i className={`fas ${getNoticeIcon(notice.noticeType)}`}></i>
                    </div>

                    {/* Core Content Body */}
                    <div className="ntc-main">

                      {/* Top Row Metadata Grid */}
                      <div className="ntc-top">
                        <span className="ntc-date">
                          {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span> 

                        <div className="ntc-badges">
                          {isNew && <span className="ntc-new-badge">NEW</span>}

                          {notice.targetDate && (
                            <Countdown targetDate={notice.targetDate} />
                          )}
                        </div>
                      </div>

                      {/* Interactive Heading Text Row */}
                      <div className="ntc-title">
                        <span>{notice.title}</span>

                        {/* Action Direction Arrow/Download Context Icons */}
                        {notice.noticeType === "FILE" && (
                          <i className="fas fa-download ntc-action-icon"></i>
                        )}
                        {notice.noticeType === "EXTERNAL_LINK" && (
                          <i className="fas fa-external-link-alt ntc-action-icon"></i>
                        )}
                        {notice.noticeType === "INTERNAL_LINK" && (
                          <i className="fas fa-chevron-right ntc-action-icon"></i>
                        )}
                      </div>

                      {/* Summary Subtext Snippet */}
                      {notice.description && (
                        <div className="ntc-desc">
                          {notice.description}
                        </div>
                      )}

                    </div>

                  </NoticeWrapper>

                </li>
              );
            })}

          </ul>
        )}
      </div>
    </div>
  );
};

export default Notices;