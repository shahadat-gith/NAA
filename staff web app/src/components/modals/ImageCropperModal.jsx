import { ThemeContext } from "@/context/ThemeProvider";
import React, { useContext, useRef } from "react";
import {
    Dimensions,
    Image,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import ImageZoom from "react-native-image-pan-zoom";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CROP_SIZE = SCREEN_WIDTH * 0.75;

const ImageCropperModal = ({ visible, imageUri, onClose, onCropSuccess }) => {
  const { COLORS } = useContext(ThemeContext);
  const zoomRef = useRef(null);

  const handleSaveCrop = () => {
    onCropSuccess({
      uri: imageUri,
      name: "profile.jpg",
      type: "image/jpeg",
    });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      {/* Keeping the master wrapper completely dark to give focus to the photo canvas */}
      <View className="flex-1 bg-black justify-between">
        {/* Header Bar */}
        <SafeAreaView className="flex-row items-center justify-between px-5 py-4 z-50">
          <Text className="text-white text-lg font-bold">
            Crop Profile Picture
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="p-1"
            activeOpacity={0.7}
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: COLORS.inactive }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </SafeAreaView>

        {/* ── CROP BOX VIEW CONTAINER ── */}
        <View
          className="items-center justify-center flex-1 relative"
          style={{ backgroundColor: COLORS.background }}
        >
          {imageUri && (
            <ImageZoom
              ref={zoomRef}
              cropWidth={SCREEN_WIDTH}
              cropHeight={SCREEN_HEIGHT * 0.6}
              imageWidth={SCREEN_WIDTH}
              imageHeight={SCREEN_HEIGHT * 0.6}
              minScale={1}
              maxScale={4}
              panToMove={true}
              pinchToZoom={true}
              useNativeDriver={false}
              enableDoubleClickZoom={true}
            >
              <View
                style={{ width: "100%", height: "100%" }}
                collapsible={false}
              >
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                />
              </View>
            </ImageZoom>
          )}

          {/* Masking focus circle – pulling your exact primary color token */}
          <View
            pointerEvents="none"
            className="absolute border-2 rounded-full"
            style={{
              width: CROP_SIZE,
              height: CROP_SIZE,
              borderColor: COLORS.primary,
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
          />

          <Text
            className="absolute bottom-10 text-xs font-medium text-center px-6"
            style={{ color: COLORS.textSecondary }}
          >
            Drag to reposition • Pinch with two fingers to zoom
          </Text>
        </View>

        {/* Action Button Strip – Styled dynamically with your theme colors */}
        <SafeAreaView className="px-5 pb-6">
          <TouchableOpacity
            onPress={handleSaveCrop}
            className="w-full py-4 rounded-2xl items-center justify-center shadow-md"
            style={{ backgroundColor: COLORS.primary }}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">
              Choose This Picture
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default ImageCropperModal;
