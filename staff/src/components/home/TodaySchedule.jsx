import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, CalendarX } from "lucide-react";

const emptyScheduleStructure = {
  Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: []
};

const TodaySchedule = ({ timetableData }) => {
  const schedule = timetableData?.schedule || emptyScheduleStructure;
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todaySchedule = schedule?.[today] || [];

  return (
    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xs">
      {/* Header Area */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-text-primary tracking-tight">
            Today's Schedule
          </h3>
          <p className="mt-1 text-xs font-medium text-text-secondary">
            {today} &bull; <span className="text-primary font-semibold">{todaySchedule.length} classes</span> scheduled
          </p>
        </div>

        <Link
          to="/timetable"
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent text-white hover:bg-primary/90 transition-all cursor-pointer group"
        >
          <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Slots Listing */}
      {todaySchedule.length > 0 ? (
        <div className="space-y-3">
          {todaySchedule.map((slot, index) => {
            const hasStream = slot.stream && slot.stream !== "null" && slot.stream !== "None";
            return (
              <div
                key={index}
                className="flex items-center justify-between gap-4 p-4 rounded-xl bg-background border border-border/60 hover:border-primary/30 transition-colors"
              >
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-text-primary truncate">
                    {slot.subject || "Subject"}
                  </h4>
                  <p className="mt-1 text-xs font-medium text-text-secondary truncate">
                    Class {slot.class || "N/A"} {hasStream ? `(${slot.stream})` : ""} &bull; {slot.medium || "N/A"}
                  </p>
                </div>
                <div className="flex items-center space-x-1.5 bg-primary/5 px-2.5 py-1.5 rounded-lg border border-primary/15 flex-shrink-0">
                  <Clock size={13} className="text-primary" />
                  <span className="font-bold text-xs text-primary">{slot.timeSlot || "N/A"}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Flat Empty State (No nested card style) */
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-text-secondary/5 flex items-center justify-center text-text-secondary/40 mb-3">
            <CalendarX size={24} />
          </div>
          <h4 className="text-sm font-bold text-text-primary">No Classes Scheduled</h4>
          <p className="max-w-xs mt-1 text-xs font-medium text-text-secondary leading-relaxed">
            You do not have any scheduled academic routines assigned for today.
          </p>
        </div>
      )}
    </div>
  );
};

export default TodaySchedule;