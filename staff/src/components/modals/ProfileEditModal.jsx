import React, { useState, useContext, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { staffApi } from "@/api/staff";
import { ThemeContext } from "@/context/ThemeProvider";
import { AppContext } from "@/context/AppContext";

const ProfileEditModal = ({ visible, onClose, staff }) => {
  const { COLORS } = useContext(ThemeContext);
  const { setStaff } = useContext(AppContext);

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

  useEffect(() => {
    if (visible && staff) {
      const address = staff.address || {};

      setForm({
        name: staff.name || "",
        email: staff.email && staff.email !== "N/A" ? staff.email : "",
        contact: staff.contact || "",
        qualification: staff.qualification || "",
        experience: staff.experience !== undefined ? String(staff.experience) : "",
        village: address.village || "",
        po: address.po || "",
        ps: address.ps || "",
        pin: address.pin || "",
        district: address.district || "",
        state: address.state || "Assam",
      });
    }
  }, [visible, staff]);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.contact.trim()) {
      return Alert.alert("Validation Error", "Name and contact number are required.");
    }

    if (form.pin && !/^\d{6}$/.test(form.pin)) {
      return Alert.alert("Validation Error", "Please enter a valid 6-digit PIN code.");
    }

    setSaving(true);

    try {
      const formData = new FormData();
      const oldAddress = staff?.address || {};
      const oldEmail = staff?.email === "N/A" ? "" : staff?.email || "";

      if (form.name !== staff?.name) formData.append("name", form.name);
      if (form.email !== oldEmail) formData.append("email", form.email || "N/A");
      if (form.contact !== staff?.contact) formData.append("contact", form.contact);
      if (form.qualification !== staff?.qualification) formData.append("qualification", form.qualification);

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

      if (!formData._parts?.length) {
        setSaving(false);
        return Alert.alert("No Changes", "No profile changes detected.");
      }

      const data = await staffApi.updateProfile(formData);

      if (data?.success) {
        setStaff(data.staff)
        onClose();
       Alert.alert("Success", "Profile updated successfully.");
      }
    } catch (error) {
      Alert.alert("Update Failed", error.message);
    } finally {
      // 🌟 FIX: Re-secured the proper javascript compile engine block boundary here
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-black/40 justify-end"
      >
        <View
          className="rounded-t-3xl max-h-[92%]"
          style={{ backgroundColor: COLORS.card }}
        >
          <View
            className="flex-row items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: COLORS.border }}
          >
            <Text
              className="text-xl font-bold"
              style={{ color: COLORS.textPrimary }}
            >
              Update Profile
            </Text>

            <TouchableOpacity disabled={saving} onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <SectionTitle title="Personal Details" colors={COLORS} />

            <Input
              label="Full Name"
              value={form.name}
              onChangeText={(v) => handleChange("name", v)}
              colors={COLORS}
            />
            <Input
              label="Email Address"
              value={form.email}
              onChangeText={(v) => handleChange("email", v)}
              keyboardType="email-address"
              colors={COLORS}
            />
            <Input
              label="Contact Number"
              value={form.contact}
              onChangeText={(v) => handleChange("contact", v)}
              keyboardType="phone-pad"
              colors={COLORS}
            />
            <Input
              label="Degree / Qualifications"
              value={form.qualification}
              onChangeText={(v) => handleChange("qualification", v)}
              colors={COLORS}
            />
            <Input
              label="Experience"
              value={form.experience}
              onChangeText={(v) => handleChange("experience", v)}
              keyboardType="numeric"
              colors={COLORS}
            />

            <SectionTitle title="Residential Address" colors={COLORS} />

            <Input
              label="Village / Town"
              value={form.village}
              onChangeText={(v) => handleChange("village", v)}
              colors={COLORS}
            />
            <Input
              label="Post Office (P.O.)"
              value={form.po}
              onChangeText={(v) => handleChange("po", v)}
              colors={COLORS}
            />
            <Input
              label="Police Station (P.S.)"
              value={form.ps}
              onChangeText={(v) => handleChange("ps", v)}
              colors={COLORS}
            />
            <Input
              label="District"
              value={form.district}
              onChangeText={(v) => handleChange("district", v)}
              colors={COLORS}
            />
            <Input
              label="PIN Code"
              value={form.pin}
              onChangeText={(v) => /^\d*$/.test(v) && handleChange("pin", v)}
              keyboardType="numeric"
              maxLength={6}
              colors={COLORS}
            />
            <Input
              label="State"
              value={form.state}
              onChangeText={(v) => handleChange("state", v)}
              colors={COLORS}
            />

            <View className="flex-row gap-3 mt-4 mb-4">
              <TouchableOpacity
                disabled={saving}
                onPress={onClose}
                className="flex-1 rounded-2xl py-4 items-center border"
                style={{ borderColor: COLORS.primary }}
                activeOpacity={0.7}
              >
                <Text
                  className="font-semibold"
                  style={{ color: COLORS.primary }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={saving}
                onPress={handleSubmit}
                className="flex-1 rounded-2xl py-4 items-center"
                style={{
                  backgroundColor: saving ? COLORS.inactive : COLORS.primary,
                }}
                activeOpacity={0.8}
              >
                {saving ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text className="text-white font-semibold">Update</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const SectionTitle = ({ title, colors }) => (
  <Text
    className="text-base font-bold mb-3 mt-2"
    style={{ color: colors.textPrimary }}
  >
    {title}
  </Text>
);

const Input = ({
  label,
  value,
  onChangeText,
  keyboardType = "default",
  maxLength,
  colors,
}) => (
  <View className="mb-4">
    <Text
      className="text-xs font-semibold mb-2"
      style={{ color: colors.textSecondary }}
    >
      {label}
    </Text>

    <TextInput
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      maxLength={maxLength}
      placeholder={label}
      placeholderTextColor={colors.textSecondary}
      className="border rounded-2xl px-4 py-4"
      style={{
        borderColor: colors.border,
        color: colors.textPrimary,
        backgroundColor: colors.background,
      }}
    />
  </View>
);

export default ProfileEditModal;