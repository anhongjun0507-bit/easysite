import type { Metadata } from 'next'
import { WizardShell } from './WizardShell'
import { parseStepParam, type StepId } from './lib/state'

export const metadata: Metadata = {
  title: '1분 만에 견적 받기',
  description:
    '몇 가지만 골라주시면 영업일 24시간 안에 견적·미리보기를 카톡으로 보내드려요.',
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
