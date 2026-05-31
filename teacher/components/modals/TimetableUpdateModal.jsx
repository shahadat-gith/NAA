import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import api from "@/configs/api";
import { ThemeContext } from "@/context/ThemeProvider";

const CLASS_OPTIONS = {
  english: [
    "nursery", "kg", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", // Appended 11 and 12
  ],
  assamese: [
    "ankur", "mukul", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12",
  ],
};

const SUBJECT_OPTIONS = [
  "Mathematics", "Advanced Mathematics", "Physics", "Chemistry", "Biology",
  "Assamese", "Advance Assamese", "English", "Alternative English",
  "Geography", "Education", "Political Science", "History", "Arabic",
  "Social Studies", "Computer", "Garments Design", "Drawing",
  "Drawing/Handwriting", "General Science", "GK", "EVS", "Hindi", "Retail Management"
];

const STREAM_OPTIONS = ["Arts", "Science"];

const TimetableUpdateModal = ({
  visible,
  onClose,
  selectedDay = "Monday",
  currentSchedule = [],
  onUpdateSuccess,
}) => {
  const { COLORS } = useContext(ThemeContext);

  // Flow step state sequence tracker
  const [scheduleList, setScheduleList] = useState(currentSchedule || []);
  const [selectedMedium, setSelectedMedium] = useState("english");
  const [formData, setFormData] = useState({
    class: CLASS_OPTIONS.english[0],
    subject: SUBJECT_OPTIONS[0],
    timeSlot: "",
    stream: "", // Tracks optional streams for Higher Secondary classes
  });

  const [submitting, setSubmitting] = useState(false);

  // Evaluates dynamically for both English and Assamese mediums
  const isHigherSecondary = formData.class === "11" || formData.class === "12";

  useEffect(() => {
    if (visible) {
      setScheduleList(currentSchedule || []);
    }
  }, [currentSchedule, visible]);

  useEffect(() => {
    const defaultClass = CLASS_OPTIONS[selectedMedium][0];
    setFormData((prev) => ({
      ...prev,
      class: defaultClass,
      stream: defaultClass === "11" || defaultClass === "12" ? STREAM_OPTIONS[0] : "",
    }));
  }, [selectedMedium]);

  if (!visible) return null;

  const handleInputChange = (name, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Secondary State Guard: Reset stream variables smoothly based on class thresholds
      if (name === "class") {
        if (value === "11" || value === "12") {
          updated.stream = prev.stream || STREAM_OPTIONS[0];
        } else {
          updated.stream = "";
        }
      }
      return updated;
    });
  };

  const addScheduleRow = () => {
    if (!formData.class || !formData.subject || !formData.timeSlot.trim()) {
      return Alert.alert("Missing Fields", "Please fill all fields.");
    }

    if (isHigherSecondary && !formData.stream) {
      return Alert.alert("Missing Field", "Please assign an academic stream branch.");
    }

    const newSlotRow = {
      class: formData.class,
      medium: selectedMedium,
      subject: formData.subject,
      timeSlot: formData.timeSlot.trim().toUpperCase(),
      // Injects stream metadata seamlessly when handling Higher Secondary slots
      ...(isHigherSecondary && { stream: formData.stream }),
    };

    setScheduleList((prev) => [...prev, newSlotRow]);

    setFormData((prev) => ({
      ...prev,
      timeSlot: "",
    }));
  };

  const removeScheduleRow = (indexToRemove) => {
    setScheduleList((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmitTimetable = async () => {
    setSubmitting(true);
    try {
      const response = await api.put("/api/teacher/timetable/update", {
        day: selectedDay,
        schedule: scheduleList,
      });

      if (response.data?.success) {
        if (onUpdateSuccess) {
          onUpdateSuccess(scheduleList);
        }
        onClose();
        Alert.alert("Success", "Timetable updated successfully.");
      }
    } catch (error) {
      Alert.alert(
        "Update Failed",
        error?.response?.data?.message || "Failed to update timetable."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/40 justify-end">
        <View 
          className="rounded-t-3xl max-h-[92%]"
          style={{ backgroundColor: COLORS.card }}
        >
          {/* Header Panel */}
          <View 
            className="flex-row items-start justify-between px-5 py-4 border-b"
            style={{ borderColor: COLORS.border }}
          >
            <View>
              <Text
                className="text-xl font-bold"
                style={{ color: COLORS.textPrimary }}
              >
                Update {selectedDay} Timetable
              </Text>

              <Text className="mt-1 text-xs" style={{ color: COLORS.textSecondary }}>
                Manage classes for {selectedDay}
              </Text>
            </View>

            <TouchableOpacity disabled={submitting} onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text
              className="text-base font-bold mb-3"
              style={{ color: COLORS.textPrimary }}
            >
              Add Schedule
            </Text>

            <Text className="text-xs font-semibold mb-2" style={{ color: COLORS.textSecondary }}>
              Medium
            </Text>

            {/* Medium Selector Controls */}
            <View className="flex-row gap-3 mb-4">
              <OptionButton
                label="English"
                active={selectedMedium === "english"}
                onPress={() => setSelectedMedium("english")}
                colors={COLORS}
              />
              <OptionButton
                label="Assamese"
                active={selectedMedium === "assamese"}
                onPress={() => setSelectedMedium("assamese")}
                colors={COLORS}
              />
            </View>

            <Text className="text-xs font-semibold mb-2" style={{ color: COLORS.textSecondary }}>
              Class
            </Text>

            {/* horizontal Scrollable Classes List */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              <View className="flex-row gap-2">
                {CLASS_OPTIONS[selectedMedium].map((cls) => (
                  <Chip
                    key={cls}
                    label={`Class ${cls}`}
                    active={formData.class === cls}
                    onPress={() => handleInputChange("class", cls)}
                    colors={COLORS}
                  />
                ))}
              </View>
            </ScrollView>

            {/* DYNAMIC STREAM VIEW: Automatically renders when Class 11 or 12 is selected in either medium */}
            {isHigherSecondary && (
              <View className="mb-4">
                <Text className="text-xs font-semibold mb-2" style={{ color: COLORS.textSecondary }}>
                  Stream
                </Text>
                <View className="flex-row gap-3">
                  {STREAM_OPTIONS.map((str) => (
                    <OptionButton
                      key={str}
                      label={`${str} Stream`}
                      active={formData.stream === str}
                      onPress={() => handleInputChange("stream", str)}
                      colors={COLORS}
                    />
                  ))}
                </View>
              </View>
            )}

            <Text className="text-xs font-semibold mb-2" style={{ color: COLORS.textSecondary }}>
              Subject
            </Text>

            {/* horizontal Scrollable Subjects List */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              <View className="flex-row gap-2">
                {SUBJECT_OPTIONS.map((subject) => (
                  <Chip
                    key={subject}
                    label={subject}
                    active={formData.subject === subject}
                    onPress={() => handleInputChange("subject", subject)}
                    colors={COLORS}
                  />
                ))}
              </View>
            </ScrollView>

            <Text className="text-xs font-semibold mb-2" style={{ color: COLORS.textSecondary }}>
              Time Slot
            </Text>

            <TextInput
              value={formData.timeSlot}
              onChangeText={(value) => handleInputChange("timeSlot", value)}
              placeholder="09:00 AM - 09:45 AM"
              placeholderTextColor={COLORS.textSecondary}
              className="border rounded-2xl px-4 py-4 mb-4"
              style={{
                borderColor: COLORS.border,
                color: COLORS.textPrimary,
                backgroundColor: COLORS.background,
              }}
            />

            <TouchableOpacity
              onPress={addScheduleRow}
              className="rounded-2xl py-4 items-center flex-row justify-center mb-5"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Ionicons name="add" size={20} color={COLORS.white} />
              <Text className="text-white font-semibold ml-2">
                Add Schedule
              </Text>
            </TouchableOpacity>

            <View className="h-px mb-5" style={{ backgroundColor: COLORS.border }} />

            {/* Active Day Meta Summary Heading */}
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text
                  className="text-base font-bold"
                  style={{ color: COLORS.textPrimary }}
                >
                  {selectedDay} Schedule
                </Text>

                <Text className="text-xs" style={{ color: COLORS.textSecondary }}>
                  {scheduleList.length} Classes
                </Text>
              </View>

              <TouchableOpacity
                disabled={submitting}
                onPress={handleSubmitTimetable}
                className="px-5 py-3 rounded-2xl"
                style={{
                  backgroundColor: submitting ? COLORS.inactive : COLORS.primary,
                }}
              >
                {submitting ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text className="text-white font-semibold">Save</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Rendered Slots Loop List */}
            {scheduleList.length === 0 ? (
              <View 
                className="rounded-2xl p-5 items-center mb-4"
                style={{ backgroundColor: COLORS.background }}
              >
                <Text style={{ color: COLORS.textSecondary }}>
                  No classes added for {selectedDay}.
                </Text>
              </View>
            ) : (
              scheduleList.map((item, index) => (
                <View
                  key={index}
                  className="rounded-2xl p-4 mb-3"
                  style={{ backgroundColor: COLORS.background }}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 pr-3">
                      <Text
                        className="font-bold"
                        style={{ color: COLORS.textPrimary }}
                      >
                        {item.subject}
                      </Text>

                      <Text
                        className="mt-1 text-xs"
                        style={{ color: COLORS.textSecondary }}
                      >
                        Class {item.class} 
                        {item.stream ? ` (${item.stream})` : ""} • {item.medium} medium
                      </Text>

                      <Text
                        className="mt-1 text-xs font-semibold"
                        style={{ color: COLORS.primary }}
                      >
                        {item.timeSlot}
                      </Text>
                    </View>

                    {/* Trash Removal Icon Trigger */}
                    <TouchableOpacity
                      onPress={() => removeScheduleRow(index)}
                      className="w-10 h-10 rounded-xl items-center justify-center"
                      style={{ 
                        backgroundColor: COLORS.card === "#ffffff" ? "#fee2e2" : "rgba(239, 68, 68, 0.15)" 
                      }}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color={COLORS.danger}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Mapped Contextual Sub-Components
const OptionButton = ({ label, active, onPress, colors }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-1 rounded-2xl py-3 items-center border"
    style={{
      backgroundColor: active ? colors.primary : colors.background,
      borderColor: active ? colors.primary : colors.border,
    }}
  >
    <Text
      className="font-semibold"
      style={{
        color: active ? colors.white : colors.textPrimary,
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const Chip = ({ label, active, onPress, colors }) => (
  <TouchableOpacity
    onPress={onPress}
    className="px-4 py-3 rounded-2xl border"
    style={{
      backgroundColor: active ? colors.primary : colors.background,
      borderColor: active ? colors.primary : colors.border,
    }}
  >
    <Text
      className="font-semibold text-xs"
      style={{
        color: active ? colors.white : colors.textPrimary,
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default TimetableUpdateModal;