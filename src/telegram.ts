const TELEGRAM_API = "https://api.telegram.org";

export async function sendTelegramMessage(
  chatId: number | string,
  text: string,
  token: string
): Promise<void> {
  const response = await fetch(
    `${TELEGRAM_API}/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📊 Анализировать TikTok",
                callback_data: "analyze_tiktok",
              },
            ],
          ],
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Telegram API returned HTTP ${response.status}: ${errorText}`
    );
  }
}
