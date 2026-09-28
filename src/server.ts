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

/* =========================
   PUBLIC WEBSITE
   ========================= */

app.get("/", (_req, res) => {
  res.type("html").send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>UGLYBABY AI</title>
      </head>
      <body>
        <h1>UGLYBABY AI</h1>
        <p>AI assistant for TikTok creators.</p>

        <p>
          <a href="/terms">Terms of Service</a>
        </p>

        <p>
          <a href="/privacy">Privacy Policy</a>
        </p>
      </body>
    </html>
  `);
});

/* =========================
   TERMS OF SERVICE
   ========================= */

app.get("/terms", (_req, res) => {
  res.type("html").send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Terms of Service - UGLYBABY AI</title>
      </head>
      <body>
        <h1>Terms of Service</h1>

        <p>
          These Terms of Service govern your use of UGLYBABY AI.
        </p>

        <p>
          UGLYBABY AI provides tools and services designed to help
          TikTok creators analyze public content and improve their
          content strategy.
        </p>

        <p>
          By using this service, you agree to use it lawfully and
          responsibly.
        </p>

        <p>
          The service may be updated, modified, or discontinued
          at any time.
        </p>

        <p>
          Contact: mikhastima@gmail.com
        </p>
      </body>
    </html>
  `);
});

/* =========================
   PRIVACY POLICY
   ========================= */

app.get("/privacy", (_req, res) => {
  res.type("html").send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Privacy Policy - UGLYBABY AI</title>
      </head>
      <body>
        <h1>Privacy Policy</h1>

        <p>
          UGLYBABY AI respects your privacy.
        </p>

        <p>
          We may process information required to provide the
          service, including information supplied by users and
          information obtained through authorized integrations.
        </p>

        <p>
          We do not sell personal information.
        </p>

        <p>
          Information is used to operate, maintain, and improve
          the service.
        </p>

        <p>
          Contact: mikhastima@gmail.com
        </p>
      </body>
    </html>
  `);
});

/* =========================
   HEALTH CHECK
   ========================= */

app.get("/api/healthz", (_req, res) => {
  res.status(200).json({ ok: true });
});

/* =========================
   TELEGRAM WEBHOOK
   ========================= */

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

/* =========================
   START SERVER
   ========================= */

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `UGLYBABY AI server listening on port ${PORT}`
  );
});
