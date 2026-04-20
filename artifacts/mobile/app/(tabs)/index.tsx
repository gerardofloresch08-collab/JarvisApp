import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ChatBubble from "@/components/ChatBubble";
import OrbAnimation from "@/components/OrbAnimation";
import QuickActionChip from "@/components/QuickActionChip";
import TypingIndicator from "@/components/TypingIndicator";
import { useJarvis } from "@/context/JarvisContext";
import { useColors } from "@/hooks/useColors";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { messages, isTyping, addMessage, clearMessages, quickActions } = useJarvis();
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInputText("");
    await addMessage(text);
    inputRef.current?.focus();
  };

  const handleQuickAction = async (prompt: string) => {
    await addMessage(prompt);
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
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
        <View style={styles.headerLeft}>
          <OrbAnimation size={22} active={isTyping} />
          <View style={styles.headerTextGroup}>
            <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>
              Jarvis
            </Text>
            <Text style={[styles.headerStatus, { color: isTyping ? colors.primary : colors.accent, fontFamily: "Inter_400Regular" }]}>
              {isTyping ? "Thinking..." : "Online"}
            </Text>
          </View>
        </View>
        <Pressable onPress={clearMessages} hitSlop={8} style={styles.clearBtn}>
          <Ionicons name="refresh-outline" size={20} color={colors.mutedForeground} />
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        ListHeaderComponent={
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsContainer}
            style={styles.quickActionsScroll}
          >
            {quickActions.map((action) => (
              <QuickActionChip
                key={action.id}
                action={action}
                onPress={handleQuickAction}
              />
            ))}
          </ScrollView>
        }
        contentContainerStyle={styles.messageList}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      />

      <View
        style={[
          styles.inputArea,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: bottomPad + 10,
          },
        ]}
      >
        <View
          style={[
            styles.inputRow,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              { color: colors.foreground, fontFamily: "Inter_400Regular" },
            ]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Message Jarvis..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            maxLength={500}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <Pressable
            onPress={handleSend}
            style={[
              styles.sendBtn,
              {
                backgroundColor: inputText.trim() ? colors.primary : colors.muted,
              },
            ]}
            disabled={!inputText.trim()}
          >
            <Ionicons
              name="arrow-up"
              size={18}
              color={inputText.trim() ? "#fff" : colors.mutedForeground}
            />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTextGroup: {
    gap: 1,
  },
  headerTitle: {
    fontSize: 17,
    letterSpacing: -0.3,
  },
  headerStatus: {
    fontSize: 12,
  },
  clearBtn: {
    padding: 4,
  },
  quickActionsScroll: {
    marginTop: 12,
    marginBottom: 4,
  },
  quickActionsContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  messageList: {
    paddingTop: 4,
    paddingBottom: 12,
  },
  inputArea: {
    paddingTop: 10,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 24,
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 120,
    lineHeight: 20,
    paddingVertical: 4,
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
});
