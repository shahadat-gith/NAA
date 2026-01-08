import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  formatClassName,
  capitalizeFirst,
  capitalizeWords,
} from "../../../utils/utility";
import "./StudentTable.css";
import axios from "axios";
import { AdminContext } from "../../../context/AdminContext";
import toast from "react-hot-toast";

const StudentTable = ({
  filteredStudents = [],
  selectedStudent,
  setSelectedStudent,
}) => {
  const navigate = useNavigate();
  const { adminToken, backendUrl } = useContext(AdminContext);

  // 🔥 local state to update toggle instantly
  const [students, setStudents] = useState(filteredStudents);
  const [loadingId, setLoadingId] = useState(null);

  // sync when filteredStudents changes
  React.useEffect(() => {
    setStudents(filteredStudents);
  }, [filteredStudents]);

  const sortedStudents = [...students].sort((a, b) => {
    if (!a.registrationNo) return 1;
    if (!b.registrationNo) return -1;
    return a.registrationNo.localeCompare(b.registrationNo);
  });

  const handleStudentClick = (student) => {
    setSelectedStudent(
      selectedStudent?._id === student._id ? null : student
    );
  };

  /* ---------- TOGGLE HANDLER ---------- */
  const onToggleAdmitCard = async (id) => {
    if (loadingId) return; // prevent spam clicks

    // optimistic update
    setStudents((prev) =>
      prev.map((s) =>
        s._id === id
          ? { ...s, canDownloadAdmitCard: !s.canDownloadAdmitCard }
          : s
      )
    );

    setLoadingId(id);

    try {
      await axios.put(
        `${backendUrl}/api/student/toggle-admit-card/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
    } catch (error) {
      // rollback on error
      setStudents((prev) =>
        prev.map((s) =>
          s._id === id
            ? { ...s, canDownloadAdmitCard: !s.canDownloadAdmitCard }
            : s
        )
      );

      toast.error("Failed to update admit card permission");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="student-table">
      {sortedStudents.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Registration No</th>
              <th>Name</th>
              <th>Class</th>
              <th>Medium</th>
              <th>Stream</th>
              <th>Admit Card</th>
            </tr>
          </thead>

          <tbody>
            {sortedStudents.map((student, index) => (
              <tr
                key={student._id}
                onClick={() => {
                  handleStudentClick(student);
                  navigate(`/students/${student._id}`);
                }}
              >
                <td>{index + 1}</td>
                <td>{student.registrationNo || "-"}</td>
                <td>{capitalizeWords(student.name)}</td>
                <td>{formatClassName(student.class)}</td>
                <td>{capitalizeFirst(student.medium)}</td>
                <td>
                  {student.stream
                    ? capitalizeFirst(student.stream)
                    : "-"}
                </td>

                {/* 🔥 ADMIT CARD TOGGLE */}
                <td onClick={(e) => e.stopPropagation()}>
                  <label className="admit-switch">
                    <input
                      type="checkbox"
                      checked={student.canDownloadAdmitCard}
                      disabled={loadingId === student._id}
                      onChange={() => onToggleAdmitCard(student._id)}
                    />
                    <span className="admit-slider"></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentTable;
