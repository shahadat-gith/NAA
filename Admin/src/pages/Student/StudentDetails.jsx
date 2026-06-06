import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit2, Trash2, ArrowLeft } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import { AdminContext } from "../../context/AdminContext";
import { capitalizeWords, capitalizeFirst } from "../../utils/utility";
import Loader from "../../components/common/Loader";
import StudentModal from "../../components/student/StudentModal";

const StudentDetails = () => {
  const { id: studentId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);

  /* ================= FETCH STUDENT ================= */
  const fetchStudent = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/student/single/${studentId}`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      if (data.success) {
        setStudent(data.student);
      }
    } catch (error) {
      console.error("Fetch student error:", error);
      toast.error("Failed to load student details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) fetchStudent();
  }, [studentId]);

  /* ================= DELETE STUDENT ================= */
  const handleDeleteStudent = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this student?"
    );

    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/student/delete/${studentId}`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      if (data.success) {
        toast.success("Student deleted successfully");
        navigate("/students");
      }
    } catch (error) {
      console.error("Delete student error:", error);
      toast.error("Failed to delete student");
    }
  };

  if (loading) return <Loader text="Loading student details..." />;

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--text-secondary)]">
        Student not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/students")}
              className="p-3 rounded-2xl border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] transition-all"
            >
              <ArrowLeft size={22} />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-[var(--text-primary)]">
                {capitalizeWords(student.name)}
              </h1>
              <p className="text-[var(--text-secondary)]">Student Profile</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-bright)] text-white rounded-2xl font-semibold transition-all"
            >
              <Edit2 size={18} />
              Edit
            </button>

            <button
              onClick={handleDeleteStudent}
              className="flex items-center gap-2 px-6 py-3 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-2xl font-semibold transition-all"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Academic Information */}
          <div className="lg:col-span-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-6">Academic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8">
              <div>
                <p className="text-sm text-[var(--text-muted)]">Class</p>
                <p className="text-2xl font-semibold mt-1">{student.class}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Medium</p>
                <p className="text-2xl font-semibold mt-1 capitalize">
                  {capitalizeFirst(student.medium)}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Stream</p>
                <p className="text-2xl font-semibold mt-1 capitalize">
                  {student.stream ? capitalizeFirst(student.stream) : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Registration No</p>
                <p className="text-2xl font-semibold mt-1 font-mono">
                  {student.registrationNo}
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-[var(--text-muted)]">Father's Name</p>
                <p className="text-lg font-medium mt-1">
                  {capitalizeWords(student.fatherName) || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Mother's Name</p>
                <p className="text-lg font-medium mt-1">
                  {capitalizeWords(student.motherName) || "—"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-[var(--text-muted)]">Date of Birth</p>
                  <p className="text-lg font-medium mt-1">{student.dob || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--text-muted)]">Gender</p>
                  <p className="text-lg font-medium mt-1 capitalize">
                    {student.gender || "—"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Phone</p>
                <p className="text-lg font-medium mt-1">{student.phone || "—"}</p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="lg:col-span-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-6">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <p className="text-sm text-[var(--text-muted)]">Village</p>
                <p className="text-lg mt-1">{capitalizeFirst(student?.address?.village) || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Post Office</p>
                <p className="text-lg mt-1">{capitalizeFirst(student?.address?.postOffice) || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Police Station</p>
                <p className="text-lg mt-1">{capitalizeFirst(student?.address?.policeStation) || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">District</p>
                <p className="text-lg mt-1">{capitalizeFirst(student?.address?.district) || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">State</p>
                <p className="text-lg mt-1">{capitalizeFirst(student?.address?.state) || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Pincode</p>
                <p className="text-lg mt-1">{student?.address?.pincode || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <StudentModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          student={student}
          setStudent={setStudent}
          onSuccess={fetchStudent}
        />
      )}
    </div>
  );
};

export default StudentDetails;