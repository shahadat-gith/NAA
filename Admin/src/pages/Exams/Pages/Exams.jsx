import React, { useContext, useState } from "react";
import "../Styles/Exams.css";
import { AppContext } from "../../../context/AppContext";
import AdmitCard from "../Tabs/AdmitCard/AdmitCard";
import Result from "../Tabs/Result/Result";
import AdmitCardDownloadModal from "./AdmitCardDownloadModal";
import Loader from "../../../components/Loader/Loader";

const Exams = () => {
  const {settings,fetchingSettings,loading} = useContext(AppContext);

  const tabs = [
    {
      id: "admitcards",
      label: "Admit Cards",
      icon: "fa-solid fa-id-card",
    },
    {
      id: "results",
      label: "Results",
      icon: "fa-solid fa-chart-line",
    },
  ];

  const [activeTab, setActiveTab] = useState("admitcards");
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case "admitcards":
        return (
          <AdmitCard
            admitCards={settings?.admitCards}
            exams={settings?.exams}
            authorities={settings?.authorities}
            loading={fetchingSettings}
          />
        );

      case "results":
        return <Result embedded />;

      default:
        return null;
    }
  };

 

  return (
    <div className="exams-container">
      <div className="exams-header">
        <div>
          <h2 className="exams-title">Exam Center</h2>
          <p className="exams-subtitle">
            Manage admit cards, schedules, and results in one place.
          </p>
        </div>
        <div className="exams-header-actions">
          <button
            className="exams-header-btn"
            onClick={() => setDownloadModalOpen(true)}
          >
            Admit Card
          </button>
        </div>
      </div>

      <div className="exams-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`exams-tab ${activeTab === tab.id ? "exams-tab-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={`exams-tab-icon ${tab.icon}`} />
            <span className="exams-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="exams-content">{renderTab()}</div>

      <AdmitCardDownloadModal
        open={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />
    </div>
  );
};

export default Exams;
