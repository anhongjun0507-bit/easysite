'use client'

import { useLettersEnv } from './LettersShell'

/**
 * 사운드 토글 — 인트로에서 한 번 고른 뒤에도 언제든 바꿀 수 있게.
 * 아직 고르지 않았으면(=인트로에서 묻는 중) 표시하지 않는다.
 */
export function SoundToggle() {
  const { sound, chooseSound } = useLettersEnv()
  if (sound === null) return null

  return (
    <button
      type="button"
      className="lt-sound"
      onClick={() => chooseSound(!sound)}
      aria-pressed={sound}
      aria-label={sound ? '소리 끄기' : '소리 켜기'}
    >
      <span className="lt-sound-bars" data-on={sound || undefined} aria-hidden>
        <i />
        <i />
        <i />
      </span>
      <span className="lt-sound-text">{sound ? '소리 켬' : '소리 끔'}</span>
    </button>
  )
}
