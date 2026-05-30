import React, { useContext, useEffect } from "react";

import { router } from "expo-router";

import { AppContext } from "@/context/AppContext";
import ScreenLoader from "@/components/common/ScreenLoader";

export default function Index() {
  const { teacher, sessionChecking } = useContext(AppContext);

  useEffect(() => {
    if (sessionChecking) return;

    if (teacher) {
      router.replace("/(tabs)");
    } else {
      router.replace("/login");
    }
  }, [teacher, sessionChecking]);

  return <ScreenLoader text="Checking your session..." />;
}
