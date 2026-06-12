-- jieuri_preregistrations: 지으리(jieuri.com) 사전등록 대기자 명단
-- 흐름:
--   1. 방문자가 /jieuri 랜딩 사전등록 폼 제출 (업종·만들고싶은것·시도경험·막힌지점·지불의향·연락처)
--   2. 서버 액션이 service_role 로 INSERT (RLS 우회)
--   3. 같은 contact 재제출 시 unique 위반(23505) → "이미 등록되어 있어요" 안내
--
-- 운영 DB 적용: Supabase Dashboard → SQL Editor 에 이 파일 내용 붙여넣어 실행.
-- (이 작업에선 Management API 로 자동 적용함)

-- ───────────────────────────────────────────────────────────────
-- 1. 테이블
-- ───────────────────────────────────────────────────────────────
create table public.jieuri_preregistrations (
  id                  uuid primary key default gen_random_uuid(),

  -- 설문 (모두 선택 — 연락처만 필수)
  business_type       text,   -- Q1 어떤 일을 하세요?
  want_type           text,   -- Q2 만들고 싶은 것
  experience          text,   -- Q3 시도 경험
  blocker             text,   -- Q4 막혔던 지점 (자유 서술)
  willingness_to_pay  text,   -- Q5 월 지불 의향

  -- 연락처 (이메일 또는 카톡ID) — 유일하게 필수. 중복 방지 위해 unique.
  contact             text not null unique,

  created_at          timestamptz not null default now()
);

-- ───────────────────────────────────────────────────────────────
-- 2. 인덱스 (어드민에서 최신순 조회 대비)
-- ───────────────────────────────────────────────────────────────
create index jieuri_preregistrations_created_at_desc_idx
  on public.jieuri_preregistrations (created_at desc);

-- ───────────────────────────────────────────────────────────────
-- 3. RLS
--   * 익명(anon): INSERT 만 허용 (사전등록 제출).
--   * SELECT/UPDATE/DELETE 정책 미생성 → 익명은 읽기·수정·삭제 모두 차단.
--   * 어드민 조회는 추후 service_role 서버 측에서 처리.
--   ⚠️ 익명 클라이언트에서 .insert().select() 금지 — RETURNING 이 SELECT RLS 를
--      트리거해 42501 발생. anon 경로는 return=minimal 사용.
--      (실제 폼은 service_role 서버 액션이라 해당 없음)
-- ───────────────────────────────────────────────────────────────
alter table public.jieuri_preregistrations enable row level security;

create policy "jieuri_preregistrations_anon_insert"
  on public.jieuri_preregistrations for insert
  to anon
  with check (true);
