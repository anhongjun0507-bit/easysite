-- jieuri_preregistrations: 사전등록 설문 v2 — 시기(urgency)·현재 사이트(current_site) 컬럼 추가.
-- 폼에 "언제 필요하세요?" / "지금 홈페이지가 있나요?" 두 문항(필수 라디오)을 추가하면서 저장 컬럼 신설.
-- ⚠️ 둘 다 nullable — 기존 응답자 행이 이미 있으므로 not null 금지(기존 행은 두 값이 NULL로 남음).
--
-- 운영 DB 적용: Supabase Dashboard → SQL Editor (이 작업에선 Management API 로 자동 적용).

alter table public.jieuri_preregistrations
  add column urgency       text,
  add column current_site  text;

comment on column public.jieuri_preregistrations.urgency is
  '언제 필요한지 (설문 v2: 당장 이번 달 / 1~3개월 내 / 올해 안 / 아직은 그냥 궁금함)';
comment on column public.jieuri_preregistrations.current_site is
  '현재 홈페이지 보유 상황 (설문 v2: 없음 / 방치·불만 / 직접 제작 사용 / 인스타·블로그 대체)';
