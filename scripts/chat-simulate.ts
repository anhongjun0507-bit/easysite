/**
 * EasySite 챗봇 시뮬레이션 CLI — 시스템 프롬프트 검수용.
 * /api/chat 코드 진입 전에 다양한 시나리오로 응답 톤·규칙 위반 여부 확인.
 *
 * 사용:
 *   node --experimental-strip-types scripts/chat-simulate.ts
 *
 * 환경:
 *   .env.local의 ANTHROPIC_API_KEY 자동 로드.
 */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import {
  callAnthropicStream,
  type ChatMessage,
} from '../src/lib/ai/anthropic.ts'
import {
  CHAT_SYSTEM_PROMPT,
  buildChatContextBlock,
  type ChatLeadContext,
} from '../src/lib/ai/chat-prompt.ts'

loadEnvLocal()

// ───── 시나리오 프리셋 ───────────────────────────────────────────────────────
type Preset = {
  label: string
  context: ChatLeadContext
}

const PRESETS: Preset[] = [
  {
    label: '한식당 — 회사 소개·소형·결제 X·AI X·친근·1개월 (가장 흔한 패턴)',
    context: {
      businessName: '손맛한식당',
      industry: '한식당',
      tagline: '30년 전통 손맛',
      wizard: {
        siteType: 'company',
        pageCount: 'small',
        payment: 'no',
        aiChat: { needed: false },
        designTone: 'friendly',
        timeline: '1m',
        budget: '200-500',
      },
      quote: {
        priceMinManwon: 170,
        priceMaxManwon: 230,
        weeksMin: 1,
        weeksMax: 3,
        breakdown: [
          { label: '기준 (회사·가게 소개)', value: '200만원' },
          { label: '페이지 수 (5개 이내)', value: '×1.0' },
          { label: '합산 후 ±15% 범위', value: '170 ~ 230만원' },
        ],
      },
      ai: {
        menuLabels: ['홈', '메뉴', '오시는 길', '예약', '연락처'],
        firstHeroHeadline: '30년 손맛, 그대로 차려드립니다',
        aboutDraft:
          '서울 강남에서 30년 동안 같은 자리를 지켜온 한식당입니다. 매일 새벽 시장에서 직접 골라온 재료로 손맛을 그대로 담아냅니다.',
        recommendedColor: {
          name: '친근',
          primary: '#C2410C',
          secondary: '#FED7AA',
          accent: '#7C2D12',
        },
      },
      similar: [
        { name: 'PS Company', category: '회사소개·MCN', url: 'https://pscp.to' },
        {
          name: 'SOC Architects',
          category: '건축',
          url: 'https://www.socarchitects.com/en',
        },
      ],
    },
  },
  {
    label: '영어학원 — 회사 소개·중형·결제 O·AI O·모던·1개월 (옵션 풀로드)',
    context: {
      businessName: '김쌤영어',
      industry: '영어학원',
      tagline: '아이의 영어 자신감을 만들어주는 곳',
      wizard: {
        siteType: 'company',
        pageCount: 'medium',
        payment: 'yes',
        aiChat: {
          needed: true,
          detail: '학부모 상담 자동 응대, 수업 일정 안내, 추천 레벨 자동 답변',
        },
        designTone: 'modern',
        timeline: '1m',
        budget: '500-1000',
      },
      quote: {
        priceMinManwon: 420,
        priceMaxManwon: 570,
        weeksMin: 5,
        weeksMax: 7,
        breakdown: [
          { label: '기준 (회사·가게 소개)', value: '200만원' },
          { label: '페이지 수 (5 ~ 10개)', value: '×1.3' },
          { label: '결제 기능', value: '+80만원' },
          { label: 'AI 챗봇·자동화', value: '+150만원' },
          { label: '합산 후 ±15% 범위', value: '420 ~ 570만원' },
        ],
      },
      ai: {
        menuLabels: ['홈', '강사 소개', '커리큘럼', '시간표', '레벨테스트', '후기', '상담'],
        firstHeroHeadline: '아이의 영어 자신감, 1년이면 만들어드려요',
        aboutDraft:
          '서울 송파에서 12년 동안 초중등 영어를 가르쳐온 학원입니다. 작은 반·체계적인 커리큘럼·1:1 피드백으로 아이의 자신감을 키워드려요.',
        recommendedColor: {
          name: '모던',
          primary: '#2563EB',
          secondary: '#DBEAFE',
          accent: '#1E3A8A',
        },
      },
      similar: [
        { name: '프리즘 입시', category: '교육·입시', url: 'https://prismedu.kr' },
        {
          name: 'Conatus 입시',
          category: '교육·입시',
          url: 'https://conatusipsi.com',
        },
      ],
    },
  },
  {
    label: '럭셔리 쇼핑몰 — 대형·결제 O·AI X·럭셔리·2주 rush (고예산 풀옵션)',
    context: {
      businessName: '오뜨꾸뛰르',
      industry: '명품 셀렉트샵',
      tagline: '엄선된 디자이너 브랜드 큐레이션',
      wizard: {
        siteType: 'shop',
        pageCount: 'large',
        payment: 'yes',
        aiChat: { needed: false },
        designTone: 'luxury',
        timeline: '2w',
        budget: '1000+',
      },
      quote: {
        priceMinManwon: 1110,
        priceMaxManwon: 1500,
        weeksMin: 3.5,
        weeksMax: 5.5,
        breakdown: [
          { label: '기준 (쇼핑몰)', value: '450만원' },
          { label: '페이지 수 (10개 이상)', value: '×1.7' },
          { label: '럭셔리 디자인 톤', value: '×1.2' },
          { label: '빠른 납기 (2주 안에)', value: '×1.3' },
          { label: '결제 기능', value: '+80만원' },
          { label: '합산 후 ±15% 범위', value: '1110 ~ 1500만원' },
        ],
      },
      ai: {
        menuLabels: ['홈', '브랜드', '신상', '시즌 컬렉션', '룩북', '매장 안내', '회원 혜택'],
        firstHeroHeadline: '엄선된 디자이너, 차분한 큐레이션',
        aboutDraft:
          '오뜨꾸뛰르는 전 세계 신진·기성 디자이너 브랜드를 직접 만나 셀렉한 큐레이션 셀렉트샵입니다. 한 장의 옷에도 이야기가 있다는 마음으로 운영합니다.',
        recommendedColor: {
          name: '럭셔리',
          primary: '#111827',
          secondary: '#D4AF37',
          accent: '#1F2937',
        },
      },
      similar: [
        {
          name: '디지털스토어',
          category: '쇼핑몰',
          url: 'https://digitalst.kr',
        },
        {
          name: 'Prism Print',
          category: '인쇄·서비스',
          url: 'https://prismprint.vercel.app',
        },
      ],
    },
  },
  {
    label: '미응답 많음 — 회사 소개만 선택, 나머지 미응답 (되묻기 테스트)',
    context: {
      businessName: null,
      industry: null,
      tagline: null,
      wizard: {
        siteType: 'company',
      },
      quote: {
        priceMinManwon: 200,
        priceMaxManwon: 280,
        weeksMin: 2,
        weeksMax: 4,
        breakdown: [
          { label: '기준 (회사·가게 소개)', value: '200만원' },
          { label: '페이지 수 (미정)', value: '×1.2' },
          { label: '합산 후 ±15% 범위', value: '200 ~ 280만원' },
        ],
      },
      ai: null,
      similar: [],
    },
  },
]

// ───── 메인 ──────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY missing — .env.local 확인')
    process.exit(1)
  }

  const rl = createInterface({ input: stdin, output: stdout })

  console.log('\n🤖 EasySite 챗봇 시뮬레이션')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('시나리오:')
  PRESETS.forEach((p, i) => console.log(`  ${i + 1}. ${p.label}`))
  console.log('  q. 종료')
  console.log('')

  const choice = (await rl.question('번호 선택: ')).trim()
  if (choice === 'q' || choice === 'Q') {
    rl.close()
    return
  }
  const idx = Number(choice) - 1
  const preset = PRESETS[idx]
  if (!preset) {
    console.log('❌ 잘못된 선택')
    rl.close()
    return
  }

  console.log(`\n✓ "${preset.label}" 로드됨\n`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('대화 시작 — exit 입력 시 종료, /reset 으로 대화 초기화\n')

  const contextBlock = buildChatContextBlock(preset.context)
  const messages: ChatMessage[] = []
  let totalInput = 0
  let totalOutput = 0
  let turn = 0

  while (true) {
    const userInput = (await rl.question(`사장님 [${turn + 1}/10]: `)).trim()
    if (!userInput) continue
    if (userInput === 'exit' || userInput === 'quit') break
    if (userInput === '/reset') {
      messages.length = 0
      turn = 0
      console.log('\n✓ 대화 초기화\n')
      continue
    }
    if (userInput === '/context') {
      console.log(`\n${contextBlock}\n`)
      continue
    }
    if (userInput === '/help') {
      console.log('\n명령: exit | /reset | /context | /help\n')
      continue
    }

    // 첫 user 메시지면 컨텍스트 블록 prepend
    const content =
      messages.length === 0
        ? `${contextBlock}\n\n${userInput}`
        : userInput
    messages.push({ role: 'user', content })

    process.stdout.write('\nAI: ')
    let full = ''
    let inTok = 0
    let outTok = 0
    try {
      for await (const ev of callAnthropicStream({
        system: CHAT_SYSTEM_PROMPT,
        messages,
        maxTokens: 1024,
      })) {
        if (ev.type === 'text') {
          process.stdout.write(ev.delta)
          full += ev.delta
        } else if (ev.type === 'usage') {
          inTok = ev.inputTokens
          outTok = ev.outputTokens
        }
      }
    } catch (err) {
      console.error(
        '\n❌ 에러:',
        err instanceof Error ? err.message : String(err),
      )
      messages.pop()
      continue
    }
    messages.push({ role: 'assistant', content: full })
    totalInput += inTok
    totalOutput += outTok
    turn += 1
    console.log(`\n  (이 턴: in ${inTok} / out ${outTok} tokens · 누적 in ${totalInput} / out ${totalOutput})\n`)
  }

  // 비용 추정 — Sonnet 4.6 기준 input $3/MTok, output $15/MTok
  const inputUSD = (totalInput / 1_000_000) * 3
  const outputUSD = (totalOutput / 1_000_000) * 15
  const totalKRW = (inputUSD + outputUSD) * 1400
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('대화 종료')
  console.log(`총 ${turn}턴 · 입력 ${totalInput} 토큰 / 출력 ${totalOutput} 토큰`)
  console.log(
    `예상 비용 ≈ $${(inputUSD + outputUSD).toFixed(4)} (약 ${Math.round(totalKRW)}원)`,
  )
  rl.close()
}

// ───── env 로더 ──────────────────────────────────────────────────────────────

function loadEnvLocal() {
  try {
    const text = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
    for (const line of text.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const idx = trimmed.indexOf('=')
      if (idx === -1) continue
      const key = trimmed.slice(0, idx).trim()
      const value = trimmed.slice(idx + 1).trim()
      if (!process.env[key]) process.env[key] = value
    }
  } catch {
    // .env.local 없어도 OK — 시스템 env가 있을 수 있음
  }
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
