import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import api from "@/configs/api";
import { pickAndCropProfileImage } from "@/configs/cropper";
import { COLORS } from "@/constants/theme";

const ProfileEditModal = ({ visible, onClose, teacher, loadTeacher }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    degree: "",
    experience: "",
    village: "",
    po: "",
    ps: "",
    pin: "",
    district: "",
    state: "Assam",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible && teacher) {
      const address = teacher.address || {};

      setForm({
        name: teacher.name || "",
        email: teacher.email && teacher.email !== "N/A" ? teacher.email : "",
        contact: teacher.contact || "",
        degree: teacher.degree || "",
        experience:
          teacher.experience !== undefined ? String(teacher.experience) : "",
        village: address.village || "",
        po: address.po || "",
        ps: address.ps || "",
        pin: address.pin || "",
        district: address.district || "",
        state: address.state || "Assam",
      });

      setImagePreview(teacher?.image?.url || teacher?.image || "");
      setImageFile(null);
    }
  }, [visible, teacher]);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagePick = async () => {
    const result = await pickAndCropProfileImage();

    if (!result) return;

    setImagePreview(result.preview);
    setImageFile(result.file);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.contact.trim()) {
      return Alert.alert(
        "Validation Error",
        "Name and contact number are required."
      );
    }

    if (form.pin && !/^\d{6}$/.test(form.pin)) {
      return Alert.alert(
        "Validation Error",
        "Please enter a valid 6-digit PIN code."
      );
    }

    setSaving(true);

    try {
      const formData = new FormData();
      const oldAddress = teacher?.address || {};
      const oldEmail = teacher?.email === "N/A" ? "" : teacher?.email || "";

      if (form.name !== teacher?.name) formData.append("name", form.name);
      if (form.email !== oldEmail) formData.append("email", form.email || "N/A");
      if (form.contact !== teacher?.contact) formData.append("contact", form.contact);
      if (form.degree !== teacher?.degree) formData.append("degree", form.degree);

      if (Number(form.experience) !== Number(teacher?.experience)) {
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
          })
        );
      }

      if (imageFile) formData.append("image", imageFile);

      if (!imageFile && !formData._parts?.length) {
        setSaving(false);
        return Alert.alert("No Changes", "No profile changes detected.");
      }

      const response = await api.post("/api/teacher/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.success) {
        await loadTeacher();
        onClose();
        Alert.alert("Success", "Profile updated successfully.");
      } else {
        Alert.alert(
          "Update Failed",
          response.data?.message || "Failed to update profile."
        );
      }
    } catch (error) {
      Alert.alert(
        "Update Failed",
        error?.response?.data?.message ||
          "An error occurred while updating profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-card rounded-t-3xl max-h-[92%]">
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
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

          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <View className="items-center mb-6">
              <Image
                source={
                  imagePreview
                    ? { uri: imagePreview }
                    : require("@/assets/images/user.png")
                }
                className="w-28 h-28 rounded-full"
                resizeMode="cover"
              />

              <TouchableOpacity
                onPress={handleImagePick}
                disabled={saving}
                className="mt-3 px-5 py-2 rounded-full"
                style={{ backgroundColor: COLORS.primary }}
              >
                <Text className="text-white font-semibold">
                  {teacher.image.url ? "Change Profile" : "Upload Profile"}
                </Text>
              </TouchableOpacity>
            </View>

            <SectionTitle title="Personal Details" />

            <Input label="Full Name" value={form.name} onChangeText={(v) => handleChange("name", v)} />
            <Input label="Email Address" value={form.email} onChangeText={(v) => handleChange("email", v)} keyboardType="email-address" />
            <Input label="Contact Number" value={form.contact} onChangeText={(v) => handleChange("contact", v)} keyboardType="phone-pad" />
            <Input label="Degree / Qualifications" value={form.degree} onChangeText={(v) => handleChange("degree", v)} />
            <Input label="Experience" value={form.experience} onChangeText={(v) => handleChange("experience", v)} keyboardType="numeric" />

            <SectionTitle title="Residential Address" />

            <Input label="Village / Town" value={form.village} onChangeText={(v) => handleChange("village", v)} />
            <Input label="Post Office (P.O.)" value={form.po} onChangeText={(v) => handleChange("po", v)} />
            <Input label="Police Station (P.S.)" value={form.ps} onChangeText={(v) => handleChange("ps", v)} />
            <Input label="District" value={form.district} onChangeText={(v) => handleChange("district", v)} />

            <Input
              label="PIN Code"
              value={form.pin}
              onChangeText={(v) => /^\d*$/.test(v) && handleChange("pin", v)}
              keyboardType="numeric"
              maxLength={6}
            />

            <Input label="State" value={form.state} onChangeText={(v) => handleChange("state", v)} />

            <View className="flex-row gap-3 mt-4 mb-4">
              <TouchableOpacity
                disabled={saving}
                onPress={onClose}
                className="flex-1 rounded-2xl py-4 items-center border"
                style={{ borderColor: COLORS.primary }}
              >
                <Text className="font-semibold" style={{ color: COLORS.primary }}>
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
      </View>
    </Modal>
  );
};

const SectionTitle = ({ title }) => (
  <Text
    className="text-base font-bold mb-3 mt-2"
    style={{ color: COLORS.textPrimary }}
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
}) => (
  <View className="mb-4">
    <Text
      className="text-xs font-semibold mb-2"
      style={{ color: COLORS.textSecondary }}
    >
      {label}
    </Text>

    <TextInput
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      maxLength={maxLength}
      placeholder={label}
      placeholderTextColor={COLORS.textSecondary}
      className="border rounded-2xl px-4 py-4"
      style={{
        borderColor: COLORS.border,
        color: COLORS.textPrimary,
        backgroundColor: COLORS.white,
      }}
    />
  </View>
);

export default ProfileEditModal;