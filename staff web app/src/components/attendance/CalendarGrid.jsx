import React from "react";
import { Text, View } from "react-native";

export const CalendarGrid = ({
  selectedMonth,
  selectedYear,
  attendanceMap,
  daysInMonth,
  COLORS,
}) => {
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();
  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);

  const getStatusStyle = (status, isSunday) => {
    const isDark = COLORS.card !== "#ffffff";

    if (status === "Present") {
      return {
        bg: isDark ? "rgba(34, 197, 94, 0.15)" : "#dcfce7",
        text: COLORS.success,
      };
    }
    if (status === "Absent") {
      return {
        bg: isDark ? "rgba(239, 68, 68, 0.15)" : "#fee2e2",
        text: COLORS.danger,
      };
    }
    if (status === "On-Leave") {
      return {
        bg: isDark ? "rgba(245, 158, 11, 0.15)" : "#fef3c7",
        text: COLORS.warning || "#d97706",
      };
    }
    if (isSunday) {
      return {
        bg: COLORS.border,
        text: COLORS.textSecondary,
      };
    }

    return {
      bg: isDark ? "rgba(107, 114, 128, 0.2)" : "#f3f4f6",
      text: COLORS.inactive,
    };
  };

  return (
    <View className="flex-row flex-wrap">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <View
          key={day}
          style={{ width: `${100 / 7}%` }}
          className="items-center mb-3"
        >
          <Text
            className="text-xs font-bold"
            style={{
              color: day === "Sun" ? COLORS.danger : COLORS.textSecondary,
            }}
          >
            {day}
          </Text>
        </View>
      ))}

      {Array.from({ length: firstDay }).map((_, index) => (
        <View
          key={`empty-${index}`}
          style={{ width: `${100 / 7}%` }}
          className="h-10 mb-2"
        />
      ))}

      {Array.from({ length: daysInMonth }).map((_, index) => {
        const day = index + 1;
        const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const status = attendanceMap[dateStr];
        const isSunday =
          new Date(selectedYear, selectedMonth, day).getDay() === 0;

        const styles = getStatusStyle(status, isSunday);

        return (
          <View
            key={day}
            style={{ width: `${100 / 7}%` }}
            className="items-center mb-2"
          >
            <View
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: styles.bg }}
            >
              <Text className="font-semibold" style={{ color: styles.text }}>
                {day}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};
