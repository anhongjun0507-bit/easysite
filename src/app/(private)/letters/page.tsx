import { LETTERS, TOTAL_COUNT } from '@/content/letters'
import { LettersShell } from './_components/LettersShell'
import { Preloader } from './_components/Preloader'
import { Intro } from './_components/Intro'
import { FlightPrologue } from './_components/FlightPrologue'
import { LetterTimeline } from './_components/LetterTimeline'
import { Epilogue } from './_components/Epilogue'
import { RouteProgress } from './_components/RouteProgress'
import { SoundToggle } from './_components/SoundToggle'
import { Mailbox } from './_components/Mailbox'
import { FontSwitch } from './_components/FontSwitch'

// DB 없이 content/letters.ts 만 읽는다. (접근 통제는 미들웨어가 담당)
// searchParams 는 서체 비교용 임시 스위처 때문에 받는다 — 확정되면 빼고 다시 정적 페이지가 된다.
export default function LettersPage({ searchParams }: { searchParams?: { font?: string | string[] } }) {
  return (
    <LettersShell>
      <FontSwitch font={searchParams?.font} />
      <Preloader />
      <Mailbox entries={LETTERS} />
      <RouteProgress />
      <SoundToggle />
      <main>
        <Intro />
        <FlightPrologue />
        <LetterTimeline entries={LETTERS} />
        <Epilogue total={TOTAL_COUNT} />
      </main>
    </LettersShell>
  )
}
