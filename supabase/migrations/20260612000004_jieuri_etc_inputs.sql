-- jieuri_preregistrations: Q1(하는 일)·Q2(만들고 싶은 것) "기타" 직접 입력값 컬럼 추가.
-- 폼에서 "기타" 선택 시에만 입력칸이 펼쳐지고 필수 → 그 값을 저장.
-- ⚠️ 둘 다 nullable — "기타"가 아닌 응답/기존 행은 NULL.
--
-- 운영 DB 적용: Supabase Dashboard → SQL Editor (이 작업에선 Management API 로 자동 적용).

alter table public.jieuri_preregistrations
  add column business_type_etc  text,
  add column want_type_etc       text;

comment on column public.jieuri_preregistrations.business_type_etc is
  'Q1 "기타" 선택 시 직접 입력한 하는 일';
comment on column public.jieuri_preregistrations.want_type_etc is
  'Q2 "기타" 선택 시 직접 입력한 만들고 싶은 것';
