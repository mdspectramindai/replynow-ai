import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());
app.use(express.static("public"));

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