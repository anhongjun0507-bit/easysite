'use client'

import { useEffect } from 'react'
import { trackConversion, type ConversionName } from '@/lib/tracking/analytics'

/**
 * 전환 페이지(견적 결과 등)에서 마운트되는 즉시 전환 1건을 전송한다.
 * dedupeKey(예: leadId)로 새로고침·재방문 중복 집계를 막는다.
 * 화면엔 아무것도 그리지 않음.
 */
export function ConversionPing({
  name,
  dedupeKey,
  value,
}: {
  name: ConversionName
  dedupeKey?: string
  value?: number
}) {
  useEffect(() => {
    trackConversion(name, { dedupeKey, value })
  }, [name, dedupeKey, value])
  return null
}
