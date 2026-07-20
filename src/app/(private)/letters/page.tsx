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

// 정적 페이지 — DB 없이 content/letters.ts 만 읽는다. (접근 통제는 미들웨어가 담당)
export default function LettersPage() {
  return (
    <LettersShell>
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
