import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
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

  const [hostelFee, setHostelFee] = useState("4000");
  const [classFees, setClassFees] = useState({
    english: {
      nursery: "800",
      kg: "800",
      "1": "900",
      "2": "900",
      "3": "1000",
      "4": "1000",
      "5": "1100",
      "6": "1100",
      "7": "1200",
      "8": "1200",
      "9": "1300",
      "10": "1300",
    },
    assamese: {
      ankur: "700",
      mukul: "700",
      "1": "900",
      "2": "900",
      "3": "1000",
      "4": "1000",
      "5": "1100",
      "6": "1100",
      "7": "1200",
      "8": "1200",
      "9": "1300",
      "10": "1300",
      "11": { science: "1500", arts: "1400" },
      "12": { science: "1600", arts: "1500" },
    },
  });
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
        setHostelFee(settings.hostelFee.toString());
        setClassFees({
          english: Object.fromEntries(
            Object.entries(settings.classFees.english).map(([key, value]) => [key, value.toString()])
          ),
          assamese: Object.fromEntries(
            Object.entries(settings.classFees.assamese).map(([key, value]) =>
              typeof value === "object"
                ? [key, { science: value.science.toString(), arts: value.arts.toString() }]
                : [key, value.toString()]
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
      const numericFee = hostelFee === "" ? 0 : Number(hostelFee);
      await axios.put(
        `${backendUrl}/api/settings/update`,
        { hostelFee: numericFee },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      toast.success("Hostel fee updated successfully");
      setHostelFee(numericFee.toString());
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
      const numericClassFees = {
        english: Object.fromEntries(
          Object.entries(classFees.english).map(([key, value]) => [key, value === "" ? 0 : Number(value)])
        ),
        assamese: Object.fromEntries(
          Object.entries(classFees.assamese).map(([key, value]) =>
            typeof value === "object"
              ? [
                  key,
                  {
                    science: value.science === "" ? 0 : Number(value.science),
                    arts: value.arts === "" ? 0 : Number(value.arts),
                  },
                ]
              : [key, value === "" ? 0 : Number(value)]
          )
        ),
      };
      await axios.put(
        `${backendUrl}/api/settings/update`,
        { classFees: numericClassFees },
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
                  type="number"
                  value={hostelFee}
                  onChange={(e) => setHostelFee(e.target.value)}
                  min="0"
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
              <input
                type="text"
                value={admitCardConfig.examName}
                onChange={(e) => setAdmitCardConfig({ ...admitCardConfig, examName: e.target.value })}
                placeholder="e.g., Annual Examination 2025"
                disabled={loadingAdmitCard}
                required
              />
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
                            type="number"
                            value={classFees.english[className]}
                            onChange={(e) => handleClassFeeChange("english", className, null, e.target.value)}
                            min="0"
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
                                  type="number"
                                  value={classFees.assamese[className].science}
                                  onChange={(e) =>
                                    handleClassFeeChange("assamese", className, "science", e.target.value)
                                  }
                                  min="0"
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
                                  type="number"
                                  value={classFees.assamese[className].arts}
                                  onChange={(e) =>
                                    handleClassFeeChange("assamese", className, "arts", e.target.value)
                                  }
                                  min="0"
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
                              type="number"
                              value={classFees.assamese[className]}
                              onChange={(e) => handleClassFeeChange("assamese", className, null, e.target.value)}
                              min="0"
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