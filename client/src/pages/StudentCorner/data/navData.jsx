// ── navData.js ── shared navigation definition
export const NAV_ITEMS = [
  {
    id: "students-union",
    label: "Union Body",
    shortLabel: "Union Body",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="17" cy="8" r="3" />
        <circle cx="7"  cy="8" r="3" />
        <path d="M2 20h8v-2a4 4 0 0 1 8 0v2h2" />
      </svg>
    ),
    children: [
      { id: "sub-president", label: "President's Message" },
      { id: "sub-exec",      label: "Executive Committee" },
      { id: "sub-events",    label: "Events & Activities" },
      { id: "sub-grievance", label: "Grievance Redressal" },
    ],
  },
  {
    id: "cells",
    label: "Cells & Committees",
    shortLabel: "Cells",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    children: [
      { id: "cell-wec",     label: "Women Empowerment Cell" },
      { id: "cell-ar",      label: "Anti Ragging Cell" },
      { id: "cell-icc",     label: "Internal Compliance Committee" },
      { id: "cell-counsel", label: "Counselling Committee" },
      { id: "cell-nss",     label: "NSS / NCC Wing" },
      { id: "cell-cultural",label: "Cultural Committee" },
    ],
  },
  {
    id: "admin",
    label: "Administrative Services",
    shortLabel: "Admin",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    children: [
      { id: "adm-fee",        label: "Fee Structure" },
      { id: "adm-scholarship",label: "Scholarships & Aid" },
      { id: "adm-calendar",   label: "Academic Calendar" },
      { id: "adm-forms",      label: "Download Forms" },
    ],
  },
];