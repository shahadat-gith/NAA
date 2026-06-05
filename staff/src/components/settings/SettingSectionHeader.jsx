import React from "react";
import { Text } from "react-native"

export const SettingSectionHeader = ({ title, colors }) => (
  <Text 
    className="text-xs font-bold uppercase tracking-wider pl-1 mb-2 ml-1"
    style={{ color: colors.textSecondary }}
  >
    {title}
  </Text>
);
