import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TextInput, TouchableOpacity } from "react-native";



const PasswordField = ({ label, value, onChangeText, visible, onToggleVisibility, colors }) => (
  <View className="mb-4">
    <Text className="text-xs font-semibold mb-2" style={{ color: colors.textSecondary }}>
      {label}
    </Text>
    <View
      className="flex-row items-center border rounded-2xl px-4"
      style={{ borderColor: colors.border, backgroundColor: colors.background }}
    >
      <Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!visible}
        placeholder={label}
        placeholderTextColor={colors.textSecondary}
        className="flex-1 py-4 ml-3 text-sm"
        style={{ color: colors.textPrimary }}
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={onToggleVisibility}>
        <Ionicons
          name={visible ? "eye-off-outline" : "eye-outline"}
          size={18}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  </View>
);


export default PasswordField
