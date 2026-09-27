import express, { type NextFunction, type Request, type Response } from "express";
import { sendTelegramMessage } from "./telegram.js";

const app = express();
const port = Number(process.env.PORT || 10000);
const token = process.env.TELEGRAM_BOT_TOKEN;

app.get("/api/healthz", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.post(
  "/api/telegram/webhook",
  express.json(),
  async (req: Request, res: Response) => {
    res.sendStatus(200);

    if (!token) return;

    try {
      const message = req.body?.message;
      const chatId = message?.chat?.id;
      const text =
        typeof message?.text === "string" ? message.text.trim() : "";

      if (!chatId || !text) return;

      const command = text.split(/\s+/)[0].toLowerCase();

      if (command === "/start" || command.startsWith("/start@")) {
        await sendTelegramMessage(
          chatId,
          "🚀 Добро пожаловать в UGLYBABY AI!\n\nТвой AI-помощник для TikTok.\n\nНажми кнопку ниже, чтобы начать анализ.",
          token
        );
      }
    } catch {
      console.error("Telegram webhook processing error");
    }
  }
);

app.use(
  (error: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (error instanceof SyntaxError) {
      return res.sendStatus(200);
    }
    next(error);
  }
);

app.listen(port, "0.0.0.0", () => {
  console.log(`UGLYBABY AI server listening on port ${port}`);
});
