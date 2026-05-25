import React, { useState } from "react";
import TimetableUpdateModal from "./TimetableUpdateModal";
import "../styles/TimetableCard.css";

const TimetableCard = ({
  timetableData = { schedule: [] },
  onRefreshDashboard,
}) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const schedule = timetableData?.schedule || [];

  // Current day
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  // Filter today's schedule
  const todaySchedule = schedule.filter(
    (slot) =>
      slot.day?.toLowerCase() === today.toLowerCase()
  );

  return (
    <section className="ttc-card">

      {/* Header */}
      <div className="ttc-header">

        <h2 className="ttc-title">
          Today's Schedule
        </h2>

        <button
          className="ttc-update-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <i className="fa-solid fa-pen-to-square"></i>
          Update Timetable
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
              {todaySchedule.map((slot, index) => (
                <tr key={slot._id || index}>

                  <td className="ttc-time-cell">
                    <i className="fa-regular fa-clock"></i>
                    {slot.timeSlot}
                  </td>

                  <td className="ttc-subject-cell">
                    <strong>{slot.subject}</strong>
                  </td>

                  <td className="ttc-class-cell">
                    {slot.class}
                  </td>

                  <td className="ttc-medium-cell">
                    {slot.medium ? (
                      <span className="ttc-medium-pill">
                        {slot.medium}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        ) : (
          <p className="ttc-no-data">
            No classes scheduled for today.
          </p>
        )}

      </div>

      {/* Modal */}
      <TimetableUpdateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentSchedule={schedule}
        onUpdateSuccess={onRefreshDashboard}
      />

    </section>
  );
};

export default TimetableCard;