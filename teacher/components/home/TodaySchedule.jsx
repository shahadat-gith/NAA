import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Feather from '@expo/vector-icons/Feather';

import { ThemeContext } from "@/context/ThemeProvider";

const emptyScheduleStructure = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
};

const TodaySchedule = ({ timetableData }) => {
  const { COLORS } = useContext(ThemeContext);

  const schedule = timetableData?.schedule || emptyScheduleStructure;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const todaySchedule = schedule?.[today] || [];

  return (
    <View 
      className="rounded-3xl p-5 mb-5" 
      style={{ backgroundColor: COLORS.card, elevation: 3 }}
    >
      {/* Widget Header Area */}
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text
            className="text-xl font-bold"
            style={{ color: COLORS.textPrimary }}
          >
            Today&apos;s Schedule
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
          <Feather name="arrow-up-right" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Dynamic Conditional Slots Listing */}
      {todaySchedule.length > 0 ? (
        <View>
          {todaySchedule.map((slot, index) => (
            <View
              key={index}
              className="rounded-2xl p-4 mb-3"
              style={{ backgroundColor: COLORS.background }}
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
                    className="mt-1 text-xs"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Class {slot.class || "N/A"} • {slot.medium || "N/A"}
                  </Text>
                </View>

                {/* Time Indicator Frame */}
                <View className="flex-row items-center">
                  <Ionicons
                    name="time-outline"
                    size={17}
                    color={COLORS.primary}
                  />

                  <Text
                    className="ml-1 font-semibold text-sm"
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
        /* Empty Schedule Fallback State */
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
            className="text-center mt-1 px-4 text-xs"
            style={{ color: COLORS.textSecondary }}
          >
            You do not have any scheduled classes for {today}.
          </Text>
        </View>
      )}
    </View>
  );
};

export default TodaySchedule;