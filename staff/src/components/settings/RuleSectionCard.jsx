import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

const RuleSectionCard = ({ title, icon, children, colors }) => (
  <View 
    className="rounded-3xl p-5 mb-4 border"
    style={{ backgroundColor: colors.card, borderColor: colors.border }}
  >
    <View className="flex-row items-center mb-3">
      <View 
        className="w-8 h-8 rounded-lg items-center justify-center mr-3"
        style={{ backgroundColor: colors.background }}
      >
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text className="font-bold text-base" style={{ color: colors.textPrimary }}>
        {title}
      </Text>
    </View>
    <Text className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
      {children}
    </Text>
  </View>
);

export default RuleSectionCard
