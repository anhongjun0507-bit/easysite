/**
 * /letters — 손편지 아카이브 데이터 (DB 없이 정적)
 *
 * 실제 스캔을 추가하는 방법
 *  1) 스캔 파일을 public/letters/ 에 넣는다 (권장: 긴 변 1400px 내외 jpg, 세로형)
 *  2) python3 scripts/gen-letter-dummies.py 대신, 새 파일용 blurDataURL 이 필요하면
 *     src/content/letters-blur.ts 에 '/letters/파일명.jpg': 'data:image/jpeg;base64,…' 를 추가한다
 *     (없어도 동작한다 — placeholder 없이 그냥 뜬다)
 *  3) 아래 LETTERS 배열에 항목을 시간순으로 추가한다
 */

import { LETTER_BLUR } from './letters-blur'

export type LetterImage = {
  src: string
  /** 스크린리더·검색 대체 텍스트 — 무엇이 찍힌 스캔인지 담백하게 */
  alt: string
  /** 원본 비율 (CLS 0 을 위해 반드시 채운다) */
  width: number
  height: number
}

export type LetterReply = {
  /** YYYY-MM-DD */
  date: string
  body: string
  photo?: LetterImage
}

export type LetterEntry = {
  id: string
  /** YYYY-MM-DD */
  date: string
  kind: 'letter' | 'diary'
  images: LetterImage[]
  /** 손글씨를 옮겨 적은 전문 (선택) */
  transcript?: string
  reply?: LetterReply
}

/** 스캔 1장을 만든다 — blur 맵이 있으면 자동으로 붙는다 */
function scan(src: string, alt: string, width = 1200, height = 1700): LetterImage {
  return { src, alt, width, height }
}

export function blurOf(src: string): string | undefined {
  return LETTER_BLUR[src]
}

// TODO: 실제 스캔이 도착하면 아래 더미 3건을 교체한다 (날짜·본문·사진 전부)
export const LETTERS: LetterEntry[] = [
  {
    id: '2026-03-14',
    date: '2026-03-14',
    kind: 'letter',
    images: [
      scan('/letters/dummy-01a.jpg', '2026년 3월 14일에 받은 손편지 스캔 1쪽'),
      scan('/letters/dummy-01b.jpg', '2026년 3월 14일에 받은 손편지 스캔 2쪽'),
    ],
    transcript:
      '오늘은 하루 종일 비가 왔어. 우산을 안 챙겨서 학교 앞에서 한참 서 있었는데, 이상하게 하나도 짜증이 안 났어.\n' +
      '비 오는 날엔 네 생각이 더 많이 나더라. 잘 지내고 있지? 밥은 꼭 챙겨 먹어.',
    reply: {
      date: '2026-03-19',
      body:
        '편지 받았어. 생활관에서 세 번 읽었어.\n' +
        '여긴 아직 아침이 춥고, 연병장 끝에 나무 한 그루가 있는데 거기 지날 때마다 네 생각이 나.\n' +
        '나 잘 지내고 있으니까 걱정 말고, 너도 우산은 좀 챙기고 다녀.',
    },
  },
  {
    id: '2026-04-02',
    date: '2026-04-02',
    kind: 'diary',
    images: [scan('/letters/dummy-02a.jpg', '2026년 4월 2일 일기 스캔')],
    transcript:
      '벚꽃이 피기 시작했다. 작년에 둘이 걷던 길인데 올해는 혼자 걸었다.\n' +
      '슬프진 않았고, 조금 이상했다. 이 계절을 모아 뒀다가 나중에 같이 봐야지.',
    reply: {
      date: '2026-04-08',
      body:
        '일기까지 보내줄 줄은 몰랐어.\n' +
        '여기서도 담벼락 쪽에 벚꽃이 폈어. 사진은 못 찍으니까 대신 적어 둘게 — 4월 7일, 오후 다섯 시, 바람 조금.\n' +
        '나중에 같이 보자는 말, 그거 하나로 한 달은 버틸 수 있을 것 같아.',
    },
  },
  {
    id: '2026-05-21',
    date: '2026-05-21',
    kind: 'letter',
    images: [
      scan('/letters/dummy-03a.jpg', '2026년 5월 21일에 받은 손편지 스캔 1쪽'),
      scan('/letters/dummy-03b.jpg', '2026년 5월 21일에 받은 손편지 스캔 2쪽'),
    ],
    transcript:
      '요즘은 시간이 빨리 가는 것 같다가도, 밤이 되면 다시 느려져.\n' +
      '그래도 하루씩 줄어드는 건 확실하니까. 다음 편지 쓸 땐 여름일 것 같네.',
    reply: {
      date: '2026-05-27',
      body:
        '여름이 오면 편지 봉투가 눅눅해진대. 그때쯤이면 나도 조금 더 단단해져 있을게.\n' +
        '남은 날 세는 건 그만두기로 했어. 대신 네가 보내준 계절을 세기로 했어.',
    },
  },
]

/** 에필로그 카운트업용 — 주고받은 통수 */
export const LETTER_COUNT = LETTERS.length
export const REPLY_COUNT = LETTERS.filter((l) => l.reply).length
export const TOTAL_COUNT = LETTER_COUNT + REPLY_COUNT
