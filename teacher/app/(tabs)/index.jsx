import React, { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert } from "react-native";

import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import TodaySchedule from "@/components/TodaySchedule";
import RecentAttendance from "@/components/RecentAttendance";
import AnimatedScreen from "@/components/AnimatedScreen";

import api from "@/configs/api";
import { AppContext } from "@/context/AppContext";
import { COLORS } from "@/constants/theme";

const emptyScheduleStructure = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
};

const Home = () => {
  const { teacher, setTeacher } = useContext(AppContext);

  const [dashboard, setDashboard] = useState({
    teacher,
    timetable: {
      schedule: emptyScheduleStructure,
    },
    attendance: [],
  });

  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Welcome");

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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      const response = await api.get("/api/teacher/dashboard");

      if (response.data?.success) {
        setDashboard(response.data.dashboard);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Unable to load dashboard data. Please log in again.";

      if (error?.response?.status === 401) {
        await SecureStore.deleteItemAsync("teacher-token");
        setTeacher(null);
        router.replace("/login");
        return;
      }

      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text className="mt-3" style={{ color: COLORS.textSecondary }}>
          Loading dashboard...
        </Text>
      </View>
    );
  }

  const dashboardTeacher = dashboard?.teacher || teacher;
  const timetable = dashboard?.timetable || {};
  const attendance = dashboard?.attendance || [];

  return (
    <AnimatedScreen>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
      >
        <View className="mb-5">
          <Text
            className="text-2xl font-bold"
            style={{ color: COLORS.textPrimary }}
          >
            <Text style={{ color: COLORS.primary }}>{greeting}</Text>,{" "}
            {dashboardTeacher?.name || "Teacher"}!
          </Text>

          <Text className="mt-1" style={{ color: COLORS.textSecondary }}>
            Here is your overview for today.
          </Text>
        </View>

        <TodaySchedule timetableData={timetable} />

        <RecentAttendance attendance={attendance} />
      </ScrollView>
    </AnimatedScreen>
  );
};

export default Home;
