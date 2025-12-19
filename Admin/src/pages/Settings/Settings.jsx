import React, { useState } from "react";
import "./Settings.css";
import ServiceTab from "./Tabs/ServiceTab/ServiceTab";
import FeesTab from "./Tabs/FeesTab/FeesTab";
import AdmitCardTab from "./Tabs/AdmitcardTab/AdmitcardTab";
import Authoritiestab from "./Tabs/AuthoritiesTab/AuthoritiesTab";
import BannerImagesTab from "./Tabs/BannerImagesTab/BannerImagesTab";

const Settings = () => {
  const tabs = [
    {
      id: "services",
      label: "Services",
      icon: "fa-solid fa-gear",
    },
    
    {
      id: "admitcard",
      label: "Admit Card",
      icon: "fa-solid fa-id-card",
    },
    {
      id: "fees",
      label: "Fees",
      icon: "fa-solid fa-indian-rupee-sign",
    },
    {
      id: "authorities",
      label: "authorities",
      icon: "fa-solid fa-person",
    },
    {
      id: "BannerImages",
      label: "Banner Images",
      icon: "fa-solid fa-image",
    },
  ];

  const [activeTab, setActiveTab] = useState("services");

  const renderTab = () => {
    switch (activeTab) {
      case "services":
        return <ServiceTab />;
      case "fees":
        return <FeesTab />;
      case "admitcard":
        return <AdmitCardTab />;
      case "authorities":
        return <Authoritiestab />;
      case "BannerImages":
        return <BannerImagesTab />;
      default:
        return null;
    }
  };

  return (
    <div className="st-container">
      <div className="st-header">
        <h2 className="st-title">System Settings</h2>
      </div>

      <div className="st-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`st-tab ${activeTab === tab.id ? "st-tab-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={`st-tab-icon ${tab.icon}`} />
            <span className="st-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="st-content">{renderTab()}</div>
    </div>
  );
};

export default Settings;
