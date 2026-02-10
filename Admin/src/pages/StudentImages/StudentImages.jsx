
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import Loader from '../../components/Loader/Loader';
import ImageUploadModal from './ImageUploadModal';
import './Styles/StudentImages.css';
import { CLASS_OPTIONS, STREAM_OPTIONS } from '../../utils/academicOptions';
import { capitalizeWords } from '../../utils/utility';

const StudentImages = () => {
    const { backendUrl, adminToken } = useContext(AdminContext);

    /* ================= STATE ================= */
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeStudent, setActiveStudent] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [mediumFilter, setMediumFilter] = useState("assamese");
    const [classFilter, setClassFilter] = useState("");
    const [streamFilter, setStreamFilter] = useState("");
    const [loading, setLoading] = useState(false);

    /* ================= FETCH STUDENTS ================= */
    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${backendUrl}/api/student/list`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });

            const list = res.data?.students || [];
            setStudents(list);
            setFilteredStudents(list);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (backendUrl && adminToken) fetchStudents();
    }, [backendUrl, adminToken]);

    /* ================= FILTER LOGIC ================= */
    useEffect(() => {
        let filtered = [...students];

        // apply medium default filter
        if (mediumFilter) {
            filtered = filtered.filter((s) => s.medium === mediumFilter);
        }

        // class sorting based on medium
        const classOrder = CLASS_OPTIONS[mediumFilter] || [];
        filtered.sort((a, b) => {
            const aIndex = classOrder.indexOf(String(a.class).toLowerCase());
            const bIndex = classOrder.indexOf(String(b.class).toLowerCase());

            if (aIndex === -1 && bIndex === -1) return 0;
            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;

            return aIndex - bIndex;
        });


        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter((s) => s.name?.toLowerCase().includes(term));
        }

        if (mediumFilter) {
            filtered = filtered.filter((s) => s.medium === mediumFilter);
        }

        if (classFilter) {
            filtered = filtered.filter((s) => s.class === classFilter);
        }

        if ( streamFilter && mediumFilter === "assamese" && ["11", "12"].includes(classFilter)) {
            filtered = filtered.filter((s) => s.stream === streamFilter);
        }

        setFilteredStudents(filtered);
    }, [searchTerm, mediumFilter, classFilter, streamFilter, students]);

    /* ================= CLEAR FILTERS ================= */
    const clearFilters = () => {
        setSearchTerm("");
        setMediumFilter("");
        setClassFilter("");
        setStreamFilter("");
        setFilteredStudents(students);
    };

    const openUploadModal = (student) => {
        setActiveStudent(student);
        setIsModalOpen(true);
    };

    const closeUploadModal = () => {
        setIsModalOpen(false);
        setActiveStudent(null);
    };

    if (loading) return <Loader text="Loading students..." />;

    const mediumOptions = ["assamese", "english"]

   const classOptions = CLASS_OPTIONS[mediumFilter] || [];

    const streamOptions = ["science", "arts"]

    return (
        <div className="student-images-page">
            <div className="student-images-header">
                <div>
                    <h2>Student Images</h2>
                </div>
                <button className="secondary-btn" onClick={clearFilters}>
                    Clear Filters
                </button>
            </div>

            <div className="student-images-filters">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
                <select
                    value={mediumFilter}
                    onChange={(event) => setMediumFilter(event.target.value)}
                >
                    <option value="">All Media</option>
                    {mediumOptions.map((medium) => (
                        <option key={medium} value={medium}>
                            {capitalizeWords(medium)}
                        </option>
                    ))}
                </select>
                <select
                    value={classFilter}
                    onChange={(event) => setClassFilter(event.target.value)}
                >
                    <option value="">All Classes</option>
                    {classOptions.map((classValue) => (
                        <option key={classValue} value={classValue}>
                            {capitalizeWords(classValue)}
                        </option>
                    ))}
                </select>
                <select
                    value={streamFilter}
                    onChange={(event) => setStreamFilter(event.target.value)}
                    disabled={
                        !(mediumFilter === 'assamese' && ['11', '12'].includes(classFilter))
                    }
                >
                    <option value="">All Streams</option>
                    {streamOptions.map((stream) => (
                        <option key={stream} value={stream}>
                            {capitalizeWords(stream)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="student-images-table-wrapper">
                <table className="student-images-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Class</th>
                            <th>Medium</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="empty-state">
                                    No students found.
                                </td>
                            </tr>
                        ) : (
                            filteredStudents.map((student) => {
                                return (
                                    <tr key={student._id || student.registrationNo || student.name}>
                                        <td>
                                            <div className="student-cell">
                                                <div className="student-avatar-wrapper">
                                                    <img
                                                        src={student?.image?.url || "/user.png"}
                                                        alt={student.name || 'Student'}
                                                        className="student-avatar"
                                                    />
                                                </div>
                                                <div className="student-info">
                                                    <span className="student-name">{capitalizeWords(student.name) ||"N/A"}</span>
                                                    <span className="student-meta">
                                                        {student.registrationNo || 'No registration'}
                                                    </span>
                                                </div>

                                                <div className="student-upload">
                                                     <button
                                                        className="student-avatar-upload"
                                                        onClick={() => openUploadModal(student)}
                                                        aria-label={`Edit image for ${student.name || 'student'}`}
                                                        title="upload image"
                                                    >
                                                        <i class="fa-solid fa-cloud-arrow-up"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{capitalizeWords(student.class) || '-'}</td>
                                        <td>{capitalizeWords(student.medium) || '-'}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <ImageUploadModal
                open={isModalOpen}
                student={activeStudent}
                onClose={closeUploadModal}
                setStudents={setStudents}
            />
        </div>
    );
}

export default StudentImages