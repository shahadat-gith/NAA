import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import api from "@/configs/api";
import { ThemeContext } from "@/context/ThemeProvider";

const ForgotPasswordModal = ({ visible, onClose }) => {
  const { COLORS } = useContext(ThemeContext);

  // Flow states: 'send-otp' -> 'verify-otp' -> 'reset-password'
  const [step, setStep] = useState("send-otp");
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDismiss = () => {
    setStep("send-otp");
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    onClose();
  };

  const validateEmail = (inputEmail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(inputEmail);
  };

  const handleFormSubmission = async () => {
    const targetEmail = email.trim().toLowerCase();
    
    if (step === "send-otp") {
      if (!targetEmail) return Alert.alert("Required Input", "Please provide your email address.");
      if (!validateEmail(targetEmail)) return Alert.alert("Format Error", "Please enter a valid email address.");
    }

    if (step === "verify-otp") {
      if (!otp.trim() || otp.length !== 6) {
        return Alert.alert("Invalid Code", "Please input the complete 6-digit verification code.");
      }
    }

    if (step === "reset-password") {
      if (!newPassword.trim() || !confirmPassword.trim()) return Alert.alert("Missing Fields", "Please populate all fields.");
      if (newPassword.length < 6) return Alert.alert("Weak Password", "Passwords must be at least 6 characters.");
      if (newPassword !== confirmPassword) return Alert.alert("Mismatch", "Your new password entries do not match.");
    }

    setLoading(true);

    try {
      const response = await api.post(`/api/auth/forgot-password/teacher/${step}`, {
        email: targetEmail,
        otp: step === "verify-otp" ? otp.trim() : undefined,
        newPassword: step === "reset-password" ? newPassword : undefined,
      });

      if (response.data?.success) {
        const backendMessage = response.data.message || "Action processed successfully.";

        if (step === "send-otp") {
          Alert.alert("OTP Sent", backendMessage);
          setStep("verify-otp");
        } else if (step === "verify-otp") {
          Alert.alert("Verified", backendMessage);
          setStep("reset-password");
        } else if (step === "reset-password") {
          Alert.alert("Success", backendMessage, [
            { text: "OK", onPress: handleDismiss }
          ]);
        }
      }
    } catch (error) {
      Alert.alert(
        "Request Failed",
        error?.response?.data?.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleDismiss}
    >
      <View className="flex-1 justify-end bg-black/50">
        <TouchableOpacity className="flex-1" activeOpacity={1} onPress={handleDismiss} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ maxHeight: "85%" }}
        >
          <View
            className="rounded-t-[32px] p-6 border-t"
            style={{ 
              backgroundColor: COLORS.card, 
              borderColor: COLORS.border,
              elevation: 24
            }}
          >
            {/* Simple static handlebar ornament */}
            <View className="w-12 h-1.5 rounded-full self-center mb-6 bg-gray-300 dark:bg-gray-700" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              
              <Text className="text-2xl font-bold mb-2 text-center" style={{ color: COLORS.textPrimary }}>
                {step === "send-otp" && "Forgot Password"}
                {step === "verify-otp" && "Verify Security Code"}
                {step === "reset-password" && "Reset Password"}
              </Text>

              <Text className="text-sm text-center mb-6 leading-relaxed" style={{ color: COLORS.textSecondary }}>
                {step === "send-otp" && "Input your email address to get a password reset code."}
                {step === "verify-otp" && `Type the 6-digit verification code sent directly to your active inbox at: \n${email.trim().toLowerCase()}`}
                {step === "reset-password" && "Add a strong and secure password."}
              </Text>

              {/* STEP 1: Email Input */}
              {step === "send-otp" && (
                <View
                  className="flex-row items-center border rounded-2xl px-4 mb-6"
                  style={{ borderColor: COLORS.border, backgroundColor: COLORS.background }}
                >
                  <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Registered Email Address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor={COLORS.textSecondary}
                    className="flex-1 py-4 ml-3 text-sm"
                    style={{ color: COLORS.textPrimary }}
                  />
                </View>
              )}

              {/* STEP 2: Code Input */}
              {step === "verify-otp" && (
                <View
                  className="flex-row items-center border rounded-2xl px-4 mb-6"
                  style={{ borderColor: COLORS.border, backgroundColor: COLORS.background }}
                >
                  <Ionicons name="keypad-outline" size={20} color={COLORS.textSecondary} />
                  <TextInput
                    value={otp}
                    onChangeText={setOtp}
                    placeholder="6-Digit OTP"
                    keyboardType="number-pad"
                    maxLength={6}
                    placeholderTextColor={COLORS.textSecondary}
                    className="flex-1 py-4 ml-3 text-sm tracking-[6px] font-bold text-center"
                    style={{ color: COLORS.textPrimary }}
                  />
                </View>
              )}

              {/* STEP 3: Password Generation Form */}
              {step === "reset-password" && (
                <View>
                  <View
                    className="flex-row items-center border rounded-2xl px-4 mb-4"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.background }}
                  >
                    <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} />
                    <TextInput
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholder="New Secure Password"
                      secureTextEntry={!showPassword}
                      placeholderTextColor={COLORS.textSecondary}
                      className="flex-1 py-4 ml-3 text-sm"
                      style={{ color: COLORS.textPrimary }}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color={COLORS.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>

                  <View
                    className="flex-row items-center border rounded-2xl px-4 mb-6"
                    style={{ borderColor: COLORS.border, backgroundColor: COLORS.background }}
                  >
                    <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.textSecondary} />
                    <TextInput
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Confirm New Password"
                      secureTextEntry={!showPassword}
                      placeholderTextColor={COLORS.textSecondary}
                      className="flex-1 py-4 ml-3 text-sm"
                      style={{ color: COLORS.textPrimary }}
                      autoCapitalize="none"
                    />
                  </View>
                </View>
              )}

              <TouchableOpacity
                disabled={loading}
                onPress={handleFormSubmission}
                className="rounded-2xl py-4 items-center justify-center"
                style={{ backgroundColor: loading ? COLORS.inactive : COLORS.primary }}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text className="text-white font-semibold text-base">
                    {step === "send-otp" && "Send Verification Code"}
                    {step === "verify-otp" && "Verify OTP"}
                    {step === "reset-password" && "Commit New Password"}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity className="mt-5 items-center" onPress={handleDismiss} disabled={loading}>
                <Text className="text-sm font-medium" style={{ color: COLORS.textSecondary }}>
                  Cancel and Close
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default ForgotPasswordModal;