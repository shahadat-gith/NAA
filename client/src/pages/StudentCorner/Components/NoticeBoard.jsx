import React, { useState } from "react";
import "../Styles/NoticeBoard.css";

const NOTICES = [
  {
    id: 1,
    tag: "Result",
    tagColor: "tag-result",
    title: "Class X & XII Result Declaration — 2024–25",
    date: "12 June 2025",
    desc: "Final examination results for Class X and Class XII students have been officially declared. Students can view their results on the school portal.",
    type: "link",
    href: "https://results.example.edu/2025",
    isNew: true,
  },
  {
    id: 2,
    tag: "Admit Card",
    tagColor: "tag-admit",
    title: "Admit Cards Released — Annual Examination 2025",
    date: "01 June 2025",
    desc: "Admit cards for the Annual Examination 2025 are now available. Students must carry a printed copy to the examination hall.",
    type: "pdf",
    pdfLabel: "Download Admit Card",
    isNew: true,
  },
  {
    id: 3,
    tag: "Scholarship",
    tagColor: "tag-scholar",
    title: "Merit Scholarship Applications Open — 2025–26",
    date: "25 May 2025",
    desc: "Applications are invited from meritorious students for the annual Merit Scholarship. Last date to apply is 30th June 2025.",
    type: "pdf",
    pdfLabel: "Download Application Form",
    isNew: false,
  },
  {
    id: 4,
    tag: "Notice",
    tagColor: "tag-notice",
    title: "Anti-Ragging Pledge — Mandatory Submission",
    date: "20 May 2025",
    desc: "All students and parents are required to submit the Anti-Ragging pledge form before 10th June. Non-compliance may affect enrollment.",
    type: "link",
    href: "https://antiragging.example.edu/pledge",
    isNew: false,
  },
  {
    id: 5,
    tag: "Event",
    tagColor: "tag-event",
    title: "Annual Cultural Fest — 'Utsav 2025' Registration",
    date: "15 May 2025",
    desc: "Register now for Utsav 2025 — the annual cultural festival. Events include dance, drama, music, art & debate. Register individually or as a team.",
    type: "link",
    href: "https://utsav.example.edu/register",
    isNew: false,
  },
  {
    id: 6,
    tag: "Exam",
    tagColor: "tag-exam",
    title: "Pre-Board Examination Time Table — Class XII",
    date: "10 May 2025",
    desc: "The detailed time table for Pre-Board Examinations for Class XII students is now published. Please check your section's schedule carefully.",
    type: "pdf",
    pdfLabel: "Download Time Table",
    isNew: false,
  },
  {
    id: 7,
    tag: "Library",
    tagColor: "tag-lib",
    title: "New Book Arrivals — June 2025 Batch",
    date: "05 May 2025",
    desc: "A new batch of reference books, fiction titles, and periodicals has been added to the library collection. Visit the library or check the e-catalogue.",
    type: "link",
    href: "https://library.example.edu/new-arrivals",
    isNew: false,
  },
  {
    id: 8,
    tag: "Holiday",
    tagColor: "tag-holiday",
    title: "Revised Holiday List — Academic Year 2025–26",
    date: "01 May 2025",
    desc: "The revised list of public holidays and school holidays for the academic year 2025–26 has been issued by the school administration.",
    type: "pdf",
    pdfLabel: "Download Holiday List",
    isNew: false,
  },
];

const FILTER_TAGS = ["All", "Result", "Admit Card", "Exam", "Scholarship", "Event", "Library", "Notice", "Holiday"];

// Compact card for the narrow sidebar
function NoticeCard({ notice }) {
  const handlePdf = (e) => {
    e.preventDefault();
    alert(`Downloading: ${notice.pdfLabel}`);
  };

  const ActionEl = notice.type === "link" ? (
    <a className="nc-mini-btn nc-mini-btn--link" href={notice.href} target="_blank" rel="noopener noreferrer">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      </svg>
      Open
    </a>
  ) : (
    <button className="nc-mini-btn nc-mini-btn--pdf" onClick={handlePdf}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      PDF
    </button>
  );

  return (
    <div className={`notice-card notice-card--compact ${notice.isNew ? "notice-card--new" : ""}`}>
      <div className="nc-compact-top">
        <span className={`nc-tag ${notice.tagColor}`}>{notice.tag}</span>
        {notice.isNew && <span className="nc-new-dot" title="New" />}
      </div>
      <p className="nc-compact-title">{notice.title}</p>
      <div className="nc-compact-footer">
        <span className="nc-compact-date">{notice.date}</span>
        {ActionEl}
      </div>
    </div>
  );
}

export default function NoticeBoard({ activeTab, activeSub }) {
  // Show latest 6 notices in the sidebar panel
  const recent = NOTICES.slice(0, 6);

  return (
    <div className="noticeboard">
      <div className="nb-header">
        <div className="nb-title-row">
          <div className="nb-title">
            <span className="nb-title-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
            </span>
            Notices
          </div>
          <span className="nb-count">{NOTICES.length}</span>
        </div>
      </div>

      <div className="nb-list">
        {recent.map((notice) => (
          <NoticeCard key={notice.id} notice={notice} />
        ))}
      </div>

      <div className="nb-view-all">
        <a href="#" className="nb-view-all-link">
          View all notices
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </a>
      </div>
    </div>
  );
}