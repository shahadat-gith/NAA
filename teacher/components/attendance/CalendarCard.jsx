import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "@/constants/theme";

const CalendarCard = ({
  history = [],
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      onMonthChange(11);
      onYearChange(selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      onMonthChange(0);
      onYearChange(selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1);
    }
  };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);

  const attendanceMap = history.reduce((acc, item) => {
    if (item.date) {
      acc[item.date.split("T")[0]] = item.status;
    }
    return acc;
  }, {});

  const presentCount = history.filter((item) => item.status === "Present").length;
  const absentCount = history.filter((item) => item.status === "Absent").length;
  const onLeaveCount = history.filter((item) => item.status === "On-Leave").length;

  const activeTrackedDays = presentCount + absentCount + onLeaveCount;
  const attendancePercentage = activeTrackedDays
    ? Math.round((presentCount / activeTrackedDays) * 100)
    : 0;

  return (
    <View className="mb-5">
      <View className="flex-row gap-2 mb-4">
        <SummaryTile title="Present" value={presentCount} color="#16a34a" />
        <SummaryTile title="Leave" value={onLeaveCount} color="#ca8a04" />
        <SummaryTile title="Absent" value={absentCount} color="#dc2626" />
        <SummaryTile title="Rate" value={`${attendancePercentage}%`} color={COLORS.primary} />
      </View>

      <View className="bg-card rounded-3xl p-5" style={{ elevation: 3 }}>
        <View className="flex-row items-center justify-between mb-5">
          <TouchableOpacity
            onPress={handlePrevMonth}
            className="w-10 h-10 rounded-xl items-center justify-center bg-background"
          >
            <Ionicons name="chevron-back" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="text-lg font-bold" style={{ color: COLORS.textPrimary }}>
              {monthNames[selectedMonth]} {selectedYear}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleNextMonth}
            className="w-10 h-10 rounded-xl items-center justify-center bg-background"
          >
            <Ionicons name="chevron-forward" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <View key={day} style={{ width: `${100 / 7}%` }} className="items-center mb-3">
              <Text
                className="text-xs font-bold"
                style={{ color: day === "Sun" ? "#ef4444" : COLORS.textSecondary }}
              >
                {day}
              </Text>
            </View>
          ))}

          {Array.from({ length: firstDay }).map((_, index) => (
            <View key={`empty-${index}`} style={{ width: `${100 / 7}%` }} className="h-10 mb-2" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const status = attendanceMap[dateStr];
            const isSunday = new Date(selectedYear, selectedMonth, day).getDay() === 0;

            const bg =
              status === "Present"
                ? "#dcfce7"
                : status === "Absent"
                ? "#fee2e2"
                : status === "On-Leave"
                ? "#fef9c3"
                : isSunday
                ? "#f3f4f6"
                : COLORS.background;

            const color =
              status === "Present"
                ? "#166534"
                : status === "Absent"
                ? "#991b1b"
                : status === "On-Leave"
                ? "#854d0e"
                : isSunday
                ? "#6b7280"
                : COLORS.textPrimary;

            return (
              <View
                key={day}
                style={{ width: `${100 / 7}%` }}
                className="items-center mb-2"
              >
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center"
                  style={{ backgroundColor: bg }}
                >
                  <Text className="font-semibold" style={{ color }}>
                    {day}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View className="flex-row flex-wrap mt-4 gap-3">
          <Legend color="#16a34a" text="Present" />
          <Legend color="#ca8a04" text="On Leave" />
          <Legend color="#dc2626" text="Absent" />
          <Legend color="#9ca3af" text="Sunday" />
        </View>
      </View>
    </View>
  );
};

const SummaryTile = ({ title, value, color }) => (
  <View className="flex-1 bg-card rounded-2xl p-3 items-center" style={{ elevation: 2 }}>
    <Text className="text-xl font-bold" style={{ color }}>
      {value}
    </Text>
    <Text className="text-xs mt-1" style={{ color: COLORS.textSecondary }}>
      {title}
    </Text>
  </View>
);

const Legend = ({ color, text }) => (
  <View className="flex-row items-center">
    <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }} />
    <Text className="text-xs" style={{ color: COLORS.textSecondary }}>
      {text}
    </Text>
  </View>
);

export default CalendarCard;