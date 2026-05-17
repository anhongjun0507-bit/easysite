-- EasySite Phase 1 초기 스키마
-- 견적 위저드(leads) + AI 챗봇 대화(conversations) + 활동 이벤트(lead_events)

create extension if not exists pgcrypto;

-- ───────────────────────────────────────────────────────────────
-- updated_at 자동 갱신용 함수
-- ───────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ───────────────────────────────────────────────────────────────
-- leads: 견적 위저드 제출
-- ───────────────────────────────────────────────────────────────
create table public.leads (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- 연락처
  business_name   text,
  contact_name    text,
  contact_phone   text,
  contact_email   text,

  -- 위저드 응답
  industry        text,
  page_count      int,
  features        jsonb not null default '{}'::jsonb,
  wizard_answers  jsonb not null default '{}'::jsonb,

  -- AI 산출물
  estimated_price_min int,
  estimated_price_max int,

  -- 운영
  status          text not null default 'new'
                    check (status in ('new','contacted','quoted','contracted','lost')),
  source          text,
  notes           text
);

create index leads_created_at_desc_idx on public.leads (created_at desc);
create index leads_status_idx          on public.leads (status);
create index leads_contact_email_idx   on public.leads (contact_email);

create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- ───────────────────────────────────────────────────────────────
-- conversations: AI 챗봇 메시지 로그
-- ───────────────────────────────────────────────────────────────
create table public.conversations (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid references public.leads(id) on delete cascade,
  session_id  text not null,
  created_at  timestamptz not null default now(),
  role        text not null check (role in ('user','assistant','system')),
  content     text not null,
  metadata    jsonb not null default '{}'::jsonb
);

create index conversations_lead_id_idx     on public.conversations (lead_id);
create index conversations_session_id_idx  on public.conversations (session_id, created_at);

-- ───────────────────────────────────────────────────────────────
-- lead_events: 활동 추적 (위저드 진입/단계 통과/제출/챗봇 시작 등)
-- ───────────────────────────────────────────────────────────────
create table public.lead_events (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid references public.leads(id) on delete cascade,
  session_id  text,
  created_at  timestamptz not null default now(),
  event_type  text not null,
  payload     jsonb not null default '{}'::jsonb
);

create index lead_events_lead_id_idx     on public.lead_events (lead_id);
create index lead_events_event_type_idx  on public.lead_events (event_type, created_at desc);
create index lead_events_session_id_idx  on public.lead_events (session_id, created_at);

-- ───────────────────────────────────────────────────────────────
-- RLS
--   * 익명 사용자: 위저드 제출 / 챗봇 사용 / 이벤트 기록만 INSERT 가능
--   * SELECT/UPDATE/DELETE: service_role 만 (관리자 패널은 추후)
-- ───────────────────────────────────────────────────────────────
alter table public.leads          enable row level security;
alter table public.conversations  enable row level security;
alter table public.lead_events    enable row level security;

create policy "leads_anon_insert"
  on public.leads for insert
  to anon
  with check (true);

create policy "conversations_anon_insert"
  on public.conversations for insert
  to anon
  with check (true);

create policy "lead_events_anon_insert"
  on public.lead_events for insert
  to anon
  with check (true);
