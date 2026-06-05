import React, { useContext } from "react";
import { Text, View } from "react-native";

import { ThemeContext } from "@/context/ThemeProvider";

const AttendanceHistory = ({ history = [] }) => {
  const { COLORS } = useContext(ThemeContext);

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
    <View
      className="rounded-3xl p-5"
      style={{ backgroundColor: COLORS.card, elevation: 3 }}
    >
      <Text
        className="text-xl font-bold mb-4"
        style={{ color: COLORS.textPrimary }}
      >
        Attendance Logs
      </Text>

      {history.length > 0 ? (
        history.map((log) => {
          const status = log.status || "Present";
          const statusLower = status.toLowerCase();

          let statusColor = COLORS.primary;
          if (status === "Present") {
            statusColor = COLORS.success;
          } else if (status === "Absent") {
            statusColor = COLORS.danger;
          } else if (status === "On-Leave") {
            statusColor = COLORS.warning || "#d97706";
          }

          return (
            <View
              key={log._id}
              className="rounded-2xl p-4 mb-3"
              style={{ backgroundColor: COLORS.background }}
            >
              <Text
                className="font-bold mb-1"
                style={{ color: COLORS.textPrimary }}
              >
                {formatDate(log.date)}
              </Text>

              <Text style={{ color: COLORS.textSecondary }}>
                {log.markedBy === "Admin" ? (
                  <>
                    Admin marked you{" "}
                    <Text style={{ color: statusColor, fontWeight: "700" }}>
                      {statusLower}
                    </Text>
                  </>
                ) : (
                  <>
                    You marked{" "}
                    <Text style={{ color: statusColor, fontWeight: "700" }}>
                      {statusLower}
                    </Text>{" "}
                    {status !== "On-Leave" && status !== "Absent" && (
                      <>
                        at{" "}
                        <Text
                          style={{
                            color: COLORS.textPrimary,
                            fontWeight: "700",
                          }}
                        >
                          {formatTime(log.createdAt)}
                        </Text>
                      </>
                    )}
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
