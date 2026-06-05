import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useContext } from "react";
import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import "../global.css";

import Header from "@/components/common/header";
import ScreenLoader from "@/components/common/ScreenLoader";
import { AppContext } from "@/context/AppContext";
import AppProvider from "@/context/AppProvider";
import { ThemeContext, ThemeProvider } from "@/context/ThemeProvider";

function LayoutContent() {
  const pathname = usePathname();
  const { staff, sessionChecking } = useContext(AppContext);
  const { COLORS, activeTheme } = useContext(ThemeContext);

  const isAuthScreen = pathname.includes("login");

  const topBarSurfaceColor =
    !isAuthScreen && staff && !sessionChecking
      ? COLORS.card
      : COLORS.background;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: topBarSurfaceColor,
      }}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        style={activeTheme === "dark" ? "light" : "dark"}
        backgroundColor={topBarSurfaceColor}
      />

      {sessionChecking ? (
        <ScreenLoader
          text="Checking your session..."
          backgroundColor={COLORS.background}
        />
      ) : (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
          {!isAuthScreen && staff && <Header />}

          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: COLORS.background },
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <ThemeProvider>
        <SafeAreaProvider>
          <LayoutContent />
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
