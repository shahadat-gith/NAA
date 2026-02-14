import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AdminContext } from "../../../../context/AdminContext";
import "../../Styles/ResultModal.css";

import {
  CLASS_OPTIONS,
  STREAM_OPTIONS,
  EXAM_OPTIONS,
  SESSION_OPTIONS,
} from "../../../../utils/academicOptions";

const ResultModal = ({ isOpen, onClose, onSuccess, editData }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [activeTab, setActiveTab] = useState("single");
  const [loading, setLoading] = useState(false);

  const allClassOptions = Array.from(
    new Set([...CLASS_OPTIONS.english, ...CLASS_OPTIONS.assamese])
  );

  const isSeniorClass = (cls) => cls === "11" || cls === "12";

  /* ================= STATES ================= */

  const initialSingleData = {
    registrationNo: "",
    class: "",
    medium: "",
    stream: "",
    examName: "",
    academicSession: "",
    maxMarksPerSubject: "",
    marks: [{ subject: "", mark: "" }],
  };

  const [singleData, setSingleData] = useState(initialSingleData);

  const [file, setFile] = useState(null);
  const [massClass, setMassClass] = useState("");
  const [massMedium, setMassMedium] = useState("");
  const [massStream, setMassStream] = useState("");
  const [massExam, setMassExam] = useState("");
  const [massSession, setMassSession] = useState("");
  const [massMaxMarks, setMassMaxMarks] = useState("");
  const [skippedDetails, setSkippedDetails] = useState([]);

  /* ================= PREFILL (EDIT MODE) ================= */

  useEffect(() => {
    if (editData) {
      setActiveTab("single");
      setSingleData({
        registrationNo: editData.registrationNo,
        class: editData.class,
        medium: editData.medium,
        stream: editData.stream || "",
        examName: editData.examName,
        academicSession: editData.academicSession,
        maxMarksPerSubject: editData.maxMarksPerSubject,
        marks: editData.marks.map((m) => ({
          subject: m.subject,
          mark: m.mark,
        })),
      });
    }
  }, [editData]);

  /* ================= HELPERS ================= */

  const resetForm = () => {
    setSingleData(initialSingleData);
    setFile(null);
    setMassClass("");
    setMassMedium("");
    setMassStream("");
    setMassExam("");
    setMassSession("");
    setMassMaxMarks("");
    setSkippedDetails([]);
    setActiveTab("single");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const handleSingleChange = (field, value) =>
    setSingleData({ ...singleData, [field]: value });

  const handleMarksChange = (i, field, value) => {
    const updated = [...singleData.marks];
    updated[i][field] = value;
    setSingleData({ ...singleData, marks: updated });
  };

  /* ================= CREATE / UPDATE ================= */

  const submitSingleResult = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        registrationNo: singleData.registrationNo,
        class: singleData.class,
        medium: singleData.medium,
        stream: isSeniorClass(singleData.class) ? singleData.stream : "",
        examName: singleData.examName,
        academicSession: singleData.academicSession,
        maxMarksPerSubject: Number(singleData.maxMarksPerSubject),
        marks: singleData.marks.map((m) => ({
          subject: m.subject,
          mark: Number(m.mark),
        })),
      };

      const url = editData
        ? `${backendUrl}/api/results/update`
        : `${backendUrl}/api/results/create`;

      await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      toast.success(
        editData ? "Result updated successfully" : "Result created successfully"
      );

      onSuccess?.();
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= MASS UPLOAD ================= */

  const submitMassResult = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSkippedDetails([]);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("class", massClass);
      formData.append("medium", massMedium);
      formData.append(
        "stream",
        isSeniorClass(massClass) ? massStream : ""
      );
      formData.append("examName", massExam);
      formData.append("academicSession", massSession);
      formData.append("maxMarksPerSubject", massMaxMarks);

      const res = await axios.post(
        `${backendUrl}/api/results/upload`,
        formData,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      toast.success(`Uploaded ${res.data.created} results`);

      if (res.data.skippedDetails?.length) {
        setSkippedDetails(res.data.skippedDetails);
        toast.error(`${res.data.skippedCount} rows skipped`);
      } else {
        onSuccess?.();
        handleClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Mass upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="result-modal-overlay" onClick={handleClose}>
      <div className="result-modal" onClick={(e) => e.stopPropagation()}>
        <div className="result-modal-header">
          <h2>{editData ? "Update Result" : "Upload Results"}</h2>
          <button onClick={handleClose}>✕</button>
        </div>

        {/* ================= TABS ================= */}
        <div className="result-tabs">
          <button
            className={activeTab === "single" ? "active" : ""}
            onClick={() => setActiveTab("single")}
          >
            {editData ? "Edit Result" : "Single Upload"}
          </button>

          {!editData && (
            <button
              className={activeTab === "mass" ? "active" : ""}
              onClick={() => setActiveTab("mass")}
            >
              Mass Upload
            </button>
          )}
        </div>

        <div className="result-form-container">
          {/* ================= SINGLE ================= */}
          {activeTab === "single" && (
            <form onSubmit={submitSingleResult} className="result-form">
              <div className="form-grid">
                <input
                  placeholder="Registration No"
                  value={singleData.registrationNo}
                  disabled={!!editData}
                  onChange={(e) =>
                    handleSingleChange("registrationNo", e.target.value)
                  }
                  required
                />

                <select
                  value={singleData.class}
                  disabled={!!editData}
                  onChange={(e) => {
                    handleSingleChange("class", e.target.value);
                    handleSingleChange("stream", "");
                  }}
                  required
                >
                  <option value="">Select Class</option>
                  {allClassOptions.map((c) => (
                    <option key={c} value={c}>
                      {c.toUpperCase()}
                    </option>
                  ))}
                </select>

                <select
                  value={singleData.medium}
                  disabled={!!editData}
                  onChange={(e) =>
                    handleSingleChange("medium", e.target.value)
                  }
                  required
                >
                  <option value="">Select Medium</option>
                  {["english", "assamese"].map((m) => (
                    <option key={m} value={m}>
                      {m.toUpperCase()}
                    </option>
                  ))}
                </select>

                {isSeniorClass(singleData.class) && (
                  <select
                    value={singleData.stream}
                    disabled={!!editData}
                    onChange={(e) =>
                      handleSingleChange("stream", e.target.value)
                    }
                    required
                  >
                    <option value="">Select Stream</option>
                    {STREAM_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.toUpperCase()}
                      </option>
                    ))}
                  </select>
                )}

                <select
                  value={singleData.examName}
                  onChange={(e) =>
                    handleSingleChange("examName", e.target.value)
                  }
                  required
                >
                  <option value="">Select Exam</option>
                  {EXAM_OPTIONS.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>

                <select
                  value={singleData.academicSession}
                  onChange={(e) =>
                    handleSingleChange("academicSession", e.target.value)
                  }
                  required
                >
                  <option value="">Select Session</option>
                  {SESSION_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Max Marks"
                  value={singleData.maxMarksPerSubject}
                  onChange={(e) =>
                    handleSingleChange("maxMarksPerSubject", e.target.value)
                  }
                  required
                />
              </div>

              <div className="subject-section">
                <h4>Subjects & Marks</h4>

                {singleData.marks.map((m, i) => (
                  <div key={i} className="subject-row">
                    <input
                      placeholder="Subject"
                      value={m.subject}
                      onChange={(e) =>
                        handleMarksChange(i, "subject", e.target.value)
                      }
                      required
                    />
                    <input
                      type="number"
                      placeholder="Marks"
                      value={m.mark}
                      onChange={(e) =>
                        handleMarksChange(i, "mark", e.target.value)
                      }
                      required
                    />
                    <button
                      type="button"
                      className="subject-row-remove"
                      onClick={() =>
                        setSingleData({
                          ...singleData,
                          marks: singleData.marks.filter(
                            (_, idx) => idx !== i
                          ),
                        })
                      }
                      disabled={singleData.marks.length === 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="add-subject-btn"
                  onClick={() =>
                    setSingleData({
                      ...singleData,
                      marks: [
                        ...singleData.marks,
                        { subject: "", mark: "" },
                      ],
                    })
                  }
                >
                  + Add Subject
                </button>
              </div>

              <button type="submit" disabled={loading}>
                {loading
                  ? "Saving..."
                  : editData
                  ? "Update Result"
                  : "Upload Result"}
              </button>
            </form>
          )}

          {/* ================= MASS ================= */}
          {!editData && activeTab === "mass" && (
            <form onSubmit={submitMassResult} className="result-form">
              <div className="form-grid">
                <select
                  value={massClass}
                  onChange={(e) => {
                    setMassClass(e.target.value);
                    setMassStream("");
                  }}
                  required
                >
                  <option value="">Select Class</option>
                  {allClassOptions.map((c) => (
                    <option key={c} value={c}>
                      {c.toUpperCase()}
                    </option>
                  ))}
                </select>

                <select
                  value={massMedium}
                  onChange={(e) => setMassMedium(e.target.value)}
                  required
                >
                  <option value="">Select Medium</option>
                  {["english", "assamese"].map((m) => (
                    <option key={m} value={m}>
                      {m.toUpperCase()}
                    </option>
                  ))}
                </select>

                {isSeniorClass(massClass) && (
                  <select
                    value={massStream}
                    onChange={(e) => setMassStream(e.target.value)}
                    required
                  >
                    <option value="">Select Stream</option>
                    {STREAM_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.toUpperCase()}
                      </option>
                    ))}
                  </select>
                )}

                <select
                  value={massExam}
                  onChange={(e) => setMassExam(e.target.value)}
                  required
                >
                  <option value="">Select Exam</option>
                  {EXAM_OPTIONS.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>

                <select
                  value={massSession}
                  onChange={(e) => setMassSession(e.target.value)}
                  required
                >
                  <option value="">Select Session</option>
                  {SESSION_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Max Marks"
                  value={massMaxMarks}
                  onChange={(e) => setMassMaxMarks(e.target.value)}
                  required
                />
              </div>

              <input
                type="file"
                accept=".xlsx"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Uploading..." : "Upload Results"}
              </button>

              {skippedDetails.length > 0 && (
                <div className="skipped-box">
                  <h4>Skipped Rows</h4>
                  {skippedDetails.map((s, i) => (
                    <p key={i}>
                      Row {s.row}: {s.registrationNo || "N/A"} — {s.reason}
                    </p>
                  ))}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
