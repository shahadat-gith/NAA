import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";


import ProfileEditModal from "@/components/modals/ProfileEditModal";
import ProfileCard from "@/components/profile/ProfileCard";
import InfoField from "@/components/profile/InfoField";
import { AppContext } from "@/context/AppContext";
import { ThemeContext } from "@/context/ThemeProvider";

const Profile = () => {
  const { teacher, loadTeacher } = useContext(AppContext);
  const { COLORS } = useContext(ThemeContext);
  const [editOpen, setEditOpen] = useState(false);

  if (!teacher) {
    return null;
  }

  const address = teacher.address || {};
  const profileImage = teacher?.image?.url || teacher?.image;


  return (
    <>
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: COLORS.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        {/* Main Profile Header Card */}
        <View 
          className="rounded-3xl p-5 mb-5" 
          style={{ backgroundColor: COLORS.card, elevation: 3 }}
        >
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

              {/* Adaptive Badge Container */}
              <View 
                className="self-start mt-2 px-3 py-1 rounded-full border"
                style={{ 
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.border 
                }}
              >
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

        {/* Account Details Wrapper */}
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

        {/* Address Details Wrapper */}
        <ProfileCard title="Residential Address">
          <InfoField label="Village / Town" value={address.village} />
          <InfoField label="Post Office (P.O.)" value={address.po} />
          <InfoField label="Police Station (P.S.)" value={address.ps} />
          <InfoField label="District" value={address.district} />
          <InfoField label="PIN Code" value={address.pin} />
          <InfoField label="State" value={address.state || "Assam"} />
        </ProfileCard>
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

export default Profile;