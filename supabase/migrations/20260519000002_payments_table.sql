-- payments: 결제 요청·승인 내역 (Phase 2 토스페이먼츠 연동)
-- 흐름:
--   1. 어드민(본인) 이 lead 상세에서 "결제 요청 생성" → row INSERT (status=pending)
--   2. 사장님이 결제 링크 클릭 → 토스페이먼츠 결제창 → 결제
--   3. 토스 콜백 → 서버가 토스 API 로 승인 검증 → status=paid, paid_at 갱신
--
-- 운영 DB 적용: Supabase Dashboard → SQL Editor 에 이 파일 내용 붙여넣어 실행.

-- ───────────────────────────────────────────────────────────────
-- 1. 테이블
-- ───────────────────────────────────────────────────────────────
create table public.payments (
  id                uuid primary key default gen_random_uuid(),
  lead_id           uuid not null references public.leads(id) on delete restrict,

  -- 금액 (원, 부가세 포함). bigint 로 두어 운영 안전성 확보.
  amount            bigint not null check (amount > 0),

  -- 결제 유형 (1차 50% / 잔금 50% / 전액)
  payment_type      text not null
                      check (payment_type in ('first', 'final', 'full')),

  -- 상태 (대기 → 결제완료 / 실패 / 취소)
  status            text not null default 'pending'
                      check (status in ('pending', 'paid', 'failed', 'canceled')),

  -- 토스페이먼츠 연동 키
  toss_order_id     text not null unique,    -- 우리가 발급 (uuid), 토스에 전달
  toss_payment_key  text unique,             -- 토스가 결제 승인 시 발급

  -- 어드민 메모 (예: "한식당 사이트 1차")
  memo              text,

  -- 타임스탬프
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  paid_at           timestamptz,

  -- 결제 실패/취소 사유 (토스 응답 message 또는 어드민 취소 사유)
  fail_reason       text
);

-- ───────────────────────────────────────────────────────────────
-- 2. 인덱스
-- ───────────────────────────────────────────────────────────────
create index payments_lead_id_idx          on public.payments (lead_id);
create index payments_status_idx           on public.payments (status, created_at desc);
create index payments_created_at_desc_idx  on public.payments (created_at desc);

-- ───────────────────────────────────────────────────────────────
-- 3. updated_at 트리거 (set_updated_at() 은 초기 스키마에서 정의)
-- ───────────────────────────────────────────────────────────────
create trigger payments_set_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

-- ───────────────────────────────────────────────────────────────
-- 4. RLS
--   * payments 는 결제 정보(개인 식별 가능) 라 anon 직접 접근 금지.
--   * 어드민 화면·결제 페이지·콜백 모두 Next.js 서버 측에서 service_role 사용.
--   * anon policy 미생성 → 익명 클라이언트는 0 행만 보임.
-- ───────────────────────────────────────────────────────────────
alter table public.payments enable row level security;
