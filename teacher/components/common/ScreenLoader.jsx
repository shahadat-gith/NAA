import React, { useContext } from "react";
import { View, ActivityIndicator, Text } from "react-native";

import { ThemeContext } from "@/context/ThemeProvider";

const ScreenLoader = ({ text = "Loading...", backgroundColor }) => {
  const { COLORS } = useContext(ThemeContext);

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: backgroundColor || COLORS.background }}
    >
      <ActivityIndicator size="large" color={COLORS.primary} />

      <Text
        className="mt-4 text-base font-medium"
        style={{ color: COLORS.textSecondary }}
      >
        {text}
      </Text>
    </View>
  );
};

export default ScreenLoader;