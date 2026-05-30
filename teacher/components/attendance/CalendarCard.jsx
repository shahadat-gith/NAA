import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemeContext } from "@/context/ThemeProvider";

const CalendarCard = ({
  history = [],
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}) => {
  const { COLORS } = useContext(ThemeContext);

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
      {/* Top Indicators Row */}
      <View className="flex-row gap-2 mb-4">
        <SummaryTile title="Present" value={presentCount} color={COLORS.success} colors={COLORS} />
        <SummaryTile title="Leave" value={onLeaveCount} color="#ca8a04" colors={COLORS} />
        <SummaryTile title="Absent" value={absentCount} color={COLORS.danger} colors={COLORS} />
        <SummaryTile title="Rate" value={`${attendancePercentage}%`} color={COLORS.primary} colors={COLORS} />
      </View>

      {/* Main Grid Wrapper */}
      <View 
        className="rounded-3xl p-5" 
        style={{ backgroundColor: COLORS.card, elevation: 3 }}
      >
        {/* Navigation Selector Row */}
        <View className="flex-row items-center justify-between mb-5">
          <TouchableOpacity
            onPress={handlePrevMonth}
            className="w-10 h-10 rounded-xl items-center justify-center"
            style={{ backgroundColor: COLORS.background }}
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
            className="w-10 h-10 rounded-xl items-center justify-center"
            style={{ backgroundColor: COLORS.background }}
          >
            <Ionicons name="chevron-forward" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Days Header Strings */}
        <View className="flex-row flex-wrap">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <View key={day} style={{ width: `${100 / 7}%` }} className="items-center mb-3">
              <Text
                className="text-xs font-bold"
                style={{ color: day === "Sun" ? COLORS.danger : COLORS.textSecondary }}
              >
                {day}
              </Text>
            </View>
          ))}

          {/* Offsetting Pre-month padding slots */}
          {Array.from({ length: firstDay }).map((_, index) => (
            <View key={`empty-${index}`} style={{ width: `${100 / 7}%` }} className="h-10 mb-2" />
          ))}

          {/* Day Grid Loop */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const status = attendanceMap[dateStr];
            const isSunday = new Date(selectedYear, selectedMonth, day).getDay() === 0;

            // Soft-contrast alphas computed safely for light and dark environments
            let bg = COLORS.background;
            let textColor = COLORS.textPrimary;

            if (status === "Present") {
              bg = status === "Present" && COLORS.card === "#ffffff" ? "#dcfce7" : "rgba(22, 163, 74, 0.2)";
              textColor = COLORS.success;
            } else if (status === "Absent") {
              bg = COLORS.card === "#ffffff" ? "#fee2e2" : "rgba(239, 68, 68, 0.2)";
              textColor = COLORS.danger;
            } else if (status === "On-Leave") {
              bg = COLORS.card === "#ffffff" ? "#fef9c3" : "rgba(202, 138, 4, 0.25)";
              textColor = "#ca8a04";
            } else if (isSunday) {
              bg = COLORS.card === "#ffffff" ? "#f3f4f6" : "#1f2937";
              textColor = COLORS.textSecondary;
            }

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
                  <Text className="font-semibold" style={{ color: textColor }}>
                    {day}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Legend Layout Footer */}
        <View className="flex-row flex-wrap mt-4 gap-3">
          <Legend color={COLORS.success} text="Present" colors={COLORS} />
          <Legend color="#ca8a04" text="On Leave" colors={COLORS} />
          <Legend color={COLORS.danger} text="Absent" colors={COLORS} />
          <Legend color={COLORS.inactive} text="Sunday" colors={COLORS} />
        </View>
      </View>
    </View>
  );
};

// Extracted Sub-Components with parameterized color mappings
const SummaryTile = ({ title, value, color, colors }) => (
  <View 
    className="flex-1 rounded-2xl p-3 items-center" 
    style={{ backgroundColor: colors.card, elevation: 2 }}
  >
    <Text className="text-xl font-bold" style={{ color }}>
      {value}
    </Text>
    <Text className="text-xs mt-1" style={{ color: colors.textSecondary }}>
      {title}
    </Text>
  </View>
);

const Legend = ({ color, text, colors }) => (
  <View className="flex-row items-center">
    <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }} />
    <Text className="text-xs" style={{ color: colors.textSecondary }}>
      {text}
    </Text>
  </View>
);

export default CalendarCard;