'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { REF_COOKIE } from '@/lib/tracking/ref'
import { consultSchema, type ConsultInput } from './lib/schema'
import { submitConsult } from './actions'

const inputBase =
  'h-12 w-full rounded-lg border-0 bg-white px-3.5 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'

export function ConsultForm() {
  const [done, setDone] = useState<null | { name: string }>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [ref, setRef] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConsultInput>({
    resolver: zodResolver(consultSchema),
    defaultValues: {
      name: '',
      phone: '',
      kakao: '',
      businessName: '',
      message: '',
      consent: false,
    },
  })

  useEffect(() => {
    try {
      setRef(window.sessionStorage.getItem(REF_COOKIE))
    } catch {
      // sessionStorage 접근 불가 시 무시
    }
  }, [])

  async function onSubmit(values: ConsultInput) {
    setServerError(null)
    const res = await submitConsult(values)
    if (res.ok) setDone({ name: values.name })
    else setServerError(res.error)
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-7 text-center sm:p-9">
        <div
          aria-hidden="true"
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">
          {done.name}님, 신청 접수됐어요!
        </h2>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-gray-700">
          영업일 기준 <b>24시간 안에</b> 안홍준 대표가 직접 연락드릴게요.
          급하시면 아래 번호로 바로 전화 주셔도 됩니다.
        </p>
        <a
          href="tel:01037825418"
          className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 text-base font-semibold text-white transition hover:bg-gray-700"
        >
          010-3782-5418 전화하기
        </a>
        <div className="mt-5">
          <Link
            href="/portfolio"
            className="text-sm font-medium text-gray-500 underline underline-offset-4 hover:text-gray-900"
          >
            기다리는 동안 만든 사이트 9곳 둘러보기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {ref && (
        <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-800">
          {ref === 'soomgo'
            ? '숨고에서 오셨군요! 반가워요 👋 견적과 함께 끝까지 도와드릴게요.'
            : '추천 링크로 찾아주셔서 감사해요 👋'}
        </div>
      )}

      <Field
        label="성함"
        required
        error={errors.name?.message}
        hint="뭐라고 불러드리면 될까요?"
      >
        <input
          {...register('name')}
          type="text"
          autoComplete="name"
          placeholder="예: 김사장"
          className={inputBase}
        />
      </Field>

      <Field
        label="연락처"
        required
        error={errors.phone?.message}
        hint="문자·전화로 연락드려요."
      >
        <input
          {...register('phone')}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="예: 010-1234-5678"
          className={inputBase}
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="카카오톡 ID" error={errors.kakao?.message} hint="선택 — 카톡이 편하시면">
          <input
            {...register('kakao')}
            type="text"
            placeholder="선택 사항"
            className={inputBase}
          />
        </Field>
        <Field label="상호·가게 이름" error={errors.businessName?.message} hint="선택 — 있으시면">
          <input
            {...register('businessName')}
            type="text"
            placeholder="선택 사항"
            className={inputBase}
          />
        </Field>
      </div>

      <Field
        label="어떤 사이트가 필요하세요?"
        error={errors.message?.message}
        hint="선택 — 한 줄이면 충분해요. 잘 모르시겠으면 비워두셔도 됩니다."
      >
        <textarea
          {...register('message')}
          rows={3}
          maxLength={500}
          placeholder="예: 우리 카페 예약 받는 사이트요. 메뉴랑 오시는 길도 넣고 싶어요."
          className={`${inputBase} h-auto resize-none py-3`}
        />
      </Field>

      <div>
        <label className="flex items-start gap-3">
          <input
            {...register('consent')}
            type="checkbox"
            className="mt-1 h-5 w-5 shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm leading-relaxed text-gray-600">
            상담을 위해 연락처를 받는 데 동의해요.{' '}
            <Link
              href="/privacy"
              target="_blank"
              className="font-medium text-indigo-700 underline underline-offset-2"
            >
              개인정보 처리방침
            </Link>
          </span>
        </label>
        {errors.consent?.message && (
          <p className="mt-1.5 text-sm text-red-600">{errors.consent.message}</p>
        )}
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="cta-glow inline-flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 text-base font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:text-[17px]"
      >
        {isSubmitting ? '신청하는 중…' : '상담 신청하기'}
      </button>

      <p className="text-center text-xs text-gray-500">
        가입 없이 가능 · 영업일 24시간 안에 직접 연락드려요
      </p>
    </form>
  )
}

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800">
        {label}
        {required && <span className="ml-1 text-indigo-600">*</span>}
        {!required && (
          <span className="ml-1.5 text-xs font-normal text-gray-400">선택</span>
        )}
      </label>
      {hint && <p className="mt-0.5 text-xs text-gray-500">{hint}</p>}
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  )
}
