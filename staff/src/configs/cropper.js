import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export const pickAndCropProfileImage = async () => {
  const permission =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    Alert.alert(
      "Permission Required",
      "Please allow gallery access."
    );
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (result.canceled) {
    return null;
  }

  const image = result.assets[0];

  return {
    preview: image.uri,
    file: {
      uri: image.uri,
      name: "profile.jpg",
      type: image.mimeType || "image/jpeg",
    },
  };
};