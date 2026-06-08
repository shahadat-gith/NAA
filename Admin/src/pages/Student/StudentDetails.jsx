import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ImagePlus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import { AdminContext } from "../../context/AdminContext";
import { capitalizeWords, capitalizeFirst } from "../../utils/utility";
import Loader from "../../components/common/Loader";
import { Button } from "../../components/common/Button";

const StudentDetails = () => {
  const { id: studentId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);

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
      toast.error(error.response?.data?.message || "Failed to load student");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) fetchStudent();
  }, [studentId]);

  const handleDeleteStudent = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this student?"
    );

    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/student/${studentId}`,
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
      toast.error(error.response?.data?.message || "Failed to delete student");
    }
  };

  const openEditStudent = () => {
    navigate("/actions?type=UpdateStudent", {
      state: { student },
    });
  };

  const openImageUpload = () => {
    navigate("/actions?type=StudentImageUpload", {
      state: { student },
    });
  };

  const formatValue = (value) => {
    if (value === undefined || value === null || value === "") return "—";
    return value;
  };

  if (loading) return <Loader text="Loading student details..." />;

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] text-[var(--text-secondary)]">
        Student not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 border-b border-[var(--border-default)]">
        <div className="flex items-center gap-3">

          <div>
            <h1 className="text-xl md:text-3xl font-bold text-[var(--text-primary)]">
              {capitalizeWords(student.name)}
            </h1>
          </div>
        </div>

        <div className="flex gap-2 md:gap-3">
          <Button onClick={openEditStudent} variant="warning">
            Update
          </Button>

          <Button onClick={openImageUpload} variant="success">
            Image
          </Button>

          <Button onClick={handleDeleteStudent} variant="danger">
            Delete
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-5 md:p-8">
            <div className="flex flex-col items-center text-center">
              <img
                src={student?.image?.url || "/user.png"}
                alt={student.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover border border-[var(--border-default)] shadow-sm"
              />

             
              <button
                onClick={openImageUpload}
                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border-default)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)]"
              >
                <ImagePlus size={16} />
                Update Image
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-5 md:p-8">
            <h3 className="text-lg md:text-xl font-semibold mb-5">
              Academic Information
            </h3>

            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <Info label="Class" value={capitalizeFirst(student.class)} />
              <Info label="Medium" value={capitalizeFirst(student.medium)} />
              <Info
                label="Stream"
                value={student.stream ? capitalizeFirst(student.stream) : "—"}
              />
              <Info
                label="Registration No"
                value={student.registrationNo}
                mono
              />
              
            </div>
          </div>

          <div className="lg:col-span-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-5 md:p-8">
            <h3 className="text-lg md:text-xl font-semibold mb-5">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <Info
                label="Father's Name"
                value={capitalizeWords(formatValue(student.fatherName))}
              />
              <Info
                label="Mother's Name"
                value={capitalizeWords(formatValue(student.motherName))}
              />
              <Info label="Date of Birth" value={formatValue(student.dob)} />
              <Info
                label="Gender"
                value={
                  student.gender ? capitalizeFirst(student.gender) : "—"
                }
              />
              <Info label="Phone" value={formatValue(student.phone)} />
              <Info label="Aadhar" value={formatValue(student.aadhar)} />
              <Info label="PEN" value={formatValue(student.pen)} />
            </div>
          </div>

          <div className="lg:col-span-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-5 md:p-8">
            <h3 className="text-lg md:text-xl font-semibold mb-5">
              Address Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <Info
                label="Village"
                value={capitalizeFirst(formatValue(student?.address?.village))}
              />
              <Info
                label="Post Office"
                value={capitalizeFirst(
                  formatValue(student?.address?.postOffice)
                )}
              />
              <Info
                label="Police Station"
                value={capitalizeFirst(
                  formatValue(student?.address?.policeStation)
                )}
              />
              <Info
                label="District"
                value={capitalizeFirst(formatValue(student?.address?.district))}
              />
              <Info
                label="State"
                value={capitalizeFirst(formatValue(student?.address?.state))}
              />
              <Info
                label="Pincode"
                value={formatValue(student?.address?.pincode)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value, mono = false }) => {
  return (
    <div className="rounded-2xl bg-[var(--bg-base)] border border-[var(--border-default)] p-4">
      <p className="text-xs text-[var(--text-muted)] mb-1">{label}</p>
      <p
        className={`text-sm md:text-base font-semibold text-[var(--text-primary)] break-words ${
          mono ? "font-mono" : ""
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
};

export default StudentDetails;