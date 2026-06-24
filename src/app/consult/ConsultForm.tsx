'use client'

import Link from 'next/link'
import { useConsultForm } from './useConsultForm'
import { PillGroup } from './PillGroup'
import { PROJECT_TYPES, BUDGET_BANDS, TIMELINES } from './lib/schema'

const inputBase =
  'h-12 w-full rounded-lg border-0 bg-white px-3.5 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'

export function ConsultForm() {
  const {
    form: {
      register,
      formState: { errors, isSubmitting },
    },
    hpRef,
    done,
    serverError,
    ref,
    submit,
  } = useConsultForm()

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
          {done.name}님, 문의 접수됐어요!
        </h2>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-gray-700">
          영업일 기준 <b>24시간 안에</b> 안홍준 대표가 직접 연락드릴게요. 급하시면 아래
          번호로 바로 전화 주셔도 됩니다.
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
            기다리는 동안 작업 사례 둘러보기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {ref && (
        <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-800">
          {ref === 'soomgo'
            ? '숨고에서 오셨군요! 반가워요 👋 견적과 함께 끝까지 도와드릴게요.'
            : '추천 링크로 찾아주셔서 감사해요 👋'}
        </div>
      )}

      <Field label="성함" required error={errors.name?.message} hint="뭐라고 불러드리면 될까요?">
        <input
          {...register('name')}
          type="text"
          autoComplete="name"
          placeholder="예: 김대표"
          className={inputBase}
        />
      </Field>

      <Field label="연락처" required error={errors.phone?.message} hint="문자·전화로 연락드려요.">
        <input
          {...register('phone')}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="예: 010-1234-5678"
          className={inputBase}
        />
      </Field>

      <PillGroup
        tone="light"
        label="어떤 프로젝트인가요?"
        required
        error={errors.projectType?.message}
        options={PROJECT_TYPES}
        registration={register('projectType')}
      />

      <PillGroup
        tone="light"
        label="예산은 어느 정도 생각하세요?"
        required
        hint="대략이면 충분해요. 정하지 못했으면 '미정'으로 두셔도 됩니다."
        error={errors.budget?.message}
        options={BUDGET_BANDS}
        registration={register('budget')}
      />

      <PillGroup
        tone="light"
        label="일정"
        hint="선택 — 언제쯤 필요하세요?"
        error={errors.timeline?.message}
        options={TIMELINES}
        registration={register('timeline')}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="회사·상호명" error={errors.company?.message} hint="선택 — 있으시면">
          <input
            {...register('company')}
            type="text"
            autoComplete="organization"
            placeholder="선택 사항"
            className={inputBase}
          />
        </Field>
        <Field label="이메일" error={errors.email?.message} hint="선택 — 제안서 받으실 주소">
          <input
            {...register('email')}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="선택 사항"
            className={inputBase}
          />
        </Field>
      </div>

      <Field label="카카오톡 ID" error={errors.kakao?.message} hint="선택 — 카톡이 편하시면">
        <input
          {...register('kakao')}
          type="text"
          placeholder="선택 사항"
          className={inputBase}
        />
      </Field>

      <Field
        label="어떤 걸 만들고 싶으세요?"
        error={errors.message?.message}
        hint="선택 — 한 줄이면 충분해요. 잘 모르시겠으면 비워두셔도 됩니다."
      >
        <textarea
          {...register('message')}
          rows={3}
          maxLength={500}
          placeholder="예: 브랜드 소개와 예약을 함께 담은 사이트를 구상 중이에요."
          className={`${inputBase} h-auto resize-none py-3`}
        />
      </Field>

      {/* honeypot — 사람에겐 보이지 않는 칸(봇 탐지용). 비워둬야 정상. */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
        <label>
          이 칸은 비워두세요
          <input ref={hpRef} type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

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
        {isSubmitting ? '보내는 중…' : '문의 보내기'}
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
      <label className="block">
        <span className="block text-sm font-semibold text-gray-800">
          {label}
          {required && <span className="ml-1 text-indigo-600">*</span>}
          {!required && (
            <span className="ml-1.5 text-xs font-normal text-gray-400">선택</span>
          )}
        </span>
        {hint && <span className="mt-0.5 block text-xs text-gray-500">{hint}</span>}
        <span className="mt-1.5 block">{children}</span>
      </label>
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
