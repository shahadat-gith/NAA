import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import ProfileCard from "@/components/profile/ProfileCard";
import InfoField from "@/components/profile/InfoField";
import { AppContext } from "@/context/AppContext";
import { ThemeContext } from "@/context/ThemeProvider";

const Profile = () => {
  const { staff } = useContext(AppContext);
  const { COLORS } = useContext(ThemeContext);
  const router = useRouter();

  if (!staff) {
    return null;
  }

  const address = staff.address || {};
  const profileImage = staff?.image?.url || staff?.image;

  return (
    <SafeAreaView 
      className="flex-1" 
      style={{ backgroundColor: COLORS.background }}
      edges={["bottom"]}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
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
                Designation: {staff?.designation || "N/A"}
              </Text>

              <Text
                className="text-2xl font-bold"
                style={{ color: COLORS.textPrimary }}
              >
                {staff?.name || "Staff Member"}
              </Text>

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
                  ID: {staff?.staffId || "N/A"}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            className="mt-5 rounded-2xl py-3 items-center"
            style={{ backgroundColor: COLORS.primary }}
            onPress={() => router.push("/profile-edit")}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Account Details Wrapper */}
        <ProfileCard title="Account & Academic Details">
          <InfoField label="Full Name" value={staff?.name} />
          <InfoField
            label="Email Address"
            value={
              staff?.email && staff.email !== "N/A"
                ? staff.email
                : "Not Provided"
            }
          />
          <InfoField label="Contact Number" value={staff?.contact} />
          <InfoField label="Subject" value={staff?.subjectTaught || "N/A"} />
          <InfoField label="Degree / Qualifications" value={staff?.qualification} />
          <InfoField
            label="Experience"
            value={
              staff?.experience !== undefined
                ? `${staff.experience} Years`
                : "N/A"
            }
          />
          <InfoField label="Account Status" value={staff?.status || "Pending"} />
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
    </SafeAreaView>
  );
};

export default Profile;