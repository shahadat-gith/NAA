import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, Upload, X } from 'lucide-react';

import Loader from '../../components/common/Loader';
import ImageUploadModal from '../../components/student/ImageUploadModal';
import { CLASS_OPTIONS } from '../../utils/academicOptions';
import { capitalizeWords } from '../../utils/utility';
import { AdminContext } from '../../context/AdminContext';

const StudentImages = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [mediumFilter, setMediumFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [streamFilter, setStreamFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);

  /* ================= FETCH STUDENTS ================= */
  const fetchStudentImages = async () => {
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
    fetchStudentImages();
  }, [adminToken]);

  /* ================= FILTER LOGIC ================= */
  useEffect(() => {
    let filtered = [...students];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((s) =>
        s.name?.toLowerCase().includes(term)
      );
    }

    if (mediumFilter) {
      filtered = filtered.filter((s) => s.medium === mediumFilter);
    }

    if (classFilter) {
      filtered = filtered.filter((s) => s.class === classFilter);
    }

    if (streamFilter && mediumFilter === "assamese" && ["11", "12"].includes(classFilter)) {
      filtered = filtered.filter((s) => s.stream === streamFilter);
    }

    // Sort by class order
    const classOrder = CLASS_OPTIONS[mediumFilter] || [];
    filtered.sort((a, b) => {
      const aIndex = classOrder.indexOf(String(a.class));
      const bIndex = classOrder.indexOf(String(b.class));
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    setFilteredStudents(filtered);
  }, [searchTerm, mediumFilter, classFilter, streamFilter, students]);

  const clearFilters = () => {
    setSearchTerm("");
    setMediumFilter("");
    setClassFilter("");
    setStreamFilter("");
  };

  const openUploadModal = (student) => {
    setActiveStudent(student);
    setIsModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsModalOpen(false);
    setActiveStudent(null);
  };

  if (loading) return <Loader text="Loading student images..." />;

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[var(--text-primary)]">Student Images</h1>
            <p className="text-[var(--text-secondary)] mt-1">Manage and upload student photos</p>
          </div>
          <button
            onClick={clearFilters}
            className="mt-4 md:mt-0 flex items-center gap-2 px-5 py-3 border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] rounded-2xl font-medium transition-all"
          >
            <X size={18} />
            Clear Filters
          </button>
        </div>

        {/* Search & Filters */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
                <input
                  type="text"
                  placeholder="Search by student name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                />
              </div>
            </div>

            {/* Medium */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Medium</label>
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
            </div>

            {/* Class */}
            {mediumFilter && (
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Class</label>
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
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Stream */}
            {mediumFilter === "assamese" && ["11", "12"].includes(classFilter) && (
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">Stream</label>
                <select
                  value={streamFilter}
                  onChange={(e) => setStreamFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
                >
                  <option value="">All Streams</option>
                  <option value="science">Science</option>
                  <option value="arts">Arts</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-[var(--text-secondary)]">
          Showing <span className="font-semibold text-[var(--text-primary)]">{filteredStudents.length}</span> students
        </div>

        {/* Student Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div
                key={student._id}
                className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className="relative h-56 bg-[var(--bg-base)] flex items-center justify-center">
                  <img
                    src={student?.image?.url || "/user.png"}
                    alt={student.name}
                    className="w-40 h-40 rounded-2xl object-cover border-4 border-[var(--bg-surface)] shadow-md"
                  />
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-lg text-[var(--text-primary)] line-clamp-1">
                    {capitalizeWords(student.name)}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {student.registrationNo} • {student.class} {student.medium}
                  </p>

                  <button
                    onClick={() => openUploadModal(student)}
                    className="mt-5 w-full flex items-center justify-center gap-2 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] rounded-2xl transition-all font-medium"
                  >
                    <Upload size={18} />
                    Update Image
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl">
              <p className="text-[var(--text-secondary)] text-lg">No students found.</p>
            </div>
          )}
        </div>

        {/* Image Upload Modal */}
        <ImageUploadModal
          isOpen={isModalOpen}
          student={activeStudent}
          onClose={closeUploadModal}
          onSuccess={fetchStudentImages}
        />
      </div>
    </div>
  );
};

export default StudentImages;