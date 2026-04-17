import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// ✅ Fix for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve static files
app.use(express.static(path.join(__dirname, "public")));

// ✅ FIX: serve index.html on root "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let usage = {};

app.post("/reply", async (req, res) => {
  const { message, userId } = req.body;

  if (!usage[userId]) usage[userId] = 0;

  if (usage[userId] >= 5) {
    return res.json({ reply: "LIMIT_REACHED" });
  }

  usage[userId]++;

  try {
    const prompt = `
User message: "${message}"

Generate 3 replies:
1. Professional
2. Friendly
3. Smart/Persuasive

Short and clear.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating reply");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});