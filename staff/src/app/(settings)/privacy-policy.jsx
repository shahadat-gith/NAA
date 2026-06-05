import React, { useContext } from "react";
import { ScrollView, View, Text } from "react-native";

import AnimatedScreen from "@/components/common/AnimatedScreen";
import PrivacyRowItem from "@/components/settings/PrivacyRowItem";
import { ThemeContext } from "@/context/ThemeProvider";

const PrivacyPolicy = () => {
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
          <Text className="text-xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>
            Data Privacy & Protection
          </Text>
          <Text className="text-xs mb-5 font-medium" style={{ color: COLORS.textSecondary }}>
            Nashib Ali Academy secure transmission framework policy overview.
          </Text>

          {/* Policy Point Row 1 */}
          <PrivacyRowItem icon="lock-closed" title="Encryption Architecture" colors={COLORS}>
            Authentication vectors, secure storage cookies, and teacher identity keys are verified via AES-256 state partitions when traveling over endpoints.
          </PrivacyRowItem>

          {/* Policy Point Row 2 */}
          <PrivacyRowItem icon="scan" title="Scanner Telemetry Data" colors={COLORS}>
            Camera processing parameters run strictly inside the sandbox component space. Token parameters read during live QR tracking are processed on-the-fly and never persisted outside official logs.
          </PrivacyRowItem>

          {/* Policy Point Row 3 */}
          <PrivacyRowItem icon="server" title="Storage Standards" colors={COLORS}>
            Your address coordinates, institutional identifiers, and personal summaries reside securely inside sandboxed databases, insulated completely from any third-party advertising layers.
          </PrivacyRowItem>
        </View>
      </ScrollView>
    </AnimatedScreen>
  );
};

export default PrivacyPolicy;