-- jieuri_preregistrations: 개인정보 수집·이용 동의 시각 기록 컬럼 추가.
-- /jieuri 사전등록 폼에 동의 체크박스(필수)를 추가하면서, 제출 시 동의 시각을 남긴다.
-- 동의 없이는 폼 스키마 검증을 통과 못 하므로 모든 행에 동의 시각이 존재한다.
--
-- 운영 DB 적용: Supabase Dashboard → SQL Editor 에 붙여넣어 실행.
-- (이 작업에선 Management API 로 자동 적용함)

alter table public.jieuri_preregistrations
  add column consented_at timestamptz not null default now();

comment on column public.jieuri_preregistrations.consented_at is
  '개인정보 수집·이용 동의 시각 (폼 제출 시 기록)';
