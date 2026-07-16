// ─────────────────────────────────────────────────────────────────────────────
// 한일금속공업(주) 시안 공유 콘텐츠 — 시안 A/B/C 3안이 이 단일 소스를 함께 사용한다.
// 실제 클라 원문이 들어오면 이 파일만 교체하면 3안에 동시 반영된다(임시 카피).
// ─────────────────────────────────────────────────────────────────────────────

/** Unsplash 직링크 조합 (next/image 미사용 — next.config remotePatterns 없음, 순수 <img>) */
const U = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${w}`

/** 전 이미지 200 확인 + 실제 피사체 육안 검증 완료(2026-07) */
export const IMG = {
  weld: U('photo-1504328345606-18bbc8c9d7d1'),      // 용접·불꽃 (표면·열)
  sparks: U('photo-1504917595217-d4dc5ebe6122'),    // 연삭 불꽃 클로즈업
  refinery: U('photo-1516937941344-00b4e0337589'),  // 산업 플랜트 스카이라인
  facility: U('photo-1513828583688-c52646db42da'),  // 설비·배관 내부
  autoline: U('photo-1567789884554-0b844b597180'),  // 자동차 로봇 조립라인
  autos: U('photo-1565043666747-69f6646db940'),     // 자동차 라인업
  parts: U('photo-1537462715879-360eeb61a0ad'),     // 금속 기계 부품(서스펜션)
  circuit: U('photo-1518770660439-4636190af475'),   // 반도체·정밀 전자
  aero: U('photo-1436491865332-7a61a109cc05'),      // 항공기 (항공·우주)
  rocket: U('photo-1541185933-ef5d8ed016c2'),       // 로켓 발사 (방산·우주)
  rnd: U('photo-1581091226825-a6a2a5aee158'),       // R&D 엔지니어 랩
  rndTeam: U('photo-1581092160607-ee22621dd758'),   // 엔지니어링 실습·측정
  esg: U('photo-1487875961445-47a00398c267'),       // 풍력 (ESG·친환경)
  consult: U('photo-1454165804606-c3d57bc86b40'),   // 상담·문의 데스크
} as const

export const COMPANY = {
  nameKo: '한일금속공업(주)',
  nameEn: 'HANIL METAL INDUSTRY CO.,LTD',
  slogan: 'FOR YOUR SATISFACTION',
  since: 1986,
  ceo: '정대성',
  addr: '경기도 시흥시 산기대학로 232',
  tel: '031-498-0326',
  telHref: 'tel:0314980326',
} as const

export const HERO = {
  main: '제품의 표면은 단순한 외관이 아닌, 수명을 좌우하는 핵심 기술 영역입니다',
  sub: '한일금속공업은 HYBRID 표면개질 기술로 고객의 NEEDS에 100% 응답하는 표면처리 전문기업입니다',
} as const

/** GNB 6종 — 존재하는 3페이지 외 링크는 전부 '#'. */
export type NavItem = { label: string; href: string; hasMega?: boolean }
export const makeNav = (base: string): NavItem[] => [
  { label: '회사소개', href: `${base}/greeting` },
  { label: 'PRODUCT', href: '#', hasMega: true },
  { label: '설비현황', href: '#' },
  { label: 'R&D', href: '#' },
  { label: 'ESG', href: '#' },
  { label: '고객지원', href: '#' },
]

/** PRODUCT 표면처리 공정 12종 — 실제 기술 기반 담백한 임시 설명(클라 원문 교체 예정) */
export type Process = { code: string; name: string; en?: string; desc: string }
export const PROCESSES: Process[] = [
  { code: 'ISONITE TF1', name: 'ISONITE TF1', en: 'Salt-bath Nitrocarburizing', desc: '염욕 연질화로 내마모·내피로성을 높이는 대표 표면경화 처리' },
  { code: 'ISONITE TF+', name: 'ISONITE TF+', en: 'TF1 + Post Oxidation', desc: 'TF1에 후산화막을 더해 내식성까지 강화한 개량 공정' },
  { code: 'ISONITE LS', name: 'ISONITE LS', en: 'Low-strain Nitriding', desc: '저변형 조건으로 정밀 부품의 치수 안정성을 확보하는 연질화' },
  { code: '가스질화', name: '가스질화', en: 'Gas Nitriding', desc: '암모니아 분위기에서 질소를 확산시켜 표면 경도를 높이는 열처리' },
  { code: 'DEFRIC', name: 'DEFRIC(고체윤활)', en: 'Solid Lubrication', desc: '고체 윤활 피막으로 마찰과 소착을 줄이는 표면 처리' },
  { code: 'DLC', name: 'DLC 코팅', en: 'Diamond-Like Carbon', desc: '다이아몬드상 카본 박막으로 고경도·저마찰 특성을 부여' },
  { code: '화성처리', name: '화성처리', en: 'Phosphate Coating', desc: '인산염 피막으로 도장 밀착과 방청성을 확보하는 표면처리' },
  { code: 'T.D', name: 'T.D 코팅', en: 'Thermal Diffusion', desc: '탄화물 확산으로 초경 카바이드 층을 형성하는 열확산 코팅' },
  { code: 'PVD', name: 'PVD 코팅', en: 'Physical Vapor Deposition', desc: '진공 증착으로 TiN·CrN 등 내마모 경질 박막을 입히는 코팅' },
  { code: '진공열처리', name: '진공열처리', en: 'Vacuum Heat Treatment', desc: '진공 분위기에서 산화·탈탄 없이 경도와 표면 품질을 확보' },
  { code: '가스침탄', name: '가스침탄', en: 'Gas Carburizing', desc: '표면에 탄소를 침투시켜 심부 인성과 표면 경도를 양립' },
  { code: '진공침탄', name: '진공침탄', en: 'Vacuum Carburizing', desc: '진공 저압 조건에서 균일한 침탄층을 얻는 정밀 침탄 공정' },
]

/** 홈 ②섹션 핵심 공정 8종(대표 공정만 노출) */
export const KEY_PROCESS_CODES = ['ISONITE TF1', 'ISONITE TF+', '가스질화', 'DLC', 'PVD', '진공열처리', '가스침탄', 'T.D']
export const KEY_PROCESSES = KEY_PROCESS_CODES.map((c) => PROCESSES.find((p) => p.code === c)!)

/** 신뢰 지표 — 검증 가능한 사실 기반(과장 수치 지양) */
export const TRUST = [
  { k: 'Since', v: '1986', label: '창립 이래 표면처리 외길' },
  { k: 'ISO 9001', v: '인증', label: '품질경영시스템' },
  { k: 'IATF 16949', v: '인증', label: '자동차 품질경영' },
  { k: 'HYBRID', v: '기술', label: '복합 표면개질' },
] as const

/** C안 카운트업 지표 (사실 기반) */
export const STATS = [
  { value: 2026 - COMPANY.since, suffix: '년', label: '축적된 표면처리 기술' },
  { value: PROCESSES.length, suffix: '종', label: '보유 표면처리 공정' },
  { value: 100, suffix: '%', label: '고객 NEEDS 대응' },
] as const

/** 적용 산업(고객사를 특정 상호로 위조하지 않고 산업군으로 표기 — 시안 임시) */
export const SECTORS = ['자동차 부품', '방위산업', '항공·우주', '정밀기계', '금형', '유압·공압'] as const

/** R&D / ESG 하이라이트 */
export const HIGHLIGHTS = [
  { tag: 'R&D', title: 'HYBRID 표면개질 연구', desc: '질화·코팅·확산 공정을 조합해 부품별 최적 표면 사양을 설계합니다.', img: IMG.rnd },
  { tag: 'ESG', title: '친환경 공정 전환', desc: '에너지 효율과 배출 저감을 고려한 처리 라인으로 지속가능성을 높입니다.', img: IMG.esg },
] as const

/** 대표이사 인사말 — 4문단 임시(클라 원문 교체 예정) */
export const GREETING = {
  eyebrow: '회사소개 · 대표이사 인사말',
  title: '표면에 기술을 새겨온 40년, 신뢰로 답하겠습니다',
  paragraphs: [
    '한일금속공업(주)는 1986년 창립 이래 오직 표면처리 한 분야에 집중해 왔습니다. 제품의 표면은 단순한 외관이 아니라 부품의 수명과 성능을 좌우하는 핵심 기술 영역이라는 믿음으로, 질화와 코팅, 확산 처리를 아우르는 HYBRID 표면개질 기술을 축적해 왔습니다.',
    '우리는 고객이 요구하는 경도, 내마모성, 내식성, 치수 정밀도를 부품 특성에 맞게 설계합니다. 자동차 부품부터 정밀기계, 항공과 방위산업에 이르기까지, 까다로운 사양일수록 한일금속의 기술이 필요한 이유입니다.',
    '품질은 타협하지 않습니다. ISO 9001과 IATF 16949 품질경영시스템을 기반으로 입고부터 출하까지 전 공정을 관리하며, 데이터로 검증된 결과만을 고객에게 전달합니다.',
    '앞으로도 한일금속공업은 기술력과 품질관리, 그리고 고객과의 신뢰를 바탕으로 표면처리의 기준을 만들어 가겠습니다. 변함없는 관심과 성원을 부탁드립니다.',
  ],
  signOff: '대표이사',
  ceo: '정대성',
} as const

/** ISONITE TF1 상세 — 3안 공통 콘텐츠 */
export const ISONITE_TF1 = {
  code: 'ISONITE TF1',
  en: 'Salt-bath Nitrocarburizing',
  category: 'PRODUCT · 표면처리 공정',
  headline: '마모와 피로에 강한 표면을, 변형 없이',
  intro: 'ISONITE TF1은 염욕(salt bath) 연질화 기술로 강 부품 표면에 균일한 화합물층을 형성해 내마모성과 내피로성을 크게 높이는 대표 표면경화 공정입니다.',
  definition:
    '비교적 낮은 온도의 염욕에서 질소와 탄소를 동시에 확산시켜 표면에 치밀한 화합물층과 확산층을 만듭니다. 열변형이 적어 정밀 부품에 적합하며, 후처리 산화를 더하면 내식성까지 확보할 수 있습니다.',
  features: [
    { title: '우수한 내마모성', desc: '표면 화합물층이 마찰 마모를 억제해 부품의 사용 수명을 연장합니다.' },
    { title: '내피로성 향상', desc: '표면 압축 잔류응력이 반복 하중에 대한 피로 강도를 개선합니다.' },
    { title: '낮은 변형', desc: '저온 처리로 열변형을 최소화해 정밀 부품의 치수를 안정적으로 유지합니다.' },
    { title: '내식성 확보', desc: '후산화 처리를 더하면 방청 성능이 향상되어 부식 환경에서도 견딥니다.' },
  ],
  applications: ['크랭크샤프트', '엔진 밸브', '기어류', '샤프트', '유압 부품', '금형 부품'],
} as const
