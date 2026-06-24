'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { REF_COOKIE } from '@/lib/tracking/ref'
import { readMarketingParams } from '@/lib/tracking/marketing'
import { trackConversion } from '@/lib/tracking/analytics'
import { consultSchema, type ConsultInput } from './lib/schema'
import { submitConsult } from './actions'

/**
 * 상담(프로젝트 문의) 폼의 공통 로직 — 라이트(/consult)·스튜디오(#contact) 두 표현이 공유.
 * 검증·서버 제출·전환 발화·유입배너·honeypot·광고파라미터 전달을 한 곳에서 처리한다.
 *  - 성공 시: trackConversion('consult', { dedupeKey: leadId }) 로 전환 1회 발화(중복 방지)
 *  - hp(honeypot)·gclid/utm 은 제출 시 서버로 함께 전달
 */
export function useConsultForm() {
  const form = useForm<ConsultInput>({
    resolver: zodResolver(consultSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      phone: '',
      company: '',
      email: '',
      kakao: '',
      message: '',
      consent: false,
      // projectType·budget·timeline 은 미선택(undefined) 상태로 시작 → 제출 시 필수 검증
    },
  })

  const [done, setDone] = useState<null | { name: string }>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [ref, setRef] = useState<string | null>(null)
  const hpRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      setRef(window.sessionStorage.getItem(REF_COOKIE))
    } catch {
      // sessionStorage 접근 불가 시 무시
    }
  }, [])

  const submit = form.handleSubmit(async (values) => {
    setServerError(null)
    const res = await submitConsult(values, {
      hp: hpRef.current?.value ?? '',
      marketing: readMarketingParams(),
    })
    if (res.ok) {
      // honeypot(봇) 경로는 leadId 가 없어 전환이 발화되지 않음 → 광고 집계 오염 방지
      if (res.leadId) trackConversion('consult', { dedupeKey: res.leadId })
      setDone({ name: values.name })
    } else {
      setServerError(res.error)
    }
  })

  return { form, hpRef, done, serverError, ref, submit }
}
