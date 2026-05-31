import React from "react";
import { View, Text } from "react-native";


export const SummaryTile = ({ title, value, color, colors }) => (
  <View 
    className="flex-1 rounded-2xl p-2.5 items-center justify-center" 
    style={{ backgroundColor: colors.card, elevation: 2 }}
  >
    <Text className="text-base font-bold" style={{ color }}>
      {value}
    </Text>
    <Text className="text-[10px] font-medium mt-0.5" style={{ color: colors.textSecondary }}>
      {title}
    </Text>
  </View>
);
