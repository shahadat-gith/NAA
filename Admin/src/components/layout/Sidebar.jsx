import React from "react";
import { NavLink } from "react-router-dom";
import * as LucideIcons from "lucide-react";

const pages = [
  {
    title: "Students & Academics",
    links: [
      { to: "/students", icon: "Users", label: "Students" },
      { to: "/student/images", icon: "Image", label: "Student Images" },
      { to: "/exams", icon: "BookOpen", label: "Exams" },
      { to: "/result", icon: "Trophy", label: "Result" },
      { to: "/admissions", icon: "UserPlus", label: "Admissions" },
      { to: "/achievers", icon: "Trophy", label: "Achievers" },
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
    ],
  },
];

const Sidebar = ({ closeSidebar }) => {
  return (
    <div className="h-full w-72 bg-[var(--bg-surface)] border-r border-[var(--border-default)] flex flex-col overflow-y-auto shadow-xl">
      <div className="p-6 h-20 border-b border-[var(--border-default)]">
        <div className="flex items-center gap-3">
          <div className="w-10 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
           <img src="/logo.png" alt="" />
          </div>
         <h1 className="text-xl font-bold tracking-tight">Admin Portal</h1>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3">
        {pages.map((section, idx) => (
          <div key={idx} className="mb-8">
            <p className="px-4 mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              {section.title}
            </p>

            <ul className="space-y-1 px-2">
              {section.links.map((link, index) => {
                const IconComponent = LucideIcons[link.icon] || LucideIcons.Circle;

                return (
                  <li key={index}>
                    <NavLink
                      to={link.to}
                      onClick={closeSidebar}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200
                         ${isActive
                           ? "bg-[var(--color-primary)] text-white shadow-md"
                           : "text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)]"
                         }`
                      }
                    >
                      <IconComponent 
                        size={20} 
                        className="transition-transform group-hover:scale-110" 
                      />
                      <span>{link.label}</span>

                      {link.badge > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                          {link.badge}
                        </span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--border-default)] mt-auto">
        <div className="text-center text-xs text-[var(--text-muted)]">
          © 2026 Nashib Ali Academy
        </div>
      </div>
    </div>
  );
};

export default Sidebar;