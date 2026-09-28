import express, { type Request, type Response } from "express";
import { sendTelegramMessage } from "./telegram.js";

const app = express();

const PORT = Number(process.env.PORT || 8080);
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

app.use(express.json());

const keyboard = {
  keyboard: [
    [{ text: "📊 Анализ TikTok" }],
    [{ text: "🎬 Анализ ролика" }],
    [{ text: "💡 Советы" }, { text: "❓ Помощь" }],
  ],
  resize_keyboard: true,
  is_persistent: true,
};

async function send(
  chatId: number | string,
  text: string,
) {
  if (!TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN is missing");
    return;
  }

  await sendTelegramMessage(
    chatId,
    text,
    TOKEN,
    keyboard,
  );
}

function cleanUsername(text: string) {
  return text
    .trim()
    .replace(/^@/, "")
    .replace(/\s+/g, "");
}

function isUsername(text: string) {
  return /^@?[a-zA-Z0-9._]{2,50}$/.test(text.trim());
}

app.get("/", (_req, res) => {
  res.status(200).send("UGLYBABY AI is online 🚀");
});

app.get("/api/healthz", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "uglybaby-ai-bot",
  });
});

app.post(
  "/api/telegram/webhook",
  async (req: Request, res: Response) => {
    res.sendStatus(200);

    try {
      const message = req.body?.message;
      const chatId = message?.chat?.id;

      const text =
        typeof message?.text === "string"
          ? message.text.trim()
          : "";

      if (!chatId || !text) return;

      // START
      if (
        text === "/start" ||
        text.startsWith("/start@")
      ) {
        await send(
          chatId,
          "🚀 Добро пожаловать в UGLYBABY AI!\n\n" +
            "AI-помощник для TikTok.\n\n" +
            "Я помогу:\n" +
            "📊 анализировать аккаунты\n" +
            "🎬 разбирать ролики\n" +
            "💡 придумывать идеи\n" +
            "🪝 создавать сильные хуки\n" +
            "📈 находить точки роста\n\n" +
            "Выбери действие 👇",
        );
        return;
      }

      // TIKTOK ANALYSIS
      if (text === "📊 Анализ TikTok") {
        await send(
          chatId,
          "📊 Анализ TikTok\n\n" +
            "Отправь username TikTok.\n\n" +
            "Например:\n" +
            "@nike",
        );
        return;
      }

      // VIDEO ANALYSIS
      if (text === "🎬 Анализ ролика") {
        await send(
          chatId,
          "🎬 Анализ ролика\n\n" +
            "Отправь ссылку на TikTok-ролик.\n\n" +
            "Я подготовлю разбор:\n" +
            "🪝 хук\n" +
            "⏱ удержание\n" +
            "🎯 идея\n" +
            "💡 что улучшить",
        );
        return;
      }

      // TIPS
      if (text === "💡 Советы") {
        await send(
          chatId,
          "💡 UGLYBABY AI — советы\n\n" +
            "🎯 Идеи роликов\n" +
            "🪝 Хуки первых секунд\n" +
            "📝 Сценарии\n" +
            "📈 Стратегия роста\n" +
            "🔥 Контент-план\n" +
            "🏷️ Описания и хэштеги\n\n" +
            "Скоро добавим полноценный AI-анализ.",
        );
        return;
      }

      // HELP
      if (text === "❓ Помощь") {
        await send(
          chatId,
          "❓ Как пользоваться\n\n" +
            "1️⃣ Нажми «📊 Анализ TikTok»\n" +
            "2️⃣ Отправь @username\n\n" +
            "Или:\n" +
            "1️⃣ Нажми «🎬 Анализ ролика»\n" +
            "2️⃣ Отправь ссылку на ролик\n\n" +
            "Просто и быстро 🚀",
        );
        return;
      }

      // TIKTOK URL
      if (
        text.includes("tiktok.com/") ||
        text.includes("vm.tiktok.com/")
      ) {
        await send(
          chatId,
          "🎬 Ролик получен.\n\n" +
            "⏳ Подготавливаю анализ...\n\n" +
            "Сейчас работаем над подключением " +
            "реальных данных TikTok.\n\n" +
            "После подключения я смогу разбирать ролики " +
            "по хуку, просмотрам, удержанию и контенту.",
        );
        return;
      }

      // USERNAME
      if (isUsername(text)) {
        const username = cleanUsername(text);

        await send(
          chatId,
          `🔎 @${username}\n\n` +
            "✅ Профиль принят.\n\n" +
            "📊 Подготовка анализа...\n\n" +
            "Пока TikTok API не подключён, " +
            "я не буду придумывать статистику.\n\n" +
            "После подключения официальных данных " +
            "покажу реальные:\n" +
            "👤 профиль\n" +
            "🎬 ролики\n" +
            "👀 просмотры\n" +
            "❤️ лайки\n" +
            "💬 комментарии\n" +
            "📈 рекомендации.",
        );
        return;
      }

      // DEFAULT
      await send(
        chatId,
        "👋 Я UGLYBABY AI.\n\n" +
          "Используй меню ниже 👇\n\n" +
          "📊 Анализ TikTok\n" +
          "🎬 Анализ ролика\n" +
          "💡 Советы",
      );
    } catch (error) {
      console.error("Webhook error:", error);
    }
  },
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `UGLYBABY AI server listening on port ${PORT}`,
  );
});
