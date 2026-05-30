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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import api from "@/configs/api";
import AnimatedScreen from "@/components/common/AnimatedScreen";
import { ThemeContext } from "@/context/ThemeProvider";

const ForgotPassword = () => {
  const { COLORS } = useContext(ThemeContext);

  // Flow states: 'send-otp' | 'verify-otp' | 'reset-password'
  const [step, setStep] = useState("send-otp");
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Email Validation Regular Expression Helper
  const validateEmail = (inputEmail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(inputEmail);
  };

  // Step 1: Input Email -> Backend shoots verification token parameters via NodeMailer
  const handleSendOtp = async () => {
    const targetEmail = email.trim().toLowerCase();

    if (!targetEmail) {
      return Alert.alert("Required Input", "Please provide your registered email address.");
    }

    if (!validateEmail(targetEmail)) {
      return Alert.alert("Format Error", "Please enter a valid email structural syntax (e.g., name@domain.com).");
    }

    setLoading(true);
    try {
      // Points cleanly to your backend router configuration handler structure
      const response = await api.post("/api/auth/forgot-password/teacher", {
        email: targetEmail,
        action: "send-otp",
      });

      if (response.data?.success) {
        Alert.alert(
          "OTP Sent", 
          `A 6-digit verification code has been dispatched safely to: \n${targetEmail}`
        );
        setStep("verify-otp");
      }
    } catch (error) {
      Alert.alert(
        "Lookup Failed",
        error?.response?.data?.message || "No institutional account detected matching that email."
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Validate Email OTP
  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.length !== 6) {
      return Alert.alert("Invalid Code", "Please input the complete 6-digit OTP security sequence.");
    }

    setLoading(true);
    try {
      const response = await api.post("/api/auth/forgot-password/teacher", {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        action: "verify-otp",
      });

      if (response.data?.success) {
        Alert.alert("Identity Verified", "Security code approved. Please initialize your new access keys.");
        setStep("reset-password");
      }
    } catch (error) {
      Alert.alert(
        "Verification Failed",
        error?.response?.data?.message || "The verification token is either incorrect or has expired."
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Write New Password data fields securely
  const handleResetPassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      return Alert.alert("Missing Fields", "Please complete all verification password blocks.");
    }

    if (newPassword.length < 6) {
      return Alert.alert("Weak Password", "Security keys must contain a length minimum of 6 characters.");
    }

    if (newPassword !== confirmPassword) {
      return Alert.alert("Mismatch", "Your password input fields do not match.");
    }

    setLoading(true);
    try {
      const response = await api.post("/api/auth/forgot-password/teacher", {
        email: email.trim().toLowerCase(),
        newPassword: newPassword,
        action: "reset-password",
      });

      if (response.data?.success) {
        Alert.alert("Success", "Account password updated successfully. Proceed to sign-in terminal.", [
          { text: "Go to Login", onPress: () => router.replace("/(auth)/login") }
        ]);
      }
    } catch (error) {
      Alert.alert(
        "Override Failed",
        error?.response?.data?.message || "Unable to process password modifications. Restart flow paths."
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
          contentContainerStyle={{ padding: 20, justifyContent: "center", flexGrow: 1 }}
        >
          <View
            className="rounded-3xl p-6 border"
            style={{ backgroundColor: COLORS.card, borderColor: COLORS.border, elevation: 4 }}
          >
            {/* Header Text block elements */}
            <Text className="text-2xl font-bold mb-2 text-center" style={{ color: COLORS.textPrimary }}>
              {step === "send-otp" && "Forgot Password"}
              {step === "verify-otp" && "Verify Security Code"}
              {step === "reset-password" && "Reset Password Keys"}
            </Text>

            <Text className="text-sm text-center mb-6 leading-relaxed" style={{ color: COLORS.textSecondary }}>
              {step === "send-otp" && "Input your registered Nashib Ali Academy workspace email address to retrieve a temporary password reset code."}
              {step === "verify-otp" && `Type the 6-digit verification code sent directly to your active inbox at: \n${email.trim().toLowerCase()}`}
              {step === "reset-password" && "Establish your fresh network credentials. Make sure it's something secure that you don't use elsewhere."}
            </Text>

            {/* STEP 1 INPUT: Email Address field block setup */}
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

            {/* STEP 2 INPUT: 6-Digit Email Verification Code Input */}
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

            {/* STEP 3 INPUT: Create and Confirm New Password fields */}
            {step === "reset-password" && (
              <View>
                {/* Password field text frame */}
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

                {/* Password verification checker matching container */}
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

            {/* Primary Adaptive Action Button */}
            <TouchableOpacity
              disabled={loading}
              onPress={
                step === "send-otp" ? handleSendOtp : 
                step === "verify-otp" ? handleVerifyOtp : handleResetPassword
              }
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

            {/* Cancel Navigation Pop Link */}
            <TouchableOpacity 
              className="mt-5 items-center" 
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text className="text-sm font-medium" style={{ color: COLORS.textSecondary }}>
                Cancel and Go Back
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AnimatedScreen>
  );
};

export default ForgotPassword;