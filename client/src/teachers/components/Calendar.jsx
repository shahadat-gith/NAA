import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../styles/Calendar.css"; 

const Calendar = ({ history = [], selectedMonth, selectedYear, onMonthChange, onYearChange }) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();

// Generates an array containing [Current - 4] through [Current + 5]
const years = Array.from({ length: 8 }, (_, i) => String((currentYear - 4) + i));

  // Helper functions
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);

  // Smooth Year-Crossing for chevron controllers
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

  // Create attendance map for quick lookup (key: YYYY-MM-DD)
  const attendanceMap = history.reduce((acc, item) => {
    acc[item.date] = item.status;
    return acc;
  }, {});

  // Calculated Metrics derived directly inside the calendar layout
  const presentCount = history.filter(item => item.status === "Present").length;
  const absentCount = history.filter(item => item.status === "Absent").length;
  const onLeaveCount = history.filter(item => item.status === "On Leave").length;
  
  const activeTrackedDays = presentCount + absentCount + onLeaveCount;
  const attendancePercentage = activeTrackedDays 
    ? Math.round((presentCount / activeTrackedDays) * 100) 
    : 0;

  return (
    <div className="calendar-wrapper-pane">
      
      {/* Premium Inlined Summary Block */}
      <div className="calendar-summary-deck">
        <div className="summary-tile present">
          <h3>{presentCount}</h3>
          <p>Present</p>
        </div>
        <div className="summary-tile leave">
          <h3>{onLeaveCount}</h3>
          <p>On Leave</p>
        </div>
        <div className="summary-tile absent">
          <h3>{absentCount}</h3>
          <p>Absent</p>
        </div>
        <div className="summary-tile highlight">
          <h3>{attendancePercentage}%</h3>
          <p>Rate</p>
        </div>
      </div>

      <section className="calendar-card">
        {/* Month & Year Selectors */}
        <div className="calendar-controls">
          <button onClick={handlePrevMonth} className="nav-btn" aria-label="Previous Month">
            <FiChevronLeft size={18} />
          </button>

          <div className="month-year-display">
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange(Number(e.target.value))}
              className="calendar-select"
            >
              {monthNames.map((name, idx) => (
                <option key={idx} value={idx}>
                  {name}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="calendar-select font-semibold"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleNextMonth} className="nav-btn" aria-label="Next Month">
            <FiChevronRight size={18} />
          </button>
        </div>

        {/* Calendar Matrix Grid */}
        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className={`calendar-header ${day === "Sun" ? "sunday-header" : ""}`}>
              {day}
            </div>
          ))}

          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty"></div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            
            const status = attendanceMap[dateStr]; 
            const isSunday = new Date(selectedYear, selectedMonth, day).getDay() === 0;

            let dayClass = "";
            if (isSunday) {
              dayClass = "sunday";
            } else if (status === "Present") {
              dayClass = "status-green";
            } else if (status === "On Leave") {
              dayClass = "status-yellow";
            } else if (status === "Absent") {
              dayClass = "status-red";
            }

            return (
              <div key={day} className={`calendar-day ${dayClass}`}>
                <span className="day-number">{day}</span>
              </div>
            );
          })}
        </div>

        {/* Graphic Legend */}
        <div className="calendar-legend">
          <div className="legend-item"><span className="legend-dot green"></span> Present</div>
          <div className="legend-item"><span className="legend-dot yellow"></span> On Leave</div>
          <div className="legend-item"><span className="legend-dot red"></span> Absent</div>
          <div className="legend-item"><span className="legend-dot gray"></span> Sunday</div>
        </div>
      </section>
    </div>
  );
};

export default Calendar;