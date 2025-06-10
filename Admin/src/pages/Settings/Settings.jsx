import React, { useState, useEffect, useContext } from "react";
import toast from 'react-hot-toast';
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import "./Settings.css";

const Settings = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const [loadingHostel, setLoadingHostel] = useState(false);
  const [loadingClassFees, setLoadingClassFees] = useState(false);
  const [loadingAdmitCard, setLoadingAdmitCard] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("english");

  const [hostelFee, setHostelFee] = useState("0");
  const [classFees, setClassFees] = useState({
    english: {
      nursery: "0",
      kg: "0",
      "1": "0",
      "2": "0",
      "3": "0",
      "4": "0",
      "5": "0",
      "6": "0",
      "7": "0",
      "8": "0",
      "9": "0",
      "10": "0",
    },
    assamese: {
      ankur: "0",
      mukul: "0",
      "1": "0",
      "2": "0",
      "3": "0",
      "4": "0",
      "5": "0",
      "6": "0",
      "7": "0",
      "8": "0",
      "9": "0",
      "10": "0",
      "11": { science: "0", arts: "0" },
      "12": { science: "0", arts: "0" },
    },
  });

  const examOptions = [
    'Half Yearly Examination',
    'Annual Examination',
    'Unit Test 1',
    'Unit Test 2',
    'Unit Test 3',
    'Unit Test 4',
  ];

  const sessionOptions = [
    '2023-2024',
    '2024-2025',
    '2025-2026',
    '2026-2027',
    '2027-2028',
  ];

  const [admitCardConfig, setAdmitCardConfig] = useState({
    isEnabled: false,
    examName: "",
    examDate: "",
    examCenter: "",
  });

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/settings/settings`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (response.data.success) {
        const settings = response.data.data;
        setHostelFee(settings.hostelFee);
        setClassFees({
          english: Object.fromEntries(
            Object.entries(settings.classFees.english).map(([key, value]) => [key, value])
          ),
          assamese: Object.fromEntries(
            Object.entries(settings.classFees.assamese).map(([key, value]) =>
              typeof value === "object"
                ? [key, { science: value.science, arts: value.arts }]
                : [key, value]
            )
          ),
        });
        setAdmitCardConfig({
          isEnabled: settings.admitCardConfig.isEnabled,
          examName: settings.admitCardConfig.examName || "",
          examDate: settings.admitCardConfig.examDate
            ? new Date(settings.admitCardConfig.examDate).toISOString().split("T")[0]
            : "",
          examCenter: settings.admitCardConfig.examCenter || "",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching settings");
      toast.error("Failed to load settings");
    }
  };

  const handleUpdateHostelFee = async (e) => {
    e.preventDefault();
    setLoadingHostel(true);
    setError("");
    try {
      await axios.put(
        `${backendUrl}/api/settings/update`,
        { hostelFee },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      toast.success("Hostel fee updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Error updating hostel fee");
      toast.error(err.response?.data?.message || "Error updating hostel fee");
    } finally {
      setLoadingHostel(false);
    }
  };

  const handleUpdateClassFees = async (e) => {
    e.preventDefault();
    setLoadingClassFees(true);
    setError("");
    try {
      await axios.put(
        `${backendUrl}/api/settings/update`,
        { classFees },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      toast.success("Class fees updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Error updating class fees");
      toast.error(err.response?.data?.message || "Error updating class fees");
    } finally {
      setLoadingClassFees(false);
    }
  };

  const handleUpdateAdmitCard = async (e) => {
    e.preventDefault();
    setLoadingAdmitCard(true);
    setError("");
    try {
      await axios.put(
        `${backendUrl}/api/settings/update`,
        { admitCardConfig },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      toast.success("Admit card settings updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Error updating admit card settings");
      toast.error(err.response?.data?.message || "Error updating admit card settings");
    } finally {
      setLoadingAdmitCard(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [backendUrl, adminToken]);

  const handleClassFeeChange = (medium, className, stream, value) => {
    setClassFees((prev) => {
      const newFees = { ...prev };
      if (stream) {
        newFees[medium][className][stream] = value;
      } else {
        newFees[medium][className] = value;
      }
      return newFees;
    });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Define the order for English and Assamese classes
  const englishClassOrder = ['nursery', 'kg', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const assameseClassOrder = ['ankur', 'mukul', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  return (
    <div className="settings-admin-section">
      <div className="section-header">
        <h2>System Settings</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Hostel Fee */}
      <div className="card">
        <div className="card-header">
          <h3>Hostel Fee Management</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleUpdateHostelFee} className="settings-form">
            <div className="form-group">
              <label>Monthly Hostel Fee (₹)</label>
              <div className="input-with-icon">
                <span className="input-icon">₹</span>
                <input
                  type="text"
                  value={hostelFee}
                  onChange={(e) => setHostelFee(e.target.value)}
                  disabled={loadingHostel}
                  required
                />
              </div>
            </div>
            <div className="form-footer">
              <button type="submit" className="btn-primary" disabled={loadingHostel}>
                {loadingHostel ? (
                  <>
                    <span className="loader"></span> Updating...
                  </>
                ) : (
                  "Update Hostel Fee"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Admit Card Settings */}
      <div className="card">
        <div className="card-header">
          <h3>Admit Card Configuration</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleUpdateAdmitCard} className="settings-form">
            <div className="form-group switch-group">
              <label>Enable Admit Card Download</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={admitCardConfig.isEnabled}
                  onChange={(e) => setAdmitCardConfig({ ...admitCardConfig, isEnabled: e.target.checked })}
                  disabled={loadingAdmitCard}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="form-group">
              <label>Exam Name</label>
              <select
                value={admitCardConfig.examName}
                onChange={(e) =>
                  setAdmitCardConfig({ ...admitCardConfig, examName: e.target.value })
                }
                disabled={loadingAdmitCard}
                required
              >
                <option value="" disabled>Select an exam</option>
                {examOptions.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Exam Date</label>
              <input
                type="date"
                value={admitCardConfig.examDate}
                onChange={(e) => setAdmitCardConfig({ ...admitCardConfig, examDate: e.target.value })}
                disabled={loadingAdmitCard}
                required
              />
            </div>

            <div className="form-group">
              <label>Exam Center</label>
              <input
                type="text"
                value={admitCardConfig.examCenter}
                onChange={(e) => setAdmitCardConfig({ ...admitCardConfig, examCenter: e.target.value })}
                placeholder="e.g., Nashib Ali Academy Main Campus"
                disabled={loadingAdmitCard}
                required
              />
            </div>

            <div className="form-footer">
              <button type="submit" className="btn-primary" disabled={loadingAdmitCard}>
                {loadingAdmitCard ? (
                  <>
                    <span className="loader"></span> Updating...
                  </>
                ) : (
                  "Update Admit Card Settings"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Class Fees */}
      <div className="card">
        <div className="card-header">
          <h3>Class Fee Structure</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleUpdateClassFees} className="settings-form">
            <div className="tabs-container">
              <div className="tabs">
                <button
                  type="button"
                  className={`tab-btn ${activeTab === "english" ? "active" : ""}`}
                  onClick={() => handleTabClick("english")}
                >
                  English Medium
                </button>
                <button
                  type="button"
                  className={`tab-btn ${activeTab === "assamese" ? "active" : ""}`}
                  onClick={() => handleTabClick("assamese")}
                >
                  Assamese Medium
                </button>
              </div>

              {/* English Medium Fees */}
              <div className={`tab-content ${activeTab === "english" ? "active" : ""}`}>
                <div className="fee-grid">
                  {englishClassOrder.map((className) => (
                    <div key={className} className="fee-item">
                      <div className="fee-class">{formatClassName(className)}</div>
                      <div className="fee-input">
                        <div className="input-with-icon">
                          <span className="input-icon">₹</span>
                          <input
                            type="text"
                            value={classFees.english[className]}
                            onChange={(e) => handleClassFeeChange("english", className, null, e.target.value)}
                            disabled={loadingClassFees}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assamese Medium Fees */}
              <div className={`tab-content ${activeTab === "assamese" ? "active" : ""}`}>
                <div className="fee-grid">
                  {assameseClassOrder.map((className) => (
                    <div key={className} className="fee-item">
                      <div className="fee-class">{formatClassName(className)}</div>
                      <div className="fee-input">
                        {typeof classFees.assamese[className] === "object" ? (
                          <div className="stream-fees">
                            <div className="stream-fee">
                              <label>Science</label>
                              <div className="input-with-icon">
                                <span className="input-icon">₹</span>
                                <input
                                  type="text"
                                  value={classFees.assamese[className].science}
                                  onChange={(e) =>
                                    handleClassFeeChange("assamese", className, "science", e.target.value)
                                  }
                                  disabled={loadingClassFees}
                                  required
                                />
                              </div>
                            </div>
                            <div className="stream-fee">
                              <label>Arts</label>
                              <div className="input-with-icon">
                                <span className="input-icon">₹</span>
                                <input
                                  type="text"
                                  value={classFees.assamese[className].arts}
                                  onChange={(e) =>
                                    handleClassFeeChange("assamese", className, "arts", e.target.value)
                                  }
                                  disabled={loadingClassFees}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="input-with-icon">
                            <span className="input-icon">₹</span>
                            <input
                              type="text"
                              value={classFees.assamese[className]}
                              onChange={(e) => handleClassFeeChange("assamese", className, null, e.target.value)}
                              disabled={loadingClassFees}
                              required
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-footer">
              <button type="submit" className="btn-primary" disabled={loadingClassFees}>
                {loadingClassFees ? (
                  <>
                    <span className="loader"></span> Updating...
                  </>
                ) : (
                  "Update Class Fees"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const formatClassName = (className) => {
  if (className === "kg") return "KG";
  if (className === "ankur") return "Ankur";
  if (className === "mukul") return "Mukul";
  if (className === "nursery") return "Nursery";
  if (!isNaN(className)) return `Class ${className}`;
  return className;
};

export default Settings;