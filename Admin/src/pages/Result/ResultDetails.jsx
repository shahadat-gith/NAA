import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Trophy } from "lucide-react";

import Loader from "../../components/common/Loader";
import { capitalizeWords, capitalizeFirst } from "../../utils/utility";
import { Button } from "../../components/common/Button.jsx";
import { generateReportCards } from "./resultPdf";
import { pdf } from "@react-pdf/renderer";

import { AdminContext } from "../../context/AdminContext";

const ResultDetails = () => {
  const { backendUrl, adminToken } = useContext(AdminContext);
  const { registrationNo } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const fetchResult = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/results/student/fetch`,
        { registrationNo },
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      if (data.success) {
        setResult(data.result);
        setPrincipal(data.principal || {});
      } else {
        toast.error(data.message || "Result not found");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load result details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (registrationNo) fetchResult();
  }, [registrationNo]);

  const handleDownload = async () => {
    if (!result) return;

    try {
      setDownloading(true);

      const blob = await pdf(
        generateReportCards({
          results: [result],
          principal,
        })
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `report_card_${result.registrationNo}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      toast.success("Report card downloaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download report card");
    } finally {
      setDownloading(false);
    }
  };

  const openEditResult = () => {
    navigate("/actions?type=EditResult", { state: { result } });
  };

  if (loading) return <Loader text="Loading result details..." />;

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--text-secondary)]">
        Result not found
      </div>
    );
  }

  const getStatusClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "pass") return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
    if (s === "fail") return "bg-red-500/10 text-red-500 border-red-500/30";
    return "bg-amber-500/10 text-amber-500 border-amber-500/30";
  };

  const getGradeColor = (grade) => {
    const g = (grade || "").toUpperCase();
    if (g === "A+" || g === "A") return "text-emerald-500";
    if (g === "B+" || g === "B") return "text-blue-500";
    if (g === "C+" || g === "C") return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] pb-12">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)]">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              {capitalizeWords(result.name)}
            </h1>
            <p className="text-[var(--text-secondary)]">Reg No: {result.registrationNo}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleDownload}
            disabled={downloading}
            variant="success"
            loading={downloading}
          >
            {downloading ? "Downloading" : "Download"}
          </Button>

          <Button onClick={openEditResult} variant="warning">
            Edit
          </Button>
        </div>
      </div>

      {/* Basic Info Cards */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Class", value: result.class },
          { label: "Medium", value: capitalizeFirst(result.medium) },
          { label: "Stream", value: capitalizeFirst(result.stream) || "—" },
          { label: "Exam", value: result.examName || "—" },
        ].map((item, i) => (
          <div key={i} className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-5">
            <p className="text-xs text-[var(--text-muted)]">{item.label}</p>
            <p className="text-lg font-semibold mt-1 text-[var(--text-primary)]">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Marks Table */}
      <div className="p-4">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl overflow-hidden mb-8">
          <div className="p-6 border-b border-[var(--border-default)]">
            <h3 className="font-semibold text-lg flex items-center gap-3">
              <Trophy size={22} className="text-[var(--color-primary)]" />
              Subject-wise Marks
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-default)] bg-[var(--bg-surface-2)]">
                  <th className="px-6 py-4 text-left text-sm font-medium text-[var(--text-muted)]">Subject</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-[var(--text-muted)]">Marks Obtained</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)]">
                {result.marks?.map((m, idx) => (
                  <tr key={idx} className="hover:bg-[var(--bg-surface-2)] transition-colors">
                    <td className="px-6 py-5 font-medium">{m.subject}</td>
                    <td className="px-6 py-5 text-center font-semibold text-lg">{m.mark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-8 text-center">
          <p className="text-[var(--text-muted)]">Total Marks</p>
          <p className="text-5xl font-bold text-[var(--text-primary)] mt-2">{result.totalMarks}</p>
        </div>

        <div className="lg:col-span-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-8 text-center">
          <p className="text-[var(--text-muted)]">Percentage</p>
          <p className="text-5xl font-bold text-[var(--text-primary)] mt-2">{result.percentage}%</p>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-8 flex flex-col items-center justify-center">
          <p className="text-[var(--text-muted)]">Grade</p>
          <p className={`text-4xl font-bold mt-2 ${getGradeColor(result.grade)}`}>
            {result.grade || "—"}
          </p>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-8 flex flex-col items-center justify-center">
          <p className="text-[var(--text-muted)]">Rank</p>
          <p className="text-4xl font-bold mt-2 text-[var(--text-primary)]">#{result.rank || "—"}</p>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-8 flex flex-col items-center justify-center col-span-1 sm:col-span-2 lg:col-span-1">
          <p className="text-[var(--text-muted)]">Result Status</p>
          <span
            className={`inline-block mt-3 px-6 py-2 rounded-full border text-sm font-medium ${getStatusClass(result.resultStatus)}`}
          >
            {result.resultStatus || "—"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResultDetails;