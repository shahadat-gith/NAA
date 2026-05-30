import React, { useContext } from "react";
import { View, Text } from "react-native";

import { ThemeContext } from "@/context/ThemeProvider";

const InfoField = ({ label, value, highlight }) => {
  const { COLORS } = useContext(ThemeContext);

  return (
    <View
      className="rounded-2xl px-4 py-3 mb-3"
      style={{ backgroundColor: COLORS.background }}
    >
      <Text
        className="text-xs font-medium mb-1"
        style={{ color: COLORS.textSecondary }}
      >
        {label}
      </Text>

      <Text
        className="text-base font-semibold"
        style={{
          color: highlight ? COLORS.primary : COLORS.textPrimary,
        }}
      >
        {value || "N/A"}
      </Text>
    </View>
  );
};

export default InfoField;