# PROGRESS

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
