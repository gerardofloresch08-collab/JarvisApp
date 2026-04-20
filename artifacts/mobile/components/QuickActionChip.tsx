import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useColors } from "@/hooks/useColors";
import { QuickAction } from "@/context/JarvisContext";

interface Props {
  action: QuickAction;
  onPress: (prompt: string) => void;
}

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const iconMap: Record<string, IoniconsName> = {
  cloud: "cloud-outline",
  calendar: "calendar-outline",
  bulb: "bulb-outline",
  flash: "flash-outline",
};

export default function QuickActionChip({ action, onPress }: Props) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withTiming(0.93, { duration: 80 }, () => {
      scale.value = withTiming(1, { duration: 120 });
    });
    onPress(action.prompt);
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          animStyle,
          styles.chip,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Ionicons
          name={iconMap[action.icon] ?? "star-outline"}
          size={16}
          color={colors.primary}
        />
        <Text
          style={[
            styles.label,
            { color: colors.foreground, fontFamily: "Inter_500Medium" },
          ]}
        >
          {action.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  label: {
    fontSize: 13,
  },
});
