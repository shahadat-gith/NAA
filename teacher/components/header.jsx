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
import { COLORS } from "@/constants/theme";

const getHeaderTitle = (pathname) => {
  if (pathname.includes("attendance")) return "Attendance";
  if (pathname.includes("timetable")) return "Timetable";
  if (pathname.includes("profile")) return "Profile";
  if (pathname.includes("settings")) return "Settings";

  return "Dashboard";
};

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { teacher } = useContext(AppContext);

  const title = getHeaderTitle(pathname);
  const isHome = title === "Dashboard";

  const profileImage = teacher?.image?.url || teacher?.image || null;

  return (
    <View
      className="border-b px-4 py-4 flex-row items-center justify-between"
      style={{
        backgroundColor: COLORS.background,
        borderColor: COLORS.border,
      }}
    >
      <View className="w-11 items-start">
        {isHome ? (
          <Image
            source={require("@/assets/images/logo.png")}
            className="w-10 h-10"
            resizeMode="contain"
          />
        ) : (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
        )}
      </View>

      <Text
        numberOfLines={1}
        className="flex-1 text-center text-lg font-semibold"
        style={{
          color: COLORS.textPrimary,
        }}
      >
        {title}
      </Text>

      <TouchableOpacity
        className="w-11 h-11"
        onPress={() => router.push("/profile")}
      >
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require("@/assets/images/user.png")
          }
          className="w-11 h-11 rounded-full"
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;