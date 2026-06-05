import { useEffect, useState } from "react";
import { X, Eye, EyeOff, ShieldCheck } from "lucide-react";

import { apis } from "../../services/api";
import Button from "../common/Button";
import Alert from "../common/Alert";

const ChangePasswordModal = ({ visible, onClose }) => {
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

  useEffect(() => {
    if (visible) {
      setForm({ newPassword: "", confirmPassword: "" });
      setVisibility({ new: false, confirm: false });
    }
  }, [visible]);

  if (!visible) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
      {/* Dimmed Overlay Layer Click Closer */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={loading ? undefined : onClose} 
      />

      {/* Main Container Wrapper Box */}
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl transition-all scale-in flex flex-col">
        
        {/* Header Block Row */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-5">
          <div className="min-w-0">
            <h3 className="text-xl font-black tracking-tight text-text-primary">
              Change Password
            </h3>
            <p className="mt-0.5 text-xs font-medium text-text-secondary">
              Update your administrative security credentials
            </p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-text-primary/5 transition-colors border-none bg-transparent cursor-pointer outline-none flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Informative Guidance Banner */}
        <p className="text-xs sm:text-sm font-medium text-text-secondary leading-relaxed mb-6 bg-background border border-border/40 rounded-xl p-3">
          Update your account credentials regularly to safeguard institutional portal data layers and student logs.
        </p>

        {/* Input Interactive Form Stack */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Input: New Password */}
          <div className="flex flex-col space-y-2 w-full">
            <label htmlFor="newPassword" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              New Password
            </label>
            <div className="relative flex items-center border rounded-2xl bg-background border-border focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary transition-all">
              <input
                type={visibility.new ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={form.newPassword}
                onChange={handleInputChange}
                disabled={loading}
                placeholder="Minimum 6 characters"
                className="w-full pl-4 pr-11 py-3 text-sm font-medium bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary/40"
              />
              <button
                type="button"
                onClick={() => toggleVisibility("new")}
                className="absolute right-3 p-1 rounded-md text-text-secondary hover:text-text-primary transition-colors border-none bg-transparent cursor-pointer outline-none"
              >
                {visibility.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Input: Confirm New Password */}
          <div className="flex flex-col space-y-2 w-full">
            <label htmlFor="confirmPassword" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Confirm New Password
            </label>
            <div className="relative flex items-center border rounded-2xl bg-background border-border focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary transition-all">
              <input
                type={visibility.confirm ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleInputChange}
                disabled={loading}
                placeholder="Re-enter new password"
                className="w-full pl-4 pr-11 py-3 text-sm font-medium bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary/40"
              />
              <button
                type="button"
                onClick={() => toggleVisibility("confirm")}
                className="absolute right-3 p-1 rounded-md text-text-secondary hover:text-text-primary transition-colors border-none bg-transparent cursor-pointer outline-none"
              >
                {visibility.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Form Action Triggers */}
          <div className="flex flex-col-reverse sm:flex-row items-center sm:justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={onClose}
              className="w-full sm:w-auto px-5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              loading={loading}
              icon={ShieldCheck}
              className="w-full sm:w-auto px-6"
            >
              Update Password
            </Button>
          </div>

        </form>
      </div>

      {/* Internal Notification Error / Success Popups Interceptor */}
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

export default ChangePasswordModal;