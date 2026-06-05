import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, GraduationCap, MapPin } from "lucide-react";

import { apis } from "../services/api";
import { useAppContext } from "../context/Context";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";
import { Input } from "../components/common/Input";

const EditProfile = () => {
  const navigate = useNavigate();
  const { staff, setStaff } = useAppContext();

  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    qualification: "",
    experience: "",
    village: "",
    po: "",
    ps: "",
    pin: "",
    district: "",
    state: "Assam",
  });

  const [saving, setSaving] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info",
  });

  useEffect(() => {
    if (!staff) {
      navigate("/profile", { replace: true });
      return;
    }

    const address = staff.address || {};
    setForm({
      name: staff.name || "",
      email: staff.email && staff.email !== "N/A" ? staff.email : "",
      contact: staff.contact || "",
      qualification: staff.qualification || "",
      experience:
        staff.experience !== undefined ? String(staff.experience) : "",
      village: address.village || "",
      po: address.po || "",
      ps: address.ps || "",
      pin: address.pin || "",
      district: address.district || "",
      state: address.state || "Assam",
    });
  }, [staff, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const triggerAlert = (title, message, variant, onConfirm = null) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      variant,
      onConfirm,
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!form.name.trim() || !form.contact.trim()) {
      return triggerAlert(
        "Validation Error",
        "Name and contact number are required.",
        "warning",
      );
    }

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
      const oldAddress = staff?.address || {};
      const oldEmail = staff?.email === "N/A" ? "" : staff?.email || "";

      // Only append changed fields to optimize payload size
      if (form.name !== staff?.name) formData.append("name", form.name);
      if (form.email !== oldEmail)
        formData.append("email", form.email || "N/A");
      if (form.contact !== staff?.contact)
        formData.append("contact", form.contact);
      if (form.qualification !== staff?.qualification)
        formData.append("qualification", form.qualification);

      if (Number(form.experience) !== Number(staff?.experience)) {
        formData.append("experience", Number(form.experience));
      }

      const hasAddressChanged =
        form.village !== oldAddress.village ||
        form.po !== oldAddress.po ||
        form.ps !== oldAddress.ps ||
        form.pin !== oldAddress.pin ||
        form.district !== oldAddress.district ||
        form.state !== oldAddress.state;

      if (hasAddressChanged) {
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
      }

      // Web-friendly check for verifying FormData contents
      let hasEntries = false;
      for (let pair of formData.entries()) {
        hasEntries = true;
        break;
      }

      if (!hasEntries) {
        setSaving(false);
        return triggerAlert(
          "No Changes",
          "No profile modifications detected.",
          "info",
        );
      }

      const data = await apis.updateProfile(formData);

      if (data?.success) {
        setStaff(data.staff);
        triggerAlert(
          "Success",
          "Profile updated successfully.",
          "success",
          () => navigate("/profile"),
        );
      }
    } catch (error) {
      triggerAlert(
        "Update Failed",
        error?.response?.data?.message ||
          error.message ||
          "An unexpected error occurred.",
        "danger",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Upper Navigation Action Bar */}
      <div className="flex items-center justify-center border-b border-border pb-5 mb-8">
        <h1 className="text-xl font-black tracking-tight text-text-primary hidden sm:block">
          Edit Your Details
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Details Subsection Grid */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center space-x-2.5 mb-6 border-b border-border/60 pb-4">
            <GraduationCap className="text-primary shrink-0" size={20} />
            <h2 className="text-lg font-bold text-text-primary tracking-tight">
              Personal & Academic Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. name@academy.com"
            />
            <Input
              label="Contact Number"
              name="contact"
              type="tel"
              value={form.contact}
              onChange={handleChange}
              required
            />
            <Input
              label="Degree / Qualifications"
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
            />
            <Input
              label="Experience (Years)"
              name="experience"
              type="number"
              min="0"
              value={form.experience}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Residential Address Subsection Grid */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center space-x-2.5 mb-6 border-b border-border/60 pb-4">
            <MapPin className="text-primary shrink-0" size={20} />
            <h2 className="text-lg font-bold text-text-primary tracking-tight">
              Residential Address
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Village / Town"
              name="village"
              value={form.village}
              onChange={handleChange}
            />
            <Input
              label="Post Office (P.O.)"
              name="po"
              value={form.po}
              onChange={handleChange}
            />
            <Input
              label="Police Station (P.S.)"
              name="ps"
              value={form.ps}
              onChange={handleChange}
            />
            <Input
              label="District"
              name="district"
              value={form.district}
              onChange={handleChange}
            />
            <Input
              label="PIN Code"
              name="pin"
              value={form.pin}
              maxLength={6}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) handleChange(e);
              }}
            />
            <Input
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Dynamic Contextual Execution Anchors */}
        <div className="flex flex-col-reverse sm:flex-row items-center sm:justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto px-6"
            disabled={saving}
            onClick={() => navigate("/profile")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="accent"
            className="w-full sm:w-auto px-8"
            loading={saving}
            icon={Check}
          >
            Save Changes
          </Button>
        </div>
      </form>

      {/* Central Notification System Alert Interceptor Modal */}
      <Alert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        variant={alertConfig.variant}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
        buttons={[
          {
            text: "Okay",
            variant: "accent",
            onClick: () => {
              setAlertConfig((prev) => ({ ...prev, visible: false }));
              if (alertConfig.onConfirm) alertConfig.onConfirm();
            },
          },
        ]}
      />
    </main>
  );
};

export default EditProfile;
