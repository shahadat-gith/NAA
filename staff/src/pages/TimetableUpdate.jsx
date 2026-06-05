import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, CalendarDays, Loader2, Save } from "lucide-react";

import { apis } from "../services/api";
import { useAppContext } from "../context/Context";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";

import {
  CLASS_OPTIONS,
  STREAM_OPTIONS,
  SUBJECT_OPTIONS,
} from "../constants/academy";

const TimetableUpdate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { staff } = useAppContext();

  // Fallback to Monday if url parameters are cleared
  const selectedDay = searchParams.get("day") || "Monday";

  const [scheduleList, setScheduleList] = useState([]);
  const [selectedMedium, setSelectedMedium] = useState("english");
  const [formData, setFormData] = useState({
    class: CLASS_OPTIONS.english[0],
    subject: SUBJECT_OPTIONS[0],
    timeSlot: "",
    stream: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: "", message: "", variant: "info" });

  const isHigherSecondary = formData.class === "11" || formData.class === "12";

  // 1. Initial Data Fetch for target day's existing records
  useEffect(() => {
    if (!staff) {
      navigate("/timetable", { replace: true });
      return;
    }

    const fetchCurrentDayTimetable = async () => {
      setLoading(true);
      try {
        const data = await apis.getTimetable();
        if (data?.success) {
          const apiSchedule = data?.timetable?.schedule?.[selectedDay] || [];
          setScheduleList(apiSchedule);
        }
      } catch (error) {
        setScheduleList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentDayTimetable();
  }, [selectedDay, staff, navigate]);

  // 2. Medium Switch Option Fallback sync
  useEffect(() => {
    const defaultClass = CLASS_OPTIONS[selectedMedium][0];
    setFormData((prev) => ({
      ...prev,
      class: defaultClass,
      stream: defaultClass === "11" || defaultClass === "12" ? STREAM_OPTIONS[0] : "",
    }));
  }, [selectedMedium]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "class") {
        if (value === "11" || value === "12") {
          updated.stream = prev.stream || STREAM_OPTIONS[0];
        } else {
          updated.stream = "";
        }
      }
      return updated;
    });
  };

  const triggerAlert = (title, message, variant) => {
    setAlertConfig({ visible: true, title, message, variant });
  };

  const addScheduleRow = (e) => {
    if (e) e.preventDefault();

    if (!formData.class || !formData.subject || !formData.timeSlot.trim()) {
      return triggerAlert("Missing Fields", "Please complete all fields to append a routine entry.", "warning");
    }

    if (isHigherSecondary && !formData.stream) {
      return triggerAlert("Missing Stream", "Please choose an academic stream branch for higher secondary classes.", "warning");
    }

    const newSlotRow = {
      class: formData.class,
      medium: selectedMedium,
      subject: formData.subject,
      timeSlot: formData.timeSlot.trim().toUpperCase(),
      ...(isHigherSecondary && { stream: formData.stream }),
    };

    setScheduleList((prev) => [...prev, newSlotRow]);
    setFormData((prev) => ({ ...prev, timeSlot: "" }));
  };

  const removeScheduleRow = (indexToRemove) => {
    setScheduleList((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmitTimetable = async () => {
    setSubmitting(true);
    try {
      const data = await apis.updateTimetable(selectedDay, scheduleList);

      if (data?.success) {
        triggerAlert("Success", `Timetable for ${selectedDay} updated successfully.`, "success");
        setTimeout(() => navigate("/timetable"), 1500);
      }
    } catch (error) {
      triggerAlert("Update Failed", error?.response?.data?.message || error.message || "Could not push routine changes.", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-3 text-sm font-medium text-text-secondary">Loading current configurations...</p>
      </div>
    );
  }

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      
      {/* Navigation and Title Header Row */}
      <div className="flex sm:items-center sm:justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-text-primary mt-2">
            Update {selectedDay} Schedule
          </h1>
        </div>

        <Button
          type="button"
          variant="accent"
          size="md"
          loading={submitting}
          icon={Save}
          onClick={handleSubmitTimetable}
          className="px-6 self-start sm:self-auto"
        >
          Save
        </Button>
      </div>

      {/* Two-Column Form and Live Display System Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Add Schedule Parameter Form Pane */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-6 shadow-xs space-y-6">

          {/* Medium Selection Blocks */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Medium</span>
            <div className="flex gap-3">
              {["english", "assamese"].map((med) => (
                <button
                  type="button"
                  key={med}
                  onClick={() => setSelectedMedium(med)}
                  className={`flex-1 py-3 rounded-xl border font-bold text-sm capitalize transition-all cursor-pointer outline-none ${
                    selectedMedium === med
                      ? "bg-primary border-primary text-white"
                      : "bg-background border-border text-text-primary hover:border-primary/30"
                  }`}
                >
                  {med}
                </button>
              ))}
            </div>
          </div>

          {/* Class Select Dropdown Option */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="class-select" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Class</label>
            <select
              id="class-select"
              value={formData.class}
              onChange={(e) => handleInputChange("class", e.target.value)}
              className="w-full px-4 py-3 border rounded-xl bg-background border-border text-text-primary text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer"
            >
              {CLASS_OPTIONS[selectedMedium].map((cls) => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>
          </div>

          {/* Dynamic Stream Select Dropdown (Renders conditional parameters for HS) */}
          {isHigherSecondary && (
            <div className="flex flex-col space-y-2 animate-fade-in">
              <label htmlFor="stream-select" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Academic Stream</label>
              <select
                id="stream-select"
                value={formData.stream}
                onChange={(e) => handleInputChange("stream", e.target.value)}
                className="w-full px-4 py-3 border rounded-xl bg-background border-border text-text-primary text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer"
              >
                {STREAM_OPTIONS.map((str) => (
                  <option key={str} value={str}>{str} Stream</option>
                ))}
              </select>
            </div>
          )}

          {/* Subject Options Dropdown */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="subject-select" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Subject</label>
            <select
              id="subject-select"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              className="w-full px-4 py-3 border rounded-xl bg-background border-border text-text-primary text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer"
            >
              {SUBJECT_OPTIONS.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Custom Time Slot Raw String Input */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="timeSlot" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Time Slot</label>
            <input
              type="text"
              id="timeSlot"
              value={formData.timeSlot}
              onChange={(e) => handleInputChange("timeSlot", e.target.value)}
              placeholder="e.g. 09:00 AM - 09:45 AM"
              className="w-full px-4 py-3 border rounded-xl bg-background border-border text-text-primary text-sm font-medium outline-none placeholder:text-text-secondary/40 focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
            />
          </div>

          {/* Append Row Inline Trigger */}
          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            icon={Plus}
            onClick={addScheduleRow}
            className="h-12"
          >
            Add Period to List
          </Button>
        </div>

        {/* RIGHT COLUMN: Running Interactive Live Queue Display List Grid */}
        <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-6 shadow-xs flex flex-col min-h-125">
          <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-5 shrink-0">
            <h2 className="text-lg font-bold text-text-primary tracking-tight">
              {selectedDay} Timetable
            </h2>
           
          </div>

          {scheduleList.length === 0 ? (
            <div className="flex-1 border border-dashed border-border/60 rounded-2xl bg-background/30 flex flex-col items-center justify-center p-8 text-center">
              <CalendarDays size={32} className="text-text-secondary/30 mb-2" />
              <p className="text-sm font-medium text-text-secondary">
                No class schedule items added to this day yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-130 pr-1 custom-scrollbar flex-1">
              {scheduleList.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border/60 bg-background hover:border-primary/20 transition-all group animate-fade-in"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm sm:text-base font-bold text-text-primary group-hover:text-primary transition-colors truncate">
                      {item.subject}
                    </h4>
                    <p className="text-xs font-medium text-text-secondary mt-1 capitalize truncate">
                      Class {item.class} {item.stream ? `(${item.stream})` : ""} &bull; {item.medium} medium
                    </p>
                    <p className="text-xs font-bold text-primary mt-1 tracking-tight">
                      {item.timeSlot}
                    </p>
                  </div>

                  {/* Destructive Delete Row Selector Button */}
                  <button
                    type="button"
                    onClick={() => removeScheduleRow(index)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center bg-danger/5 hover:bg-danger/10 text-danger border border-danger/10 hover:border-danger/20 transition-all cursor-pointer outline-none shrink-0"
                    title="Delete period layout"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Central Pop-Up Dialog Overlay Modal Trigger */}
      <Alert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        variant={alertConfig.variant}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
        buttons={[
          {
            text: "Okay",
            variant: "accent",
            onClick: () => setAlertConfig((prev) => ({ ...prev, visible: false })),
          },
        ]}
      />
    </main>
  );
};

export default TimetableUpdate;