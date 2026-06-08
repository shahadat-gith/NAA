import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Search, ToggleLeft, ToggleRight, ImagePlus, Eye } from "lucide-react";

import { CLASS_OPTIONS } from "../../utils/academicOptions";
import { capitalizeWords, sortStudents } from "../../utils/utility";
import { AdminContext } from "../../context/AdminContext";
import Loader from "../../components/common/Loader";
import { Button } from "../../components/common/Button.jsx";

const Student = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [mediumFilter, setMediumFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [streamFilter, setStreamFilter] = useState("");

  const fetchStudents = async () => {
    if (!adminToken) return;

    setLoading(true);

    try {
      const { data } = await axios.get(`${backendUrl}/api/student/list`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (data.success) {
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [adminToken]);

  useEffect(() => {
    let filtered = [...students];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();

      filtered = filtered.filter(
        (student) =>
          student.name?.toLowerCase().includes(term) ||
          student.registrationNo?.toLowerCase().includes(term),
      );
    }

    if (mediumFilter) {
      filtered = filtered.filter((student) => student.medium === mediumFilter);
    }

    if (classFilter) {
      filtered = filtered.filter((student) => student.class === classFilter);
    }

    if (
      streamFilter &&
      mediumFilter === "assamese" &&
      ["11", "12"].includes(classFilter)
    ) {
      filtered = filtered.filter((student) => student.stream === streamFilter);
    }

    setFilteredStudents(sortStudents(filtered));
  }, [students, searchTerm, mediumFilter, classFilter, streamFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setMediumFilter("");
    setClassFilter("");
    setStreamFilter("");
  };

  const openAddStudent = () => {
    navigate("/actions?type=StudentForm");
  };

  const openPromoteStudents = () => {
    navigate("/actions?type=PromoteStudents");
  };

  const openStudentDetails = (studentId) => {
    navigate(`/students/${studentId}`);
  };

  const openImageUpload = (student) => {
    navigate("/actions?type=StudentImageUpload", {
      state: { student },
    });
  };

  const onToggleAdmitCard = async (id) => {
    if (loadingId) return;

    const student = students.find((s) => s._id === id);
    const currentValue = student?.canDownloadAdmitCard;

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
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        },
      );
    } catch (error) {
      console.error("Admit card toggle error:", error);

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

  if (loading) {
    return <Loader text="Loading students..." />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="flex flex-col md:flex-row md:items-center p-4 justify-between border-b border-[var(--border-default)]">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Students
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Manage student records, images and admit card permissions
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <Button variant="primary" onClick={openAddStudent}>
            Add Student
          </Button>

          <Button variant="success" onClick={openPromoteStudents}>
            Promote Students
          </Button>
        </div>
      </div>

      <div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-6 mb-6">
          <div className="relative mb-6">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              size={20}
            />

            <input
              type="text"
              placeholder="Search by student name or registration number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none text-base"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              value={mediumFilter}
              onChange={(e) => {
                setMediumFilter(e.target.value);
                setClassFilter("");
                setStreamFilter("");
              }}
              className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
            >
              <option value="">All Mediums</option>
              <option value="english">English</option>
              <option value="assamese">Assamese</option>
            </select>

            {mediumFilter && (
              <select
                value={classFilter}
                onChange={(e) => {
                  setClassFilter(e.target.value);
                  setStreamFilter("");
                }}
                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
              >
                <option value="">All Classes</option>
                {CLASS_OPTIONS[mediumFilter]?.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            )}

            {mediumFilter === "assamese" &&
              ["11", "12"].includes(classFilter) && (
                <select
                  value={streamFilter}
                  onChange={(e) => setStreamFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                >
                  <option value="">All Streams</option>
                  <option value="science">Science</option>
                  <option value="arts">Arts</option>
                </select>
              )}

            <Button
              variant="warning"
              onClick={clearFilters}
              disabled={
                !searchTerm && !mediumFilter && !classFilter && !streamFilter
              }
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        <div className="mb-6 text-[var(--text-secondary)]">
          Showing{" "}
          <span className="font-semibold text-[var(--text-primary)]">
            {filteredStudents.length}
          </span>{" "}
          students
        </div>

        {filteredStudents.length === 0 ? (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-12 text-center">
            <p className="text-[var(--text-secondary)] text-lg">
              No students found.
            </p>
          </div>
        ) : (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl md:rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-default)] bg-[var(--bg-surface-2)]">
                    <th className="px-2 py-3 w-8 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">
                      #
                    </th>

                    <th className="px-2 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">
                      Student
                    </th>

                    <th className="px-2 py-3 w-24 text-center text-xs font-semibold text-[var(--text-muted)] uppercase">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[var(--border-default)] px-3 ">
                  {filteredStudents.map((student, index) => (
                    <tr
                      key={student._id}
                      className="hover:bg-[var(--bg-surface-2)] transition-colors"
                    >
                      <td className="px-2 py-3 text-xs md:text-sm text-[var(--text-secondary)] whitespace-nowrap">
                        {index + 1}
                      </td>

                      <td className="px-2 py-3">
                        <div className="flex items-center gap-2 md:gap-3 min-w-0">
                          <img
                            src={student?.image?.url || "/user.png"}
                            alt={student.name}
                            className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl object-cover border border-[var(--border-default)] flex-shrink-0"
                          />

                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm md:text-base text-[var(--text-primary)] truncate max-w-[150px] sm:max-w-none">
                              {capitalizeWords(student.name)}
                            </h3>

                            <p className="text-[11px] md:text-sm text-[var(--text-secondary)] truncate max-w-[150px] sm:max-w-none">
                              {student.registrationNo || "-"}
                            </p>
                            <p className="text-[10px] text-[var(--text-secondary)] truncate max-w-[150px] sm:max-w-none">
                              {student.class || "-"} - {student.medium || "-"}
                              {student.stream && ` - ${student.stream}`}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-2 py-3">
                        <div className="flex justify-center gap-1.5 md:gap-2">
                          <button
                            onClick={() => openStudentDetails(student._id)}
                            className="p-1.5 md:p-2 rounded-lg md:rounded-xl border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            title="View Student"
                          >
                            <Eye
                              size={16}
                              className="md:w-[18px] md:h-[18px]"
                            />
                          </button>

                          <button
                            onClick={() => openImageUpload(student)}
                            className="p-1.5 md:p-2 rounded-lg md:rounded-xl border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            title="Update Image"
                          >
                            <ImagePlus
                              size={16}
                              className="md:w-[18px] md:h-[18px]"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Student;
