/**
 * 본인 텔레그램 알림 — TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID 없으면 silently skip.
 * 사용자 응답에 영향 안 주도록 best-effort.
 */

export async function notifyTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    return
  }
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })
  } catch {
    // 알림 실패해도 lead 저장은 성공 — 사용자에겐 영향 X
  }
}
