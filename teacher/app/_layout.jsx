import { Stack, usePathname } from "expo-router";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useContext } from "react";

import "../global.css";

import AppProvider from "@/context/AppProvider";
import Header from "@/components/header";
import ScreenLoader from "@/components/ScreenLoader";
import { AppContext } from "@/context/AppContext";
import { COLORS } from "@/constants/theme";

function LayoutContent() {
  const pathname = usePathname();

  const { teacher, sessionChecking } =
    useContext(AppContext);

  const isAuthScreen = pathname.includes("login");


  if (sessionChecking) {
    return (
      <ScreenLoader text="Checking your session..." />
    );
  }

  return (
    <>
      {!isAuthScreen && teacher && (
          <Header />
        )
      }

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <SafeAreaProvider>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: COLORS.background,
          }}
          edges={["top", "left", "right"]}
        >
          <StatusBar
            style="dark"
            backgroundColor={COLORS.background}
          />

          <LayoutContent />
        </SafeAreaView>
      </SafeAreaProvider>
    </AppProvider>
  );
}