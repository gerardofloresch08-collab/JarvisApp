import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

interface SettingRowProps {
  icon: string;
  label: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
}

function SettingRow({ icon, label, subtitle, right, onPress, showChevron }: SettingRowProps) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.row,
        { backgroundColor: colors.card, borderBottomColor: colors.border },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.secondary }]}>
        <Ionicons name={icon as any} size={18} color={colors.primary} />
      </View>
      <View style={styles.rowLabel}>
        <Text style={[styles.rowTitle, { color: colors.foreground, fontFamily: "Inter_500Medium" }]}>
          {label}
        </Text>
        {subtitle && (
          <Text style={[styles.rowSubtitle, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            {subtitle}
          </Text>
        )}
      </View>
      <View style={styles.rowRight}>
        {right}
        {showChevron && (
          <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
        )}
      </View>
    </Pressable>
  );
}

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>
        {title}
      </Text>
      <View style={[styles.sectionCard, { borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

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
          Settings
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.avatarLarge, { backgroundColor: colors.primary }]}>
            <View style={[styles.avatarInner, { backgroundColor: "#5AC8FA" }]} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
              Jarvis AI
            </Text>
            <Text style={[styles.profileSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              Personal Assistant
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: colors.accent }]}>
            <Text style={[styles.statusText, { fontFamily: "Inter_600SemiBold" }]}>Active</Text>
          </View>
        </View>

        <SettingSection title="ASSISTANT">
          <SettingRow
            icon="chatbubble-outline"
            label="Response Style"
            subtitle="Balanced"
            showChevron
          />
          <SettingRow
            icon="language-outline"
            label="Language"
            subtitle="English"
            showChevron
          />
          <SettingRow
            icon="volume-high-outline"
            label="Voice Feedback"
            right={<Switch value={false} onValueChange={() => {}} trackColor={{ true: colors.primary }} />}
          />
        </SettingSection>

        <SettingSection title="APPEARANCE">
          <SettingRow
            icon="moon-outline"
            label="Dark Mode"
            subtitle={isDark ? "On" : "Off"}
            right={<Switch value={isDark} onValueChange={() => {}} trackColor={{ true: colors.primary }} />}
          />
          <SettingRow
            icon="text-outline"
            label="Text Size"
            subtitle="Medium"
            showChevron
          />
        </SettingSection>

        <SettingSection title="NOTIFICATIONS">
          <SettingRow
            icon="notifications-outline"
            label="Push Notifications"
            right={<Switch value={true} onValueChange={() => {}} trackColor={{ true: colors.primary }} />}
          />
          <SettingRow
            icon="alarm-outline"
            label="Reminder Alerts"
            right={<Switch value={true} onValueChange={() => {}} trackColor={{ true: colors.primary }} />}
          />
        </SettingSection>

        <SettingSection title="PRIVACY">
          <SettingRow
            icon="shield-outline"
            label="Privacy Policy"
            showChevron
          />
          <SettingRow
            icon="document-text-outline"
            label="Terms of Service"
            showChevron
          />
          <SettingRow
            icon="trash-outline"
            label="Clear All Data"
            showChevron
          />
        </SettingSection>

        <Text style={[styles.version, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          JarvisApp v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 28,
    letterSpacing: -0.5,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 24,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  avatarLarge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 17 },
  profileSub: { fontSize: 13, marginTop: 2 },
  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: { color: "#fff", fontSize: 12 },
  section: { gap: 8 },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 0.8,
    marginLeft: 4,
  },
  sectionCard: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { flex: 1 },
  rowTitle: { fontSize: 15 },
  rowSubtitle: { fontSize: 12, marginTop: 2 },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 8,
  },
});
