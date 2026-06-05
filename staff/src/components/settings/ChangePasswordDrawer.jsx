import { useState, useEffect, useRef } from "react";
import { X, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";

import { apis } from "../../services/api";
import Alert from "../common/Alert";
import { useDrawerAnimation } from "../../hooks/useDrawerAnimation";

const ChangePasswordDrawer = ({ visible, onClose }) => {
  const drawerRef = useRef(null);
  
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [visibility, setVisibility] = useState({
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: "", message: "", variant: "info" });

  // Consume your global, high-performance animation lifecycle hook
  const { render, animate } = useDrawerAnimation(visible, 300);

  // Reset local buffers cleanly when the drawer lifecycle closes
  useEffect(() => {
    if (visible) {
      setForm({ newPassword: "", confirmPassword: "" });
      setVisibility({ new: false, confirm: false });
    }
  }, [visible]);

  if (!render) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const triggerAlert = (title, message, variant) => {
    setAlertConfig({ visible: true, title, message, variant });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const { newPassword, confirmPassword } = form;

    if (!newPassword.trim() || !confirmPassword.trim()) {
      return triggerAlert("Missing Fields", "Please populate both password fields.", "warning");
    }

    if (newPassword.length < 6) {
      return triggerAlert("Weak Password", "New credentials must be at least 6 characters long.", "warning");
    }

    if (newPassword !== confirmPassword) {
      return triggerAlert("Mismatch Error", "Your new password entries do not match.", "warning");
    }

    setLoading(true);
    try {
      const data = await apis.inAppUpdatePassword(newPassword);

      if (data?.success) {
        triggerAlert("Success", "Your password has been updated successfully.", "success");
        setTimeout(() => {
          setAlertConfig((prev) => ({ ...prev, visible: false }));
          onClose();
        }, 1500);
      }
    } catch (error) {
      triggerAlert("Update Failed", error?.response?.data?.message || error.message || "Could not save credentials.", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Shared Opacity Backdrop Mask Fade Overlay Track */
    <div
      className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end transition-opacity duration-300 ease-out ${
        animate ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Tap Backdrop Click Dismiss Area Closer */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={loading ? undefined : onClose} 
      />

      <div
        ref={drawerRef}
        className={`w-full h-auto bg-card border-t border-border rounded-t-4xl flex flex-col shadow-2xl transition-transform duration-300 transform will-change-transform ease-[cubic-bezier(0.32,0.94,0.6,1)] ${
          animate ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Minimal Mobile Visual Affordance Pull Bar */}
        <div className="w-10 h-1 bg-border/80 rounded-full mx-auto my-3.5 shrink-0" />

        {/* Dynamic Section Header Layout Title */}
        <div className="px-5 pb-3 flex items-center justify-between border-b border-border/40 shrink-0">
          <div className="min-w-0">
            <h3 className="text-sm font-black uppercase tracking-wider text-text-primary">
              Change Password
            </h3>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border bg-background text-text-secondary active:scale-90 transition-transform cursor-pointer outline-none shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {/* Form Pipeline Viewport Shell */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between overflow-hidden">
          
          {/* Scrollable Core Form Data Input Rows */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar">

            {/* Field: New Password Box */}
            <div className="flex flex-col space-y-1.5 w-full">
              <label htmlFor="newPassword" className="text-[10px] font-black text-text-secondary/60 uppercase tracking-widest">
                New Password
              </label>
              <div className="relative flex items-center border rounded-xl bg-background border-border/80 focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary transition-all duration-200">
                <input
                  type={visibility.new ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-3 pr-10 py-2.5 text-sm font-medium bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary/40"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility("new")}
                  className="absolute right-3 p-1 text-text-secondary hover:text-text-primary border-none bg-transparent cursor-pointer outline-none"
                >
                  {visibility.new ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Field: Confirm Password Box */}
            <div className="flex flex-col space-y-1.5 w-full">
              <label htmlFor="confirmPassword" className="text-[10px] font-black text-text-secondary/60 uppercase tracking-widest">
                Confirm New Password
              </label>
              <div className="relative flex items-center border rounded-xl bg-background border-border/80 focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary transition-all duration-200">
                <input
                  type={visibility.confirm ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Re-enter new password"
                  className="w-full pl-3 pr-10 py-2.5 text-sm font-medium bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary/40"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility("confirm")}
                  className="absolute right-3 p-1 text-text-secondary hover:text-text-primary border-none bg-transparent cursor-pointer outline-none"
                >
                  {visibility.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

          </div>

          {/* Persistent Sticky Action Button Panel Block footer */}
          <div className="p-5 border-t border-border/60 bg-background/50 flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 text-xs font-bold border border-border text-text-secondary rounded-xl active:scale-98 transition-transform bg-card cursor-pointer outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 text-xs font-bold bg-primary text-white rounded-xl active:scale-98 transition-transform flex items-center justify-center gap-1.5 shadow-sm shadow-primary/20 cursor-pointer outline-none"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ShieldCheck size={14} strokeWidth={2.5} />
              )}{" "}
              Update Password
            </button>
          </div>

        </form>
      </div>

      {/* Internal Alert Interceptor Portal Notifications */}
      <Alert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        variant={alertConfig.variant}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
        buttons={[
          {
            text: "Acknowledge",
            variant: "accent",
            onClick: () => setAlertConfig((prev) => ({ ...prev, visible: false })),
          },
        ]}
      />
    </div>
  );
};

export default ChangePasswordDrawer;