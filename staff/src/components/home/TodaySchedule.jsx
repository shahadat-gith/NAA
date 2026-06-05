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
    <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
      
      {/* Header Area */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/40 select-none">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wide text-text-primary">
            Today's Schedule
          </h3>
          <p className="mt-0.5 text-[11px] font-medium text-text-secondary leading-none">
            {today} &bull; <span className="text-primary font-bold">{todaySchedule.length} classes</span> scheduled
          </p>
        </div>

        {/* Small Mobile Tappable Navigation Action Trigger */}
        <Link
          to="/timetable"
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent text-white hover:bg-primary/90 transition-transform active:scale-90 cursor-pointer"
          aria-label="View Full Timetable"
        >
          <ArrowUpRight size={15} />
        </Link>
      </div>

      {/* Sequential Mobile Slots Grid */}
      {todaySchedule.length > 0 ? (
        <div className="space-y-2.5">
          {todaySchedule.map((slot, index) => {
            const hasStream = slot.stream && slot.stream !== "null" && slot.stream !== "None";
            return (
              <div
                key={index}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-background border border-border/80"
              >
                {/* Subject Identity Data Track */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-black text-text-primary truncate leading-tight">
                    {slot.subject || "Subject"}
                  </h4>
                  <p className="mt-1 text-[11px] font-medium text-text-secondary truncate leading-none">
                    Class {slot.class || "N/A"} {hasStream ? `(${slot.stream})` : ""} &bull; {slot.medium || "N/A"}
                  </p>
                </div>
                
                {/* Micro Time Badge Indicator Container */}
                <div className="flex items-center space-x-1 bg-primary/5 px-2 py-1 rounded-lg border border-primary/10 shrink-0 select-none">
                  <Clock size={11} className="text-primary" />
                  <span className="font-black text-[10px] text-primary tracking-wide">
                    {slot.timeSlot || "N/A"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Compact Responsive Empty State Framework Illustration */
        <div className="flex flex-col items-center justify-center py-8 text-center select-none">
          <div className="w-10 h-10 rounded-xl bg-text-secondary/5 flex items-center justify-center text-text-secondary/30 mb-2">
            <CalendarX size={20} />
          </div>
          <h4 className="text-xs font-black text-text-primary uppercase tracking-wide">
            No Classes Scheduled
          </h4>
          <p className="max-w-[240px] mt-0.5 text-[11px] font-medium text-text-secondary leading-normal">
            You do not have any scheduled academic routines assigned for today.
          </p>
        </div>
      )}
    </div>
  );
};

export default TodaySchedule;