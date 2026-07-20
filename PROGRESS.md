# PROGRESS

## 2026-07-20 — /letters 후속 3종: 서체 비교·캡쳐 sync·우편함 (배포 완료, 서체 선택 대기)
- 서체: 제목·UI 전부 동글동글 계열로 교체(손글씨 본문은 유지). 후보 3종 전부 OFL — 배민 주아/카페24 써라운드/카페24 동동.
  넥슨 배찌체는 "폰트 파일 수정·복제·배포 금지"라 서브셋 불가로 제외. `?font=1|2|3` 스위처로 라이브 비교 중(선택 후 정리 커밋 예정).
  `scripts/subset-letters-font.py` 가 후보당 display(10~18KB, preload) + ui(2,350자 118~181KB, swap) 두 벌을 굽는다.
- 캡쳐 파이프라인: `npm run sync:letters` — 파일 스캔 → webp(해시 파일명으로 URL 추측 차단) → blur → letters.ts AUTO 구간 생성.
  reply·transcript·alt 는 보존되고, 실제 캡쳐가 1장이라도 들어오면 더미 3세트가 자동으로 빠진다. 원본은 `_src/`(gitignore).
- 우편함 인덱스: 좌상단 버튼 → 풀스크린 오버레이(월별 항로·답장한 날만 로즈 점). 클릭 이동 + `#entry-id` 딥링크,
  ESC·↑↓·Tab 트랩·reduced-motion 폴백. 라이브 검증: 3종×4컷 스크린샷, 딥링크 착지, 콘솔 에러 0, 타 라우트 회귀 정상.

## 2026-07-20 — /letters 프라이빗 편지 아카이브 딥블랙 버전 (배포 완료)
- 아트 디렉션 교체: 빈티지 항공우편(크림) → 딥블랙 #0a0a0b + 오프화이트 + 로즈 #FF9398 (Love Lost 문법 계승).
  씬: 프리로더 → 인트로(사운드 선택) → 항로 프롤로그(pin+scrub) → 엔트리 루프(소인·캡쳐·리더·답장) → 에필로그.
- 엔진: gsap.ticker 단일 RAF + Lenis, ScrollTrigger 1개가 `lib/letters/scroll.ts` 단일 진행도에 기록 → HTML·WebGL 공유.
  R3F 풀스크린 캔버스는 밤하늘·항로만 그리고 캡쳐는 HTML(next/image) 유지(alt·키보드·CLS 0). 성능 티어 high/low/none(`?perf=`).
- 서체: 제목 나눔명조 98자 서브셋(12/14KB, preload), 본문 나눔손글씨 다행체(OFL) 교체. 사운드는 Web Audio 런타임 합성(파일 0KB).
- 성능: three 동적 분리+idle 마운트로 first load 398→167KB, LCP 7.7→2.3s, TBT 2.2→1.2s, CLS 0 (로컬 Lighthouse 모바일 Perf 71).
- 라이브 검증(jieuri.com/letters): 게이트 오답/정답, 사운드 AudioContext running, 리더 키보드 조작, 캔버스 마운트, 페이지 에러 0.
  Vercel prod/preview 에 LETTERS_PASSCODE·LETTERS_SECRET 추가. robots Disallow·sitemap 제외·타 라우트 회귀 정상.

## 2026-07-16 — 한일 시안 전용 독립 호스트 추가 (배포 완료)
- Vercel 프로젝트에 `hanilmetal.vercel.app` 추가(후보 1순위). 클라에 jieuri.com 미노출용 독립 URL.
- `src/middleware.ts`: 시안 호스트에서만 / → /hanil rewrite, /a·/b·/c 등 → /hanil/*, 기존 /hanil/* 링크는 307로 /* 정규화. jieuri.com 등 타 호스트 무영향. matcher에 api·폰트·css/js 제외 추가(에셋 보호).
- 페이지/콘텐츠/디자인 변경 없음. 라이브 검증: 시안 호스트 / ·/a·/b·/c·/a/isonite-tf1·/b/greeting 전부 200 + CSS/JS/woff2 200 + noindex 유지, /hanil/a→/a 307. 회귀: jieuri.com/ 및 /hanil/a 기존 동작 그대로.

## 2026-07-16 — /hanil 시안 A/B/C 대기업급 디자인 업그레이드 (배포 예정)
- 공통 기반 신설: `_components/_ui.ts`(타입 스케일·모션·여백 토큰) + `Section.tsx`(SectionHead 번호 01~ 패턴 · ScrollCue).
- 공유 컴포넌트 업그레이드(3안 동시): SiteHeader GNB 언더라인 hover + 메가메뉴 번호/영문, SiteFooter 슬로건 밴드+4컬럼(회사정보·연락처 분리), IsoniteBody pull-quote+적용부품 비주얼 카드 3종, GreetingBody 인용 첫 문단 강조+서명 정돈, HeroCrossfade(A) 세그먼트 프로그레스+01/03 카운터.
- 홈 3종: 타입 스케일 적용, 섹션 번호 01~03, 공정 그리드 8→12종+01~12 번호, B/C 히어로 ScrollCue, CTA 위계(주+텍스트링크).
- 시안 아이덴티티·피드백분(확대 로고/GNB/히어로, 블러 4px+1.05, keep-all, noindex 격리) 유지. 외부 애니메 라이브러리 미사용(CSS+IO만).
- 검증: build EXIT=0(10 라우트 static), A/B/C×(홈·isonite)+greeting 1440/375 전후 스크린샷, / 회귀 정상. references/hanil-design.md 리서치 보강.


## 2026-07-16 — /hanil 시안 A/B/C 클라 피드백 2건 반영 (배포 완료)
- 텍스트 확대(시니어 가독성): 공용 SiteHeader 로고 17→20px, GNB 13.5→15px,
  메가메뉴 공정 13→14px, 헤더 높이 64/76→72/88px + 각 히어로 메인·서브 카피 한 단계 확대(keep-all 유지).
- 히어로 배경 블러: blur-4px + scale-1.05 + overflow-hidden(edge bleed 방지), 텍스트·버튼 선명 유지,
  오버레이 불변. A안 크로스페이드 3장 동일 적용.
- 비-hanil 라우트 무변경(/·/jieuri·/pricing 회귀 정상). build EXIT=0.
- main 머지·푸시(8bc2821) → Vercel prod 배포 → live jieuri.com/hanil/a·b·c 200 확인.
