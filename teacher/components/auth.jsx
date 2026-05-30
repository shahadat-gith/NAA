import React, { useContext, useEffect } from "react";
import { router } from "expo-router";

import { AppContext } from "@/context/AppContext";
import ScreenLoader from "@/components/ScreenLoader";

const AuthGate = () => {
  const { teacher, sessionChecking } = useContext(AppContext);

  useEffect(() => {
    if (sessionChecking) return;

    if (teacher) {
      router.replace("/(tabs)");
    } else {
      router.replace("/login");
    }
  }, [teacher, sessionChecking]);

  return (
    <ScreenLoader text="Checking your session..." />
  );
};

export default AuthGate;