import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";


const RecentAttendance = ({ attendance = [] }) => {
  const formatDate = (isoString) => {
    if (!isoString) return "—";

    return new Date(isoString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCheckInTime = (isoString) => {
    if (!isoString) return "—";

    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View className="bg-card rounded-3xl p-5 mb-5" style={{ elevation: 3 }}>
      <View className="flex-row items-center justify-between mb-4">
        <Text
          className="text-xl font-bold"
          style={{ color: COLORS.textPrimary }}
        >
          Recent Attendance Logs
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/attendance")}
          className="w-11 h-11 rounded-2xl items-center justify-center"
          style={{ backgroundColor: COLORS.primary }}
        >
          <Ionicons name="open-outline" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {attendance.length > 0 ? (
        <View>
          {attendance.slice(0, 5).map((log) => (
            <View
              key={log._id}
              className="bg-background rounded-2xl px-4 py-3 mb-3"
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text
                    className="font-bold"
                    style={{ color: COLORS.textPrimary }}
                  >
                    {formatDate(log.date)}
                  </Text>

                  <Text
                    className="mt-1"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Check-In: {formatCheckInTime(log.createdAt)}
                  </Text>
                </View>

                <View
                  className="px-3 py-1 rounded-full"
                  style={{
                    backgroundColor:
                      log.status === "Present" ? "#dcfce7" : "#fee2e2",
                  }}
                >
                  <Text
                    className="text-xs font-bold"
                    style={{
                      color:
                        log.status === "Present" ? "#166534" : "#991b1b",
                    }}
                  >
                    {log.status || "Present"}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className="items-center py-8">
          <Ionicons
            name="document-text-outline"
            size={42}
            color={COLORS.textSecondary}
          />

          <Text
            className="text-base font-semibold mt-3"
            style={{ color: COLORS.textPrimary }}
          >
            No recent attendance entries recorded.
          </Text>
        </View>
      )}
    </View>
  );
};


export default RecentAttendance