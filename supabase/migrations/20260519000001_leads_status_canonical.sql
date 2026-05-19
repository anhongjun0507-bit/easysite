-- 리드 상태 정규화 — admin/leads 키와 정렬.
-- 기존 CHECK는 위저드 초기('new','contacted','quoted','contracted','lost')라
-- 어드민 상세 페이지에서 상태 변경(in_progress·contract·canceled·on_hold) 시 막힘.
-- 운영 DB에 SQL Editor로 직접 적용해주세요. (위저드는 'new'만 insert하므로 백필은 안전)

-- 1. 기존 CHECK 제거
alter table public.leads drop constraint if exists leads_status_check;

-- 2. 레거시 값 → 신규 키 매핑 (방어적 백필)
update public.leads set status = 'in_progress' where status in ('contacted', 'quoted');
update public.leads set status = 'contract'    where status = 'contracted';
update public.leads set status = 'canceled'    where status = 'lost';

-- 3. 새 CHECK 추가
alter table public.leads
  add constraint leads_status_check
  check (status in ('new', 'in_progress', 'contract', 'canceled', 'on_hold'));
