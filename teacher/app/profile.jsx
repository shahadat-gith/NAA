import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ProfileEditModal from "@/components/modals/ProfileEditModal";
import { AppContext } from "@/context/AppContext";
import { COLORS } from "@/constants/theme";

const Profile = () => {
  const { teacher, setTeacher, loadTeacher } = useContext(AppContext);
  const [editOpen, setEditOpen] = useState(false);

  if (!teacher) {
    return null;
  }

  const address = teacher.address || {};
  const profileImage = teacher?.image?.url || teacher?.image;

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("teacher-token");
          setTeacher(null);
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        <View className="bg-card rounded-3xl p-5 mb-5" style={{ elevation: 3 }}>
          <View className="flex-row items-center">
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require("@/assets/images/user.png")
              }
              className="w-20 h-20 rounded-2xl mr-4"
              resizeMode="cover"
            />

            <View className="flex-1">
              <Text
                className="text-xs font-semibold mb-1"
                style={{ color: COLORS.textSecondary }}
              >
                Designation: {teacher?.designation || "N/A"}
              </Text>

              <Text
                className="text-2xl font-bold"
                style={{ color: COLORS.textPrimary }}
              >
                {teacher?.name || "Teacher"}
              </Text>

              <View className="self-start mt-2 px-3 py-1 rounded-full bg-orange-50">
                <Text
                  className="text-xs font-semibold"
                  style={{ color: COLORS.primary }}
                >
                  ID: {teacher?.teacherId || "N/A"}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            className="mt-5 rounded-2xl py-3 items-center"
            style={{ backgroundColor: COLORS.primary }}
            onPress={() => setEditOpen(true)}
          >
            <Text className="text-white font-semibold">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <ProfileCard title="Account & Academic Details">
          <InfoField label="Full Name" value={teacher?.name} />
          <InfoField
            label="Email Address"
            value={
              teacher?.email && teacher.email !== "N/A"
                ? teacher.email
                : "Not Provided"
            }
          />
          <InfoField label="Contact Number" value={teacher?.contact} />
          <InfoField label="Subject" value={teacher?.subjectTaught} highlight />
          <InfoField label="Degree / Qualifications" value={teacher?.degree} />
          <InfoField
            label="Experience"
            value={
              teacher?.experience !== undefined
                ? `${teacher.experience} Years`
                : "N/A"
            }
          />
          <InfoField label="Account Status" value={teacher?.status || "Pending"} />
        </ProfileCard>

        <ProfileCard title="Residential Address">
          <InfoField label="Village / Town" value={address.village} />
          <InfoField label="Post Office (P.O.)" value={address.po} />
          <InfoField label="Police Station (P.S.)" value={address.ps} />
          <InfoField label="District" value={address.district} />
          <InfoField label="PIN Code" value={address.pin} />
          <InfoField label="State" value={address.state || "Assam"} />
        </ProfileCard>

        <TouchableOpacity
          onPress={handleLogout}
          className="mt-2 rounded-2xl py-4 flex-row items-center justify-center"
          style={{ backgroundColor: COLORS.danger || "#ef4444" }}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text className="text-white font-semibold ml-2">Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <ProfileEditModal
        visible={editOpen}
        onClose={() => setEditOpen(false)}
        teacher={teacher}
        loadTeacher={loadTeacher}
      />
    </>
  );
};

const ProfileCard = ({ title, children }) => (
  <View className="bg-card rounded-3xl p-5 mb-5" style={{ elevation: 2 }}>
    <Text
      className="text-lg font-bold mb-4"
      style={{ color: COLORS.textPrimary }}
    >
      {title}
    </Text>

    <View>{children}</View>
  </View>
);

const InfoField = ({ label, value, highlight }) => (
  <View className="bg-background rounded-2xl px-4 py-3 mb-3">
    <Text
      className="text-xs font-medium mb-1"
      style={{ color: COLORS.textSecondary }}
    >
      {label}
    </Text>

    <Text
      className="text-base font-semibold"
      style={{
        color: highlight ? COLORS.primary : COLORS.textPrimary,
      }}
    >
      {value || "N/A"}
    </Text>
  </View>
);

export default Profile;