import { useState, useEffect, useRef } from "react";
import { X, Loader2, Check } from "lucide-react";
import { apis } from "../../services/api";
import { useAppContext } from "../../context/Context";
import { useDrawerAnimation } from "./../../hooks/useDrawerAnimation";
import { Input } from "../common/Input";

const AddressEditDrawer = ({ visible, onClose, triggerAlert }) => {
  const { staff, setStaff } = useAppContext();
  const drawerRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    village: "",
    po: "",
    ps: "",
    pin: "",
    district: "",
    state: "Assam",
  });

  // Clean, single-line consumption hook definition handles mounting/animating loops
  const { render, animate } = useDrawerAnimation(visible, 300);

  // Synchronize dynamic input fields value buffer setup track
  useEffect(() => {
    if (visible && staff) {
      const addr = staff.address || {};
      setForm({
        village: addr.village || "",
        po: addr.po || "",
        ps: addr.ps || "",
        pin: addr.pin || "",
        district: addr.district || "",
        state: addr.state || "Assam",
      });
    }
  }, [visible, staff]);

  if (!render) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.pin && !/^\d{6}$/.test(form.pin)) {
      return triggerAlert(
        "Validation Error",
        "Please enter a valid 6-digit PIN code.",
        "warning",
      );
    }

    setSaving(true);
    try {
      const formData = new FormData();
      const oldAddr = staff?.address || {};

      const changed =
        form.village !== oldAddr.village ||
        form.po !== oldAddr.po ||
        form.ps !== oldAddr.ps ||
        form.pin !== oldAddr.pin ||
        form.district !== oldAddr.district ||
        form.state !== oldAddr.state;

      if (!changed) {
        setSaving(false);
        return triggerAlert(
          "No Changes",
          "No address modifications detected.",
          "info",
        );
      }

      formData.append(
        "address",
        JSON.stringify({
          village: form.village,
          po: form.po,
          ps: form.ps,
          pin: form.pin,
          district: form.district,
          state: form.state,
        }),
      );

      const data = await apis.updateProfile(formData);
      if (data?.success) {
        setStaff(data.staff);
        onClose();
        triggerAlert(
          "Success",
          "Residential address updated safely.",
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
    <div
      className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end transition-opacity duration-300 ease-out ${animate ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div
        className="absolute inset-0 -z-10"
        onClick={saving ? undefined : onClose}
      />

      <div
        ref={drawerRef}
        className={`w-full h-[70vh] bg-card border-t border-border rounded-t-[2rem] flex flex-col shadow-2xl transition-transform duration-300 transform will-change-transform ease-[cubic-bezier(0.32,0.94,0.6,1)] ${
          animate ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="w-10 h-1 bg-border/80 rounded-full mx-auto my-3.5 shrink-0" />

        <div className="px-5 pb-3 flex items-center justify-between shrink-0">
          <h3 className="text-sm font-black uppercase tracking-wider text-text-primary">
            Edit Address Coordinates
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
              label="Village / Town"
              name="village"
              value={form.village}
              onChange={(e) =>
                setForm((p) => ({ ...p, village: e.target.value }))
              }
            />
            <Input
              label="Post Office (P.O.)"
              name="po"
              value={form.po}
              onChange={(e) => setForm((p) => ({ ...p, po: e.target.value }))}
            />
            <Input
              label="Police Station (P.S.)"
              name="ps"
              value={form.ps}
              onChange={(e) => setForm((p) => ({ ...p, ps: e.target.value }))}
            />
            <Input
              label="District"
              name="district"
              value={form.district}
              onChange={(e) =>
                setForm((p) => ({ ...p, district: e.target.value }))
              }
            />
            <Input
              label="PIN Code"
              name="pin"
              value={form.pin}
              maxLength={6}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value))
                  setForm((p) => ({ ...p, pin: e.target.value }));
              }}
            />
            <Input
              label="State"
              name="state"
              value={form.state}
              onChange={(e) =>
                setForm((p) => ({ ...p, state: e.target.value }))
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

export default AddressEditDrawer;
