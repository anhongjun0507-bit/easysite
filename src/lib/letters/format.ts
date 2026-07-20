/** /letters 날짜 표기 — 'YYYY-MM-DD' → '2026년 3월 14일' */
export function koDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${y}년 ${Number(m)}월 ${Number(d)}일`
}
