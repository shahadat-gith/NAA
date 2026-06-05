import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarRange, CalendarOff } from "lucide-react";

import { apis } from "../services/api";
import { useAppContext } from "../context/Context";
import DayScheduleCard from "../components/timetable/DayScheduleCard";
import Loader from "../components/common/Loader";

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

  const handleEditRedirect = (day) => {
    if (isNonTeaching) return;
    navigate(`/timetable/update?day=${day}`);
  };

  if (loading) return <Loader fullScreen={true} size="medium" />;

  return (
    <main className="w-full px-4 py-6 space-y-6 max-w-md mx-auto animate-fade-in">
      
      {/* ================= MOBILE STREAMLINED HEADER ================= */}
      <div className="bg-gradient-to-br from-card to-background border border-border p-4 rounded-2xl shadow-xs select-none">
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <CalendarRange size={16} />
          </div>
          <h1 className="text-xs font-black uppercase tracking-wide text-text-primary">
            Weekly Timetable
          </h1>
        </div>
        <p className="text-[11px] font-medium text-text-secondary leading-normal pl-0.5">
          Review, analyze, and manage scheduled daily academic classroom distribution rosters.
        </p>
      </div>

      {/* ================= MAIN MOBILE VIEWPORT SWITCHBOARD ================= */}
      {isNonTeaching ? (
        /* Compact Responsive Empty State Card */
        <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-border rounded-2xl bg-card p-5 select-none">
          <div className="w-10 h-10 rounded-xl bg-text-secondary/5 flex items-center justify-center text-text-secondary/30 mb-2.5">
            <CalendarOff size={20} />
          </div>
          <h3 className="text-xs font-black uppercase tracking-wide text-text-primary">
            Timetable Disabled
          </h3>
          <p className="max-w-60 mt-1 text-[11px] font-medium text-text-secondary leading-normal">
            Routine parameters are restricted to Teaching structures. Non-teaching profiles carry no assigned calendar items.
          </p>
        </div>
      ) : (
        /* Mobile-First Sequential Vertical Feed Stack */
        <div className="space-y-4">
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