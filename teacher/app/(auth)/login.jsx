import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ImageBackground,
} from "react-native";

import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import api from "@/configs/api";
import { AppContext } from "@/context/AppContext";
import { ThemeContext } from "@/context/ThemeProvider";

import ForgotPasswordModal from "@/components/modals/ForgotPasswordModal";

const Login = () => {
  const { teacher, setTeacher } = useContext(AppContext);
  const { COLORS } = useContext(ThemeContext);

  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Local visibility tracking state hook for your bottom sheet modal component
  const [isModalVisible, setIsModalVisible] = useState(false);

  // SAFE REDIRECT GUARD: Fires strictly outside the layout rendering pass
  useEffect(() => {
    if (teacher) {
      router.replace("/(tabs)");
    }
  }, [teacher]);

  const handleLogin = async () => {
    if (!contact.trim() || !password.trim()) {
      return Alert.alert(
        "Validation Error",
        "Please enter both contact and password."
      );
    }

    setLoading(true);

    try {
      const response = await api.post("/api/auth/teacher-login", {
        contact: contact.trim(),
        password,
      });

      if (response.data?.success) {
        const token = response.data.token;
        const teacherData = response.data.teacher;

        if (!token) {
          return Alert.alert(
            "Login Failed",
            "Token was not received from server."
          );
        }

        if (!teacherData) {
          return Alert.alert(
            "Login Failed",
            "Teacher profile was not received from server."
          );
        }

        await SecureStore.setItemAsync("teacher-token", token);
        setTeacher(teacherData);
        
        // Let the useEffect hook up top handle standard redirect transitions seamlessly
      } else {
        Alert.alert(
          "Login Failed",
          response.data?.message || "Invalid credentials."
        );
      }
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error?.response?.data?.message ||
          "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/background.webp")}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 bg-black/35">
        <KeyboardAvoidingView
          className="flex-1 justify-center px-6"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Brand Identity / Logo Header */}
          <View className="items-center mb-8">
            <View className="w-24 h-24 rounded-full bg-white items-center justify-center mb-4">
              <Image
                source={require("@/assets/images/logo.png")}
                className="w-20 h-20"
                resizeMode="contain"
              />
            </View>

            <Text className="text-white text-3xl font-bold text-center">
              Nashib Ali Academy
            </Text>

            <Text className="text-white/90 text-base mt-2 text-center">
              Teacher Portal
            </Text>
          </View>

          {/* Login Form Sheet Container */}
          <View
            className="rounded-3xl px-6 py-7"
            style={{ backgroundColor: COLORS.card, elevation: 8 }}
          >
            <Text
              className="text-2xl font-bold text-center mb-2"
              style={{ color: COLORS.textPrimary }}
            >
              Welcome Back
            </Text>

            <Text
              className="text-center mb-7"
              style={{ color: COLORS.textSecondary }}
            >
              Sign in to access your dashboard
            </Text>

            {/* Input - Contact Field */}
            <View
              className="flex-row items-center border rounded-2xl px-4 mb-4"
              style={{ 
                borderColor: COLORS.border,
                backgroundColor: COLORS.background 
              }}
            >
              <Ionicons
                name="call-outline"
                size={20}
                color={COLORS.textSecondary}
              />

              <TextInput
                value={contact}
                onChangeText={setContact}
                placeholder="Contact Number"
                keyboardType="phone-pad"
                placeholderTextColor={COLORS.textSecondary}
                className="flex-1 py-4 ml-3"
                style={{ color: COLORS.textPrimary }}
              />
            </View>

            {/* Input - Password Field */}
            <View
              className="flex-row items-center border rounded-2xl px-4 mb-3"
              style={{ 
                borderColor: COLORS.border,
                backgroundColor: COLORS.background 
              }}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={COLORS.textSecondary}
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry={!showPassword}
                placeholderTextColor={COLORS.textSecondary}
                className="flex-1 py-4 ml-3"
                style={{ color: COLORS.textPrimary }}
              />

              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Recovery Action Link - NOW SAFELY TRIPPED OVER THE LOCAL MODAL HOOK STATE */}
            <TouchableOpacity 
              className="self-end mb-6" 
              onPress={() => setIsModalVisible(true)}
            >
              <Text style={{ color: COLORS.primary }}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Submit Action Trigger */}
            <TouchableOpacity
              disabled={loading}
              onPress={handleLogin}
              className="rounded-2xl py-4 items-center"
              style={{
                backgroundColor: loading ? COLORS.inactive : COLORS.primary,
              }}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text className="text-white font-semibold text-base">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>

      {/* Embedded Account Password Recovery Modal Sheet */}
      <ForgotPasswordModal 
        visible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
      />
    </ImageBackground>
  );
};

export default Login;