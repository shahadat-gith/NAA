import { Ionicons } from "@expo/vector-icons";
import React, { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { CalendarGrid } from "@/components/attendance/CalendarGrid";
import { Legend } from "@/components/attendance/Legend";
import { SummaryTile } from "@/components/attendance/SummaryTile";
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
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();

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

  const attendanceMap = history.reduce((acc, item) => {
    if (item.date) {
      acc[item.date.split("T")[0]] = item.status;
    }
    return acc;
  }, {});

  const presentCount = history.filter(
    (item) => item.status === "Present",
  ).length;
  const absentCount = history.filter((item) => item.status === "Absent").length;
  const onLeaveCount = history.filter(
    (item) => item.status === "On-Leave",
  ).length;

  const activeTrackedDays = presentCount + absentCount + onLeaveCount;
  const attendancePercentage = activeTrackedDays
    ? Math.round((presentCount / activeTrackedDays) * 100)
    : 0;

  const leaveColor = COLORS.warning || "#d97706";
  const unmarkedColor =
    COLORS.card === "#ffffff" ? "#f3f4f6" : "rgba(107, 114, 128, 0.2)";

  return (
    <View className="mb-5">
      <View className="flex-row gap-2 mb-4">
        <SummaryTile
          title="Present"
          value={presentCount}
          color={COLORS.success}
          colors={COLORS}
        />
        <SummaryTile
          title="Leave"
          value={onLeaveCount}
          color={leaveColor}
          colors={COLORS}
        />
        <SummaryTile
          title="Absent"
          value={absentCount}
          color={COLORS.danger}
          colors={COLORS}
        />
        <SummaryTile
          title="Rate"
          value={`${attendancePercentage}%`}
          color={COLORS.textPrimary}
          colors={COLORS}
        />
      </View>

      <View
        className="rounded-3xl p-5"
        style={{ backgroundColor: COLORS.card, elevation: 3 }}
      >
        <View className="flex-row items-center justify-between mb-5">
          <TouchableOpacity
            onPress={handlePrevMonth}
            className="w-10 h-10 rounded-xl items-center justify-center"
            style={{ backgroundColor: COLORS.background }}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>

          <View className="items-center">
            <Text
              className="text-lg font-bold"
              style={{ color: COLORS.textPrimary }}
            >
              {monthNames[selectedMonth]} {selectedYear}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleNextMonth}
            className="w-10 h-10 rounded-xl items-center justify-center"
            style={{ backgroundColor: COLORS.background }}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-forward"
              size={22}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
        </View>

        <CalendarGrid
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          attendanceMap={attendanceMap}
          daysInMonth={daysInMonth}
          COLORS={COLORS}
        />

        <View className="flex-row flex-wrap mt-4 gap-x-4 gap-y-2">
          <Legend color={COLORS.success} text="Present" colors={COLORS} />
          <Legend color={leaveColor} text="On Leave" colors={COLORS} />
          <Legend color={COLORS.danger} text="Absent" colors={COLORS} />
          <Legend color={COLORS.border} text="Sunday" colors={COLORS} />
          <Legend color={unmarkedColor} text="Unmarked" colors={COLORS} />
        </View>
      </View>
    </View>
  );
};

export default CalendarCard;
