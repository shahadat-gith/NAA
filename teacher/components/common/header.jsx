import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";

import { AppContext } from "@/context/AppContext";
import { ThemeContext } from "@/context/ThemeProvider";

const getHeaderTitle = (pathname) => {
  // Explicit matching for precise settings sub-routes
  if (pathname.includes("change-password")) return "Change Password";
  if (pathname.includes("academic-rules")) return "Academic Rules";
  if (pathname.includes("terms-conditions")) return "Terms & Conditions";
  if (pathname.includes("privacy-policy")) return "Privacy Policy";
  
  // Base core module level route tracking definitions
  if (pathname.includes("attendance")) return "Attendance";
  if (pathname.includes("timetable")) return "Timetable";
  if (pathname.includes("profile")) return "Profile";
  if (pathname.includes("developer")) return "Developer Information";
  if (pathname.includes("settings")) return "Settings";

  return "Dashboard";
};

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { teacher } = useContext(AppContext);
  const { COLORS } = useContext(ThemeContext);

  const title = getHeaderTitle(pathname);
  
  // Array defining all primary bottom-tab navigation root paths
  const ROOT_TABS = ["Dashboard", "Attendance", "Timetable", "Settings"];
  
  // If the active title matches any element in the array, it's treated as a root tab view
  const isRootTab = ROOT_TABS.includes(title);

  const profileImage = teacher?.image?.url || teacher?.image || null;

  return (
    <View
      className="border-b px-4 py-4 flex-row items-center justify-between"
      style={{
        backgroundColor: COLORS.card, // Perfectly uniform color matching the SafeArea top edge block
        borderColor: COLORS.border,
      }}
    >
      {/* Left Action Box (Logo for Tabs or Back Arrow for Sub-routes) */}
      <View className="w-11 items-start justify-center">
        {isRootTab ? (
          <Image
            source={require("@/assets/images/logo.png")}
            className="w-10 h-10"
            resizeMode="contain"
          />
        ) : (
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full border items-center justify-center"
            style={{
              backgroundColor: COLORS.background,
              borderColor: COLORS.border
            }}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={COLORS.textPrimary}
              style={{ marginRight: 1 }}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Screen Title */}
      <Text
        numberOfLines={1}
        className="flex-1 text-center text-lg font-semibold"
        style={{
          color: COLORS.textPrimary,
        }}
      >
        {title}
      </Text>

      {/* Right User Avatar Action Trigger */}
      <TouchableOpacity
        className="w-11 h-11"
        onPress={() => router.push("/profile")}
      >
        <Image
          source={profileImage ? { uri: profileImage } : require("@/assets/images/user.png")}
          className="w-11 h-11 rounded-full"
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;