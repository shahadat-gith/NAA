import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeProvider";

const tabs = [
  {
    name: "index",
    title: "Dashboard",
    icon: "grid-outline",
    activeIcon: "grid",
  },
  {
    name: "attendance",
    title: "Attendance",
    icon: "calendar-outline",
    activeIcon: "calendar",
  },
  {
    name: "timetable",
    title: "Timetable",
    icon: "time-outline",
    activeIcon: "time",
  },
  {
    name: "settings",
    title: "Settings",
    icon: "settings-outline",
    activeIcon: "settings",
  },
];

export default function TabLayout() {
  const { COLORS } = useContext(ThemeContext);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "none",
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          position: "absolute",
          bottom: Platform.OS === "ios" ? 28 : 16,
          left: 16,
          right: 16,
          
          // ── GEOMETRY STYLE DEFINITIONS ──
          backgroundColor: COLORS.card,
          borderRadius: 100,
          height: 68,
          borderTopWidth: 0,
          marginRight: 9,
          marginLeft:9,
          
          // ── PREMIUM SHADOW ELEVATION MATRIX ──
          ...Platform.select({
            ios: {
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
            },
            android: {
              elevation: 6,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginBottom: 8, // Slides text labels neatly up from the card borders
        },
        tabBarIconStyle: {
          marginTop: 6, // Centers icons perfectly relative to labels
        }
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
                size={size - 1} // Slightly compressed diameter layout scale matches minimal visual tones
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}