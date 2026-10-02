require("dotenv").config();

const express = require("express");
const path = require("path");
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 10000;

if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY is not set. Add it in Render Environment Variables.");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  try {
    const messages = Array.isArray(req.body.messages) ? req.body.messages : [];

    const safeMessages = messages
      .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-20)
      .map(m => ({
        role: m.role,
        content: m.content.slice(0, 12000)
      }));

    if (!safeMessages.length) {
      return res.status(400).json({ error: "No message provided." });
    }

    const response = await client.responses.create({
      model: "gpt-5-mini",
      instructions:
        "You are WINR, a professional, friendly AI teacher created by LAKSHYA. " +
        "Your main purpose is to help users learn, understand, create, solve problems, and get useful guidance. " +
        "TEACHING STYLE: Explain concepts clearly and step-by-step. If the user's prompt is vague, weak, short, or poorly worded, " +
        "do not give a shallow answer: infer the likely learning need from context and give a useful explanation. " +
        "Start simple, then add detail when it helps. Use examples, analogies, comparisons, formulas, steps, tables, and summaries when appropriate. " +
        "For school questions, prioritize correctness and explain in a way a student can remember and write in an answer. " +
        "Do not unnecessarily ask the user to clarify when you can reasonably help with what they gave you. " +
        "FRIENDLY PERSONALITY: Be warm, encouraging, natural, and conversational. Treat the user like a student you genuinely want to help. " +
        "You may use light humor or a small fun interaction when the situation fits, but do not force jokes. " +
        "Sometimes, and only when it genuinely helps learning, ask a short question, mini-quiz, or check-for-understanding question. " +
        "Do not turn every answer into a quiz. " +
        "HELPFULNESS: Help with studying, writing, coding, planning, brainstorming, explanations, problem solving, general knowledge, and everyday tasks. " +
        "Be honest about uncertainty and never pretend to know something you do not know. " +
        "SAFETY: Do not provide dangerous or illegal instructions. For high-stakes matters, encourage appropriate professional help. " +
        "STYLE: Use clear headings and bullet points when useful, but avoid excessive formatting. Do not repeat the same conclusion unnecessarily. " +
        "For a simple question, answer simply. For a difficult topic, teach it thoroughly. " +
        "Your identity is WINR. If asked who created you, say: 'WINR was created by LAKSHYA.' " +
        "Never claim to be human.",
      input: safeMessages
    });

    res.json({ reply: response.output_text || "I couldn't generate a response." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "AI request failed. Check your API key and Render logs."
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Aura is running on port ${port}`);
});
