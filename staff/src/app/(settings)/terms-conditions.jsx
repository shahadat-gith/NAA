import React, { useContext } from "react";
import { ScrollView, View, Text } from "react-native";

import AnimatedScreen from "@/components/common/AnimatedScreen";
import { ThemeContext } from "@/context/ThemeProvider";

const TermsConditions = () => {
  const { COLORS } = useContext(ThemeContext);

  return (
    <AnimatedScreen>
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: COLORS.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        <View 
          className="rounded-3xl p-5 border"
          style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
        >
          <Text className="text-xs font-bold mb-1" style={{ color: COLORS.inactive }}>
            Last Updated: May 2026
          </Text>
          <Text className="text-xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>
            Terms of Service
          </Text>

          <Text className="text-sm font-semibold mb-2 mt-4" style={{ color: COLORS.textPrimary }}>
            1. Account Security
          </Text>
          <Text className="text-sm leading-relaxed mb-4" style={{ color: COLORS.textSecondary }}>
            Faculty portal credentials are strictly for individual educational use. Sharing accounts, tokens, or session tokens across devices to forge attendance actions is strictly monitored and flagged.
          </Text>

          <Text className="text-sm font-semibold mb-2 mt-2" style={{ color: COLORS.textPrimary }}>
            2. Database Integrity
          </Text>
          <Text className="text-sm leading-relaxed mb-4" style={{ color: COLORS.textSecondary }}>
            All entries updated via the timetable manager or the attendance checking logs are recorded directly to the core network endpoint. Tampering with payload attributes or network parameters will trigger automatic account locks.
          </Text>

          <Text className="text-sm font-semibold mb-2 mt-2" style={{ color: COLORS.textPrimary }}>
            3. Operational Usage Limits
          </Text>
          <Text className="text-sm leading-relaxed" style={{ color: COLORS.textSecondary }}>
            Nashib Ali Academy preserves the right to alter features, update portal data schemas, or apply temporary security boundaries to optimize teacher-portal communication stability.
          </Text>
        </View>
      </ScrollView>
    </AnimatedScreen>
  );
};

export default TermsConditions;