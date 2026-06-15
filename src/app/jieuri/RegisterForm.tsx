'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  useForm,
  type UseFormRegister,
  type UseFormRegisterReturn,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronDown, CircleCheck, Loader2 } from 'lucide-react'
import {
  BUSINESS_TYPES,
  WANT_TYPES,
  EXPERIENCES,
  URGENCY,
  CURRENT_SITE,
  WILLINGNESS_TO_PAY,
  preregisterSchema,
  type PreregisterInput,
} from './lib/schema'
import { submitPreregistration } from './actions'

const inputBase =
  'h-12 w-full rounded-lg border-0 bg-white px-3.5 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'

type RadioName =
  | 'businessType'
  | 'wantType'
  | 'experience'
  | 'urgency'
  | 'currentSite'
  | 'willingnessToPay'

export function RegisterForm() {
  const [done, setDone] = useState(false)
  const [duplicate, setDuplicate] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [consentOpen, setConsentOpen] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PreregisterInput>({
    resolver: zodResolver(preregisterSchema),
    defaultValues: {
      businessType: undefined,
      businessTypeEtc: '',
      wantType: undefined,
      wantTypeEtc: '',
      experience: undefined,
      urgency: undefined,
      currentSite: undefined,
      willingnessToPay: undefined,
      blocker: '',
      contact: '',
      consent: false,
    },
  })

  // "기타" 선택 시에만 직접 입력칸 펼침
  const showBizEtc = watch('businessType') === '기타'
  const showWantEtc = watch('wantType') === '기타'

  async function onSubmit(values: PreregisterInput) {
    setDuplicate(false)
    setToast(null)
    const res = await submitPreregistration(values)
    if (res.ok) {
      setDone(true)
      return
    }
    if (res.reason === 'duplicate') {
      setDuplicate(true)
      return
    }
    setToast(res.message)
    window.setTimeout(() => setToast(null), 4000)
  }

  if (done) {
    return (
      <div className="animate-ease-up rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center sm:p-10">
        <div
          aria-hidden="true"
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white"
        >
          <Check className="h-7 w-7" strokeWidth={3} />
        </div>
        <h3 className="mt-5 text-xl font-extrabold text-gray-900 sm:text-2xl">
          등록 완료!
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-gray-700">
          출시되면 가장 먼저 알려드릴게요. 선착순 100명{' '}
          <b className="text-emerald-700">평생 50% 할인</b> 대상에 들어가셨어요.
        </p>
        <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link
            href="/portfolio"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-900 transition hover:border-gray-400 hover:bg-gray-50"
          >
            포트폴리오 보기
          </Link>
          <Link
            href="/wizard"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            지금 급하면 견적 받기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
        <Question
          step={1}
          label="어떤 일을 하세요?"
          required
          error={errors.businessType?.message}
        >
          <CardGrid cols={2}>
            {BUSINESS_TYPES.map((v) => (
              <RadioCard key={v} name="businessType" value={v} register={register} />
            ))}
          </CardGrid>
          <EtcInput
            show={showBizEtc}
            registration={register('businessTypeEtc')}
            error={errors.businessTypeEtc?.message}
            placeholder="어떤 일을 하시는지 적어주세요"
          />
        </Question>

        <Question
          step={2}
          label="무엇을 만들고 싶으세요?"
          required
          error={errors.wantType?.message}
        >
          <CardGrid cols={2}>
            {WANT_TYPES.map((v) => (
              <RadioCard key={v} name="wantType" value={v} register={register} />
            ))}
          </CardGrid>
          <EtcInput
            show={showWantEtc}
            registration={register('wantTypeEtc')}
            error={errors.wantTypeEtc?.message}
            placeholder="무엇을 만들고 싶은지 적어주세요"
          />
        </Question>

        <Question
          step={3}
          label="혹시 전에 시도해보신 적 있어요?"
          required
          error={errors.experience?.message}
        >
          <CardGrid cols={2}>
            {EXPERIENCES.map((v) => (
              <RadioCard key={v} name="experience" value={v} register={register} />
            ))}
          </CardGrid>
        </Question>

        <Question
          step={4}
          label="어디서 막히셨어요?"
          optional
          hint="안 적으셔도 괜찮아요. 적어주시면 그 부분부터 챙길게요."
        >
          <textarea
            {...register('blocker')}
            rows={3}
            maxLength={1000}
            placeholder="예: 토스로 결제받는 걸 못 붙이겠더라고요"
            className={`${inputBase} h-auto resize-none py-3 leading-relaxed`}
          />
        </Question>

        <Question
          step={5}
          label="언제 필요하세요?"
          required
          error={errors.urgency?.message}
        >
          <CardGrid cols={2}>
            {URGENCY.map((v) => (
              <RadioCard key={v} name="urgency" value={v} register={register} />
            ))}
          </CardGrid>
        </Question>

        <Question
          step={6}
          label="지금 홈페이지가 있나요?"
          required
          error={errors.currentSite?.message}
        >
          <CardGrid cols={1}>
            {CURRENT_SITE.map((v) => (
              <RadioCard key={v} name="currentSite" value={v} register={register} />
            ))}
          </CardGrid>
        </Question>

        <Question
          step={7}
          label="한 달에 얼마면 쓸 만하다 싶으세요?"
          required
          error={errors.willingnessToPay?.message}
        >
          <CardGrid cols={1}>
            {WILLINGNESS_TO_PAY.map((v) => (
              <RadioCard
                key={v}
                name="willingnessToPay"
                value={v}
                register={register}
              />
            ))}
          </CardGrid>
        </Question>

        <Question
          step={8}
          label="어디로 연락드리면 될까요?"
          required
          hint="출시되면 여기로 딱 한 번만 알려드려요. 이메일이나 카톡 ID, 편하신 걸로요."
          error={errors.contact?.message}
        >
          <input
            {...register('contact')}
            type="text"
            inputMode="email"
            autoComplete="email"
            placeholder="예: hong@email.com 또는 카톡 hongkim"
            className={inputBase}
          />
        </Question>

        {/* 개인정보 수집·이용 동의 (필수) */}
        <div>
          <div className="flex items-start gap-3">
            <input
              id="consent"
              type="checkbox"
              {...register('consent')}
              className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="text-sm leading-relaxed">
              <label
                htmlFor="consent"
                className="cursor-pointer font-semibold text-gray-800"
              >
                개인정보 수집·이용에 동의합니다{' '}
                <span className="text-indigo-600">(필수)</span>
              </label>
              <button
                type="button"
                onClick={() => setConsentOpen((v) => !v)}
                aria-expanded={consentOpen}
                className="ml-2 inline-flex items-center gap-0.5 align-middle text-xs font-medium text-indigo-600 transition hover:text-indigo-800"
              >
                {consentOpen ? '접기' : '내용 보기'}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${consentOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {consentOpen && (
                <dl className="animate-ease-up mt-2 space-y-1 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-3 text-xs leading-relaxed text-gray-600">
                  <div className="flex gap-1.5">
                    <dt className="shrink-0 font-semibold text-gray-700">
                      수집 항목
                    </dt>
                    <dd>연락처(이메일 또는 카카오톡 ID)</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="shrink-0 font-semibold text-gray-700">
                      이용 목적
                    </dt>
                    <dd>지으리 출시 안내(1회)</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="shrink-0 font-semibold text-gray-700">
                      보유 기간
                    </dt>
                    <dd>출시 안내 후 3개월 이내 파기</dd>
                  </div>
                </dl>
              )}
            </div>
          </div>
          {errors.consent?.message && (
            <p className="mt-1.5 text-sm font-medium text-red-600">
              {errors.consent.message}
            </p>
          )}
        </div>

        {duplicate && (
          <div className="animate-ease-up flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm leading-relaxed text-amber-900">
            <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" strokeWidth={2} />
            <span>
              <b>이미 등록되어 있어요.</b> 이 연락처로는 신청이 끝났어요. 출시되면
              가장 먼저 알려드릴게요.
            </span>
          </div>
        )}

        <div className="space-y-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="cta-glow inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-base font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:text-[17px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                등록하는 중…
              </>
            ) : (
              '선착순 100명 — 평생 50% 할인 등록'
            )}
          </button>
          <p className="text-center text-xs leading-relaxed text-gray-500">
            광고 아닙니다. 출시하면 딱 한 번 연락드립니다.
          </p>
        </div>
      </form>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="animate-ease-up fixed inset-x-4 bottom-6 z-50 mx-auto max-w-sm rounded-xl bg-gray-900 px-4 py-3.5 text-center text-sm font-medium text-white shadow-lg sm:left-1/2 sm:right-auto sm:-translate-x-1/2"
        >
          {toast}
        </div>
      )}
    </>
  )
}

function Question({
  step,
  label,
  hint,
  required,
  optional,
  error,
  children,
}: {
  step: number
  label: string
  hint?: string
  required?: boolean
  optional?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <fieldset>
      <legend className="flex items-center gap-2.5 text-[17px] font-bold text-gray-900 sm:text-lg">
        <span
          aria-hidden="true"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white"
        >
          {step}
        </span>
        <span>
          {label}
          {required && <span className="ml-1 text-indigo-600">*</span>}
          {optional && (
            <span className="ml-1.5 align-middle text-xs font-medium text-gray-400">
              선택
            </span>
          )}
        </span>
      </legend>
      {hint && (
        <p className="mt-1.5 pl-[38px] text-sm leading-relaxed text-gray-500">
          {hint}
        </p>
      )}
      <div className="mt-3.5">{children}</div>
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </fieldset>
  )
}

function CardGrid({
  cols,
  children,
}: {
  cols: 1 | 2
  children: React.ReactNode
}) {
  return (
    <div
      className={`grid gap-2.5 ${cols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}
    >
      {children}
    </div>
  )
}

function EtcInput({
  show,
  registration,
  error,
  placeholder,
}: {
  show: boolean
  registration: UseFormRegisterReturn
  error?: string
  placeholder: string
}) {
  // grid-rows 0fr↔1fr 로 부드럽게 펼침 (layout 자연 변화, 모션 끔이면 즉시)
  return (
    <div
      className={`grid transition-[grid-template-rows] duration-300 ease-emphasized motion-reduce:transition-none ${
        show ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      }`}
    >
      <div className="overflow-hidden">
        <div className="pt-2.5">
          <input
            {...registration}
            type="text"
            placeholder={placeholder}
            aria-hidden={!show}
            tabIndex={show ? 0 : -1}
            className={inputBase}
          />
          {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  )
}

function RadioCard({
  name,
  value,
  register,
}: {
  name: RadioName
  value: string
  register: UseFormRegister<PreregisterInput>
}) {
  return (
    <label className="relative flex cursor-pointer items-center gap-3 rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-[15px] font-medium text-gray-800 transition hover:border-gray-300 hover:bg-gray-50 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50 has-[:checked]:text-indigo-900 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-500/40">
      <input
        type="radio"
        value={value}
        {...register(name)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 transition peer-checked:border-indigo-600 peer-checked:bg-indigo-600"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-white opacity-0 transition peer-checked:opacity-100" />
      </span>
      <span>{value}</span>
    </label>
  )
}
