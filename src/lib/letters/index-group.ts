import type { LetterEntry } from '@/content/letters'

export type LetterMonth = {
  /** 'YYYY-MM' */
  key: string
  /** '2026년 3월' */
  label: string
  entries: LetterEntry[]
}

/** 우편함 인덱스용 — 엔트리를 달(月)로 묶는다. 입력 순서(시간순)를 그대로 지킨다. */
export function groupByMonth(entries: LetterEntry[]): LetterMonth[] {
  const months: LetterMonth[] = []
  for (const entry of entries) {
    const [y, m] = entry.date.split('-')
    const key = `${y}-${m}`
    const last = months[months.length - 1]
    if (last?.key === key) last.entries.push(entry)
    else months.push({ key, label: `${y}년 ${Number(m)}월`, entries: [entry] })
  }
  return months
}
