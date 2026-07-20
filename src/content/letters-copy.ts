/**
 * /letters 화면 문구 — 명조(디스플레이) 서체로 그려지는 문장만 여기 모은다.
 *
 * 왜 한 파일에 모으나: 디스플레이 폰트를 **여기 등장하는 글자만** 남긴 초경량 서브셋으로 만들기 때문.
 * 문구를 고치면 반드시 `python3 scripts/subset-display-font.py` 를 다시 돌려야 한다.
 * (UI 라벨·날짜처럼 Pretendard 로 그리는 문구는 여기 두지 않는다.)
 */

export const DISPLAY = {
  /** 프리로더 — 로딩 자체를 한 문장으로 */
  preloader: '어둠에 눈이 익을 때까지',

  // TODO: 실제 캡쳐가 도착하면 제목·부제를 최종 문구로 교체
  introTitle: '도희가 보낸\n계절들',
  introSub: '손으로 쓴 것들을 순서대로 모아 둡니다.',

  /** 사운드 선택 */
  soundAsk: '소리를 켜고 볼까요?',

  /** 항로 프롤로그 */
  prologue: '편지는 밤을 건너\n여기까지 옵니다.',

  /** 에필로그 */
  epilogueLead: '지금까지 오간 것',
  epilogueTail: '다음 편지에 계속',
} as const

/** 게이트(패스코드) 화면 */
export const GATE = {
  title: '보관함',
  hint: '코드를 알고 있다면 들어올 수 있어요.',
  label: '코드',
  submit: '들어가기',
  submitting: '여는 중',
  error: '코드가 맞지 않아요',
  network: '연결이 끊겼어요. 잠시 뒤 다시 시도해 주세요.',
} as const

/** 서브셋 스크립트가 읽는 대상 — 디스플레이 서체로 그려지는 모든 문자열 */
export const DISPLAY_TEXT: string[] = [...Object.values(DISPLAY), GATE.title]
