import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "@/constants/theme";

const tabs = [
  {
    name: "index",
    title: "Home",
    icon: "home-outline",
    activeIcon: "home",
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
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "none",
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
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
