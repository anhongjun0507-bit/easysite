import type { Metadata } from 'next'
import { GateForm } from './GateForm'

export const metadata: Metadata = {
  title: { absolute: '보관함' },
  robots: { index: false, follow: false },
}

// 미들웨어가 쿠키 없는 /letters 요청을 여기로 rewrite 한다(주소는 /letters 그대로).
export default function LettersGatePage() {
  return <GateForm />
}
