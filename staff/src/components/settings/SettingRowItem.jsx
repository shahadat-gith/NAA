import React from "react";
import { Text, TouchableOpacity, View } from "react-native"
import { Ionicons } from "@expo/vector-icons";

export const SettingRowItem = ({ icon, title, description, onPress, colors, isLast }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between p-4"
    style={{ 
      borderBottomWidth: isLast ? 0 : 1,
      borderColor: colors.border
    }}
  >
    <View className="flex-row items-center flex-1 pr-4">
      <View 
        className="w-10 h-10 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: colors.background }}
      >
        <Ionicons name={icon} size={20} color={colors.textSecondary} />
      </View>
      <View className="flex-1">
        <Text className="font-bold text-sm" style={{ color: colors.textPrimary }}>
          {title}
        </Text>
        <Text className="text-xs mt-0.5" style={{ color: colors.textSecondary }} numberOfLines={1}>
          {description}
        </Text>
      </View>
    </View>
    <Ionicons name="chevron-forward" size={16} color={colors.inactive} />
  </TouchableOpacity>
);