import type { Metadata } from 'next'
import { Hero } from '@/components/landing/Hero'
import { PainPoints } from '@/components/landing/PainPoints'
import { Differentiators } from '@/components/landing/Differentiators'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Testimonials } from '@/components/landing/Testimonials'
import { Faq } from '@/components/landing/Faq'
import { FinalCta } from '@/components/landing/FinalCta'

// 구브랜드 EasySite 메인(7섹션) → 지으리 전환 후 /home 으로 보존.
// 루트(/)는 미들웨어가 지으리 사전등록 랜딩으로 rewrite. 여기는 견적·위저드·포트폴리오 동선 페이지.
export const metadata: Metadata = {
  alternates: { canonical: '/home' },
}

export default function Home() {
  return (
    <>
      <Hero />
      <PainPoints />
      <Differentiators />
      <HowItWorks />
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  )
}
