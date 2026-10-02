require("dotenv").config();

const express = require("express");
const path = require("path");
const fs = require("fs");
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 10000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json({ limit: "1mb" }));

// Use public folder if it exists
const publicFolder = path.join(__dirname, "public");
const publicIndex = path.join(publicFolder, "index.html");
const rootIndex = path.join(__dirname, "index.html");

if (fs.existsSync(publicFolder)) {
  app.use(express.static(publicFolder));
}

// Also serve files from the root folder
app.use(express.static(__dirname));

app.post("/api/chat", async (req, res) => {
  try {
    const messages = Array.isArray(req.body.messages)
      ? req.body.messages
      : [];

    const safeMessages = messages
      .filter(
        m =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string"
      )
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
        "You are WINR, a professional and friendly AI teacher created by LAKSHYA. " +
        "Explain topics clearly and step-by-step. If a user's prompt is short, vague, or weak, " +
        "still provide a useful explanation instead of giving a shallow response. " +
        "Adapt the depth to the user's needs. Use examples, analogies, formulas, steps, " +
        "tables and summaries when helpful. Be friendly and encouraging. " +
        "You may occasionally use light humour or ask a short learning question, " +
        "but do not force jokes or quizzes. Help with studying, writing, coding, " +
        "problem solving, brainstorming and general tasks. " +
        "If asked who created you, say WINR was created by LAKSHYA.",
      input: safeMessages
    });

    res.json({
      reply: response.output_text || "I couldn't generate a response."
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "AI request failed. Check the API key and server logs."
    });
  }
});

// Open the website
app.get("*", (req, res) => {
  if (fs.existsSync(publicIndex)) {
    return res.sendFile(publicIndex);
  }

  if (fs.existsSync(rootIndex)) {
    return res.sendFile(rootIndex);
  }

  res.status(404).send("WINR website files not found.");
});

app.listen(port, () => {
  console.log(`WINR is running on port ${port}`);
});
