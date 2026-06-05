import React from "react";
import { Text, TouchableOpacity } from "react-native"


export const ThemeOptionButton = ({ label, active, onPress, colors }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-1 rounded-xl py-2.5 items-center justify-center border"
    style={{
      backgroundColor: active ? colors.primary : colors.background,
      borderColor: active ? colors.primary : colors.border,
    }}
  >
    <Text 
      className="text-xs font-bold"
      style={{ color: active ? colors.white : colors.textPrimary }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);