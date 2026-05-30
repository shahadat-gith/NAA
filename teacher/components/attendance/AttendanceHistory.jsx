import React from "react";
import { View, Text } from "react-native";

import { COLORS } from "@/constants/theme";

const AttendanceHistory = ({ history = [] }) => {
  const formatDate = (isoString) => {
    if (!isoString) return "—";

    return new Date(isoString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (isoString) => {
    if (!isoString) return "—";

    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View className="bg-card rounded-3xl p-5" style={{ elevation: 3 }}>
      <Text className="text-xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>
        Attendance Logs
      </Text>

      {history.length > 0 ? (
        history.map((log) => {
          const status = log.status || "Present";
          const statusLower = status.toLowerCase();
          const color =
            status === "Present"
              ? "#16a34a"
              : status === "Absent"
              ? "#dc2626"
              : "#ca8a04";

          return (
            <View key={log._id} className="bg-background rounded-2xl p-4 mb-3">
              <Text className="font-bold mb-1" style={{ color: COLORS.textPrimary }}>
                {formatDate(log.date)}
              </Text>

              <Text style={{ color: COLORS.textSecondary }}>
                {log.markedBy === "Admin" ? (
                  <>
                    Admin marked you{" "}
                    <Text style={{ color, fontWeight: "700" }}>{statusLower}</Text>
                  </>
                ) : (
                  <>
                    You marked{" "}
                    <Text style={{ color, fontWeight: "700" }}>{statusLower}</Text>{" "}
                    at{" "}
                    <Text style={{ color: COLORS.textPrimary, fontWeight: "700" }}>
                      {formatTime(log.createdAt)}
                    </Text>
                  </>
                )}
              </Text>
            </View>
          );
        })
      ) : (
        <View className="items-center py-8">
          <Text style={{ color: COLORS.textSecondary }}>
            No logged attendance entries found.
          </Text>
        </View>
      )}
    </View>
  );
};

export default AttendanceHistory;