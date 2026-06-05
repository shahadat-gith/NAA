import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

import AnimatedScreen from "@/components/common/AnimatedScreen";
import { ThemeContext } from "@/context/ThemeProvider";
import { useDeveloperData } from "@/hooks/useDeveloperData"; // Import your fresh hook

import fallback_image from "@/assets/images/user.png";

const Developer = () => {
  const { COLORS } = useContext(ThemeContext);
  const { developerInfo, loading, error } = useDeveloperData();

  const handleLinkPress = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (err) {
      console.error("An error occurred launching system device intent loops: ", err);
    }
  };

  // 1. Loading State UI Layout
  if (loading) {
    return (
      <AnimatedScreen>
        <View className="flex-1 items-center justify-center" style={{ backgroundColor: COLORS.background }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text className="text-xs mt-3 font-medium" style={{ color: COLORS.textSecondary }}>
            Fetching developer credentials...
          </Text>
        </View>
      </AnimatedScreen>
    );
  }

  // 2. Error/Offline Fallback State UI Layout
  if (error || !developerInfo) {
    return (
      <AnimatedScreen>
        <View className="flex-1 items-center justify-center p-6" style={{ backgroundColor: COLORS.background }}>
          <Ionicons name="cloud-offline-outline" size={48} color={COLORS.inactive} />
          <Text className="text-sm font-bold mt-4 text-center" style={{ color: COLORS.textPrimary }}>
            Failed to Synchronize Profile
          </Text>
          <Text className="text-xs mt-1 text-center mb-6" style={{ color: COLORS.textSecondary }}>
            Make sure your device is connected to an active network pool.
          </Text>
        </View>
      </AnimatedScreen>
    );
  }

  // Extract clean structured items dynamically directly out of the Gist JSON state payload
  const { personalInfo, socialLinks, education, skills } = developerInfo;

  return (
    <AnimatedScreen>
      <ScrollView 
        className="flex-1"
        style={{ backgroundColor: COLORS.background }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* Profile Card Summary Module */}
        <View 
          className="rounded-3xl p-6 items-center border mb-6"
          style={{ backgroundColor: COLORS.card, borderColor: COLORS.border, elevation: 2 }}
        >
          <Image 
            source={personalInfo.image ? { uri: personalInfo.image } : fallback_image}
            className="w-28 h-28 rounded-full border-2"
            style={{ borderColor: COLORS.primary }}
            resizeMode="cover"
          />
          <Text className="text-2xl font-bold mt-4" style={{ color: COLORS.textPrimary }}>
            {personalInfo.name}
          </Text>
          <Text className="text-sm font-medium mt-1" style={{ color: COLORS.primary }}>
            {personalInfo.title || "Software Engineer"}
          </Text>
        </View>

        {/* SECTION: Social Channels Card */}
        <Text className="text-lg font-bold mb-3 px-1" style={{ color: COLORS.textPrimary }}>
          Connect with me
        </Text>
        <View 
          className="rounded-3xl p-2 border mb-6"
          style={{ backgroundColor: COLORS.card, borderColor: COLORS.border, elevation: 1 }}
        >
          {socialLinks.map((item, index) => (
            <TouchableOpacity
              key={index}
              className={`flex-row items-center justify-between p-3.5 ${
                index !== socialLinks.length - 1 ? "border-b" : ""
              }`}
              style={{ borderColor: COLORS.background }}
              onPress={() => handleLinkPress(item.href)}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center flex-1 pr-4">
                <View className="w-6 items-center justify-center mr-3.5">
                  <FontAwesome name={item.icon} size={20} color={COLORS.textPrimary} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold" style={{ color: COLORS.textPrimary }}>
                    {item.label}
                  </Text>
                  <Text className="text-xs mt-0.5" style={{ color: COLORS.textSecondary }}>
                    {item.subtitle}
                  </Text>
                </View>
              </View>

              <View 
                className="flex-row items-center px-3 py-1.5 rounded-xl gap-1"
                style={{ backgroundColor: COLORS.background }}
              >
                <Text className="text-[10px] font-bold uppercase tracking-wider" style={{ color: COLORS.primary }}>
                  {item.actionText}
                </Text>
                <Ionicons name="open-outline" size={11} color={COLORS.primary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* SECTION: Technical Skill Blocks Section */}
        <Text className="text-lg font-bold mb-3 px-1" style={{ color: COLORS.textPrimary }}>
          Skills & Expertises
        </Text>
        <View 
          className="rounded-3xl p-5 border mb-6"
          style={{ backgroundColor: COLORS.card, borderColor: COLORS.border, elevation: 1 }}
        >
          {Object.entries(skills).map(([category, list], idx, arr) => (
            <View key={category} className={idx !== arr.length - 1 ? "mb-4" : ""}>
              <Text className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: COLORS.textSecondary }}>
                {category}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {list.map((skill) => (
                  <View 
                    key={skill}
                    className="px-3 py-1.5 rounded-xl"
                    style={{ backgroundColor: COLORS.background }}
                  >
                    <Text className="text-xs font-semibold" style={{ color: COLORS.textPrimary }}>
                      {skill}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* SECTION: Educational Credentials Timelines */}
        <Text className="text-lg font-bold mb-3 px-1" style={{ color: COLORS.textPrimary }}>
          Education
        </Text>
        <View className="gap-4">
          {education.map((edu, index) => (
            <View
              key={index}
              className="rounded-3xl p-5 border"
              style={{ backgroundColor: COLORS.card, borderColor: COLORS.border, elevation: 1 }}
            >
              <View className="flex-row justify-between items-start flex-wrap gap-1">
                <View className="flex-1 pr-2">
                  <Text className="text-base font-bold" style={{ color: COLORS.textPrimary }}>
                    {edu.institution}
                  </Text>
                  <Text className="text-xs mt-0.5 font-medium" style={{ color: COLORS.textSecondary }}>
                    {edu.location}
                  </Text>
                </View>
                <View 
                  className="px-2.5 py-1 rounded-lg"
                  style={{ backgroundColor: COLORS.background }}
                >
                  <Text className="text-[10px] font-bold" style={{ color: COLORS.primary }}>
                    {edu.metric}
                  </Text>
                </View>
              </View>

              <Text className="text-xs font-semibold mt-3" style={{ color: COLORS.textPrimary }}>
                {edu.degree}
              </Text>
              <Text className="text-[11px] font-medium mt-1" style={{ color: COLORS.inactive }}>
                {edu.timeline}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </AnimatedScreen>
  );
};

export default Developer;