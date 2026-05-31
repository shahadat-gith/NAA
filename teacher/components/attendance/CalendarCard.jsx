import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { SummaryTile } from "@/components/attendance/SummaryTile";
import { Legend } from "@/components/attendance/Legend";
import { CalendarGrid } from "@/components/attendance/CalendarGrid";

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

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

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

  // Hash history records into a clean key-value lookup map
  const attendanceMap = history.reduce((acc, item) => {
    if (item.date) {
      acc[item.date.split("T")[0]] = item.status;
    }
    return acc;
  }, {});

  // --- Dynamic Metrics Engine ---
  const presentCount = history.filter((item) => item.status === "Present").length;
  const absentCount = history.filter((item) => item.status === "Absent").length;
  const onLeaveCount = history.filter((item) => item.status === "On-Leave").length;

  // Calculates total non-Sunday days that haven't been logged yet
  let unmarkedCount = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const isSunday = new Date(selectedYear, selectedMonth, d).getDay() === 0;
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    if (!isSunday && !attendanceMap[dateStr]) {
      unmarkedCount++;
    }
  }

  const activeTrackedDays = presentCount + absentCount + onLeaveCount;
  const attendancePercentage = activeTrackedDays ? Math.round((presentCount / activeTrackedDays) * 100) : 0;

  return (
    <View className="mb-5">
      {/* Top Indicators Summary Dashboard Bar */}
      <View className="flex-row gap-2 mb-4">
        <SummaryTile title="Present" value={presentCount} color={COLORS.success} colors={COLORS} />
        <SummaryTile title="Leave" value={onLeaveCount} color={COLORS.primary} colors={COLORS} />
        <SummaryTile title="Absent" value={absentCount} color={COLORS.danger} colors={COLORS} />
        <SummaryTile title="Unmarked" value={unmarkedCount} color={COLORS.inactive} colors={COLORS} />
        <SummaryTile title="Rate" value={`${attendancePercentage}%`} color={COLORS.textPrimary} colors={COLORS} />
      </View>

      {/* Main Grid Card Interface Container */}
      <View 
        className="rounded-3xl p-5" 
        style={{ backgroundColor: COLORS.card, elevation: 3 }}
      >
        {/* Navigation Selector Header Row */}
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

        {/* Modularized Calendar Day Grid Core */}
        <CalendarGrid 
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          attendanceMap={attendanceMap}
          daysInMonth={daysInMonth}
          COLORS={COLORS}
        />

        {/* Legend Layout Footer Metadata Hints */}
        <View className="flex-row flex-wrap mt-4 gap-x-4 gap-y-2">
          <Legend color={COLORS.success} text="Present" colors={COLORS} />
          <Legend color={COLORS.primary} text="On Leave" colors={COLORS} />
          <Legend color={COLORS.danger} text="Absent" colors={COLORS} />
          <Legend color={COLORS.border} text="Sunday" colors={COLORS} />
          <Legend 
            color={COLORS.card === "#ffffff" ? "#f3f4f6" : "rgba(107, 114, 128, 0.2)"} 
            text="Unmarked" 
            colors={COLORS} 
          />
        </View>
      </View>
    </View>
  );
};

export default CalendarCard;