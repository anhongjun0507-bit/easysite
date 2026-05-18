'use client'

import Link from 'next/link'
import { useState } from 'react'
import { StepShell } from '../components/StepShell'
import { StickyFooter } from '../components/StickyFooter'
import { contactSchema } from '../lib/schema'
import type { Contact, WizardState } from '../lib/state'

type Props = {
  state: WizardState
  submitting: boolean
  serverError: string | null
  onPatch: (patch: Partial<Contact>) => void
  onSubmit: () => void
}

type FieldErrors = Partial<Record<keyof Contact, string>>

export function ContactStep({
  state,
  submitting,
  serverError,
  onPatch,
  onSubmit,
}: Props) {
  const [errors, setErrors] = useState<FieldErrors>({})
  const { contact } = state

  const handleSubmit = () => {
    const parsed = contactSchema.safeParse({
      name: contact.name ?? '',
      phone: contact.phone ?? '',
      email: contact.email ?? '',
      kakao: contact.kakao ?? '',
      consent: contact.consent ?? false,
    })
    if (!parsed.success) {
      const next: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Contact
        if (!next[key]) next[key] = issue.message
      }
      setErrors(next)
      return
    }
    setErrors({})
    onSubmit()
  }

  return (
    <>
      <StepShell
        question="연락처만 남기면 끝나요"
        helper={
          <>
            영업일 24시간 안에 카톡으로 견적이랑 미리보기 보내드릴게요. 광고 X.
          </>
        }
      >
        <div className="space-y-5">
          <ContactField
            id="contact-name"
            label="이름"
            placeholder="예: 안홍준"
            autoComplete="name"
            value={contact.name ?? ''}
            error={errors.name}
            onChange={(v) => {
              onPatch({ name: v })
              if (errors.name) setErrors((e) => ({ ...e, name: undefined }))
            }}
          />
          <ContactField
            id="contact-phone"
            label="휴대전화"
            placeholder="010-1234-5678"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={contact.phone ?? ''}
            error={errors.phone}
            onChange={(v) => {
              onPatch({ phone: v })
              if (errors.phone) setErrors((e) => ({ ...e, phone: undefined }))
            }}
          />
          <ContactField
            id="contact-kakao"
            label={
              <>
                카카오톡 ID{' '}
                <span className="ml-1 text-xs font-normal text-gray-500">(선택)</span>
              </>
            }
            placeholder="예: easysite_kr"
            value={contact.kakao ?? ''}
            error={errors.kakao}
            onChange={(v) => onPatch({ kakao: v })}
          />
          <ContactField
            id="contact-email"
            label={
              <>
                이메일{' '}
                <span className="ml-1 text-xs font-normal text-gray-500">(선택)</span>
              </>
            }
            placeholder="user@example.com"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={contact.email ?? ''}
            error={errors.email}
            onChange={(v) => {
              onPatch({ email: v })
              if (errors.email) setErrors((e) => ({ ...e, email: undefined }))
            }}
          />

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <input
              type="checkbox"
              checked={contact.consent ?? false}
              onChange={(e) => {
                onPatch({ consent: e.target.checked })
                if (errors.consent)
                  setErrors((s) => ({ ...s, consent: undefined }))
              }}
              className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-400 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm leading-relaxed text-gray-700">
              <span className="font-semibold text-gray-900">
                개인정보 수집·이용에 동의
              </span>
              합니다. 견적 답변·서비스 제공 목적, 보유 기간 2년.{' '}
              <Link
                href="/privacy"
                target="_blank"
                className="underline underline-offset-2 hover:text-indigo-700"
              >
                자세히
              </Link>
            </span>
          </label>
          {errors.consent && (
            <p className="text-sm text-red-600">{errors.consent}</p>
          )}

          {serverError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}
        </div>
      </StepShell>
      <StickyFooter>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="cta-glow inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-6 text-base font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          style={{ height: 52 }}
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
            <>견적 요청 보내기</>
          )}
        </button>
        <p className="mt-2 text-center text-xs text-gray-600">
          가입 없이 가능 · 영업일 24시간 안에 카톡으로 답변
        </p>
      </StickyFooter>
    </>
  )
}

type ContactFieldProps = {
  id: string
  label: React.ReactNode
  placeholder?: string
  type?: string
  autoComplete?: string
  inputMode?: 'text' | 'tel' | 'email' | 'numeric'
  value: string
  error?: string
  onChange: (v: string) => void
}

function ContactField({
  id,
  label,
  placeholder,
  type = 'text',
  autoComplete,
  inputMode,
  value,
  error,
  onChange,
}: ContactFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-900">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-2 w-full rounded-xl border-2 bg-white px-4 text-base text-gray-900 shadow-sm placeholder:text-gray-500 transition focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/30'
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/30'
        }`}
        style={{ height: 52 }}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
