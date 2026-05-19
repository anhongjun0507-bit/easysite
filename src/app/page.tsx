import { Hero } from '@/components/landing/Hero'
import { PainPoints } from '@/components/landing/PainPoints'
import { Differentiators } from '@/components/landing/Differentiators'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Faq } from '@/components/landing/Faq'
import { FinalCta } from '@/components/landing/FinalCta'

export default function Home() {
  return (
    <>
      <Hero />
      <PainPoints />
      <Differentiators />
      <HowItWorks />
      <Faq />
      <FinalCta />
    </>
  )
}
