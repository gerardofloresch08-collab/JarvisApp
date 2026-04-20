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
  { id: "1", label: "Weather", prompt: "What's the weather like today?", icon: "cloud" },
  { id: "2", label: "Schedule", prompt: "Help me plan my day", icon: "calendar" },
  { id: "3", label: "Ideas", prompt: "Give me 3 creative ideas for today", icon: "bulb" },
  { id: "4", label: "Focus", prompt: "I need to focus. Give me a productivity tip.", icon: "flash" },
];

const JARVIS_RESPONSES: Record<string, string> = {
  weather: "Based on current conditions, it looks like a clear day ahead. Temperature around 72°F with a gentle breeze. Perfect for a walk outside.",
  schedule: "I'd suggest starting with your highest-priority task in the morning when your focus is sharpest. Block 25-minute deep work sessions with 5-minute breaks. What's your main goal today?",
  ideas: "Here are three ideas:\n\n1. Start a 30-day creative challenge — pick one skill to practice daily.\n2. Reach out to someone you haven't spoken to in months.\n3. Spend 10 minutes journaling about what's working well in your life.",
  focus: "Try the Pomodoro Technique: work intensely for 25 minutes, then take a 5-minute break. Close all notifications, put your phone face down, and commit to one task at a time. You've got this.",
  default: "I understand. Let me help you with that. Could you give me a bit more context so I can provide the best assistance?",
  hello: "Hello! I'm Jarvis, your personal AI assistant. I'm here to help you stay organized, get things done, and think through challenges. What can I do for you today?",
  hi: "Hi there! Ready to help whenever you are. What's on your mind?",
  reminder: "I've noted that down. I'll help you stay on track with your schedule.",
  thanks: "You're welcome! Is there anything else I can help you with?",
  thank: "Happy to help! Let me know if you need anything else.",
};

function generateResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  for (const [key, response] of Object.entries(JARVIS_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  const responses = [
    `Interesting question about "${userMessage.substring(0, 30)}...". Let me think through this carefully. The key insight here is that breaking complex problems into smaller steps makes them much more manageable. What aspect would you like to explore first?`,
    `Great question! Here's how I'd approach it:\n\n1. Start by defining the core objective clearly\n2. Identify any constraints or requirements\n3. Brainstorm multiple approaches\n4. Choose the most effective path forward\n\nWould you like me to elaborate on any of these steps?`,
    `I've analyzed your request. The most effective approach would be to focus on the fundamentals first, then build complexity gradually. What specific outcome are you hoping to achieve?`,
    `That's something I can definitely help with. Based on best practices, I'd recommend starting small and iterating quickly. Consistency over intensity is usually the winning formula. What's your timeline for this?`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

const STORAGE_KEYS = {
  messages: "jarvis_messages",
  reminders: "jarvis_reminders",
};

export function JarvisProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [storedMessages, storedReminders] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.messages),
          AsyncStorage.getItem(STORAGE_KEYS.reminders),
        ]);
        if (storedMessages) {
          const parsed = JSON.parse(storedMessages);
          setMessages(parsed.map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) })));
        } else {
          setMessages([
            {
              id: "welcome",
              role: "assistant",
              content: "Hello! I'm Jarvis, your personal AI assistant. How can I help you today?",
              timestamp: new Date(),
            },
          ]);
        }
        if (storedReminders) {
          const parsed = JSON.parse(storedReminders);
          setReminders(parsed.map((r: Reminder) => ({ ...r, createdAt: new Date(r.createdAt) })));
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    AsyncStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages)).catch(() => {});
  }, [messages]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.reminders, JSON.stringify(reminders)).catch(() => {});
  }, [reminders]);

  const addMessage = useCallback(async (content: string) => {
    const userMsg: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const delay = 800 + Math.random() * 1200;
    typingTimeout.current = setTimeout(() => {
      const response = generateResponse(content);
      const aiMsg: Message = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  }, []);

  const clearMessages = useCallback(() => {
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    const welcome: Message = {
      id: "welcome-" + Date.now(),
      role: "assistant",
      content: "Conversation cleared. I'm ready to help — what's on your mind?",
      timestamp: new Date(),
    };
    setMessages([welcome]);
    setIsTyping(false);
  }, []);

  const addReminder = useCallback((title: string, time: string) => {
    const reminder: Reminder = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
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
