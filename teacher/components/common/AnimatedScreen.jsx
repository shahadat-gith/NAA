import React, { useCallback } from "react";
import { useFocusEffect } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const AnimatedScreen = ({ children }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  useFocusEffect(
    useCallback(() => {
      opacity.value = 0;
      translateY.value = 12;

      opacity.value = withTiming(1, {
        duration: 220,
      });

      translateY.value = withTiming(0, {
        duration: 220,
      });
    }, [])
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {
        translateY: translateY.value,
      },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          flex: 1,
        },
        animatedStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default AnimatedScreen;