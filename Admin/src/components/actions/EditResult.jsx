import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { X } from "lucide-react";

import { Button } from "../common/Button";
import { AdminContext } from "../../context/AdminContext";

const EditResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl, adminToken } = useContext(AdminContext);

  const result = location.state?.result;

  const [formData, setFormData] = useState({
    marks: [],
    totalMarks: 0,
    percentage: 0,
    resultStatus: "",
    rank: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (result) {
      setFormData({
        marks: result.marks || [],
        totalMarks: result.totalMarks || 0,
        percentage: result.percentage || 0,
        resultStatus: result.resultStatus || "Pass",
        rank: result.rank || "",
      });
    }
  }, [result]);

  const handleMarkChange = (index, value) => {
    const updatedMarks = [...formData.marks];
    updatedMarks[index] = {
      ...updatedMarks[index],
      mark: parseInt(value) || 0,
    };

    const total = updatedMarks.reduce((sum, m) => sum + (parseInt(m.mark) || 0), 0);
    const maxMarks = result.maxMarksPerSubject * updatedMarks.length || 100;

    setFormData({
      ...formData,
      marks: updatedMarks,
      totalMarks: total,
      percentage: maxMarks ? Math.round((total / maxMarks) * 100) : 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.put(
        `${backendUrl}/api/results/${result._id}`,
        formData,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      if (data.success) {
        toast.success("Result updated successfully!");
        navigate(-1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update result");
    } finally {
      setLoading(false);
    }
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
        <p className="text-[var(--text-muted)]">Result not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)]">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Edit Result</h1>
        <button
          onClick={() => navigate(-1)}
          className="p-3 rounded-2xl border border-[var(--border-default)] hover:bg-[var(--bg-surface-2)] transition-all"
        >
          <X size={26} />
        </button>
      </div>

      <div className="bg-[var(--bg-surface)] border-b border-[var(--border-default)]">
        {/* Student Info */}
        <div className="p-6 border-b border-[var(--border-default)]">
          <h3 className="font-semibold text-xl mb-1">Student: {result.name}</h3>
          <p className="text-[var(--text-secondary)]">Reg No: {result.registrationNo}</p>
        </div>

        {/* Marks Section */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div>
            <h4 className="font-medium mb-4">Update Marks</h4>
            <div className="space-y-4">
              {formData.marks.map((mark, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl p-5"
                >
                  <div className="flex-1">
                    <p className="font-medium">{mark.subject}</p>
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      value={mark.mark}
                      onChange={(e) => handleMarkChange(index, e.target.value)}
                      className="w-full px-5 py-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl text-center font-semibold text-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-6 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl p-6">
            <div>
              <p className="text-sm text-[var(--text-muted)]">Total Marks</p>
              <p className="text-4xl font-bold text-[var(--text-primary)] mt-1">
                {formData.totalMarks}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)]">Percentage</p>
              <p className="text-4xl font-bold text-[var(--text-primary)] mt-1">
                {formData.percentage}%
              </p>
            </div>
          </div>

          {/* Result Status */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
              Result Status
            </label>
            <select
              value={formData.resultStatus}
              onChange={(e) => setFormData({ ...formData, resultStatus: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl focus:border-[var(--border-strong)] outline-none"
            >
              <option value="Pass">Pass</option>
              <option value="Fail">Fail</option>
            </select>
          </div>

          {/* Save Button */}
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            loading={loading}
            className="w-full py-4"
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditResult;