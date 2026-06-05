import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Legend } from "./Legend";

export const Calendar = ({ selectedMonth, setSelectedMonth, selectedYear, setSelectedYear, history }) => {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // 1. Compute calendar dimension matrix states internally
  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  // 2. Map history logs to plain integers matching day keys
  const attendanceMap = useMemo(() => {
    const map = {};
    history.forEach((att) => {
      if (!att || att.date == null) return;

      let dateObj = null;

      // Accept Date objects, numeric timestamps, and strings.
      if (att.date instanceof Date) {
        dateObj = att.date;
      } else if (typeof att.date === "number") {
        dateObj = new Date(att.date);
      } else if (typeof att.date === "string") {
        // Try built-in parser first
        dateObj = new Date(att.date);
        // Fallback: extract YYYY-MM-DD if parser failed for some backend formats
        if (isNaN(dateObj.getTime())) {
          const isoMatch = att.date.match(/\d{4}-\d{2}-\d{2}/);
          if (isoMatch) dateObj = new Date(isoMatch[0]);
        }
      }

      // If date is valid, extract day number; otherwise skip and warn.
      if (dateObj && !isNaN(dateObj.getTime())) {
        const dayNum = dateObj.getDate();
        map[dayNum] = att.status;
      } else {
        // eslint-disable-next-line no-console
        console.warn("Attendance entry has invalid date:", att.date);
      }
    });
    return map;
  }, [history]);

  // 3. Navigation handler actions
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  const getStatusStyle = (status, isSunday) => {
    const normalizedStatus = status?.toLowerCase();
    if (normalizedStatus === "present") return "bg-success/10 text-success border-success/20";
    if (normalizedStatus === "absent") return "bg-danger/10 text-danger border-danger/20";
    if (normalizedStatus === "leave" || normalizedStatus === "on leave") {
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    }
    if (isSunday) return "bg-text-secondary/5 text-text-secondary/40 border-transparent opacity-60";
    return "bg-text-secondary/5 text-text-primary border-transparent";
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
      {/* Month Navigation Control Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-background border border-border/60 hover:border-primary/30 text-text-primary transition-all cursor-pointer outline-none active:scale-95"
        >
          <ChevronLeft size={16} />
        </button>

        <h3 className="text-xs font-black text-text-primary uppercase tracking-wider select-none">
          {monthNames[selectedMonth]} {selectedYear}
        </h3>

        <button
          type="button"
          onClick={handleNextMonth}
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-background border border-border/60 hover:border-primary/30 text-text-primary transition-all cursor-pointer outline-none active:scale-95"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Grid Track Viewport Frame */}
      <div className="grid grid-cols-7 text-center gap-y-1">
        {weekDays.map((day) => (
          <div key={day} className="text-[10px] font-black uppercase tracking-widest mb-2 select-none">
            <span className={day === "Sun" ? "text-danger" : "text-text-secondary/60"}>{day}</span>
          </div>
        ))}

        {/* Padding Empty Cells */}
        {Array.from({ length: firstDay }).map((_, idx) => (
          <div key={`empty-${idx}`} className="w-8 h-8 mx-auto" />
        ))}

        {/* Render Day Block Matrix */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const status = attendanceMap[day];
          const isSunday = new Date(selectedYear, selectedMonth, day).getDay() === 0;

          return (
            <div key={day} className="py-0.5 flex items-center justify-center">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs border shadow-3xs select-none transition-all duration-150 ${getStatusStyle(
                  status,
                  isSunday
                )}`}
              >
                {day}
              </div>
            </div>
          );
        })}
      </div>

      {/* Symmetrical Color Legend Label Grid Row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-4 pt-3 border-t border-border/40 select-none">
        <Legend dotClass="bg-success" text="Present" />
        <Legend dotClass="bg-amber-500" text="On Leave" />
        <Legend dotClass="bg-danger" text="Absent" />
        <Legend dotClass="bg-text-secondary/10" text="Unmarked" />
      </div>
    </div>
  );
};