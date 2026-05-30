import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";

import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "@/constants/theme";

const ScannerModal = ({ visible, onClose, onScanSuccess }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (visible) {
      setScanned(false);
      requestPermission();
    }
  }, [visible]);

  const handleBarcodeScanned = ({ data }) => {
    if (scanned) return;

    setScanned(true);

    try {
      const parsed = JSON.parse(data);
      const token = parsed?.token;

      if (!token) {
        Alert.alert("Invalid QR Code", "Token not found.");
        setScanned(false);
        return;
      }

      onScanSuccess(token);
    } catch (error) {
      Alert.alert("Invalid QR Code", "Failed to read QR code.");
      setScanned(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/80 justify-center px-5">
        <View className="bg-card rounded-3xl overflow-hidden">
          <View className="flex-row items-center justify-between p-5">
            <View>
              <Text className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>
                Scan Attendance QR
              </Text>
              <Text className="mt-1" style={{ color: COLORS.textSecondary }}>
                Position the QR code inside the frame
              </Text>
            </View>

            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={26} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <View className="h-96 bg-black mx-5 rounded-3xl overflow-hidden mb-5">
            {permission?.granted ? (
              <CameraView
                style={{ flex: 1 }}
                facing="back"
                barcodeScannerSettings={{
                  barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
              />
            ) : (
              <View className="flex-1 items-center justify-center px-5">
                <Ionicons name="camera-outline" size={44} color={COLORS.white} />
                <Text className="text-white text-center mt-3">
                  Camera permission is required to scan QR codes.
                </Text>

                <TouchableOpacity
                  onPress={requestPermission}
                  className="mt-5 px-5 py-3 rounded-2xl"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  <Text className="text-white font-semibold">
                    Allow Camera
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={onClose}
            className="mx-5 mb-5 rounded-2xl py-4 items-center"
            style={{ backgroundColor: COLORS.primary }}
          >
            <Text className="text-white font-semibold">Close Scanner</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ScannerModal;