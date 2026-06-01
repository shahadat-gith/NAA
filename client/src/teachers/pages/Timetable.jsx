import React, { useState } from "react";
import "../styles/Timetable.css";
import TimetableUpdateModal from "../components/TimetableUpdateModal";
import { useOutletContext } from "react-router-dom";

const Timetable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedDaySchedule, setSelectedDaySchedule] = useState([]);

  const { dashboard, setDashboard } = useOutletContext();
  const timetable = dashboard?.timetable || {};
  const schedule = timetable?.schedule || {};

  const openDayEditor = (day, schedules) => {
    setSelectedDay(day);
    setSelectedDaySchedule(schedules || []);
    setIsModalOpen(true);
  };

  const refreshTimetableState = (updatedDaySchedule) => {
    setDashboard((prev) => ({
      ...prev,
      timetable: {
        ...prev.timetable,
        schedule: {
          ...prev.timetable.schedule,
          [selectedDay]: updatedDaySchedule,
        },
      },
    }));
  };

  return (
    <div className="tt-page">
      {/* Header */}
      <div className="tt-header">
        <div>
          <h1 className="tt-title" style={{textAlign:"center"}}>Weekly Timetable</h1>
        </div>
      </div>

      {/* Timetable Days Grid Stack */}
      <div className="tt-days-wrapper">
        {Object.entries(schedule).length === 0 ? (
          <div className="tt-empty-state">
            <div className="tt-empty-icon-frame">
              <i className="fa-regular fa-calendar-xmark"></i>
            </div>
            <h3>No Schedule Assigned</h3>
            <p>Your institutional teaching profile has no assigned classes for this block.</p>
            <button
              className="tt-empty-btn"
              onClick={() => openDayEditor("Monday", [])}
            >
              Initialize Schedule
            </button>
          </div>
        ) : (
          Object.entries(schedule).map(([day, schedules]) => (
            <div className="tt-day-section" key={day}>
              
              {/* Minimalist Header Row */}
              <div className="tt-day-top">
                <h2 style={{color:"#e94560"}}>{day}</h2>
                  <button
                  className="tt-update-btn"
                  onClick={() => openDayEditor(day, schedules)}
                  style={{border:"1px solid #e94560"}}
                  aria-label={`Edit ${day} schedule`}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
              </div>

              {/* Minimalist Borderless Table System */}
              <div className="tt-table-wrapper">
                <table className="tt-table">
                  <thead>
                    <tr>
                      <th>Time Frame</th>
                      <th>Class</th>
                      <th>Medium</th>
                      <th>Subject</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules?.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="tt-no-classes">
                          No classes scheduled for this day
                        </td>
                      </tr>
                    ) : (
                      schedules.map((item, index) => (
                        <tr key={index}>
                          <td className="tt-time-cell">{item.timeSlot}</td>
                          <td className="tt-class-cell">Class {item.class}</td>
                          <td>
                            <span className="tt-medium-text">{item.medium}</span>
                          </td>
                          <td>
                            <span className="tt-subject-text">{item.subject}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Modal Engine Component */}
      <TimetableUpdateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDay={selectedDay}
        currentSchedule={selectedDaySchedule}
        onUpdateSuccess={refreshTimetableState}
      />
    </div>
  );
};

export default Timetable;