import React, { useContext } from "react";
import { View, Text } from "react-native";
import { ThemeContext } from "@/context/ThemeProvider";

const ProfileCard = ({ title, children }) => {
  const { COLORS } = useContext(ThemeContext);

  return (
    <View
      className="rounded-3xl p-5 mb-5"
      style={{
        elevation: 2,
        backgroundColor: COLORS.card,
      }}
    >
      <Text
        className="text-lg font-bold mb-4"
        style={{ color: COLORS.textPrimary }}
      >
        {title}
      </Text>

      <View>{children}</View>
    </View>
  );
};

export default ProfileCard;