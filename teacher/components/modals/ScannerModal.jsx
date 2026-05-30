import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";

import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

import { ThemeContext } from "@/context/ThemeProvider";

const ScannerModal = ({ visible, onClose, onScanSuccess }) => {
  const { COLORS } = useContext(ThemeContext);
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
      {/* Dimmed Modal Backdrop Overlap layer */}
      <View className="flex-1 bg-black/80 justify-center px-5">
        <View 
          className="rounded-3xl overflow-hidden"
          style={{ backgroundColor: COLORS.card }}
        >
          {/* Header Description Section */}
          <View className="flex-row items-center justify-between p-5">
            <View className="flex-1 pr-2">
              <Text className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>
                Scan Attendance QR
              </Text>
              <Text className="mt-1 text-xs" style={{ color: COLORS.textSecondary }}>
                Position the QR code inside the frame
              </Text>
            </View>

            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={26} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Camera Viewport View Container */}
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
              /* Fallback Missing Permissions View Block */
              <View className="flex-1 items-center justify-center px-5">
                <Ionicons name="camera-outline" size={44} color={COLORS.white} />
                <Text className="text-white text-center mt-3 text-sm">
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

          {/* Actions Close Trigger Button */}
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