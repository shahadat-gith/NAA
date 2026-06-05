import React, { useContext } from "react";
import { ScrollView, Text } from "react-native";

import AnimatedScreen from "@/components/common/AnimatedScreen";
import RuleSectionCard from "@/components/settings/RuleSectionCard";
import { ThemeContext } from "@/context/ThemeProvider";

const AcademicRules = () => {
  const { COLORS } = useContext(ThemeContext);

  return (
    <AnimatedScreen>
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: COLORS.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        <Text className="text-xs font-bold uppercase tracking-wider pl-1 mb-3" style={{ color: COLORS.textSecondary }}>
          Institutional Framework
        </Text>

        {/* Rule Blocks Layout */}
        <RuleSectionCard title="1. Attendance & Timings" icon="time-outline" colors={COLORS}>
          • Faculty must track attendance using their designated portal interface within the initial 10 minutes of classes.{"\n\n"}
          • Late arrivals or scheduling conflicts must be communicated to the administration ahead of session block indicators.
        </RuleSectionCard>

        <RuleSectionCard title="2. Curriculum Delivery" icon="book-outline" colors={COLORS}>
          • Syllabus pathways should match the institutional timeline targets set for each active academic period.{"\n\n"}
          • Any unexpected deviations or extra revision slots must be updated within the central scheduling panel.
        </RuleSectionCard>

        <RuleSectionCard title="3. Grading & Evaluation" icon="ribbon-outline" colors={COLORS}>
          • Internal evaluations, practical assignments, and marks submissions should occur cleanly within standard cutoff dates.{"\n\n"}
          • Faculty are requested to keep records completely clear and auditable for subsequent validation sweeps.
        </RuleSectionCard>
      </ScrollView>
    </AnimatedScreen>
  );
};

export default AcademicRules;