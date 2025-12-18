import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AdminContext } from "../../../../context/AdminContext";
import "./ServiceTab.css";

const ServiceTab = () => {
    const { backendUrl, adminToken } = useContext(AdminContext);

    const [loading, setLoading] = useState(true);
    const [services, setServices] = useState({
        feeMonthly: false,
        feeAdmission: false,
        feeHostel: false,
        result: false,
        admitCard: false,
        admission: false,
    });

    const servicesList = [
        {
            key: "admission",
            label: "Student Admission",
            description: "Allow students to apply for admission",
            icon: "fa-user-graduate",
        },
        {
            key: "admitCard",
            label: "Admit Card",
            description: "Enable admit card generation and download",
            icon: "fa-ticket",
        },
        {
            key: "result",
            label: "Result",
            description: "Enable result viewing and management",
            icon: "fa-chart-column",
        },
        {
            key: "feeMonthly",
            label: "Monthly Fees",
            description: "Enable monthly fee payment system",
            icon: "fa-credit-card",
        },
        {
            key: "feeAdmission",
            label: "Admission Fees",
            description: "Enable admission fee payment",
            icon: "fa-money-bill-wave",
        },
        {
            key: "feeHostel",
            label: "Hostel Fees",
            description: "Enable hostel fee payment system",
            icon: "fa-bed",
        },
    ];


    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${backendUrl}/api/settings/services`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            if (res.data.success && res.data.data) {
                setServices(res.data.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const toggleService = async (key) => {
        try {
            const res = await axios.put(
                `${backendUrl}/api/settings/toggle/${key}`,
                {},
                {
                    headers: { Authorization: `Bearer ${adminToken}` },
                }
            );

            if (res.data.success) {
                setServices(res.data.data);
                toast.success(`${key} ${res.data.data[key] ? "enabled" : "disabled"}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to toggle service");
        }
    };

    if (loading) {
        return (
            <div className="srv-loading">
                <div className="srv-spinner"></div>
                <div>Loading settings...</div>
            </div>
        );
    }

    return (
        <div className="srv-container">
            <div className="srv-header">
                <h3>Service Management</h3>
            </div>

            <div className="srv-grid">
                {servicesList.map((service) => (
                    <div key={service.key} className="srv-card">
                        <div className="srv-card-header">
                            <div className="srv-card-info">
                                <span className="srv-card-icon">
                                    <i className={`fa-solid ${service.icon}`}></i>
                                </span>
                                <div>
                                    <h4 className="srv-card-title">{service.label}</h4>
                                </div>
                            </div>

                            <label className="srv-toggle">
                                <input
                                    type="checkbox"
                                    checked={services[service.key] || false}
                                    onChange={() => toggleService(service.key)}
                                />
                                <span className="srv-toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ServiceTab;