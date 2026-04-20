import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import { Message } from "@/context/JarvisContext";

interface ChatBubbleProps {
  message: Message;
}

function formatTime(date: Date): string {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const colors = useColors();
  const isUser = message.role === "user";

  return (
    <View style={[styles.row, isUser ? styles.userRow : styles.aiRow]}>
      {!isUser && (
        <View
          style={[
            styles.avatar,
            { backgroundColor: colors.primary },
          ]}
        >
          <View style={[styles.avatarDot, { backgroundColor: "#5AC8FA" }]} />
        </View>
      )}
      <View style={styles.bubbleWrapper}>
        <View
          style={[
            styles.bubble,
            isUser
              ? [styles.userBubble, { backgroundColor: colors.primary }]
              : [styles.aiBubble, { backgroundColor: colors.aiBubble, borderColor: colors.border }],
          ]}
        >
          <Text
            style={[
              styles.text,
              {
                color: isUser ? "#FFFFFF" : colors.foreground,
                fontFamily: "Inter_400Regular",
              },
            ]}
          >
            {message.content}
          </Text>
        </View>
        <Text
          style={[
            styles.timestamp,
            {
              color: colors.mutedForeground,
              fontFamily: "Inter_400Regular",
              textAlign: isUser ? "right" : "left",
            },
          ]}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginVertical: 4,
    paddingHorizontal: 16,
    alignItems: "flex-end",
  },
  userRow: {
    justifyContent: "flex-end",
  },
  aiRow: {
    justifyContent: "flex-start",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  avatarDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  bubbleWrapper: {
    maxWidth: "75%",
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 3,
    marginHorizontal: 4,
  },
});
