import { ThemeContext } from "@/context/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import React, { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const DayScheduleCard = ({ day, schedules = [], onEdit }) => {
  const { COLORS } = useContext(ThemeContext);

  return (
    <View
      className="rounded-3xl p-5 mb-5"
      style={{ backgroundColor: COLORS.card, elevation: 3 }}
    >
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xl font-bold" style={{ color: COLORS.primary }}>
          {day}
        </Text>

        <TouchableOpacity
          onPress={onEdit}
          className="w-11 h-11 rounded-2xl items-center justify-center border"
          style={{
            backgroundColor: COLORS.background,
            borderColor: COLORS.border,
          }}
          activeOpacity={0.7}
        >
          <Feather name="edit" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {schedules?.length === 0 ? (
        <View
          className="rounded-2xl p-4 items-center"
          style={{ backgroundColor: COLORS.background }}
        >
          <Ionicons
            name="calendar-clear-outline"
            size={30}
            color={COLORS.textSecondary}
          />
          <Text
            className="mt-2 text-xs"
            style={{ color: COLORS.textSecondary }}
          >
            No classes scheduled for this day
          </Text>
        </View>
      ) : (
        schedules.map((item, index) => (
          <View
            key={index}
            className="rounded-2xl p-4 mb-3"
            style={{ backgroundColor: COLORS.background }}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text
                  className="text-base font-bold"
                  style={{ color: COLORS.textPrimary }}
                >
                  {item.subject || "Subject"}
                </Text>

                <Text
                  className="mt-1 text-xs capitalize"
                  style={{ color: COLORS.textSecondary }}
                >
                  Class {item.class || "N/A"} • {item.medium || "N/A"} Medium
                  {item.stream ? ` • ${item.stream} Stream` : ""}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons
                  name="time-outline"
                  size={17}
                  color={COLORS.primary}
                />
                <Text
                  className="ml-1 text-xs font-semibold"
                  style={{ color: COLORS.primary }}
                >
                  {item.timeSlot || "N/A"}
                </Text>
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );
};

export default DayScheduleCard;
