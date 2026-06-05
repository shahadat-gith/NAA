import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

const PrivacyRowItem = ({ icon, title, children, colors }) => (
  <View className="mb-5 flex-row items-start">
    <View 
      className="w-9 h-9 rounded-xl items-center justify-center mr-4 mt-0.5"
      style={{ backgroundColor: colors.background }}
    >
      <Ionicons name={icon} size={18} color={colors.primary} />
    </View>
    <View className="flex-1">
      <Text className="font-bold text-sm mb-1" style={{ color: colors.textPrimary }}>
        {title}
      </Text>
      <Text className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
        {children}
      </Text>
    </View>
  </View>
);

export default PrivacyRowItem