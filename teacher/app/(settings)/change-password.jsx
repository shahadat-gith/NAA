import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";

import api from "@/configs/api";
import AnimatedScreen from "@/components/common/AnimatedScreen";
import PasswordField from "@/components/settings/PasswordField";
import { ThemeContext } from "@/context/ThemeProvider";

const ChangePassword = () => {
  const { COLORS } = useContext(ThemeContext);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [visibility, setVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    const { currentPassword, newPassword, confirmPassword } = form;

    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      return Alert.alert("Missing Fields", "Please populate all security blocks.");
    }

    if (newPassword.length < 6) {
      return Alert.alert("Weak Password", "New credentials must be at least 6 characters long.");
    }

    if (newPassword !== confirmPassword) {
      return Alert.alert("Mismatch Error", "Your new password entries do not match.");
    }

    setLoading(true);
    try {
      // Synchronized with backend user router configuration target path
      const response = await api.put("/api/auth/teacher/update-password", {
        currentPassword,
        newPassword,
      });

      if (response.data?.success) {
        Alert.alert("Success", "Your password have been updated successfully.", [
          { text: "OK", onPress: () => router.back() }
        ]);
      }
    } catch (error) {
      Alert.alert(
        "Update Failed",
        error?.response?.data?.message || "Unable to modify credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedScreen>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          style={{ backgroundColor: COLORS.background }}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        >
          <View 
            className="rounded-3xl p-5 border mb-6"
            style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
          >
            <Text className="text-sm font-semibold mb-5" style={{ color: COLORS.textSecondary }}>
              Update your account credentials regularly to safeguard institutional portal data access.
            </Text>

            {/* Input - Current Password */}
            <PasswordField
              label="Current Password"
              value={form.currentPassword}
              onChangeText={(v) => handleInputChange("currentPassword", v)}
              visible={visibility.current}
              onToggleVisibility={() => toggleVisibility("current")}
              colors={COLORS}
            />

            {/* Input - New Password */}
            <PasswordField
              label="New Password"
              value={form.newPassword}
              onChangeText={(v) => handleInputChange("newPassword", v)}
              visible={visibility.new}
              onToggleVisibility={() => toggleVisibility("new")}
              colors={COLORS}
            />

            {/* Input - Confirm New Password */}
            <PasswordField
              label="Confirm New Password"
              value={form.confirmPassword}
              onChangeText={(v) => handleInputChange("confirmPassword", v)}
              visible={visibility.confirm}
              onToggleVisibility={() => toggleVisibility("confirm")}
              colors={COLORS}
            />

            {/* Submit Trigger Action */}
            <TouchableOpacity
              disabled={loading}
              onPress={handleSubmit}
              className="rounded-2xl py-4 items-center justify-center mt-4"
              style={{
                backgroundColor: loading ? COLORS.inactive : COLORS.primary,
              }}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text className="text-white font-semibold text-base">Update Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AnimatedScreen>
  );
};



export default ChangePassword;