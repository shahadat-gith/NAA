import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useContext } from "react";
import { View } from "react-native";

import { ThemeContext } from "@/context/ThemeProvider";

export default function AuthLayout() {
   const { COLORS, activeTheme } = useContext(ThemeContext);

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <StatusBar
        style={activeTheme === "dark" ? "light" : "dark"}
        backgroundColor={COLORS.card }
      />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </View>
  );
}
