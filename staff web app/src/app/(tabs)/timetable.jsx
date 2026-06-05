import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { staffApi } from "@/api/staff";
import AnimatedScreen from "@/components/common/AnimatedScreen";
import TimetableUpdateModal from "@/components/modals/TimetableUpdateModal";
import DayScheduleCard from "@/components/timetable/DayScheduleCard";
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

const Timetable = () => {
  const { staff } = useContext(AppContext);
  const { COLORS } = useContext(ThemeContext);
  const [schedule, setSchedule] = useState(emptyScheduleStructure);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedDaySchedule, setSelectedDaySchedule] = useState([]);

  const isNonTeaching = staff?.staffType === "Non-Teaching";

  const fetchTimetable = async () => {
    if (isNonTeaching) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await staffApi.getTimetable();

      if (data?.success) {
        const apiSchedule = data?.timetable?.schedule;

        setSchedule({
          ...emptyScheduleStructure,
          ...(apiSchedule || {}),
        });
      }
    } catch (error) {
      setSchedule(emptyScheduleStructure);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, [staff]); 
  const openDayEditor = (day, schedules) => {
    if (isNonTeaching) return;
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
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-5 items-center">
          <Text
            className="text-2xl font-bold"
            style={{ color: COLORS.textPrimary }}
          >
            Weekly Timetable
          </Text>

          <Text className="mt-1" style={{ color: COLORS.textSecondary }}>
            Your weekly class schedule
          </Text>
        </View>

        {isNonTeaching ? (
          <View
            className="rounded-3xl p-8 items-center border border-dashed mt-4"
            style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
          >
            <Text
              className="text-base font-semibold text-center"
              style={{ color: COLORS.textSecondary }}
            >
              No timetable for Non-Teaching staff.
            </Text>
          </View>
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
