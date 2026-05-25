export const navSections = [
  {
    title: "Students & Academics",
    links: [
      { to: "/students", icon: "fas fa-user-graduate", label: "Students" },
      { to: "/student/images", icon: "fas fa-images", label: "Student Images" },
      { to: "/exams", icon: "fas fa-chart-line", label: "Exams" },
      { to: "/result", icon: "fas fa-poll", label: "Result" },
      { to: "/admissions", icon: "fas fa-user-plus", label: "Admissions" },
    ],
  },
  {
    title: "Staff",
    links: [
      { to: "/teachers", icon: "fas fa-chalkboard-teacher", label: "Teachers" },
      {
        to: "/teachers/attendance",
        icon: "fas fa-clipboard-check",
        label: "Attendance",
      },
    ],
  },
  {
    title: "Payments",
    links: [
      {
        to: "/payments",
        icon: "fas fa-money-bill-wave",
        label: "Payment Dashboard",
      },
    ],
  },
  {
    title: "System",
    links: [{ to: "/settings", icon: "fas fa-cogs", label: "Settings" }],
  },
];
