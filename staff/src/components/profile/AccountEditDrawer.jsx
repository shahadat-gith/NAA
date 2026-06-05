import { useState, useEffect, useRef } from "react";
import { X, Loader2, Check } from "lucide-react";
import { apis } from "../../services/api";
import { useAppContext } from "../../context/Context";
import { Input } from "../common/Input";
import { useDrawerAnimation } from "./../../hooks/useDrawerAnimation";

const AccountEditDrawer = ({ visible, onClose, triggerAlert }) => {
  const { staff, setStaff } = useAppContext();
  const drawerRef = useRef(null);

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    qualification: "",
    experience: "",
  });

  // Clean implementation of the shared transition hook
  const { render, animate } = useDrawerAnimation(visible, 300);

  // Load contextual values from app state stream
  useEffect(() => {
    if (visible && staff) {
      setForm({
        name: staff.name || "",
        email: staff.email && staff.email !== "N/A" ? staff.email : "",
        contact: staff.contact || "",
        qualification: staff.qualification || "",
        experience:
          staff.experience !== undefined ? String(staff.experience) : "",
      });
    }
  }, [visible, staff]);

  if (!render) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) {
      return triggerAlert(
        "Validation Error",
        "Name and contact number are required.",
        "warning",
      );
    }

    setSaving(true);
    try {
      const formData = new FormData();
      const oldEmail = staff?.email === "N/A" ? "" : staff?.email || "";

      if (form.name !== staff?.name) formData.append("name", form.name);
      if (form.email !== oldEmail)
        formData.append("email", form.email || "N/A");
      if (form.contact !== staff?.contact)
        formData.append("contact", form.contact);
      if (form.qualification !== staff?.qualification)
        formData.append("qualification", form.qualification);
      const newExp = form.experience === "" ? undefined : Number(form.experience);
      const oldExp = staff?.experience;
      if (newExp !== oldExp && !(isNaN(newExp) && isNaN(oldExp))) {
        formData.append("experience", newExp ?? 0);
      }
      let hasEntries = false;
      for (let pair of formData.entries()) {
        hasEntries = true;
        break;
      }

      if (!hasEntries) {
        setSaving(false);
        return triggerAlert(
          "No Changes",
          "No account alterations detected.",
          "info",
        );
      }

      const data = await apis.updateProfile(formData);
      if (data?.success) {
        setStaff(data.staff);
        onClose();
        triggerAlert(
          "Success",
          "Account details updated successfully.",
          "success",
        );
      }
    } catch (err) {
      triggerAlert(
        "Update Failed",
        err?.response?.data?.message || err.message || "An error occurred.",
        "danger",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    /* Smooth Backdrop Layer Opacity Transition Fade matching the hook state */
    <div
      className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end transition-opacity duration-300 ease-out ${
        animate ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Tap Backdrop Closer Guard Area */}
      <div
        className="absolute inset-0 -z-10"
        onClick={saving ? undefined : onClose}
      />

      <div
        ref={drawerRef}
        className={`w-full h-[70vh] bg-card border-t border-border rounded-t-4xl flex flex-col shadow-2xl transition-transform duration-300 transform will-change-transform ease-[cubic-bezier(0.32,0.94,0.6,1)] ${
          animate ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Decorative Drag Handle Notch */}
        <div className="w-10 h-1 bg-border/80 rounded-full mx-auto my-3.5 shrink-0" />

        <div className="px-5 pb-3 flex items-center justify-between shrink-0">
          <h3 className="text-sm font-black uppercase tracking-wider text-text-primary">
            Edit Account Info
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="p-1.5 rounded-lg border border-border bg-background text-text-secondary active:scale-90 transition-transform cursor-pointer outline-none"
          >
            <X size={14} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col justify-between overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-5 py-2 space-y-4 custom-scrollbar">
            <Input
              label="Full Name"
              name="name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              placeholder="name@academy.com"
            />
            <Input
              label="Contact Number"
              name="contact"
              type="tel"
              value={form.contact}
              onChange={(e) =>
                setForm((p) => ({ ...p, contact: e.target.value }))
              }
              required
            />
            <Input
              label="Degree / Qualifications"
              name="qualification"
              value={form.qualification}
              onChange={(e) =>
                setForm((p) => ({ ...p, qualification: e.target.value }))
              }
            />
            <Input
              label="Experience (Years)"
              name="experience"
              type="number"
              min="0"
              value={form.experience}
              onChange={(e) =>
                setForm((p) => ({ ...p, experience: e.target.value }))
              }
            />
          </div>

          <div className="p-5 border-t border-border/60 bg-background/50 flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-3 text-xs font-bold border border-border text-text-secondary rounded-xl active:scale-98 transition-transform bg-card cursor-pointer outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 text-xs font-bold bg-primary text-white rounded-xl active:scale-98 transition-transform flex items-center justify-center gap-1.5 shadow-sm shadow-primary/20 cursor-pointer outline-none"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Check size={14} strokeWidth={2.5} />
              )}{" "}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountEditDrawer;
