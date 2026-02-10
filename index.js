import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";

const BOT_TOKEN = process.env.BOT_TOKEN;
const GEMINI_KEY = process.env.GEMINI_KEY;

if (!BOT_TOKEN || !GEMINI_KEY) {
  console.log("Missing keys");
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const prompt = msg.text;

  if (!prompt) return;

  bot.sendMessage(chatId, "🧠 Image generate cheyyunnu… 😮‍💨");

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );

    const data = await res.json();

    const img =
      data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!img) {
      bot.sendMessage(chatId, "❌ Image generate cheyyan pattiyilla");
      return;
    }

    const buffer = Buffer.from(img, "base64");
    bot.sendPhoto(chatId, buffer);

  } catch (err) {
    bot.sendMessage(chatId, "⚠️ Error vannu… later try cheyyൂ");
  }
});

console.log("AJAI Image Bot started 🤖");
