'use client'

import { forwardRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { wizardSchema, submitWizard, type WizardInput } from './actions'

export function WizardForm({ initialIntent }: { initialIntent: string }) {
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WizardInput>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      businessName: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      intent: initialIntent,
      description: initialIntent ? `“${initialIntent}” 같은 사이트를 만들고 싶어요.` : '',
    },
  })

  async function onSubmit(values: WizardInput) {
    setSubmitting(true)
    setServerError(null)
    const result = await submitWizard(values)
    setSubmitting(false)
    if (result.ok) {
      setSubmitted(true)
    } else {
      setServerError(result.error)
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-indigo-200 bg-indigo-50 p-8 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path d="M5 12l5 5L20 7" />
          </svg>
        </div>
        <h2 className="mt-5 text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl">
          잘 받았어요!
        </h2>
        <p className="mt-3 text-base leading-relaxed text-gray-700">
          24시간 안에 견적이랑 사이트 미리보기 보내드릴게요.
          <br className="hidden sm:inline" /> 빠른 답변이 필요하시면 아래로 직접
          연락주셔도 좋아요.
        </p>
        <a
          href="tel:01037825418"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-700 transition hover:border-gray-400"
        >
          010-3782-5418
        </a>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-xl space-y-5"
      noValidate
    >
      <Field
        id="businessName"
        label="사업체 이름"
        placeholder="예: 손맛한식당"
        autoComplete="organization"
        error={errors.businessName?.message}
        {...register('businessName')}
      />
      <Field
        id="contactName"
        label="이름"
        placeholder="예: 안홍준"
        autoComplete="name"
        error={errors.contactName?.message}
        {...register('contactName')}
      />
      <Field
        id="contactPhone"
        label="휴대전화"
        placeholder="010-1234-5678"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        error={errors.contactPhone?.message}
        {...register('contactPhone')}
      />
      <Field
        id="contactEmail"
        label={
          <>
            이메일{' '}
            <span className="ml-1 text-xs font-normal text-gray-500">(선택)</span>
          </>
        }
        placeholder="user@example.com"
        type="email"
        autoComplete="email"
        error={errors.contactEmail?.message}
        {...register('contactEmail')}
      />
      <input type="hidden" {...register('intent')} />

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-gray-900"
        >
          어떤 사이트가 필요하세요?
        </label>
        <p className="mt-1 text-xs text-gray-500">
          업종, 페이지 수, 결제·예약 같은 기능, 예산 범위 등 떠오르는 대로
          적어주세요.
        </p>
        <textarea
          id="description"
          rows={5}
          className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 shadow-sm placeholder:text-gray-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          placeholder="예: 30년 된 한식당이에요. 메뉴랑 예약 페이지 필요하고..."
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1.5 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="cta-glow inline-flex h-14 w-full items-center justify-center rounded-lg bg-indigo-600 px-7 text-base font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 sm:text-[17px]"
        >
          {submitting ? (
            <>
              <svg
                aria-hidden="true"
                className="mr-2 h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  opacity="0.25"
                />
                <path
                  d="M22 12a10 10 0 0 1-10 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              보내는 중…
            </>
          ) : (
            <>
              <span className="whitespace-nowrap">1분 만에 견적 받기</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2 h-5 w-5"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="13 6 19 12 13 18" />
              </svg>
            </>
          )}
        </button>
        <p className="mt-3 text-center text-sm font-medium text-gray-600">
          가입 없이 가능 · 24시간 안에 카톡으로 답변
        </p>
      </div>
    </form>
  )
}

type FieldProps = {
  id: string
  label: React.ReactNode
  error?: string
  type?: string
  placeholder?: string
  autoComplete?: string
  inputMode?: 'text' | 'tel' | 'email' | 'numeric'
  name: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  onBlur: React.FocusEventHandler<HTMLInputElement>
}

const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  props,
  ref,
) {
  const {
    id,
    label,
    error,
    type = 'text',
    placeholder,
    autoComplete,
    inputMode,
    name,
    onChange,
    onBlur,
  } = props
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-900">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-2 h-12 w-full rounded-lg border bg-white px-4 text-base text-gray-900 shadow-sm placeholder:text-gray-400 transition focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/30'
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/30'
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
})
