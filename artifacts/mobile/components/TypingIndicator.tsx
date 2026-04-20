import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useColors } from "@/hooks/useColors";

function Dot({ delay }: { delay: number }) {
  const colors = useColors();
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-5, { duration: 300, easing: Easing.out(Easing.ease) }),
          withTiming(0, { duration: 300, easing: Easing.in(Easing.ease) })
        ),
        -1,
        false
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        style,
        styles.dot,
        { backgroundColor: colors.primary },
      ]}
    />
  );
}

export default function TypingIndicator() {
  const colors = useColors();

  return (
    <View style={[styles.row]}>
      <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
        <View style={[styles.avatarDot, { backgroundColor: "#5AC8FA" }]} />
      </View>
      <View style={[styles.bubble, { backgroundColor: colors.aiBubble, borderColor: colors.border }]}>
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  bubble: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 5,
    borderWidth: 1,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
});
