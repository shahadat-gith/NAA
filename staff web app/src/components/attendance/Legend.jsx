import React from "react";
import { Text, View } from "react-native";

export const Legend = ({ color, text, colors }) => (
  <View className="flex-row items-center">
    <View
      className="w-3 h-3 rounded-full mr-2 border"
      style={{ backgroundColor: color, borderColor: colors.border }}
    />
    <Text
      className="text-xs font-medium"
      style={{ color: colors.textSecondary }}
    >
      {text}
    </Text>
  </View>
);
