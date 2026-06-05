import React, { useContext } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";

import { AppContext } from "@/context/AppContext";
import { ThemeContext } from "@/context/ThemeProvider";

const getHeaderTitle = (pathname) => {
  if (pathname.includes("change-password")) return "Change Password";
  if (pathname.includes("academic-rules")) return "Academic Rules";
  if (pathname.includes("terms-conditions")) return "Terms & Conditions";
  if (pathname.includes("privacy-policy")) return "Privacy Policy";
  if (pathname.includes("profile-edit")) return "Edit Your Profile";

  // Generic matching states fall back lower down the loop hierarchy safely
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

  const { staff } = useContext(AppContext);
  const { COLORS } = useContext(ThemeContext);

  const title = getHeaderTitle(pathname);
  const ROOT_TABS = ["Dashboard", "Attendance", "Timetable", "Settings"];
  const isRootTab = ROOT_TABS.includes(title);

  const profileImage =
    staff?.image?.url ||
    (typeof staff?.image === "string" ? staff.image : null);

  return (
    <View
      className="border-b px-4 py-4 flex-row items-center justify-between"
      style={{
        backgroundColor: COLORS.card,
        borderColor: COLORS.border,
      }}
    >
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
              borderColor: COLORS.border,
            }}
            activeOpacity={0.7}
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

      <Text
        numberOfLines={1}
        className="flex-1 text-center text-lg font-semibold mx-2"
        style={{ color: COLORS.textPrimary }}
      >
        {title}
      </Text>

      {/* 🌟 USER PROFILE AVATAR TRIGGER */}
      <TouchableOpacity
        className="w-11 h-11"
        onPress={() => {
          // Only redirect if we are not already explicitly staying on the profile page
          if (!pathname.endsWith("/profile")) {
            router.push("/profile");
          }
        }}
        activeOpacity={0.8}
      >
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require("@/assets/images/user.png")
          }
          className="w-11 h-11 rounded-full bg-neutral-200"
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;