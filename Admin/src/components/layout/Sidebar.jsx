import React from "react";
import { NavLink } from "react-router-dom";
import * as LucideIcons from "lucide-react";

const pages = [
  {
    title: "Students",
    links: [
      { to: "/students", icon: "Users", label: "Students" },
      { to: "/student/images", icon: "Image", label: "Student Images" },
      { to: "/exams", icon: "BookOpen", label: "Exams" },
      { to: "/result", icon: "Trophy", label: "Result" },
      { to: "/admissions", icon: "UserPlus", label: "Admissions" },
    ],
  },
  {
    title: "Staff",
    links: [
      { to: "/staffs", icon: "Briefcase", label: "Staffs" },
      { to: "/attendance", icon: "QrCode", label: "Attendance" },
    ],
  },
  {
    title: "System",
    links: [
      { to: "/settings", icon: "Settings", label: "Settings" },
      { to: "/achievers", icon: "Trophy", label: "Achievers" },
      { to: "/notices", icon: "Megaphone", label: "Notices" },
      { to: "/gallery", icon: "Images", label: "Gallery" },
    ],
  },
];

const Sidebar = ({ closeSidebar }) => {
  return (
    <div className="h-full w-72 bg-[var(--bg-surface)] border-r border-[var(--border-default)] flex flex-col overflow-y-auto">
      

      <nav className="flex-1 px-3 py-4">
        {pages.map((section) => (
          <div key={section.title} className="mb-6">
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {section.title}
            </p>

            <ul className="space-y-1">
              {section.links.map((link) => {
                const Icon = LucideIcons[link.icon] || LucideIcons.Circle;

                return (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      onClick={closeSidebar}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all
                        ${
                          isActive
                            ? "bg-[var(--color-primary-subtle)] text-[var(--color-primary-bright)] border border-[var(--border-hover)]"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)]"
                        }`
                      }
                    >
                      <Icon size={19} />
                      <span>{link.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-[var(--border-default)]">
        <p className="text-xs text-center text-[var(--text-muted)]">
          © 2026 Nashib Ali Academy
        </p>
      </div>
    </div>
  );
};

export default Sidebar;