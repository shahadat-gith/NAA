import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, CheckCircle, User, BookOpen, MapPin } from "lucide-react";

import { AdminContext } from "../../context/AdminContext";
import Loader from "../../components/common/Loader";
import VerifyAdmissionModal from "../../components/admissions/VerifyAdmissionModal";

const AdmissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [loading, setLoading] = useState(true);
  const [admission, setAdmission] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const fetchAdmissionDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/admission/single/${id}`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (data?.success) {
        setAdmission(data.admission);
      } else {
        toast.error("Admission not found");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching admission details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchAdmissionDetails();
  }, [id]);

  if (loading) return <Loader text="Fetching admission details..." />;

  if (!admission) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--text-secondary)]">
        Admission not found
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
              onClick={() => navigate(-1)}
              className="p-3 rounded-2xl border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] transition-all"
            >
              <ArrowLeft size={22} />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-[var(--text-primary)]">
                {admission.name}
              </h1>
              <p className="text-[var(--text-secondary)]">Admission Application</p>
            </div>
          </div>

          <button
            onClick={() => setShowVerifyModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold transition-all"
          >
            <CheckCircle size={20} />
            Verify Admission
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Information */}
          <div className="lg:col-span-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <User className="text-[var(--color-primary)]" size={26} />
              <h3 className="text-2xl font-semibold">Student Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8">
              <div>
                <p className="text-sm text-[var(--text-muted)]">Full Name</p>
                <p className="text-xl font-semibold mt-1">{admission.name}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Father's Name</p>
                <p className="text-xl font-medium mt-1">{admission.fatherName || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Mother's Name</p>
                <p className="text-xl font-medium mt-1">{admission.motherName || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Date of Birth</p>
                <p className="text-xl font-medium mt-1">{admission.dob || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Gender</p>
                <p className="text-xl font-medium mt-1 capitalize">{admission.gender || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Phone Number</p>
                <p className="text-xl font-medium mt-1">{admission.phone || "—"}</p>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="text-[var(--color-primary)]" size={26} />
              <h3 className="text-2xl font-semibold">Academic Details</h3>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-[var(--text-muted)]">Applied For Class</p>
                <p className="text-3xl font-bold mt-1">{admission.class}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Medium</p>
                <p className="text-xl font-medium mt-1 capitalize">{admission.medium}</p>
              </div>
              {admission.stream && (
                <div>
                  <p className="text-sm text-[var(--text-muted)]">Stream</p>
                  <p className="text-xl font-medium mt-1 capitalize">{admission.stream}</p>
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className="lg:col-span-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="text-[var(--color-primary)]" size={26} />
              <h3 className="text-2xl font-semibold">Address Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <p className="text-sm text-[var(--text-muted)]">Village</p>
                <p className="text-lg mt-1">{admission.address?.village || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Post Office</p>
                <p className="text-lg mt-1">{admission.address?.postOffice || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Police Station</p>
                <p className="text-lg mt-1">{admission.address?.policeStation || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">District</p>
                <p className="text-lg mt-1">{admission.address?.district || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">State</p>
                <p className="text-lg mt-1">{admission.address?.state || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Pincode</p>
                <p className="text-lg mt-1">{admission.address?.pincode || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verify Modal */}
      <VerifyAdmissionModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        admissionId={id}
        onSuccess={fetchAdmissionDetails}
      />
    </div>
  );
};

export default AdmissionDetails;