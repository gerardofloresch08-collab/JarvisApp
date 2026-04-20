import React, { useEffect } from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useColors } from "@/hooks/useColors";

interface OrbAnimationProps {
  size?: number;
  active?: boolean;
}

export default function OrbAnimation({ size = 80, active = false }: OrbAnimationProps) {
  const colors = useColors();
  const scale = useSharedValue(1);
  const opacity1 = useSharedValue(0.3);
  const opacity2 = useSharedValue(0.15);
  const rotation = useSharedValue(0);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    if (active) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.95, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      opacity1.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 600 }),
          withTiming(0.2, { duration: 600 })
        ),
        -1,
        true
      );
      opacity2.value = withRepeat(
        withSequence(
          withTiming(0.35, { duration: 700 }),
          withTiming(0.1, { duration: 700 })
        ),
        -1,
        true
      );
      rotation.value = withRepeat(withTiming(360, { duration: 4000, easing: Easing.linear }), -1);
    } else {
      cancelAnimation(scale);
      cancelAnimation(opacity1);
      cancelAnimation(opacity2);
      cancelAnimation(rotation);
      scale.value = withTiming(1, { duration: 400 });
      opacity1.value = withTiming(0.3, { duration: 400 });
      opacity2.value = withTiming(0.15, { duration: 400 });
      rotation.value = withTiming(0, { duration: 800 });
    }
  }, [active]);

  const coreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const ring1Style = useAnimatedStyle(() => ({
    opacity: opacity1.value,
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const ring2Style = useAnimatedStyle(() => ({
    opacity: opacity2.value,
    transform: [{ rotate: `${-rotation.value * 0.7}deg` }],
  }));

  const primaryBlue = isDark ? "#0A84FF" : "#007AFF";
  const pulseBlue = isDark ? "#5AC8FA" : "#32ADE6";

  return (
    <View style={[styles.container, { width: size * 2.4, height: size * 2.4 }]}>
      <Animated.View
        style={[
          styles.ring,
          ring2Style,
          {
            width: size * 2.2,
            height: size * 2.2,
            borderRadius: size * 1.1,
            borderColor: pulseBlue,
            borderWidth: 1,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          ring1Style,
          {
            width: size * 1.6,
            height: size * 1.6,
            borderRadius: size * 0.8,
            borderColor: primaryBlue,
            borderWidth: 1.5,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.core,
          coreStyle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: primaryBlue,
            shadowColor: primaryBlue,
            shadowRadius: active ? 24 : 12,
            shadowOpacity: active ? 0.9 : 0.5,
            shadowOffset: { width: 0, height: 0 },
            elevation: 8,
          },
        ]}
      >
        <View
          style={[
            styles.innerGlow,
            {
              width: size * 0.55,
              height: size * 0.55,
              borderRadius: size * 0.275,
              backgroundColor: pulseBlue,
              opacity: 0.7,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    borderStyle: "solid",
  },
  core: {
    alignItems: "center",
    justifyContent: "center",
  },
  innerGlow: {
    position: "absolute",
  },
});
