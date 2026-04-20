import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  createdAt: Date;
}

export interface QuickAction {
  id: string;
  label: string;
  prompt: string;
  icon: string;
}

interface JarvisContextType {
  messages: Message[];
  reminders: Reminder[];
  isTyping: boolean;
  addMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  addReminder: (title: string, time: string) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  quickActions: QuickAction[];
}

const JarvisContext = createContext<JarvisContextType | null>(null);

const QUICK_ACTIONS: QuickAction[] = [
  { id: "1", label: "Weather", prompt: "What's the weather like today? Give me a brief summary.", icon: "cloud" },
  { id: "2", label: "Schedule", prompt: "Help me plan my day productively.", icon: "calendar" },
  { id: "3", label: "Ideas", prompt: "Give me 3 creative ideas I can do today.", icon: "bulb" },
  { id: "4", label: "Focus", prompt: "I need to focus. Give me one powerful productivity tip.", icon: "flash" },
];

const STORAGE_KEYS = {
  messages: "jarvis_messages",
  reminders: "jarvis_reminders",
};

const API_BASE = `https://${process.env["EXPO_PUBLIC_DOMAIN"]}`;

function makeId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

async function callClaudeAPI(
  history: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  const response = await fetch(`${API_BASE}/api/jarvis/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: history }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = (await response.json()) as { content: string };
  return data.content;
}

export function JarvisProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Keep a ref so we can read current messages inside async callbacks
  const messagesRef = useRef<Message[]>([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    (async () => {
      try {
        const [storedMessages, storedReminders] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.messages),
          AsyncStorage.getItem(STORAGE_KEYS.reminders),
        ]);
        if (storedMessages) {
          const parsed = JSON.parse(storedMessages) as Message[];
          const hydrated = parsed.map((m) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }));
          setMessages(hydrated);
          messagesRef.current = hydrated;
        } else {
          const welcome: Message[] = [
            {
              id: "welcome",
              role: "assistant",
              content:
                "Hello! I'm Jarvis, your personal AI assistant powered by Claude. How can I help you today?",
              timestamp: new Date(),
            },
          ];
          setMessages(welcome);
          messagesRef.current = welcome;
        }
        if (storedReminders) {
          const parsed = JSON.parse(storedReminders) as Reminder[];
          setReminders(
            parsed.map((r) => ({ ...r, createdAt: new Date(r.createdAt) }))
          );
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    AsyncStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages)).catch(
      () => {}
    );
  }, [messages]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.reminders, JSON.stringify(reminders)).catch(
      () => {}
    );
  }, [reminders]);

  const addMessage = useCallback(async (content: string) => {
    const userMsg: Message = {
      id: makeId(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    // Append user message and get the full updated list
    const updatedMessages = [...messagesRef.current, userMsg];
    setMessages(updatedMessages);
    messagesRef.current = updatedMessages;
    setIsTyping(true);

    // Build conversation history for Claude (last 20 messages)
    const history = updatedMessages
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const aiContent = await callClaudeAPI(history);
      const aiMsg: Message = {
        id: makeId(),
        role: "assistant",
        content: aiContent,
        timestamp: new Date(),
      };
      const withAI = [...messagesRef.current, aiMsg];
      setMessages(withAI);
      messagesRef.current = withAI;
    } catch {
      const errMsg: Message = {
        id: makeId(),
        role: "assistant",
        content:
          "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      const withErr = [...messagesRef.current, errMsg];
      setMessages(withErr);
      messagesRef.current = withErr;
    } finally {
      setIsTyping(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setIsTyping(false);
    const welcome: Message = {
      id: "welcome-" + makeId(),
      role: "assistant",
      content: "Conversation cleared. What would you like to talk about?",
      timestamp: new Date(),
    };
    const reset = [welcome];
    setMessages(reset);
    messagesRef.current = reset;
  }, []);

  const addReminder = useCallback((title: string, time: string) => {
    const reminder: Reminder = {
      id: makeId(),
      title,
      time,
      completed: false,
      createdAt: new Date(),
    };
    setReminders((prev) => [reminder, ...prev]);
  }, []);

  const toggleReminder = useCallback((id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return (
    <JarvisContext.Provider
      value={{
        messages,
        reminders,
        isTyping,
        addMessage,
        clearMessages,
        addReminder,
        toggleReminder,
        deleteReminder,
        quickActions: QUICK_ACTIONS,
      }}
    >
      {children}
    </JarvisContext.Provider>
  );
}

export function useJarvis() {
  const ctx = useContext(JarvisContext);
  if (!ctx) throw new Error("useJarvis must be used within JarvisProvider");
  return ctx;
}
