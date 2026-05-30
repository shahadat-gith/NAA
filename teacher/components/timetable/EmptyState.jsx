import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "@/context/ThemeProvider";

const EmptyState = ({ onPress }) => {
  const { COLORS } = useContext(ThemeContext);

  return (
    <View 
      className="rounded-3xl p-8 items-center" 
      style={{ backgroundColor: COLORS.card, elevation: 3 }}
    >
      {/* Icon Frame Wrapper */}
      <View 
        className="w-20 h-20 rounded-full items-center justify-center mb-4"
        style={{ backgroundColor: COLORS.background }}
      >
        <Ionicons
          name="calendar-clear-outline"
          size={40}
          color={COLORS.textSecondary}
        />
      </View>

      {/* Main Header Descriptor */}
      <Text
        className="text-xl font-bold text-center"
        style={{ color: COLORS.textPrimary }}
      >
        No Schedule Assigned
      </Text>

      {/* Auxiliary Context Text */}
      <Text
        className="text-center mt-2 mb-5 text-sm"
        style={{ color: COLORS.textSecondary }}
      >
        Your institutional teaching profile has no assigned classes for this block.
      </Text>

      {/* Action CTA Button */}
      <TouchableOpacity
        onPress={onPress}
        className="px-5 py-3 rounded-2xl"
        style={{ backgroundColor: COLORS.primary }}
      >
        <Text className="text-white font-semibold">
          Initialize Schedule
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyState;