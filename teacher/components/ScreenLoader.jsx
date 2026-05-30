import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

import { COLORS } from "@/constants/theme";

const ScreenLoader = ({ text = "Loading..." }) => {
  return (
    <View
      className="flex-1 items-center justify-center bg-background"
      style={{ backgroundColor: COLORS.background }}
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