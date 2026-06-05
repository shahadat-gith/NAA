import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";

import AnimatedScreen from "@/components/common/AnimatedScreen";
import RecentAttendance from "@/components/home/RecentAttendance";
import TodaySchedule from "@/components/home/TodaySchedule";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { staffApi } from "@/api/staff"; // Consuming your centralized staff endpoints file
import { AppContext } from "@/context/AppContext";
import { ThemeContext } from "@/context/ThemeProvider";

const emptyScheduleStructure = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
};

const Home = () => {
  // Swapped context handles to use the general staff payload references
  const { staff, setStaff } = useContext(AppContext);
  const { COLORS } = useContext(ThemeContext);

  const [dashboard, setDashboard] = useState({
    profile: staff,
    timetable: {
      schedule: emptyScheduleStructure,
    },
    attendance: [],
  });

  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Welcome");

  /* ================= CALCULATE SYSTEM DYNAMIC GREETING ================= */
  useEffect(() => {
    const hour = new Date().getHours();

    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 16) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  /* ================= EFFECT DISPATCHER ROUTINE ================= */
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Calls your central service abstraction function directly
      const data = await staffApi.getDashboard();

      if (data?.success) {
        setDashboard(data.dashboard);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Unable to load workspace data records. Please log in again.";

      if (error?.response?.status === 401) {
        // Clear updated secure store slot path parameters on unauthorized signals
        await SecureStore.deleteItemAsync("staff-token");
        setStaff(null);
        router.replace("/login");
        return;
      }

      Alert.alert("Sync Error", message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: COLORS.background }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text
          className="mt-3 text-sm font-medium"
          style={{ color: COLORS.textSecondary }}
        >
          Loading your workspace...
        </Text>
      </View>
    );
  }

  // De-structuring clean variables matching the updated backend payload schema
  const profile = dashboard?.profile || staff;
  const timetable = dashboard?.timetable;
  const attendance = dashboard?.attendance || [];

  return (
    <AnimatedScreen>
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: COLORS.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header / Dynamic Profile Greeting Section */}
        <View className="mb-6">
          <Text
            className="text-2xl font-bold tracking-tight"
            style={{ color: COLORS.textPrimary }}
          >
            <Text style={{ color: COLORS.primary }}>{greeting}</Text>,{" "}
            {profile?.name || "Staff Member"}!
          </Text>
         
        </View>

        {/* CONDITIONALLY RENDER TIMETABLE SECTION WIDGET */}
        {/* Hides class slots dynamically if employee belongs to non-teaching structures */}
        {profile?.staffType === "Teaching" && timetable ? (
          <TodaySchedule timetableData={timetable} />
        ) : null}

        {/* Historical Attendance Logger Widget */}
        <RecentAttendance attendance={attendance} />
      </ScrollView>
    </AnimatedScreen>
  );
};

export default Home;
