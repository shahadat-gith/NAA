import React from "react";
import { NAV_ITEMS } from "../data/navData";
import NoticeBoard from "./NoticeBoard";
import "../Styles/SectionPanel.css";

export default function SectionPanel({ activeTab, activeSub, setSub }) {
  const tabData = NAV_ITEMS.find((n) => n.id === activeTab);
  if (!tabData) return null;

  const subData = tabData.children.find((c) => c.id === activeSub);

  return (
    <div className="sp-wrapper">
      {/* ── left: sub-navigation ── */}
      <aside className="sp-subnav">
        <div className="sp-subnav-header">
          <span className="sp-subnav-icon">{tabData.icon}</span>
          {tabData.label}
        </div>
        <ul className="sp-subnav-list">
          {tabData.children.map((child) => (
            <li key={child.id}>
              <button
                className={`sp-subnav-btn ${activeSub === child.id ? "sp-subnav-btn--active" : ""}`}
                onClick={() => setSub(child.id)}
              >
                <span className="sp-subnav-dot" />
                {child.label}
                {activeSub === child.id && (
                  <svg className="sp-subnav-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className="sp-subnav-help">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Need help? <a href="#">Contact Admin</a>
        </div>
      </aside>

      {/* ── right: content + notices ── */}
      <main className="sp-content">
        {/* sub-section header */}
        <div className="sp-content-header">
          <div className="sp-content-title">
            <h2>{subData?.label ?? tabData.label}</h2>
            <p className="sp-content-breadcrumb">
              Student Corner <span>›</span> {tabData.label} <span>›</span> {subData?.label}
            </p>
          </div>
        </div>

        {/* two-column: info card + notice board */}
        <div className="sp-content-grid">
          {/* placeholder info card */}
          <div className="sp-info-card">
            <div className="sp-info-card-header">
              <div className="sp-info-icon">{tabData.icon}</div>
              <div>
                <div className="sp-info-title">{subData?.label}</div>
                <div className="sp-info-sub">{tabData.label}</div>
              </div>
            </div>
            <p className="sp-info-body">
              This section contains detailed information about <strong>{subData?.label}</strong>.
              Content, documents, and resources specific to this section will be displayed here.
              Administrators can manage this content from the admin panel.
            </p>
            <div className="sp-info-tags">
              <span className="sp-tag">📋 Guidelines Available</span>
              <span className="sp-tag">📁 Documents</span>
              <span className="sp-tag">🔗 Quick Links</span>
            </div>
            <div className="sp-info-actions">
              <button className="sp-btn sp-btn--primary">View Details</button>
              <button className="sp-btn sp-btn--ghost">Download Resources</button>
            </div>
          </div>

          {/* notice board */}
          <NoticeBoard activeTab={activeTab} activeSub={activeSub} />
        </div>
      </main>
    </div>
  );
}