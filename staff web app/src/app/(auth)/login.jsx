import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { staffApi } from "@/api/staff";
import api from "@/configs/api";
import { AppContext } from "@/context/AppContext";
import { ThemeContext } from "@/context/ThemeProvider";
import ForgotPasswordModal from "@/components/modals/ForgotPasswordModal";

const Login = () => {
  const { staff, setStaff } = useContext(AppContext);
  const { COLORS } = useContext(ThemeContext);

  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (staff) {
      router.replace("/(tabs)");
    }
  }, [staff]);

  const handleLogin = async () => {
    const cleanContact = contact.trim();

    if (!cleanContact || !password.trim()) {
      return Alert.alert(
        "Missing Details",
        "Please enter both your contact number and password.",
      );
    }

    setLoading(true);
    try {
      const data = await staffApi.login(cleanContact, password);

      if (data?.success) {
        const token = data.token;
        const staffProfileData = data.staff;

        if (!token || !staffProfileData) {
          return Alert.alert(
            "Login Failed",
            "Could not set up your secure session. Please try again.",
          );
        }

        await SecureStore.setItemAsync("staff-token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setStaff(staffProfileData);
      } else {
        Alert.alert(
          "Login Failed",
          data?.message || "Incorrect contact number or password.",
        );
      }
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand/Logo Identity Block */}
          <View className="items-center mb-10">
            <View 
              className="w-20 h-20 rounded-3xl items-center justify-center mb-5 border shadow-sm"
              style={{ 
                backgroundColor: COLORS.card, 
                borderColor: COLORS.border,
                shadowColor: COLORS.textPrimary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
              }}
            >
              <Image
                source={require("@/assets/images/logo.png")}
                className="w-14 h-14"
                resizeMode="contain"
              />
            </View>

            <Text className="text-2xl font-black tracking-tight" style={{ color: COLORS.textPrimary }}>
              Nashib Ali Academy
            </Text>
            <Text className="text-sm font-semibold uppercase tracking-widest mt-1.5" style={{ color: COLORS.primary }}>
              Staff Portal Access
            </Text>
          </View>

          {/* Core Credentials Input Field Blocks */}
          <View className="space-y-4">
            
            {/* Input Wrapper: Contact */}
            <View className="mb-4">
              <Text className="text-xs font-bold uppercase tracking-wider mb-2 ml-1" style={{ color: COLORS.textSecondary }}>
                Contact Number
              </Text>
              <View
                className="flex-row items-center border rounded-2xl px-4"
                style={{
                  borderColor: COLORS.border,
                  backgroundColor: COLORS.card,
                }}
              >
                <Ionicons name="call-outline" size={18} color={COLORS.textSecondary} />
                <TextInput
                  value={contact}
                  onChangeText={setContact}
                  placeholder="Enter your registered number"
                  keyboardType="phone-pad"
                  placeholderTextColor={COLORS.inactive}
                  className="flex-1 py-4 ml-3 text-sm font-medium"
                  style={{ color: COLORS.textPrimary }}
                />
              </View>
            </View>

            {/* Input Wrapper: Password */}
            <View className="mb-2">
              <Text className="text-xs font-bold uppercase tracking-wider mb-2 ml-1" style={{ color: COLORS.textSecondary }}>
                Password
              </Text>
              <View
                className="flex-row items-center border rounded-2xl px-4"
                style={{
                  borderColor: COLORS.border,
                  backgroundColor: COLORS.card,
                }}
              >
                <Ionicons name="lock-closed-outline" size={18} color={COLORS.textSecondary} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter secure credentials"
                  secureTextEntry={!showPassword}
                  placeholderTextColor={COLORS.inactive}
                  className="flex-1 py-4 ml-3 text-sm font-medium"
                  style={{ color: COLORS.textPrimary }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Sheet Modal Trigger Trigger */}
            <TouchableOpacity
              className="self-end py-2 mb-6"
              onPress={() => setIsModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text className="font-semibold text-xs tracking-wide" style={{ color: COLORS.textSecondary }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Submit Action Button */}
            <TouchableOpacity
              disabled={loading}
              onPress={handleLogin}
              className="rounded-2xl py-4.5 items-center justify-center shadow-sm"
              style={{
                backgroundColor: loading ? COLORS.inactive : COLORS.primary,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
              }}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} size="small" className="m-4"/>
              ) : (
                <Text className="text-white font-bold text-base m-4 tracking-wide">
                  Login
                </Text>
              )}
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ForgotPasswordModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};

export default Login;