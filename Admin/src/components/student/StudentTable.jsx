import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, ToggleLeft, ToggleRight } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  capitalizeFirst,
  capitalizeWords,
  sortStudents,
} from "../../utils/utility";
import { AdminContext } from "../../context/AdminContext";
import Loader from "../../components/common/Loader";
import { Button } from "../common/Button";

const StudentTable = ({
  filteredStudents = [],
  selectedStudent,
  setSelectedStudent,
}) => {
  const navigate = useNavigate();
  const { adminToken, backendUrl } = useContext(AdminContext);

  const [students, setStudents] = useState(filteredStudents);
  const [loadingId, setLoadingId] = useState(null);

  // Sync with parent filtered data
  useEffect(() => {
    setStudents(filteredStudents);
  }, [filteredStudents]);

  const sortedStudents = sortStudents(students).sort((a, b) => {
    if (!a.registrationNo) return 1;
    if (!b.registrationNo) return -1;
    return a.registrationNo.localeCompare(b.registrationNo);
  });

  const handleRowClick = (student) => {
    setSelectedStudent(selectedStudent?._id === student._id ? null : student);
    navigate(`/students/${student._id}`);
  };

  const onToggleAdmitCard = async (id) => {
    if (loadingId) return;

    const student = students.find((s) => s._id === id);
    const currentValue = student?.canDownloadAdmitCard;

    // Optimistic update
    setStudents((prev) =>
      prev.map((s) =>
        s._id === id ? { ...s, canDownloadAdmitCard: !currentValue } : s,
      ),
    );

    setLoadingId(id);

    try {
      await axios.put(
        `${backendUrl}/api/student/toggle-admit-card/${id}`,
        {},
        { headers: { Authorization: `Bearer ${adminToken}` } },
      );
    } catch (error) {
      console.log("Error in Student table: ", error);
      setStudents((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, canDownloadAdmitCard: currentValue } : s,
        ),
      );
      toast.error("Failed to update admit card permission");
    } finally {
      setLoadingId(null);
    }
  };

  if (sortedStudents.length === 0) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-12 text-center">
        <p className="text-[var(--text-secondary)] text-lg">
          No students found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          <thead>
            <tr className="border-b border-[var(--border-default)] bg-[var(--bg-surface-2)]">
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                S.No.
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Registration No
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Medium
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Stream
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Admit Card
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border-default)]">
            {sortedStudents.map((student, index) => (
              <tr
                key={student._id}
                onClick={() => handleRowClick(student)}
                className="hover:bg-[var(--bg-surface-2)] transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                  {index + 1}
                </td>

                <td className="px-6 py-4 font-medium text-[var(--text-primary)]">
                  {student.registrationNo || "-"}
                </td>

                <td className="px-6 py-4">
                  <div className="font-semibold text-[var(--text-primary)]">
                    {capitalizeWords(student.name)}
                  </div>
                </td>

                <td className="px-6 py-4 text-sm">{student.class}</td>

                <td className="px-6 py-4 text-sm capitalize">
                  {capitalizeFirst(student.medium)}
                </td>

                <td className="px-6 py-4 text-sm capitalize">
                  {student.stream ? capitalizeFirst(student.stream) : "-"}
                </td>

                {/* Admit Card Toggle */}
                <td
                  className="px-6 py-4 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    onClick={() => onToggleAdmitCard(student._id)}
                    disabled={loadingId === student._id}
                  >
                    {student.canDownloadAdmitCard ? (
                      <ToggleRight size={28} className="text-emerald-500" />
                    ) : (
                      <ToggleLeft
                        size={28}
                        className="text-[var(--text-muted)]"
                      />
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
