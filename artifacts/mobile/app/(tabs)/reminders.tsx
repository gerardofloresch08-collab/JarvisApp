import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ReminderCard from "@/components/ReminderCard";
import { useJarvis } from "@/context/JarvisContext";
import { useColors } from "@/hooks/useColors";

export default function RemindersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { reminders, addReminder, toggleReminder, deleteReminder } = useJarvis();
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [showForm, setShowForm] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const active = reminders.filter((r) => !r.completed);
  const done = reminders.filter((r) => r.completed);

  const handleAdd = () => {
    if (!title.trim()) {
      Alert.alert("Required", "Please enter a reminder title.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addReminder(title.trim(), time.trim());
    setTitle("");
    setTime("");
    setShowForm(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
          Reminders
        </Text>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowForm((v) => !v);
          }}
          style={[
            styles.addBtn,
            { backgroundColor: showForm ? colors.muted : colors.primary },
          ]}
        >
          <Ionicons
            name={showForm ? "close" : "add"}
            size={20}
            color={showForm ? colors.mutedForeground : "#fff"}
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottomPad + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {showForm && (
          <View
            style={[
              styles.form,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <TextInput
              style={[
                styles.formInput,
                {
                  color: colors.foreground,
                  backgroundColor: colors.secondary,
                  fontFamily: "Inter_400Regular",
                },
              ]}
              value={title}
              onChangeText={setTitle}
              placeholder="Reminder title..."
              placeholderTextColor={colors.mutedForeground}
              autoFocus
            />
            <TextInput
              style={[
                styles.formInput,
                {
                  color: colors.foreground,
                  backgroundColor: colors.secondary,
                  fontFamily: "Inter_400Regular",
                },
              ]}
              value={time}
              onChangeText={setTime}
              placeholder="Time (e.g. 3:00 PM)"
              placeholderTextColor={colors.mutedForeground}
            />
            <Pressable
              onPress={handleAdd}
              style={[styles.saveBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.saveBtnText, { fontFamily: "Inter_600SemiBold" }]}>
                Add Reminder
              </Text>
            </Pressable>
          </View>
        )}

        {active.length === 0 && done.length === 0 && !showForm ? (
          <View style={styles.empty}>
            <Ionicons name="notifications-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}>
              No reminders yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              Tap + to add your first reminder
            </Text>
          </View>
        ) : null}

        {active.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>
              UPCOMING
            </Text>
            {active.map((r) => (
              <ReminderCard
                key={r.id}
                reminder={r}
                onToggle={toggleReminder}
                onDelete={deleteReminder}
              />
            ))}
          </View>
        )}

        {done.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>
              COMPLETED
            </Text>
            {done.map((r) => (
              <ReminderCard
                key={r.id}
                reminder={r}
                onToggle={toggleReminder}
                onDelete={deleteReminder}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 28,
    letterSpacing: -0.5,
  },
  addBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  form: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    gap: 10,
  },
  formInput: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  saveBtn: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
});
