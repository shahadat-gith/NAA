import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CalendarRange, CalendarOff } from "lucide-react";

import { apis } from "../services/api";
import { useAppContext } from "../context/Context";
import DayScheduleCard from "../components/timetable/DayScheduleCard";

const emptyScheduleStructure = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
};

const Timetable = () => {
  const navigate = useNavigate();
  const { staff } = useAppContext();
  const [schedule, setSchedule] = useState(emptyScheduleStructure);
  const [loading, setLoading] = useState(true);

  const isNonTeaching = staff?.staffType === "Non-Teaching";

  useEffect(() => {
    const fetchTimetable = async () => {
      if (isNonTeaching) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await apis.getTimetable();

        if (data?.success) {
          const apiSchedule = data?.timetable?.schedule;
          setSchedule({
            ...emptyScheduleStructure,
            ...(apiSchedule || {}),
          });
        }
      } catch (error) {
        setSchedule(emptyScheduleStructure);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [staff, isNonTeaching]);

  // Swapped from the old local inline openDayEditor modal block to direct clean URL routing parameters
  const handleEditRedirect = (day) => {
    if (isNonTeaching) return;
    navigate(`/timetable/update?day=${day}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-3 text-sm font-medium text-text-secondary">
          Loading academic timetable...
        </p>
      </div>
    );
  }

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      
      {/* Header Heading Banner Row */}
      <div className="mb-10 flex flex-col items-start gap-2 border-b border-border pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <CalendarRange size={20} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-text-primary">
            Weekly Timetable
          </h1>
        </div>
        <p className="text-sm font-medium text-text-secondary ml-13">
          Review, analyze, and update scheduled daily academic classroom distributions.
        </p>
      </div>

      {/* Main Operational Switch Board Layer */}
      {isNonTeaching ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-3xl bg-card">
          <div className="w-14 h-14 rounded-full bg-text-secondary/5 flex items-center justify-center text-text-secondary/40 mb-3">
            <CalendarOff size={26} />
          </div>
          <h3 className="text-base font-bold text-text-primary">
            Timetable Mapping Disabled
          </h3>
          <p className="max-w-xs mt-1 text-xs font-medium text-text-secondary leading-relaxed">
            Routine parameters are restricted to Teaching structures only. Non-teaching profiles carry no assigned calendar items.
          </p>
        </div>
      ) : (
        /* Web Layout Grid Framework: Spans beautifully across viewports without vertical mobile piling constraints */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {Object.entries(schedule).map(([day, schedules]) => (
            <DayScheduleCard
              key={day}
              day={day}
              schedules={schedules}
              onEdit={() => handleEditRedirect(day)}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default Timetable;