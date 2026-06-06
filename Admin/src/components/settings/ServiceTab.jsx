import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  GraduationCap, 
  Ticket, 
  BarChart3, 
  CreditCard, 
  Banknote, 
  Bed 
} from "lucide-react";


import { AdminContext } from "../../context/AdminContext";

const ServiceTab = ({ data, loading, onRefresh }) => {
  const { backendUrl, adminToken } = useContext(AdminContext);

  const [services, setServices] = useState({
    admission: false,
    admitCard: false,
    result: false,
    feeMonthly: false,
    feeAdmission: false,
    feeHostel: false,
  });

  // Sync with parent data
  useEffect(() => {
    if (data) {
      setServices(data);
    }
  }, [data]);

  const servicesList = [
    {
      key: "admission",
      label: "Student Admission",
      description: "Allow students to apply for admission",
      icon: GraduationCap,
    },
    {
      key: "admitCard",
      label: "Admit Card",
      description: "Enable admit card generation & download",
      icon: Ticket,
    },
    {
      key: "result",
      label: "Result",
      description: "Enable result viewing and management",
      icon: BarChart3,
    },
    {
      key: "feeMonthly",
      label: "Monthly Fees",
      description: "Enable monthly fee payment system",
      icon: CreditCard,
    },
    {
      key: "feeAdmission",
      label: "Admission Fees",
      description: "Enable admission fee payment",
      icon: Banknote,
    },
    {
      key: "feeHostel",
      label: "Hostel Fees",
      description: "Enable hostel fee payment system",
      icon: Bed,
    },
  ];

  const toggleService = async (key) => {
    const previousValue = services[key];
    const newValue = !previousValue;

    // Optimistic update
    setServices((prev) => ({ ...prev, [key]: newValue }));

    try {
      const res = await axios.put(
        `${backendUrl}/api/settings/toggle/${key}`,
        {},
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (res.data.success) {
        const updated = res.data.data || {};
        setServices((prev) => ({ ...prev, [key]: updated[key] }));
        toast.success(`${servicesList.find(s => s.key === key).label} ${newValue ? "enabled" : "disabled"}`);
      } else {
        setServices((prev) => ({ ...prev, [key]: previousValue }));
      }
    } catch (error) {
      setServices((prev) => ({ ...prev, [key]: previousValue }));
      toast.error(error.response?.data?.message || "Failed to update service");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[var(--text-secondary)]">Loading services...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-[var(--text-primary)]">Service Management</h3>
        <p className="text-[var(--text-secondary)] mt-1">Enable or disable features for the portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {servicesList.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.key}
              className="bg-[var(--bg-base)] border border-[var(--border-default)] rounded-3xl p-6 hover:border-[var(--border-strong)] transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-primary)]/10 transition-colors">
                    <Icon size={24} className="text-[var(--text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
                  </div>

                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)] text-lg">{service.label}</h4>
                    <p className="text-sm text-[var(--text-secondary)] mt-1 leading-snug">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Modern Toggle */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={services[service.key] || false}
                    onChange={() => toggleService(service.key)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-7 bg-[var(--border-default)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceTab;