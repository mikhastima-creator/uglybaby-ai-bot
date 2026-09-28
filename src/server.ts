import express, { type Request, type Response } from "express";
import { sendTelegramMessage } from "./telegram.js";

const app = express();

const PORT = Number(process.env.PORT || 10000);
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

app.use(express.json());

const keyboard = {
  keyboard: [
    [{ text: "📊 Анализ TikTok" }],
    [{ text: "💡 Советы" }, { text: "❓ Помощь" }],
  ],
  resize_keyboard: true,
  is_persistent: true,
};

async function send(
  chatId: number | string,
  text: string
) {
  if (!TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN is missing");
    return;
  }

  await sendTelegramMessage(
    chatId,
    text,
    TOKEN,
    keyboard
  );
}

app.get("/api/healthz", (_req, res) => {
  res.status(200).json({ ok: true });
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

      if (
        text === "/start" ||
        text.startsWith("/start@")
      ) {
        await send(
          chatId,
          "🚀 Добро пожаловать в UGLYBABY AI!\n\n" +
            "Твой AI-помощник для TikTok.\n\n" +
            "Выбери действие 👇"
        );
        return;
      }

      if (text === "📊 Анализ TikTok") {
        await send(
          chatId,
          "📊 Анализ TikTok\n\n" +
            "Отправь username TikTok.\n\n" +
            "Например: @username"
        );
        return;
      }

      if (text === "💡 Советы") {
        await send(
          chatId,
          "💡 Советы по TikTok\n\n" +
            "Я помогу с:\n" +
            "🎯 идеями роликов\n" +
            "🪝 хуками\n" +
            "📝 сценариями\n" +
            "📈 ростом аккаунта\n" +
            "🔥 контент-планом\n" +
            "🏷️ описаниями и хэштегами"
        );
        return;
      }

      if (text === "❓ Помощь") {
        await send(
          chatId,
          "❓ Помощь\n\n" +
            "Нажми «📊 Анализ TikTok» и отправь @username.\n\n" +
            "Или нажми «💡 Советы», чтобы получить идеи для TikTok."
        );
        return;
      }

      if (
        text.startsWith("@") ||
        /^[a-zA-Z0-9._]+$/.test(text)
      ) {
        const username = text.replace(/^@/, "");

        await send(
          chatId,
          `🔎 @${username}\n\n` +
            "Профиль принят для анализа.\n\n" +
            "⏳ Следующий этап — подключение данных TikTok.\n\n" +
            "После подключения я смогу показывать статистику, " +
            "анализировать ролики и давать рекомендации."
        );
        return;
      }

      await send(
        chatId,
        "👋 Используй кнопки меню или отправь TikTok username, например @username."
      );
    } catch (error) {
      console.error("Webhook error:", error);
    }
  }
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `UGLYBABY AI server listening on port ${PORT}`
  );
});
