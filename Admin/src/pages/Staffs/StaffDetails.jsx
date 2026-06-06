import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, Edit2, Trash2, User, Phone, Mail, MapPin } from "lucide-react";

import { AdminContext } from "../../context/AdminContext";
import Loader from "../../components/common/Loader";
import VerifyModal from "../../components/staffs/VerifyModal";

const StaffDetails = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStaffProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/staff/${staffId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (data.success) {
        setStaff(data.staff);
      }
    } catch (error) {
      console.error("Error fetching staff details:", error);
      toast.error("Failed to load staff profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (staffId) fetchStaffProfile();
  }, [staffId]);

  const handleDeleteProfile = async () => {
    const confirmation = window.confirm(
      `Are you sure you want to permanently delete ${staff?.name}'s profile?`
    );

    if (!confirmation) return;

    setActionLoading(true);
    try {
      await axios.delete(`${backendUrl}/api/staff/${staffId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      toast.success("Staff profile deleted successfully");
      navigate("/staffs");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete profile");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader text="Loading staff profile..." />;

  if (!staff) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--text-secondary)]">
        Staff profile not found
      </div>
    );
  }

  const avatar = staff.image?.url || "/user.png";

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                {staff.name}
              </h1>
              <p className="text-[var(--text-secondary)]">{staff.designation}</p>
            </div>
          </div>

          <div className="flex gap-3">
            {staff.status === "Pending" && (
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={actionLoading}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold transition-all"
              >
                <Edit2 size={18} />
                Verify
              </button>
            )}

            <button
              onClick={handleDeleteProfile}
              disabled={actionLoading}
              className="flex items-center gap-2 px-6 py-3 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-2xl font-semibold transition-all"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        </div>

        <div className="gap-6">
          {/* Main Content */}
          <div className="space-y-6">
             <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-8 text-center">
              <div className="w-32 h-32 mx-auto rounded-3xl overflow-hidden border-4 border-[var(--bg-surface)] shadow-md mb-6">
                <img
                  src={avatar}
                  alt={staff.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-2xl font-bold text-[var(--text-primary)]">{staff.name}</h2>
              <p className="text-[var(--text-secondary)] mt-1">{staff.designation}</p>

              <div className="flex justify-center gap-3 mt-6">
                <span
                  className={`px-4 py-1 text-sm font-medium rounded-full border ${
                    staff.staffType?.toLowerCase() === "teaching"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-500"
                  }`}
                >
                  {staff.staffType || "Staff"}
                </span>
                <span
                  className={`px-4 py-1 text-sm font-medium rounded-full border ${
                    staff.status === "Active"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-500"
                  }`}
                >
                  {staff.status || "Pending"}
                </span>
              </div>
            </div>
            {/* Institutional Details */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <User className="text-[var(--color-primary)]" size={26} />
                <h3 className="text-xl font-semibold">Institutional Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-[var(--text-muted)]">Staff ID</p>
                  <p className="text-md font-mono font-semibold mt-1">{staff.staffId || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--text-muted)]">Designation</p>
                  <p className="text-md font-medium mt-1">{staff.designation || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--text-muted)]">Staff Type</p>
                  <p className="text-md font-medium mt-1 capitalize">{staff.staffType || "—"}</p>
                </div>
                {staff.subjectTaught && (
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">Subject Taught</p>
                    <p className="text-md font-medium mt-1">{staff.subjectTaught}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Phone className="text-[var(--color-primary)]" size={26} />
                <h3 className="text-xl font-semibold">Contact Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-[var(--text-muted)]">Phone</p>
                  <p className="text-md font-medium mt-1">{staff.contact || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--text-muted)]">Email</p>
                  <p className="text-md font-medium mt-1">{staff.email || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--text-muted)]">Gender</p>
                  <p className="text-md font-medium mt-1 capitalize">{staff.gender || "—"}</p>
                </div>
              </div>
            </div>

            {/* Address Details */}
            {staff.address && (
              <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="text-[var(--color-primary)]" size={26} />
                  <h3 className="text-xl font-semibold">Address Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">Village / Town</p>
                    <p className="text-md mt-1">{staff.address.village || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">Post Office</p>
                    <p className="text-md mt-1">{staff.address.po || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">Police Station</p>
                    <p className="text-md mt-1">{staff.address.ps || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">District</p>
                    <p className="text-md mt-1">{staff.address.district || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">State</p>
                    <p className="text-md mt-1">{staff.address.state || "Assam"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">Pincode</p>
                    <p className="text-md mt-1">{staff.address.pin || "—"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verify Modal */}
      <VerifyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        staffId={staffId}
        staffName={staff.name}
        setStaff={setStaff}
      />
    </div>
  );
};

export default StaffDetails;