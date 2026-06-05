import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { staffApi } from "@/api/staff";
import AttendanceHistory from "@/components/attendance/AttendanceHistory";
import CalendarCard from "@/components/attendance/CalendarCard";
import ScannerModal from "@/components/modals/ScannerModal";

import AnimatedScreen from "@/components/common/AnimatedScreen";
import { ThemeContext } from "@/context/ThemeProvider";

const Attendance = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { COLORS } = useContext(ThemeContext);

  const fetchMonthlyAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await staffApi.getAttendanceHistory(
        selectedMonth + 1,
        selectedYear,
      );

      if (data?.success) {
        setHistory(data.attendance || []);
      }
    } catch (err) {
      setError(err.message);
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
      const data = await staffApi.markAttendance(qrToken, "Staff", "Present");

      if (data?.success) {
        setShowScanner(false);
        setTimeout(() => {
          Alert.alert("Success", "Attendance marked successfully.");
        }, 100);
        setHistory(data.attendance || []);
      }
    } catch (err) {
      setShowScanner(false);
      setTimeout(() => {
        Alert.alert("Failed", err.message);
      }, 300);
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
          className="flex-1"
          style={{ backgroundColor: COLORS.background }}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
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
              activeOpacity={0.8}
            >
              {marking ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Ionicons
                  name="qr-code-outline"
                  size={26}
                  color={COLORS.white}
                />
              )}
            </TouchableOpacity>
          </View>

          {isTodayAttendanceMarked && (
            <View
              className="border rounded-2xl px-4 py-3 mb-5"
              style={{
                backgroundColor: COLORS.card,
                borderColor: COLORS.success,
              }}
            >
              <Text className="font-semibold" style={{ color: COLORS.success }}>
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
            <View
              className="border rounded-2xl p-4"
              style={{
                backgroundColor: COLORS.card,
                borderColor: COLORS.danger,
              }}
            >
              <Text className="font-semibold" style={{ color: COLORS.danger }}>
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
        isMarking={marking}
      />
    </>
  );
};

export default Attendance;
