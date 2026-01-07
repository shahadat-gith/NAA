
import generateAdmissionSlip from "../../utils/generateAdmissionSlip";
import { useState } from "react";
import toast from "react-hot-toast"
import axios from "axios"
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import {useNavigate} from "react-router-dom"

const VerifyAdmissionModal = ({
    isOpen,
    onClose,
    admissionId
}) => {

    const [registrationNo, setRegistrationNo] = useState("");
    const [loading, setLoading] = useState(false);
    const { backendUrl, adminToken } = useContext(AdminContext);

    const navigate = useNavigate()


    /* ================= VERIFY & GENERATE SLIP ================= */
    const handleVerifySubmit = async () => {
        if (!registrationNo.trim()) {
            toast.error("Registration number is required");
            return;
        }

        try {
            setLoading(true);

            const { data } = await axios.post(
                `${backendUrl}/api/admission/verify`,
                {
                    admissionId,
                    registrationNumber: registrationNo,
                },
                {
                    headers: { Authorization: `Bearer ${adminToken}` },
                }
            );

            if (data?.success && data?.student) {
                toast.success(data.message || "Admission verified successfully");

                // Generate PDF
                generateAdmissionSlip(data.student, data.principal);
                setRegistrationNo("");
                onClose()
                navigate(`/students/${data.student._id}`)
            } else {
                toast.error(data?.message || "Verification failed");
            }
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message || "Error verifying admission"
            );
        } finally {
            setLoading(false);
        }
    };
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h3>Verify Admission</h3>

                <label className="modal-label">
                    Assign Registration Number
                </label>

                <input
                    type="text"
                    className="modal-input"
                    value={registrationNo}
                    onChange={(e) => setRegistrationNo(e.target.value)}
                    placeholder="Enter registration number"
                />

                <div className="modal-actions">
                    <button
                        className="action-btn verify"
                        onClick={handleVerifySubmit}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save & Generate Slip"}
                    </button>

                    <button
                        className="action-btn back"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyAdmissionModal;
