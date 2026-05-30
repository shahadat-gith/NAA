import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

const TodaySchedule = ({ timetableData }) => {
  const schedule = timetableData?.schedule || emptyScheduleStructure;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const todaySchedule = schedule?.[today] || [];

  return (
    <View className="bg-card rounded-3xl p-5 mb-5" style={{ elevation: 3 }}>
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text
            className="text-xl font-bold"
            style={{ color: COLORS.textPrimary }}
          >
            Today's Schedule
          </Text>

          <Text className="mt-1" style={{ color: COLORS.textSecondary }}>
            {today} • {todaySchedule.length} classes today
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/timetable")}
          className="w-11 h-11 rounded-2xl items-center justify-center"
          style={{ backgroundColor: COLORS.primary }}
        >
          <Ionicons name="create-outline" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {todaySchedule.length > 0 ? (
        <View>
          {todaySchedule.map((slot, index) => (
            <View
              key={index}
              className="bg-background rounded-2xl p-4 mb-3"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text
                    className="text-base font-bold"
                    style={{ color: COLORS.textPrimary }}
                  >
                    {slot.subject || "Subject"}
                  </Text>

                  <Text
                    className="mt-1"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Class {slot.class || "N/A"} • {slot.medium || "N/A"}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Ionicons
                    name="time-outline"
                    size={17}
                    color={COLORS.primary}
                  />

                  <Text
                    className="ml-1 font-semibold"
                    style={{ color: COLORS.primary }}
                  >
                    {slot.timeSlot || "N/A"}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className="items-center py-8">
          <Ionicons
            name="calendar-clear-outline"
            size={42}
            color={COLORS.textSecondary}
          />

          <Text
            className="text-lg font-bold mt-3"
            style={{ color: COLORS.textPrimary }}
          >
            No Classes Today
          </Text>

          <Text
            className="text-center mt-1"
            style={{ color: COLORS.textSecondary }}
          >
            You do not have any scheduled classes for {today}.
          </Text>
        </View>
      )}
    </View>
  );
};

export default TodaySchedule