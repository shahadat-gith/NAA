import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X, Download, Calendar, BookOpen } from "lucide-react";
import { generateRoutinePdf } from "../exams/generateRoutinePdf";
import toast from "react-hot-toast";
import { Button } from "../common/Button";

const PreviewRoutine = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { routine, examDetails, authorities = [] } = location.state || {};

  if (!routine) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-4">
        <p className="text-[var(--text-muted)] text-center">No routine data available</p>
      </div>
    );
  }

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const handleDownload = () => {
    const principal = authorities.find(
      (a) => a.role?.toLowerCase() === "principal"
    );

    if (!principal) {
      return toast.error("Principal details not configured properly");
    }

    generateRoutinePdf(routine, principal, examDetails);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-3xl font-bold text-[var(--text-primary)]">Examination Routine</h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 md:p-3 rounded-2xl border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl overflow-hidden">
          {/* Routine Details */}
          <div className="px-5 md:px-8 py-5 md:py-6 border-b border-[var(--border-default)] bg-[var(--bg-surface-2)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-sm">
              <div>
                <p className="text-[var(--text-muted)] text-xs md:text-sm">Class</p>
                <p className="text-sm md:text-base font-semibold mt-1">{routine.class}</p>
              </div>
              <div>
                <p className="text-[var(--text-muted)] text-xs md:text-sm">Medium</p>
                <p className="text-sm md:text-base font-semibold mt-1 capitalize">
                  {routine.medium || "—"}
                </p>
              </div>
              <div>
                <p className="text-[var(--text-muted)] text-xs md:text-sm">Stream</p>
                <p className="text-sm md:text-base font-semibold mt-1 capitalize">
                  {routine.stream || "—"}
                </p>
              </div>
              <div>
                <p className="text-[var(--text-muted)] text-xs md:text-sm">Exam Center</p>
                <p className="text-sm md:text-base font-semibold mt-1">{routine.examCenter || "—"}</p>
              </div>
            </div>
          </div>

          {/* Exam Schedule Table */}
          <div className="p-5 md:p-8">
            <div className="flex items-center gap-2 mb-5 md:mb-6">
              <BookOpen size={20} className="text-[var(--color-primary)]" />
              <h3 className="font-semibold text-lg md:text-xl">Exam Schedule</h3>
            </div>

            <div className="overflow-x-auto border border-[var(--border-default)] rounded-2xl">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b border-[var(--border-default)] bg-[var(--bg-surface-2)]">
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">#</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Subject</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Date</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Shift</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-default)]">
                  {routine.exams.map((exam, index) => (
                    <tr key={index} className="hover:bg-[var(--bg-surface-2)] transition-colors">
                      <td className="px-4 md:px-6 py-4 text-[var(--text-secondary)] font-medium text-sm">{index + 1}</td>
                      <td className="px-4 md:px-6 py-4 font-medium text-sm">{exam.subject}</td>
                      <td className="px-4 md:px-6 py-4 text-[var(--text-secondary)] text-sm">{formatDate(exam.date)}</td>
                      <td className="px-4 md:px-6 py-4 capitalize text-sm">{exam.shift}</td>
                      <td className="px-4 md:px-6 py-4 font-medium text-sm">{exam.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Download Button - No Icon */}
        <div className="mt-6 md:mt-8">
          <Button
            onClick={handleDownload}
            variant="success"
            className="w-full py-3.5 md:py-4 text-base"
          >
            Download PDF Routine
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewRoutine;