import { router } from "expo-router";
import React, { useContext, useEffect } from "react";

import ScreenLoader from "@/components/common/ScreenLoader";
import { AppContext } from "@/context/AppContext";

export default function Index() {
  const { staff, sessionChecking } = useContext(AppContext);

  useEffect(() => {
    if (sessionChecking) return;

    if (staff) {
      router.replace("/(tabs)");
    } else {
      router.replace("/login");
    }
  }, [staff, sessionChecking]);

  return <ScreenLoader text="Checking your session..." />;
}
