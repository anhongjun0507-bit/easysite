'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { useMagnetic } from '@/hooks/useMagnetic'
import { MAGNET } from '@/lib/motion'
import { useConsultForm } from '@/app/consult/useConsultForm'
import { PillGroup } from '@/app/consult/PillGroup'
import { PROJECT_TYPES, BUDGET_BANDS, TIMELINES } from '@/app/consult/lib/schema'

// 언더라인 인풋 — box 금지, 하단 보더만. 포커스 시 보더가 흰색으로 전환.
const underline =
  'w-full border-b border-white/20 bg-transparent px-0 py-2.5 text-[17px] text-white transition-colors placeholder:text-white/25 focus:border-white focus:outline-none focus:ring-0'

/**
 * 스튜디오 컨택 폼 — 다크 #contact 섹션 위. consult 스키마·서버액션·전환을 그대로 재사용.
 * "폼처럼 안 생긴 폼": 언더라인 입력 + 칩 토글 + 마그네틱 제출.
 * 필드 그룹은 data-c-reveal 로 ContactSection 리빌 타임라인을 타고 staggered fade-up 된다.
 */
export function ContactForm() {
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
  const submitRef = useMagnetic<HTMLButtonElement>(MAGNET)

  if (done) {
    return (
      <div
        data-c-reveal
        className="rounded-2xl border border-white/15 bg-white/[0.04] p-8 text-center sm:p-10"
      >
        <div
          aria-hidden="true"
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-gray-950"
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
        <h3 className="mt-5 text-xl font-bold text-white sm:text-2xl">
          {done.name}님, 문의 접수됐어요
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-white/60">
          영업일 기준 24시간 안에 안홍준 대표가 직접 검토해 연락드릴게요. 급하시면 아래
          번호로 바로 전화 주셔도 됩니다.
        </p>
        <a
          href="tel:01037825418"
          data-cursor="hover"
          className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-[15px] font-bold text-gray-950 transition-colors hover:bg-gray-200"
        >
          010-3782-5418 전화하기
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-7">
      {ref && (
        <div
          data-c-reveal
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white/80"
        >
          {ref === 'soomgo'
            ? '숨고에서 오셨군요 👋 끝까지 함께 도와드릴게요.'
            : '추천 링크로 찾아주셔서 감사해요 👋'}
        </div>
      )}

      <div data-c-reveal className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2">
        <SField label="성함" required error={errors.name?.message}>
          <input
            {...register('name')}
            type="text"
            autoComplete="name"
            placeholder="김대표"
            className={underline}
          />
        </SField>
        <SField label="연락처" required error={errors.phone?.message}>
          <input
            {...register('phone')}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="010-1234-5678"
            className={underline}
          />
        </SField>
      </div>

      <div data-c-reveal>
        <PillGroup
          tone="dark"
          label="어떤 프로젝트인가요?"
          required
          error={errors.projectType?.message}
          options={PROJECT_TYPES}
          registration={register('projectType')}
        />
      </div>

      <div data-c-reveal>
        <PillGroup
          tone="dark"
          label="예산은 어느 정도 생각하세요?"
          required
          hint="대략이면 충분합니다. 정하지 못했으면 ‘미정’으로 두셔도 됩니다."
          error={errors.budget?.message}
          options={BUDGET_BANDS}
          registration={register('budget')}
        />
      </div>

      <div data-c-reveal>
        <PillGroup
          tone="dark"
          label="일정"
          hint="언제쯤 시작하면 좋을까요?"
          error={errors.timeline?.message}
          options={TIMELINES}
          registration={register('timeline')}
        />
      </div>

      <div data-c-reveal className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2">
        <SField label="회사·브랜드명" error={errors.company?.message}>
          <input
            {...register('company')}
            type="text"
            autoComplete="organization"
            placeholder="선택"
            className={underline}
          />
        </SField>
        <SField label="이메일" error={errors.email?.message}>
          <input
            {...register('email')}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="선택 · 제안서 받으실 주소"
            className={underline}
          />
        </SField>
      </div>

      <div data-c-reveal>
        <SField label="프로젝트를 한 줄로 들려주세요" error={errors.message?.message}>
          <textarea
            {...register('message')}
            rows={2}
            maxLength={500}
            placeholder="선택 · 예: 브랜드 소개와 예약을 함께 담은 사이트를 구상 중이에요."
            className={`${underline} resize-none`}
          />
        </SField>
      </div>

      {/* honeypot — 사람에겐 보이지 않는 칸(봇 탐지용). 비워둬야 정상. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden"
      >
        <label>
          이 칸은 비워두세요
          <input ref={hpRef} type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div data-c-reveal className="space-y-6">
        <label className="flex items-start gap-3">
          <input
            {...register('consent')}
            type="checkbox"
            className="mt-1 h-5 w-5 shrink-0 rounded border-white/30 bg-transparent text-indigo-500 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-950"
          />
          <span className="text-sm leading-relaxed text-white/60">
            상담을 위해 연락처를 받는 데 동의해요.{' '}
            <Link
              href="/privacy"
              target="_blank"
              className="font-medium text-white underline underline-offset-2"
            >
              개인정보 처리방침
            </Link>
          </span>
        </label>
        {errors.consent?.message && (
          <p className="text-sm text-rose-300">{errors.consent.message}</p>
        )}

        {serverError && (
          <p className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-200">
            {serverError}
          </p>
        )}

        <div>
          <button
            ref={submitRef}
            type="submit"
            disabled={isSubmitting}
            data-cursor="hover"
            className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-white px-9 text-[17px] font-bold text-gray-950 transition-colors duration-300 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60 sm:text-[18px]"
          >
            {isSubmitting ? '보내는 중…' : '문의 보내기'}
            <ArrowUpRight className="h-5 w-5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
          <p className="mt-4 text-xs text-white/40">
            가입 없이 가능 · 영업일 24시간 안에 직접 연락드려요
          </p>
        </div>
      </div>
    </form>
  )
}

function SField({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block">
        <span className="block text-[13px] font-medium tracking-wide text-white/55">
          {label}
          {required ? (
            <span className="ml-1 text-white">*</span>
          ) : (
            <span className="ml-1.5 text-xs font-normal text-white/35">선택</span>
          )}
        </span>
        <span className="mt-2 block">{children}</span>
      </label>
      {error && (
        <p role="alert" className="mt-2 text-sm text-rose-300">
          {error}
        </p>
      )}
    </div>
  )
}
