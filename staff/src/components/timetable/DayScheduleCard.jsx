import React from "react";
import { Edit2, Clock, CalendarX } from "lucide-react";

const DayScheduleCard = ({ day, schedules = [], onEdit }) => {
  return (
    <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col h-full">
      
      {/* Card Header Section */}
      <div className="flex items-center justify-between mb-5 shrink-0">
        <h3 className="text-lg font-black tracking-tight text-primary">
          {day}
        </h3>

        {/* Action Button: Routes directly to the new standalone update page */}
        <button
          type="button"
          onClick={onEdit}
          className="w-9 h-9 rounded-xl flex items-center justify-center border border-border/60 bg-background text-text-secondary hover:text-primary hover:border-primary/30 transition-all cursor-pointer outline-none group"
          title={`Edit ${day} Schedule`}
        >
          <Edit2 size={14} className="transition-transform group-hover:scale-110" />
        </button>
      </div>

      {/* Dynamic Structural Content Loop Slots */}
      {schedules?.length === 0 ? (
        /* Flat Empty Fallback Frame (No nesting) */
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center border border-dashed border-border/60 rounded-2xl bg-background/40 flex-1">
          <CalendarX size={22} className="text-text-secondary/40 mb-2" />
          <p className="text-xs font-semibold text-text-secondary">
            No classes scheduled for this day
          </p>
        </div>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto max-h-85 pr-0.5 custom-scrollbar">
          {schedules.map((item, index) => {
            // Check for valid stream values matching original filter layers
            const hasStream = item.stream && item.stream !== "null" && item.stream !== "None";

            return (
              <div
                key={index}
                className="rounded-xl p-3.5 border border-border/50 bg-background hover:border-border transition-colors group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors truncate">
                      {item.subject || "Subject"}
                    </h4>
                    
                    <p className="mt-1 text-[11px] font-medium text-text-secondary capitalize truncate">
                      Class {item.class || "N/A"} &bull; {item.medium || "N/A"} Medium
                      {hasStream && ` &bull; ${item.stream} Stream`}
                    </p>
                  </div>

                  {/* Right Side Sticky Time Frame Badge */}
                  <div className="flex items-center space-x-1 bg-primary/5 px-2 py-1 rounded-lg border border-primary/10 shrink-0 mt-0.5">
                    <Clock size={12} className="text-primary" />
                    <span className="font-bold text-[11px] text-primary tracking-tight">
                      {item.timeSlot || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DayScheduleCard;