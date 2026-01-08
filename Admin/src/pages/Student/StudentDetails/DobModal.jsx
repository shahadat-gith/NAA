import React, { useContext, useState } from "react";
import "./DobModal.css";
import axios from "axios";
import { AdminContext } from "../../../context/AdminContext";
import toast from "react-hot-toast";

const DobModal = ({ isOpen, onClose, studentId, onDobUpdated }) => {
    const { adminToken, backendUrl } = useContext(AdminContext);

    const [dob, setDob] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    /* ---------- AUTO FORMAT DOB ---------- */
    const handleDobChange = (e) => {
        let value = e.target.value.replace(/\D/g, "").slice(0, 8);

        if (value.length >= 5) {
            value = `${value.slice(0, 2)}-${value.slice(2, 4)}-${value.slice(4)}`;
        } else if (value.length >= 3) {
            value = `${value.slice(0, 2)}-${value.slice(2)}`;
        }

        setDob(value);
    };

    /* ---------- SUBMIT ---------- */
    const handleSubmit = async () => {
        if (!dob) return toast.error("Please enter DOB");

        if (!/^\d{2}-\d{2}-\d{4}$/.test(dob)) {
            return toast.error("DOB must be in DD-MM-YYYY format");
        }

        try {
            setLoading(true);

            const { data } = await axios.post(
                `${backendUrl}/api/student/update-dob`,
                { studentId, dob },
                {
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                    },
                }
            );

            if (data.success) {
                // 🔥 UPDATE UI
                onDobUpdated(dob);

                toast.success("DOB updated successfully");
                setDob("");
                onClose();
            }


        } catch (error) {
            console.error("Update DOB error:", error);
            toast.error(
                error.response?.data?.message || "Failed to update DOB"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="naa-dob-modal-overlay" onClick={onClose}>
            <div className="naa-dob-modal" onClick={(e) => e.stopPropagation()}>
                <h3 className="naa-dob-modal-title">Update Date of Birth</h3>

                <input
                    type="text"
                    placeholder="DD-MM-YYYY"
                    value={dob}
                    onChange={handleDobChange}
                    className="naa-dob-input"
                    inputMode="numeric"
                    disabled={loading}
                />

                <label
                    style={{
                        display: "block",
                        marginBottom: "6px",
                        fontSize: "13px",
                        color: "#94a3b8",
                        fontWeight: "500",
                    }}
                >
                    Format: DD-MM-YYYY
                </label>

                <div className="naa-dob-modal-actions">
                    <button
                        className="naa-dob-cancel-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        className="naa-dob-save-btn"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }} />
                                Saving...
                            </>
                        ) : (
                            "Save DOB"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DobModal;
