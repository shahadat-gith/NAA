import React, { useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

import AnimatedScreen from "@/components/common/AnimatedScreen";

import { ThemeOptionButton } from "@/components/settings/ThemeOptionButton";
import { SettingSectionHeader } from "@/components/settings/SettingSectionHeader";
import { SettingRowItem } from "@/components/settings/SettingRowItem";
import { AppContext } from "@/context/AppContext";
import { ThemeContext } from "@/context/ThemeProvider";

const Settings = () => {
  const { setTeacher } = useContext(AppContext);
  const { COLORS, themeMode, updateThemeMode, activeTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out of your session?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("teacher-token");
          setTeacher(null);
          router.push("/(auth)/login")
        },
      },
    ]);
  };

  const toggleThemeSwitch = (isDarkIntent) => {
    updateThemeMode(isDarkIntent ? "dark" : "light");
  };

  return (
    <AnimatedScreen>
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: COLORS.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        {/* SECTION 1: Appearance & Display options */}
        <SettingSectionHeader title="Appearance & Display" colors={COLORS} />
        
        <View 
          className="rounded-3xl p-4 mb-6 border"
          style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
        >
          {/* Quick Toggle Row */}
          <View className="flex-row items-center justify-between pb-4 border-b" style={{ borderColor: COLORS.border }}>
            <View className="flex-row items-center flex-1 pr-4">
              <View 
                className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: activeTheme === "dark" ? "rgba(255, 107, 74, 0.15)" : "rgba(255, 77, 45, 0.1)" }}
              >
                <Ionicons 
                  name={activeTheme === "dark" ? "moon-outline" : "sunny-outline"} 
                  size={20} 
                  color={COLORS.primary} 
                />
              </View>
              <View>
                <Text className="font-bold text-sm" style={{ color: COLORS.textPrimary }}>
                  Dark Mode
                </Text>
                <Text className="text-xs mt-0.5" style={{ color: COLORS.textSecondary }}>
                  Current: {themeMode === "system" ? "System Sync" : activeTheme === "dark" ? "Dark" : "Light"}
                </Text>
              </View>
            </View>
            <Switch
              value={activeTheme === "dark"}
              onValueChange={toggleThemeSwitch}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={Platform.OS === "android" ? COLORS.white : undefined}
            />
          </View>

          {/* Explicit Preference Selector Row */}
          <View className="pt-4">
            <Text className="text-xs font-semibold mb-3" style={{ color: COLORS.textSecondary }}>
              Theme Preference Mode
            </Text>
            <View className="flex-row gap-2">
              <ThemeOptionButton 
                label="System" 
                active={themeMode === "system"} 
                onPress={() => updateThemeMode("system")}
                colors={COLORS}
              />
              <ThemeOptionButton 
                label="Light Only" 
                active={themeMode === "light"} 
                onPress={() => updateThemeMode("light")}
                colors={COLORS}
              />
              <ThemeOptionButton 
                label="Dark Only" 
                active={themeMode === "dark"} 
                onPress={() => updateThemeMode("dark")}
                colors={COLORS}
              />
            </View>
          </View>
        </View>

        {/* SECTION 2: Security Settings */}
        <SettingSectionHeader title="Security" colors={COLORS} />
        <View 
          className="rounded-3xl overflow-hidden mb-6 border"
          style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
        >
          <SettingRowItem
            icon="key-outline"
            title="Change Password"
            description="Update your security credentials regularly"
            onPress={() => router.push("/change-password")}
            colors={COLORS}
            isLast
          />
        </View>

        {/* SECTION 3: Institutional Protocols & Legal Guidelines */}
        <SettingSectionHeader title="Academy Information" colors={COLORS} />
        <View 
          className="rounded-3xl overflow-hidden mb-6 border"
          style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
        >
          <SettingRowItem
            icon="book-outline"
            title="Academic Rules"
            description="Institutional guidelines, rules, and teaching grading parameters"
            onPress={() => router.push("/academic-rules")}
            colors={COLORS}
          />
          <SettingRowItem
            icon="document-text-outline"
            title="Terms & Conditions"
            description="Operational usage parameters and standard service conditions"
            onPress={() => router.push("/terms-conditions")}
            colors={COLORS}
          />
          <SettingRowItem
            icon="shield-checkmark-outline"
            title="Privacy Policy"
            description="Data footprint protection protocols and teacher security frameworks"
            onPress={() => router.push("/privacy-policy")}
            colors={COLORS}
            isLast
          />
        </View>

        {/* SECTION 4: System Exit Actions */}
        <SettingSectionHeader title="Session Management" colors={COLORS} />
        <TouchableOpacity
          onPress={handleLogout}
          className="rounded-2xl py-4 flex-row items-center justify-center border"
          style={{ backgroundColor: COLORS.card, borderColor: COLORS.danger }}
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          <Text className="font-bold ml-2 text-base" style={{ color: COLORS.danger }}>
            Log Out Account
          </Text>
        </TouchableOpacity>

        {/* Footprint Metadata Brand Details */}
        <View className="items-center justify-center mt-10">
          <Text className="text-xs font-medium" style={{ color: COLORS.textSecondary }}>
            Nashib Ali Academy • Teacher Portal
          </Text>
          <Text className="text-[10px] mt-1" style={{ color: COLORS.inactive }}>
            v1.0.0 • Stable Production Engine Build
          </Text>
        </View>
      </ScrollView>
    </AnimatedScreen>
  );
};

export default Settings;