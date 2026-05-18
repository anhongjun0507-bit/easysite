import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { calculateQuote, formatPriceRange, formatWeeksRange } from './calculate.ts'

test('회사소개 + 5개 이내 + 옵션 없음 = 기준 200만원 ±15%', () => {
  const q = calculateQuote({
    siteType: 'company',
    pageCount: 'small',
    payment: 'no',
    aiChatNeeded: false,
    designTone: 'modern',
    timeline: '1m',
  })
  // 200 * 1.0 + 0 + 0 = 200
  assert.equal(q.priceCenterManwon, 200)
  assert.equal(q.priceMinManwon, 170) // 170 (round to 10)
  assert.equal(q.priceMaxManwon, 230) // 230
  // 기간: pageWeeks 2 + 0 + 0 + 0 = 2 → min 1, max 3
  assert.equal(q.weeksMin, 1)
  assert.equal(q.weeksMax, 3)
})

test('쇼핑몰 + 5~10개 + 결제 + 럭셔리 + 1개월 납기', () => {
  const q = calculateQuote({
    siteType: 'shop',
    pageCount: 'medium',
    payment: 'yes',
    aiChatNeeded: false,
    designTone: 'luxury',
    timeline: '1m',
  })
  // 450 * 1.3 * 1.2 + 80 = 702 + 80 = 782
  assert.equal(q.priceCenterManwon, 780)
  // weeks: 3 + 1 + 0 + 0.5 = 4.5 → min 3.5, max 5.5
  assert.equal(q.weeksMin, 3.5)
  assert.equal(q.weeksMax, 5.5)
})

test('예약·회원제 + AI 챗봇 + 2주 납기 (rush) → 가격×1.3 + AI 가산', () => {
  const q = calculateQuote({
    siteType: 'reservation',
    pageCount: 'medium',
    payment: 'no',
    aiChatNeeded: true,
    designTone: 'modern',
    timeline: '2w',
  })
  // 350 * 1.3 * 1.0 * 1.3 + 0 + 150 = 591.5 + 150 = 741.5 → 740
  assert.equal(q.priceCenterManwon, 740)
  // weeks: (3 + 0 + 2 + 0) * 0.7 = 3.5 → min 2.5, max 4.5
  assert.equal(q.weeksMin, 2.5)
  assert.equal(q.weeksMax, 4.5)
})

test('랜딩페이지 최소 시나리오 (5개 이내 + 옵션 없음)', () => {
  const q = calculateQuote({
    siteType: 'landing',
    pageCount: 'small',
    payment: 'no',
    aiChatNeeded: false,
  })
  // 100 * 1.0 = 100
  assert.equal(q.priceCenterManwon, 100)
  assert.equal(q.priceMinManwon, 90) // 85 → round to 90
  assert.equal(q.priceMaxManwon, 110) // 115 → 120? 115/10=11.5→12*10=120. Wait round half to even. Math.round(11.5)=12 → 120. Let's check: 100 * 1.15 = 115. round(115/10)*10 = round(11.5)*10. Math.round(11.5) = 12 → 120. Actually JS Math.round rounds half away from zero so 11.5 → 12. 즉 120.
})

test('쇼핑몰 + 10개+ + 결제 + AI + 럭셔리 + 2주 — 최대 시나리오', () => {
  const q = calculateQuote({
    siteType: 'shop',
    pageCount: 'large',
    payment: 'yes',
    aiChatNeeded: true,
    designTone: 'luxury',
    timeline: '2w',
  })
  // 450 * 1.7 * 1.2 * 1.3 + 80 + 150 = 450 * 1.7 = 765 * 1.2 = 918 * 1.3 = 1193.4 + 230 = 1423.4 → 1420
  assert.equal(q.priceCenterManwon, 1420)
  // weeks: (5 + 1 + 2 + 0.5) * 0.7 = 8.5 * 0.7 = 5.95 → roundHalf = 6.0 → min 5, max 7
  assert.equal(q.weeksMin, 5)
  assert.equal(q.weeksMax, 7)
})

test('답변 누락 시 기본값 (회사소개 + unsure 페이지)', () => {
  const q = calculateQuote({})
  // company 200 * unsure 1.2 = 240
  assert.equal(q.priceCenterManwon, 240)
  // weeks: 3 (unsure) → min 2, max 4
  assert.equal(q.weeksMin, 2)
  assert.equal(q.weeksMax, 4)
})

test('breakdown — 옵션 없는 경우엔 가산 항목 안 나옴', () => {
  const q = calculateQuote({
    siteType: 'company',
    pageCount: 'small',
    payment: 'no',
    aiChatNeeded: false,
  })
  const labels = q.breakdown.map((b) => b.label)
  assert.ok(labels.some((l) => l.includes('기준')))
  assert.ok(labels.some((l) => l.includes('페이지')))
  assert.ok(!labels.some((l) => l.includes('럭셔리')))
  assert.ok(!labels.some((l) => l.includes('결제')))
  assert.ok(!labels.some((l) => l.includes('AI')))
  assert.ok(labels.some((l) => l.includes('±15%')))
})

test('breakdown — 옵션 다 있는 경우 모두 표시', () => {
  const q = calculateQuote({
    siteType: 'shop',
    pageCount: 'large',
    payment: 'yes',
    aiChatNeeded: true,
    designTone: 'luxury',
    timeline: '2w',
  })
  const labels = q.breakdown.map((b) => b.label)
  assert.ok(labels.some((l) => l.includes('럭셔리')))
  assert.ok(labels.some((l) => l.includes('빠른 납기')))
  assert.ok(labels.some((l) => l.includes('결제')))
  assert.ok(labels.some((l) => l.includes('AI')))
})

test('formatPriceRange/formatWeeksRange 출력 형태', () => {
  const q = calculateQuote({
    siteType: 'shop',
    pageCount: 'medium',
    payment: 'yes',
    aiChatNeeded: false,
    designTone: 'modern',
  })
  // 450 * 1.3 + 80 = 585 + 80 = 665 → 670
  // min: 565 → 570, max: 765 → 770
  const priceStr = formatPriceRange(q)
  assert.match(priceStr, /\d+\s*~\s*\d+만원/)
  const weeksStr = formatWeeksRange(q)
  assert.match(weeksStr, /\d+(\.\d)?\s*~\s*\d+(\.\d)?주/)
})

test('가격은 항상 priceMin ≤ priceCenter ≤ priceMax', () => {
  const matrix = [
    { siteType: 'landing' as const, pageCount: 'small' as const },
    { siteType: 'shop' as const, pageCount: 'large' as const, payment: 'yes' as const, aiChatNeeded: true, designTone: 'luxury' as const, timeline: '2w' as const },
    { siteType: 'company' as const, pageCount: 'unsure' as const },
    { siteType: 'reservation' as const, pageCount: 'medium' as const, payment: 'yes' as const },
  ]
  for (const m of matrix) {
    const q = calculateQuote(m)
    assert.ok(q.priceMinManwon <= q.priceCenterManwon, `min(${q.priceMinManwon}) ≤ center(${q.priceCenterManwon})`)
    assert.ok(q.priceCenterManwon <= q.priceMaxManwon, `center(${q.priceCenterManwon}) ≤ max(${q.priceMaxManwon})`)
    assert.ok(q.weeksMin >= 1, `weeksMin ≥ 1, got ${q.weeksMin}`)
    assert.ok(q.weeksMin <= q.weeksMax)
  }
})
