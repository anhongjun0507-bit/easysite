# 한일금속공업(주) 시안 디자인 리서치 (2026-07)

클라 검토용 `/hanil` 시안 3종 제작 시 참고한 실사이트 조사 요약. 재조사 금지 — 이후 세션은 이 파일만 참조.

## 시안 A — Deep Navy Tech
참고: heattreatment.ai(에스피열처리), SKF, 현대제철 급 다크 프리미엄 제조.
- 다크 베이스 + 화이트 타이포, 풀폭 히어로에 **다크 그라데이션 오버레이**로 사진 위 가독성 확보.
- 공정 카드는 **이미지/다크 카드 그리드**로 스캔 가능하게, 스틸블루·메탈릭 미세 액센트.
- nav는 희소·정제. 다크/라이트 섹션 교차로 리듬.

## 시안 B — Light Corporate
참고: jwmfittings.com/kr(정우금속), 일본 정밀부품사, POSCO홀딩스 급 라이트 코퍼레이트.
- 화이트/라이트그레이 + **네이비 단일 액센트**, 커맨딩한 히어로 태그라인 1줄.
- **모듈형 섹션 블록 + 일관된 수직 리듬**, 넉넉한 여백, 위계는 타이포 크기로만.
- 카드 그림자 절제, 플랫하고 스캔 쉬운 nav.

## 시안 C — Industrial Hybrid
참고: POSCO, 두산 계열 모던 인더스트리얼.
- **다크 히어로 → 라이트 본문** 교차, 포인트 컬러(딥버건디)를 라벨·버튼·메가메뉴 배경에만 소량.
- **큰 숫자 지표(카운트업)**, hover 반응 카드 그리드.
- 네온·그라데이션 배제, 대면적 포인트 컬러 금지.

## 공통 적용 원칙 (frontend-design + design-taste-frontend 룰셋)
- em-dash 전면 금지, 이모지 금지, 커스텀 커서 금지(격리로 충족), 3-동일카드 디폴트 회피.
- 액센트 1개/시안(Color Consistency Lock), 히어로 뷰포트 안착·텍스트 4요소 제한, eyebrow 절제.
- 모션: CSS transition/keyframes + IntersectionObserver만(GSAP/Lenis/Motion 미사용). 리듀스드모션 존중.
- 다이얼: B2B 제조=trust-first + 브리프의 "CSS/IO만" 명시 → MOTION 낮게(3~4), DENSITY 3~4, VARIANCE 시안별 상이.
- 이미지: Unsplash 직링크(순수 `<img>`, next/image 미사용). 전 URL 200 + 피사체 육안 검증 완료.
