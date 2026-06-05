import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { staffApi } from "@/api/staff";
import PasswordField from "@/components/settings/PasswordField";
import { ThemeContext } from "@/context/ThemeProvider";

const ChangePasswordModal = ({ visible, onClose }) => {
  const { COLORS } = useContext(ThemeContext);

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [visibility, setVisibility] = useState({
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setForm({ newPassword: "", confirmPassword: "" });
      setVisibility({ new: false, confirm: false });
    }
  }, [visible]);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    const { newPassword, confirmPassword } = form;

    if (!newPassword.trim() || !confirmPassword.trim()) {
      return Alert.alert("Missing Fields", "Please populate both password fields.");
    }

    if (newPassword.length < 6) {
      return Alert.alert("Weak Password", "New credentials must be at least 6 characters long.");
    }

    if (newPassword !== confirmPassword) {
      return Alert.alert("Mismatch Error", "Your new password entries do not match.");
    }

    setLoading(true);
    try {
      const data = await staffApi.inAppUpdatePassword(newPassword);

      if (data?.success) {
        Alert.alert("Success", "Your password has been updated successfully.", [
          { text: "OK", onPress: onClose }
        ]);
      }
    } catch (error) {
      Alert.alert("Update Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-black/40 justify-end"
      >
        <View
          className="rounded-t-3xl max-h-[85%]"
          style={{ backgroundColor: COLORS.card }}
        >
          {/* Modal Header */}
          <View
            className="flex-row items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: COLORS.border }}
          >
            <View>
              <Text
                className="text-xl font-bold"
                style={{ color: COLORS.textPrimary }}
              >
                Change Password
              </Text>
              <Text
                className="mt-1 text-xs"
                style={{ color: COLORS.textSecondary }}
              >
                Update your portal security credentials
              </Text>
            </View>

            <TouchableOpacity disabled={loading} onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Form Content */}
          <ScrollView
            contentContainerStyle={{ padding: 20, paddingBottom: Platform.OS === "ios" ? 40 : 24 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text
              className="text-sm font-semibold mb-5"
              style={{ color: COLORS.textSecondary }}
            >
              Update your account credentials regularly to safeguard institutional portal data access.
            </Text>

            <PasswordField
              label="New Password"
              value={form.newPassword}
              onChangeText={(v) => handleInputChange("newPassword", v)}
              visible={visibility.new}
              onToggleVisibility={() => toggleVisibility("new")}
              colors={COLORS}
            />

            <PasswordField
              label="Confirm New Password"
              value={form.confirmPassword}
              onChangeText={(v) => handleInputChange("confirmPassword", v)}
              visible={visibility.confirm}
              onToggleVisibility={() => toggleVisibility("confirm")}
              colors={COLORS}
            />

            <TouchableOpacity
              disabled={loading}
              onPress={handleSubmit}
              className="rounded-2xl py-4 items-center justify-center mt-4"
              style={{
                backgroundColor: loading ? COLORS.inactive : COLORS.primary,
              }}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text className="text-white font-semibold text-base">
                  Update Password
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ChangePasswordModal;