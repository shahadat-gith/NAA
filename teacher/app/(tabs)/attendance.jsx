import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import api from "@/configs/api";
import { COLORS } from "@/constants/theme";
import CalendarCard from "@/components/attendance/CalendarCard";
import AttendanceHistory from "@/components/attendance/AttendanceHistory";
import ScannerModal from "@/components/modals/ScannerModal";

import AnimatedScreen from "@/components/AnimatedScreen";

const Attendance = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchMonthlyAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/api/attendance/history/me", {
        params: {
          month: selectedMonth + 1,
          year: selectedYear,
        },
      });

      if (res.data?.success) {
        setHistory(res.data.attendance || []);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Unable to load attendance history.";

      setError(message);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchMonthlyAttendance();
  }, [fetchMonthlyAttendance]);

  const markAttendance = async (qrToken) => {
    setMarking(true);

    try {
      const res = await api.post("/api/attendance/mark-attendance", {
        token: qrToken,
        markedBy: "Teacher",
        status: "Present",
      });

      if (res.data?.success) {
        Alert.alert("Success", "Attendance marked successfully.");
        setShowScanner(false);
        fetchMonthlyAttendance();
      }
    } catch (error) {
      Alert.alert(
        "Failed",
        error?.response?.data?.message || "Failed to mark attendance."
      );
    } finally {
      setMarking(false);
    }
  };

  const getTodayISTString = () => {
    return new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
  };

  const isTodayAttendanceMarked = history.some((att) => {
    if (!att.date) return false;
    return att.date.split("T")[0] === getTodayISTString();
  });

  return (
    <>
     <AnimatedScreen>
       <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        <View className="flex-row items-center justify-between mb-5">
          <View>
            <Text
              className="text-2xl font-bold"
              style={{ color: COLORS.textPrimary }}
            >
              Attendance
            </Text>

            <Text className="mt-1" style={{ color: COLORS.textSecondary }}>
              Monthly Overview
            </Text>
          </View>

          <TouchableOpacity
            disabled={marking || isTodayAttendanceMarked}
            onPress={() => setShowScanner(true)}
            className="w-14 h-14 rounded-2xl items-center justify-center"
            style={{
              backgroundColor:
                marking || isTodayAttendanceMarked
                  ? COLORS.inactive
                  : COLORS.primary,
            }}
          >
            {marking ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Ionicons name="qr-code-outline" size={26} color={COLORS.white} />
            )}
          </TouchableOpacity>
        </View>

        {isTodayAttendanceMarked && (
          <View className="bg-green-50 border border-green-100 rounded-2xl px-4 py-3 mb-5">
            <Text className="font-semibold" style={{ color: "#166534" }}>
              Your attendance is already marked for today.
            </Text>
          </View>
        )}

        {loading ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text className="mt-3" style={{ color: COLORS.textSecondary }}>
              Loading attendance...
            </Text>
          </View>
        ) : error ? (
          <View className="bg-red-50 border border-red-100 rounded-2xl p-4">
            <Text className="font-semibold" style={{ color: "#991b1b" }}>
              {error}
            </Text>
          </View>
        ) : (
          <>
            <CalendarCard
              history={history}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
            />

            <AttendanceHistory history={history} />
          </>
        )}
      </ScrollView>
     </AnimatedScreen>

      <ScannerModal
        visible={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={markAttendance}
      />
    </>
  );
};

export default Attendance;