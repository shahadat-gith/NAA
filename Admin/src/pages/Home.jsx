import React from "react";
import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";

const navLinks = [
  { to: "/students", icon: "Users", label: "Students" },
  { to: "/student/images", icon: "Image", label: "Student Images" },
  { to: "/exams", icon: "BookOpen", label: "Exams" },
  { to: "/result", icon: "Trophy", label: "Result" },
  { to: "/admissions", icon: "UserPlus", label: "Admissions" },
  { to: "/staffs", icon: "Briefcase", label: "Staffs" },
  { to: "/attendance", icon: "QrCode", label: "Attendance" },
  { to: "/notices", icon: "Megaphone", label: "Notices" },
  { to: "/achievers", icon: "Award", label: "Achievers" },
  { to: "/gallery", icon: "Images", label: "Gallery" },
  { to: "/settings", icon: "Settings", label: "Settings" },
];

const Home = () => {
  const hour = new Date().getHours();
  let greeting = "Welcome";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section - Neutral & Elegant */}
        <div className="mb-10">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-8 md:p-12 shadow-sm">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--color-primary-subtle)] text-[var(--color-primary)] rounded-full text-sm font-medium mb-4">
                {greeting}
              </div>
              
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-4 text-[var(--text-primary)]">
                {greeting}, Admin 👋
              </h1>
              
              <p className="text-lg md:text-xl text-[var(--text-secondary)]">
                Welcome to Nashib Ali Academy Admin Portal. 
                Manage students, staff, academics, and operations efficiently from one place.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Quick Access</h2>
              <p className="text-[var(--text-secondary)]">Frequently used sections</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {navLinks.map((item) => {
              const IconComponent = LucideIcons[item.icon] || LucideIcons.Circle;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--border-strong)] rounded-3xl p-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-[var(--bg-base)] rounded-2xl flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                      <IconComponent size={28} />
                    </div>
                    <div className="text-[var(--text-muted)] group-hover:text-[var(--color-primary)] transition-colors">
                      <LucideIcons.ArrowRight size={20} />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-lg text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                      {item.label}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;