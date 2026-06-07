import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Settings as SettingsIcon, Wrench, IndianRupee, Users, Image } from "lucide-react";

import { AdminContext } from "../context/AdminContext";
import Loader from "../components/common/Loader";

import ServiceTab from "../components/settings/ServiceTab";
import FeesTab from "../components/settings/FeesTab";
import Authoritiestab from "../components/settings/AuthoritiesTab";
import BannerImagesTab from "../components/settings/BannerImagesTab";


const Settings = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("services");

  const tabs = [
    { id: "services", label: "Services", icon: Wrench },
    { id: "fees", label: "Fees", icon: IndianRupee },
    { id: "authorities", label: "Authorities", icon: Users },
    { id: "BannerImages", label: "Banner Images", icon: Image },
  ];

  /* ================= FETCH SETTINGS ================= */
  const fetchSettings = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/settings/`, {
        headers: { Authorization: `Bearer ${adminToken}` },
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

  useEffect(() => {
    fetchSettings();
  }, [adminToken]);

  const renderTab = () => {
    switch (activeTab) {
      case "services":
        return <ServiceTab data={settings?.serviceSettings} loading={loading} onRefresh={fetchSettings} />;
      case "fees":
        return <FeesTab data={settings?.feesSettings} loading={loading} onRefresh={fetchSettings} />;
      case "authorities":
        return <Authoritiestab authorities={settings?.authorities} loading={loading} onRefresh={fetchSettings} />;
      case "BannerImages":
        return <BannerImagesTab heroImages={settings?.heroImages} loading={loading} onRefresh={fetchSettings} />;
      default:
        return null;
    }
  };

  if (loading) return <Loader text="Loading settings..." />;

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Settings</h1>
           
          </div>
        </div>

        {/* Tabs - Horizontal Scroll on Mobile */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-2 mb-8 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-[var(--color-primary)] text-white shadow-md"
                      : "hover:bg-[var(--bg-surface-2)] text-[var(--text-primary)]"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-6 md:p-8">
          {renderTab()}
        </div>
      </div>
    </div>
  );
};

export default Settings;