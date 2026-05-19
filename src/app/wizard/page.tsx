import type { Metadata } from 'next'
import { WizardShell } from './WizardShell'
import { parseStepParam, type StepId } from './lib/state'

export const metadata: Metadata = {
  title: '1분 만에 견적 받기',
  description:
    '1분 만에 사이트 견적 받기. 8단계 질문에 답하면 가격과 예상 시안을 보여드려요.',
  // 위저드는 funnel 페이지라 색인 안 시킴 (랜딩에서만 진입). canonical 도 의미 없어 생략.
  robots: { index: false, follow: false },
}

function pickFirst(raw: string | string[] | undefined): string | undefined {
  return Array.isArray(raw) ? raw[0] : raw
}

export default function WizardPage({
  searchParams,
}: {
  searchParams: { intent?: string | string[]; step?: string | string[] }
}) {
  const intent = (pickFirst(searchParams.intent) ?? '').trim().slice(0, 200)
  const stepFromUrl: StepId = parseStepParam(pickFirst(searchParams.step) ?? null)

  return <WizardShell initialIntent={intent} initialStepFromUrl={stepFromUrl} />
}
