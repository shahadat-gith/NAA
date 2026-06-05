import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CalendarCard = ({
  history = [],
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      onMonthChange(11);
      onYearChange(selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      onMonthChange(0);
      onYearChange(selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1);
    }
  };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);

  const attendanceMap = history.reduce((acc, item) => {
    if (item.date) {
      acc[item.date.split("T")[0]] = item.status;
    }
    return acc;
  }, {});

  const presentCount = history.filter((item) => item.status === "Present").length;
  const absentCount = history.filter((item) => item.status === "Absent").length;
  const onLeaveCount = history.filter((item) => item.status === "On-Leave").length;

  const activeTrackedDays = presentCount + absentCount + onLeaveCount;
  const attendancePercentage = activeTrackedDays
    ? Math.round((presentCount / activeTrackedDays) * 100)
    : 0;

  return (
    <div className="space-y-4 max-w-md mx-auto lg:mx-0">
      {/* 1. Compact Analytic Counter Row Grid */}
      <div className="grid grid-cols-4 gap-2.5">
        <SummaryTile title="Present" value={presentCount} textColor="text-success" />
        <SummaryTile title="Leave" value={onLeaveCount} textColor="text-amber-600" />
        <SummaryTile title="Absent" value={absentCount} textColor="text-danger" />
        <SummaryTile title="Rate" value={`${attendancePercentage}%`} textColor="text-text-primary" />
      </div>

      {/* 2. Main Space-Optimized Month Matrix Wrapper */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
        {/* Month Selector Navigation Bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-background border border-border/60 hover:border-primary/30 text-text-primary transition-all cursor-pointer outline-none"
          >
            <ChevronLeft size={14} />
          </button>

          <h3 className="text-xs sm:text-sm font-bold text-text-primary tracking-tight select-none">
            {monthNames[selectedMonth]} {selectedYear}
          </h3>

          <button
            type="button"
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-background border border-border/60 hover:border-primary/30 text-text-primary transition-all cursor-pointer outline-none"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Compact Calendar Core Grid */}
        <CalendarGrid
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          attendanceMap={attendanceMap}
          daysInMonth={daysInMonth}
        />

        {/* Bottom Legend Color Label References */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-4 pt-3 border-t border-border/40">
          <Legend dotClass="bg-success" text="Present" />
          <Legend dotClass="bg-amber-500" text="On Leave" />
          <Legend dotClass="bg-danger" text="Absent" />
          <Legend dotClass="bg-text-secondary/10" text="Unmarked" />
        </div>
      </div>
    </div>
  );
};

/* ================= COMPONENT: COMPACT SUMMARY TILE ================= */
const SummaryTile = ({ title, value, textColor }) => (
  <div className="bg-card border border-border rounded-xl p-2 text-center shadow-xs">
    <span className={`block text-base font-black tracking-tight ${textColor}`}>
      {value}
    </span>
    <span className="block text-[9px] font-bold text-text-secondary uppercase tracking-wider mt-0.5">
      {title}
    </span>
  </div>
);

/* ================= COMPONENT: COMPACT CALENDAR GRID ================= */
const CalendarGrid = ({
  selectedMonth,
  selectedYear,
  attendanceMap,
  daysInMonth,
}) => {
  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getStatusStyle = (status, isSunday) => {
    if (status === "Present") return "bg-success/10 text-success border-success/10";
    if (status === "Absent") return "bg-danger/10 text-danger border-danger/10";
    if (status === "On-Leave") return "bg-amber-500/10 text-amber-600 border-amber-500/10";
    if (isSunday) return "bg-border text-text-secondary border-transparent";
    return "bg-text-secondary/5 text-inactive border-transparent";
  };

  return (
    <div className="grid grid-cols-7 text-center">
      {/* Header Day Text Blocks */}
      {weekDays.map((day) => (
        <div key={day} className="text-[10px] font-bold uppercase tracking-wider mb-2">
          <span className={day === "Sun" ? "text-danger" : "text-text-secondary"}>
            {day}
          </span>
        </div>
      ))}

      {/* Leading Blank Cells Offset */}
      {Array.from({ length: firstDay }).map((_, idx) => (
        <div key={`empty-${idx}`} className="w-8 h-8 mx-auto" />
      ))}

      {/* Days Interactive Mapping Grid */}
      {Array.from({ length: daysInMonth }).map((_, idx) => {
        const day = idx + 1;
        const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const status = attendanceMap[dateStr];
        const isSunday = new Date(selectedYear, selectedMonth, day).getDay() === 0;

        return (
          <div key={day} className="py-0.5 flex items-center justify-center">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border shadow-2xs select-none ${getStatusStyle(status, isSunday)}`}
            >
              {day}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ================= COMPONENT: COMPACT LEGEND ================= */
const Legend = ({ dotClass, text }) => (
  <div className="flex items-center text-[10px] font-semibold text-text-secondary">
    <div className={`w-2 h-2 rounded-xs mr-1 border border-border/40 shrink-0 ${dotClass}`} />
    <span>{text}</span>
  </div>
);

export default CalendarCard;