import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useColors } from "@/hooks/useColors";
import { Reminder } from "@/context/JarvisContext";

interface Props {
  reminder: Reminder;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ReminderCard({ reminder, onToggle, onDelete }: Props) {
  const colors = useColors();
  const opacity = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggle(reminder.id);
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    opacity.value = withTiming(0, { duration: 250 }, () => {});
    setTimeout(() => onDelete(reminder.id), 250);
  };

  return (
    <Animated.View
      style={[
        animStyle,
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Pressable onPress={handleToggle} style={styles.checkArea}>
        <View
          style={[
            styles.checkbox,
            {
              borderColor: reminder.completed ? colors.accent : colors.border,
              backgroundColor: reminder.completed ? colors.accent : "transparent",
            },
          ]}
        >
          {reminder.completed && (
            <Ionicons name="checkmark" size={12} color="#fff" />
          )}
        </View>
      </Pressable>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: reminder.completed ? colors.mutedForeground : colors.foreground,
              fontFamily: "Inter_500Medium",
              textDecorationLine: reminder.completed ? "line-through" : "none",
            },
          ]}
          numberOfLines={2}
        >
          {reminder.title}
        </Text>
        {reminder.time ? (
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={12} color={colors.mutedForeground} />
            <Text
              style={[
                styles.time,
                { color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
              ]}
            >
              {reminder.time}
            </Text>
          </View>
        ) : null}
      </View>

      <Pressable onPress={handleDelete} style={styles.deleteBtn} hitSlop={8}>
        <Ionicons name="trash-outline" size={16} color={colors.mutedForeground} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    gap: 12,
  },
  checkArea: {
    padding: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  time: {
    fontSize: 12,
  },
  deleteBtn: {
    padding: 4,
  },
});
