/**
 * /letters — 손편지·일기 아카이브 데이터 (DB 없이 정적)
 *
 * 새 캡쳐를 넣는 법 — 3단계면 끝난다
 *  1) `public/letters/` 에 규칙대로 파일을 넣는다
 *     `YYYY-MM-DD_letter_01.jpg` (편지) · `YYYY-MM-DD_diary_01.png` (일기) · 여러 장이면 _02, _03…
 *  2) `npm run sync:letters`
 *     webp 변환(추측 못 하도록 파일명에 해시를 붙인다) · blur 미리보기 · 아래 AUTO 구간 갱신까지 한 번에.
 *     원본 jpg/png 는 `public/letters/_src/` 로 옮겨진다(git 에 올라가지 않는다).
 *  3) 아래 엔트리의 `reply.body` 에 답장을 쓴다. 줄바꿈(\n)은 화면에 그대로 나온다.
 *     sync 를 다시 돌려도 직접 쓴 `reply`·`transcript`·`alt` 는 지워지지 않는다.
 */

// 확장자를 붙여 둔다 — scripts/sync-letters.ts 가 이 파일을 node 로 그대로 실행해서 읽기 때문
import { LETTER_BLUR } from './letters-blur.ts'

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
  /** 딥링크 앵커이기도 하다 — `YYYY-MM-DD-letter` / `YYYY-MM-DD-diary` */
  id: string
  /** YYYY-MM-DD */
  date: string
  kind: 'letter' | 'diary'
  images: LetterImage[]
  /** 손글씨를 옮겨 적은 전문 (선택) */
  transcript?: string
  reply?: LetterReply
}

export function blurOf(src: string): string | undefined {
  return LETTER_BLUR[src]
}

// <<< AUTO — `npm run sync:letters` 가 생성한다. 이 구간을 손으로 고쳐도 되지만
//            reply·transcript·alt 를 뺀 나머지는 다음 sync 때 파일 기준으로 덮어써진다.
const REAL: LetterEntry[] = [
  {
    id: '2026-08-11-diary',
    date: '2026-08-11',
    kind: 'diary',
    images: [
      { src: '/letters/2026-08-11_diary_01.90d5f2.webp', alt: '2026년 8월 11일 일기 캡쳐', width: 1340, height: 2000 },
    ],
    transcript: '8월 11일 / 23:32 / 오늘기분 : (^^)\n처음으로 홍준이랑 연락 안되는 날이다. 생각보다 내가 홍준이한테 많은 일상을 공유하는 것 같다. 오늘은 병원 갔다가 언니 신발을 사고 너무 피곤해서 장을 보지 않고 집에 왔다.\n와서 좀 있다가 잠에 들었다 ㅋㅋㅋㅋ. 일어나서 디자인을 하려고 했지만 머리에 떠오르는 아이디어가 너무적다. 내일은 더 열심히 디자인을 해야겠다. 좀 있음 학교를 가니까 그전까지 빡세게 해야지.\n홍준이가 많이 생각나는 날이다. 홍준이는 잘하고 있으려나? 첫날 밤은 많이들 운다던데 홍준이는 많이 안울면 좋겠다. 이제 일어나서 훈련 받기 시작하겠지? 조심히 잘 해내면 좋겠다. 늘 응원하고 있을게.\n사랑합니당 💜 오늘 일기 끝!',
    reply: {
      date: '2026-08-11',
      body: '오늘 도히 택배를 받았는데, 진짜 감동의 도가니탕이야 노트 한장한장에 도희가 붙어있는게 너무 좋아.\n첫글을 읽고있는데, 이 때 생각이 나는데 진짜 너무 힘들었어 나도 첫날에는 도희 생각 엄청 많이 나고 첫째주에는 적응하느라 완전 바빴던거 같네,\n과카몰리 올라간 나쵸 완죤 맛있겠다 미국가면 같이 묵자!',
    },
  },
  {
    id: '2026-08-12-diary',
    date: '2026-08-12',
    kind: 'diary',
    images: [
      { src: '/letters/2026-08-12_diary_01.2db8ae.webp', alt: '2026년 8월 12일 일기 캡쳐', width: 1268, height: 2000 },
    ],
    transcript: '8월 12일 / 22:54 / 오늘기분 : ☺\n오늘은 아침을 좀 늦게 일어난 편이다. 오늘 일어나서 장보러 가는데 언니가 준 새로운 옷을 입었다. 좀 청순한 지 같기도? ㅋㅋㅋ 코스트코에서 맛있는 것들을 사고 돌아올때 들레🐱링 마주쳤다. 그래도 들레가 잘 살아있어서 다행이다. 돌아와서 언니랑 노래방을 하고 강철의 연금술사를 봤다. 그리고 저녁으로는 나랑 언니랑 같이 삼겹살 덮밥을 해먹었다. 짱 맛있었다 (그래도 홍준이가 해준게 더 맛있음) 오늘은 오랜만에 언니랑 같이 홈트를 하고 까먹고 있었던 KSEA 미팅을 했다.\n로렌 언니가 Jason 씨에 대해 알려줬다. 어떤 여자애가 자기를 좋아한다고 착각하고 있다고 했다. 미안하지만 줌미팅을 하는데 조금 웃겼다. KSEA 임원분들중 차있으신 분에게 블럭 돌아갈때 공항에서 라이드 괜찮은지 물어보려고 한다. 홍준이 괜찮나? 홍준이가 괜찮다고 하면 물어봐야지! 이제 홍준이랑 전화할때 까지 3일 남았나? 할 수있다 아자아자! 홍준이가 정말로 많이 많이 생각난다. 내 일상속에도 침투했나 보다. 많이많이 사랑한다 💗 오늘은 어떤 훈련을 했으려나...?',
    reply: {
      date: '2026-08-12',
      body: '두번째 답장을 보낸다. 도히가 언니가 준 새로운 옷을 입은 사진을 봤는데 사람이 너무 귀엽자나 특히 색연필로 고양이 필터를 만든게 있는데 확실히 눈이 크니까 완전 내가 집사 해주고 싶다ㅏ\n들레는 처음 들어보는 고양인데 풍채가 거의 호랑이인데? 저녁으로 삼겹살 덮밥을 만들어 먹은거 같은데, 이건 내 전문 분야잖아 5학년 때 내가 진짜 야무지게 부타동 만들어줄께!\n이때도 용준씨는 레전드였구나.. 이 때까지만 해도 훈련소에서 완전 힘들어서 하루종일 도희 사진 건빵주머니에 넣고 보고다녔던거 같다! 두번째 편지도 너무 고마워용',
    },
  },
]
// >>> AUTO

export const LETTERS: LetterEntry[] = REAL

/** 답장을 실제로 쓴 엔트리인지 — sync 스크립트가 채울 자리로 빈 reply 를 만들어 두기 때문 */
export function hasReply(entry: LetterEntry): boolean {
  return Boolean(entry.reply?.body.trim())
}

/** 에필로그 카운트업용 — 주고받은 통수 */
export const LETTER_COUNT = LETTERS.length
export const REPLY_COUNT = LETTERS.filter(hasReply).length
export const TOTAL_COUNT = LETTER_COUNT + REPLY_COUNT
