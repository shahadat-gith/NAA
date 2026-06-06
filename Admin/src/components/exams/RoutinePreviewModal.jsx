import React from "react";
import { X, Download, Calendar, BookOpen } from "lucide-react";
import { generateRoutinePdf } from "./generateRoutinePdf";
import toast from "react-hot-toast";

const RoutinePreviewModal = ({ 
  open, 
  onClose, 
  routine, 
  examDetails, 
  authorities 
}) => {
  if (!open || !routine) return null;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const handleDownload = () => {
    if (!authorities?.principal) {
      toast.error("Principal details not configured properly");
      return;
    }

    generateRoutinePdf(routine, authorities, examDetails);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1200] flex items-center justify-center p-4">
      <div
        className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl w-full max-w-4xl max-h-[60vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--border-default)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Examination Routine
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-surface-2)] rounded-xl transition-colors"
          >
            <X size={26} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto">
          {/* Routine Details */}
          <div className="px-8 py-6 border-b border-[var(--border-default)] bg-[var(--bg-surface-2)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div>
                <p className="text-[var(--text-muted)]">Class</p>
                <p className="text-sm font-semibold mt-1">{routine.class}</p>
              </div>
              <div>
                <p className="text-[var(--text-muted)]">Medium</p>
                <p className="text-sm font-semibold mt-1 capitalize">
                  {routine.medium || "—"}
                </p>
              </div>
              <div>
                <p className="text-[var(--text-muted)]">Stream</p>
                <p className="text-sm font-semibold mt-1 capitalize">
                  {routine.stream || "—"}
                </p>
              </div>
              <div>
                <p className="text-[var(--text-muted)]">Exam Center</p>
                <p className="text-sm font-semibold mt-1">{routine.examCenter || "—"}</p>
              </div>
            </div>
          </div>

          {/* Exam Schedule Table */}
          <div className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={20} className="text-[var(--color-primary)]" />
              <h3 className="font-semibold text-lg">Exam Schedule</h3>
            </div>

            <div className="overflow-x-auto border border-[var(--border-default)] rounded-2xl">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b border-[var(--border-default)] bg-[var(--bg-surface-2)]">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Shift</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-default)]">
                  {routine.exams.map((exam, index) => (
                    <tr key={index} className="hover:bg-[var(--bg-surface-2)] transition-colors">
                      <td className="px-6 py-4 text-[var(--text-secondary)] font-medium">{index + 1}</td>
                      <td className="px-6 py-4 font-medium">{exam.subject}</td>
                      <td className="px-6 py-4 text-[var(--text-secondary)]">{formatDate(exam.date)}</td>
                      <td className="px-6 py-4 capitalize">{exam.shift}</td>
                      <td className="px-6 py-4 font-medium">{exam.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-6 border-t border-[var(--border-default)] flex justify-end flex-shrink-0">
          <button
            onClick={handleDownload}
            className="flex items-center gap-3 px-8 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-bright)] text-white rounded-2xl font-semibold transition-all"
          >
            <Download size={20} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoutinePreviewModal;