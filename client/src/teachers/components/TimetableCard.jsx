import React, { useState } from "react";
import TimetableUpdateModal from "./TimetableUpdateModal";
import "../styles/TimetableCard.css";

const emptyScheduleStructure = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
};

const TimetableCard = ({
  timetableData = {
    schedule: emptyScheduleStructure,
  },
  onRefreshDashboard,
}) => {

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  // Full weekly schedule
  const schedule =
    timetableData?.schedule ||
    emptyScheduleStructure;

  // Current day
  const today =
    new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "long",
      }
    );

  // Current day's schedule only
  const todaySchedule =
    schedule?.[today] || [];

  // Refresh only today's schedule
  const handleRefreshTodaySchedule = (
    updatedTodaySchedule
  ) => {

    const updatedFullSchedule = {

      ...schedule,

      [today]: updatedTodaySchedule,
    };

    if (onRefreshDashboard) {
      onRefreshDashboard(
        updatedFullSchedule
      );
    }
  };

  return (
    <section className="ttc-card">

      {/* Header */}

      <div className="ttc-header">

        <div>

          <h2 className="ttc-title">
            Today's Schedule
          </h2>

          <p className="ttc-subtitle">
            {today} •{" "}
            {todaySchedule.length} classes
            today
          </p>

        </div>

        <button
          className="ttc-update-btn"
          onClick={() =>
            setIsModalOpen(true)
          }
        >
          <i className="fa-solid fa-pen-to-square"></i>
        </button>

      </div>

      {/* Table */}

      <div className="ttc-table-container">

        {todaySchedule.length > 0 ? (

          <table className="ttc-table">

            <thead>

              <tr>
                <th>Time</th>
                <th>Subject</th>
                <th>Class</th>
                <th>Medium</th>
              </tr>

            </thead>

            <tbody>

              {todaySchedule.map(
                (slot, index) => (

                  <tr key={index}>

                    <td className="ttc-time-cell">

                      <i className="fa-regular fa-clock"></i>

                      {slot.timeSlot}

                    </td>

                    <td className="ttc-subject-cell">

                      <strong>
                        {slot.subject}
                      </strong>

                    </td>

                    <td className="ttc-class-cell">

                      Class {slot.class}

                    </td>

                    <td className="ttc-medium-cell">

                      <span className="ttc-medium-pill">
                        {slot.medium}
                      </span>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        ) : (

          <div className="ttc-empty-state">

            <i className="fa-regular fa-calendar-xmark"></i>

            <h3>No Classes Today</h3>

            <p>
              You don't have any scheduled
              classes for {today}.
            </p>

          </div>

        )}

      </div>

      {/* Modal */}

      <TimetableUpdateModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }

        // Important
        selectedDay={today}

        // Send only today's schedule
        currentSchedule={todaySchedule}

        onUpdateSuccess={
          handleRefreshTodaySchedule
        }
      />

    </section>
  );
};

export default TimetableCard;