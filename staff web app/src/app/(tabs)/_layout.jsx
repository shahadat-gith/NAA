import { tabs } from "@/constants/tabs";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

import { ThemeContext } from "@/context/ThemeProvider";
import { useContext } from "react";

export default function TabLayout() {
  const { COLORS } = useContext(ThemeContext);

  // Define platform-specific heights to account for system navigation properties
  const tabBarHeight = Platform.select({
    ios: 88,
    android: 120,
    default: 64,
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "none",
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,

        // ── NATIVE DOCK WITH SYSTEM NAV BUFFER ──
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: tabBarHeight,

          // Layout Distribution Matrix
          paddingTop: 8,
          paddingBottom: Platform.OS === "android" ? 22 : 0, // Pushes buttons/labels safely upwards on Android

          // Native Elevation Shadow Matrix
          elevation: 8,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          // Eliminates conflicts with the container's bottom padding parameters
          marginBottom: Platform.OS === "ios" ? 0 : 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons
                name={focused ? tab.activeIcon : tab.icon}
                size={size}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
