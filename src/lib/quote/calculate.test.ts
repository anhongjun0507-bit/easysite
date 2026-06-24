import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import {
  calculateQuote,
  shownPrice,
  formatPriceRange,
  formatWeeksRange,
  EVENT_ACTIVE,
} from './calculate.ts'

test('이벤트 비활성 — 정가만 노출', () => {
  assert.equal(EVENT_ACTIVE, false)
  const q = calculateQuote({ siteType: 'company', pageCount: 'small' })
  assert.equal(q.eventActive, false)
  // 이벤트 비활성이면 화면 적용가(priceMin/Max)는 정가(list)와 일치
  assert.equal(q.priceMinManwon, q.list.min)
  assert.equal(q.priceMaxManwon, q.list.max)
})

test('★ 핵심 예시 — 쇼핑몰·5~10개·결제·관리자·한달: 정가 425 / 이벤트가 255', () => {
  const q = calculateQuote({
    siteType: 'shop',
    pageCount: 'medium',
    features: { payment: true, admin: true },
    timeline: '1m',
  })
  // 정가: 250 × 1.3 + 50 + 50 = 325 + 100 = 425
  assert.equal(q.list.center, 425)
  // 이벤트가: 150 × 1.3 + 30 + 30 = 195 + 60 = 255
  assert.equal(q.event.center, 255)
  // 기간: page 3 + payment 1 + admin 0.5 = 4.5 → min 3.5 / max 5.5
  assert.equal(q.weeksMin, 3.5)
  assert.equal(q.weeksMax, 5.5)
})

test('회사·가게 소개 + 5개 이내 + 옵션 없음: 정가 150 / 이벤트가 100', () => {
  const q = calculateQuote({ siteType: 'company', pageCount: 'small', timeline: '1m' })
  assert.equal(q.list.center, 150)
  assert.equal(q.event.center, 100)
})

test('랜딩페이지 최소: 정가 80 / 이벤트가 50', () => {
  const q = calculateQuote({ siteType: 'landing', pageCount: 'small' })
  assert.equal(q.list.center, 80)
  assert.equal(q.event.center, 50)
})

test('앱 개발 — 5개 이내·옵션 없음: 정가 600 / 이벤트가 400', () => {
  const q = calculateQuote({ siteType: 'app', pageCount: 'small', timeline: '1m' })
  assert.equal(q.list.center, 600)
  assert.equal(q.event.center, 400)
})

test('디자인 톤은 가격에 영향 없음 (입력에 없음 → 동일)', () => {
  const base = calculateQuote({ siteType: 'company', pageCount: 'medium' })
  // company 150×1.3 = 195(정가), 100×1.3 = 130(이벤트). 5만원 단위 그대로.
  assert.equal(base.list.center, 195)
  assert.equal(base.event.center, 130)
})

test('2주 급행 ×1.3 — 전 기능: 정가/이벤트가', () => {
  const q = calculateQuote({
    siteType: 'shop',
    pageCount: 'medium',
    features: { payment: true, admin: true, aiChat: true },
    timeline: '2w',
  })
  // 정가: 250×1.3×1.3 = 422.5, +50+50+150 = 672.5 → 5만원 단위 675
  assert.equal(q.list.center, 675)
  // 이벤트: 150×1.3×1.3 = 253.5, +30+30+80 = 393.5 → 395
  assert.equal(q.event.center, 395)
  // 기간: (3 + 1 + 0.5 + 2) × 0.7 = 6.5 × 0.7 = 4.55 → roundHalf 4.5 → min 3.5 / max 5.5
  assert.equal(q.weeksMin, 3.5)
  assert.equal(q.weeksMax, 5.5)
})

test('답변 누락 시 기본값 (회사소개 + unsure)', () => {
  const q = calculateQuote({})
  // 정가 150 × 1.2 = 180, 이벤트 100 × 1.2 = 120
  assert.equal(q.list.center, 180)
  assert.equal(q.event.center, 120)
})

test('breakdown — 관리자 페이지 가산 항목 노출', () => {
  const q = calculateQuote({
    siteType: 'shop',
    pageCount: 'medium',
    features: { payment: true, admin: true },
  })
  const labels = q.breakdown.map((b) => b.label)
  assert.ok(labels.some((l) => l.includes('관리자 페이지')))
  assert.ok(labels.some((l) => l.includes('온라인 결제')))
  assert.ok(!labels.some((l) => l.includes('럭셔리'))) // 디자인 가산 제거 확인
})

test('정가 ≥ 이벤트가, min ≤ center ≤ max', () => {
  const matrix = [
    { siteType: 'landing' as const, pageCount: 'small' as const },
    {
      siteType: 'shop' as const,
      pageCount: 'large' as const,
      features: { payment: true, admin: true, aiChat: true },
      timeline: '2w' as const,
    },
    { siteType: 'company' as const, pageCount: 'unsure' as const },
    {
      siteType: 'reservation' as const,
      pageCount: 'medium' as const,
      features: { payment: true },
    },
  ]
  for (const m of matrix) {
    const q = calculateQuote(m)
    for (const p of [q.list, q.event]) {
      assert.ok(p.min <= p.center, `min ${p.min} ≤ center ${p.center}`)
      assert.ok(p.center <= p.max, `center ${p.center} ≤ max ${p.max}`)
    }
    assert.ok(q.event.center <= q.list.center, '이벤트가 ≤ 정가')
    assert.ok(q.weeksMin >= 1 && q.weeksMin <= q.weeksMax)
  }
})

test('포맷 출력 형태', () => {
  const q = calculateQuote({
    siteType: 'shop',
    pageCount: 'medium',
    features: { payment: true },
  })
  assert.match(formatPriceRange(shownPrice(q)), /\d+\s*~\s*\d+만원/)
  assert.match(formatPriceRange(q.list), /\d+\s*~\s*\d+만원/)
  assert.match(formatWeeksRange(q), /\d+(\.\d)?\s*~\s*\d+(\.\d)?주/)
})
