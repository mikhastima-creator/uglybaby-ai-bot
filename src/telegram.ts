const TELEGRAM_API = "https://api.telegram.org";

export async function sendTelegramMessage(
  chatId: number | string,
  text: string,
  token: string
): Promise<void> {
  const response = await fetch(
    `${TELEGRAM_API}/bot${encodeURIComponent(token)}/sendMessage`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📊 Анализировать TikTok",
                callback_data: "analyze_tiktok"
              }
            ]
          ]
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Telegram API returned HTTP ${response.status}`);
  }
}
