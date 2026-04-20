import Anthropic from "@anthropic-ai/sdk";
import { Router } from "express";

const router = Router();

const baseURL = process.env["AI_INTEGRATIONS_ANTHROPIC_BASE_URL"];
const apiKey = process.env["AI_INTEGRATIONS_ANTHROPIC_API_KEY"];

if (!baseURL || !apiKey) {
  throw new Error(
    "AI_INTEGRATIONS_ANTHROPIC_BASE_URL and AI_INTEGRATIONS_ANTHROPIC_API_KEY must be set.",
  );
}

const anthropic = new Anthropic({ baseURL, apiKey });

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

router.post("/jarvis/chat", async (req, res) => {
  const { messages } = req.body as { messages: ChatMessage[] };

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages array is required" });
    return;
  }

  const validMessages = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role, content: String(m.content) }));

  if (validMessages.length === 0) {
    res.status(400).json({ error: "No valid messages provided" });
    return;
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system:
        "You are Jarvis, a highly intelligent and helpful personal AI assistant. You are concise, warm, and genuinely useful. You help users with planning, thinking through problems, productivity, creativity, and answering questions. Keep responses conversational and appropriately brief for a mobile chat interface — typically 1-4 sentences unless the question requires more detail. Do not use markdown formatting like ** or ##.",
      messages: validMessages,
    });

    const block = response.content[0];
    const content = block.type === "text" ? block.text : "";

    res.json({ content });
  } catch (err) {
    req.log.error({ err }, "Anthropic API error");
    res.status(500).json({ error: "Failed to get response from Claude" });
  }
});

export default router;
