import React from "react";
import { User, Users } from "lucide-react";

const StudentList = ({
  students = [],
  selectable = false,
  selectedKey = "",
  onSelect,
}) => {
  if (students.length === 0) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-12 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-[var(--bg-base)] flex items-center justify-center mb-4 border border-[var(--border-default)]">
          <Users size={32} className="text-[var(--text-muted)]" />
        </div>
        <p className="text-[var(--text-secondary)] text-lg">No students to show</p>
        <p className="text-[var(--text-muted)] mt-1 text-sm">
          {selectable
            ? "Search for a student by name or registration number"
            : "Select medium and class to view students"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--border-default)] flex items-center justify-between bg-[var(--bg-surface-2)]">
        <div className="flex items-center gap-3">
          <Users size={20} className="text-[var(--color-primary)]" />
          <span className="font-semibold text-[var(--text-primary)]">
            {students.length} {students.length === 1 ? "Student" : "Students"}
          </span>
        </div>
        {selectable && (
          <span className="text-xs text-[var(--text-muted)]">Click row to select</span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          <thead>
            <tr className="border-b border-[var(--border-default)] bg-[var(--bg-surface-2)]">
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Reg No</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Class</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Medium</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border-default)]">
            {students.map((s) => {
              const key = s._id || s.registrationNo;
              const isSelected = selectable && selectedKey === key;

              return (
                <tr
                  key={key}
                  onClick={selectable ? () => onSelect?.(key) : undefined}
                  className={`hover:bg-[var(--bg-surface-2)] transition-colors cursor-pointer ${
                    isSelected ? "bg-[var(--color-primary)]/10" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-2xl bg-[var(--bg-base)] flex items-center justify-center border border-[var(--border-default)]">
                        <User size={16} className="text-[var(--text-muted)]" />
                      </div>
                      <span className="font-medium text-[var(--text-primary)]">
                        {s.name || "Unknown"}
                      </span>
                      {isSelected && (
                        <span className="ml-auto text-emerald-500">
                          ✓
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[var(--text-secondary)] font-mono">
                    {s.registrationNo || "N/A"}
                  </td>
                  <td className="px-6 py-4 font-semibold">{s.class}</td>
                  <td className="px-6 py-4 capitalize text-[var(--text-secondary)]">
                    {s.medium || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;