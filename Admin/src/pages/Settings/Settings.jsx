import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./Settings.css";
import ServiceTab from "./Tabs/ServiceTab/ServiceTab";
import FeesTab from "./Tabs/FeesTab/FeesTab";
import Authoritiestab from "./Tabs/AuthoritiesTab/AuthoritiesTab";
import BannerImagesTab from "./Tabs/BannerImagesTab/BannerImagesTab";
import Loader from "../../components/common/Loader";
import { AdminContext } from "../../context/AdminContext";

const Settings = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH SETTINGS ================= */
  const fetchSettings = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/settings/`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (response.data.success) {
        const data = response.data.data || {};
        setSettings({
          serviceSettings: data.serviceSettings || null,
          feesSettings: data.feesSettings || null,
          authorities: data.authorities || [],
          heroImages: data.heroImages || [],
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD ON MOUNT ================= */
  useEffect(() => {
    fetchSettings();
  }, [adminToken]);
  const tabs = [
    {
      id: "services",
      label: "Services",
      icon: "fa-solid fa-gear",
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
        return (
          <ServiceTab
            data={settings?.serviceSettings}
            loading={loading}
            onRefresh={fetchSettings}
          />
        );

      case "fees":
        return (
          <FeesTab
            data={settings?.feesSettings}
            loading={loading}
            onRefresh={fetchSettings}
          />
        );

      case "authorities":
        return (
          <Authoritiestab
            authorities={settings?.authorities}
            loading={loading}
            onRefresh={fetchSettings}
          />
        );

      case "BannerImages":
        return (
          <BannerImagesTab
            heroImages={settings?.heroImages}
            loading={loading}
            onRefresh={fetchSettings}
          />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return <Loader text="Loading settings..." />;
  }

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
