import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";

import AnimatedScreen from "@/components/common/AnimatedScreen";
import TimetableUpdateModal from "@/components/modals/TimetableUpdateModal";
import DayScheduleCard from "@/components/timetable/DayScheduleCard";
import EmptyState from "@/components/timetable/EmptyState";
import api from "@/configs/api";
import { ThemeContext } from "@/context/ThemeProvider";

const emptyScheduleStructure = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
};

const Timetable = () => {
  const { COLORS } = useContext(ThemeContext);
  
  const [schedule, setSchedule] = useState(emptyScheduleStructure);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedDaySchedule, setSelectedDaySchedule] = useState([]);

  const fetchTimetable = async () => {
    setLoading(true);

    try {
      const response = await api.get("/api/teacher/dashboard");

      if (response.data?.success) {
        const apiSchedule =
          response.data?.dashboard?.timetable?.schedule ||
          emptyScheduleStructure;

        setSchedule({
          ...emptyScheduleStructure,
          ...apiSchedule,
        });
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Unable to load timetable."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const openDayEditor = (day, schedules) => {
    setSelectedDay(day);
    setSelectedDaySchedule(schedules || []);
    setIsModalOpen(true);
  };

  const refreshTimetableState = (updatedDaySchedule) => {
    setSchedule((prev) => ({
      ...prev,
      [selectedDay]: updatedDaySchedule,
    }));
  };

  if (loading) {
    return (
      <AnimatedScreen>
        <View 
          className="flex-1 items-center justify-center" 
          style={{ backgroundColor: COLORS.background }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text className="mt-3" style={{ color: COLORS.textSecondary }}>
            Loading timetable...
          </Text>
        </View>
      </AnimatedScreen>
    );
  }

  return (
    <AnimatedScreen>
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: COLORS.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        {/* Header Block */}
        <View className="mb-5 items-center">
          <Text
            className="text-2xl font-bold"
            style={{ color: COLORS.textPrimary }}
          >
            Weekly Timetable
          </Text>

          <Text className="mt-1" style={{ color: COLORS.textSecondary }}>
            your weekly class schedule
          </Text>
        </View>

        {/* Dynamic Cards & Empty State Layout */}
        {Object.entries(schedule).length === 0 ? (
          <EmptyState onPress={() => openDayEditor("Monday", [])} />
        ) : (
          Object.entries(schedule).map(([day, schedules]) => (
            <DayScheduleCard
              key={day}
              day={day}
              schedules={schedules}
              onEdit={() => openDayEditor(day, schedules)}
            />
          ))
        )}
      </ScrollView>

      <TimetableUpdateModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDay={selectedDay}
        currentSchedule={selectedDaySchedule}
        onUpdateSuccess={refreshTimetableState}
      />
    </AnimatedScreen>
  );
};

export default Timetable;