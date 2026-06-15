// 포트폴리오: 실제 운영 중인 클라이언트 사이트
// 사용처: Hero Trust Bar(featured=true만), /portfolio 페이지(전체),
//        추후 위저드 결과 페이지의 "비슷한 예시" 매칭
// 썸네일: public/portfolio/{id}.png (1280×748, 16:10 근사)

export type PortfolioItem = {
  id: string
  name: string
  url: string
  category: string
  description: string
  tech_stack: string[]
  featured: boolean
  image: string
  imageAlt: string
}

export const portfolio: PortfolioItem[] = [
  {
    id: 'sellfit',
    name: 'SELLFIT (쎈셀핏)',
    url: 'https://sellfit.vercel.app',
    category: '패션·중고거래',
    description:
      '스타일 탐색 기반 AI 매칭으로 중고 패션을 사고팔고 교환하는 플랫폼.',
    tech_stack: ['Next.js', 'Vercel'],
    featured: true,
    image: '/portfolio/sellfit.png',
    imageAlt: 'SELLFIT 쎈셀핏 — 스타일 탐색·중고 패션 거래 코디 피드 화면',
  },
  {
    id: 'prismedu',
    name: '프리즘 입시',
    url: 'https://prismedu.kr',
    category: '교육·입시',
    description: '한국 국제학교 학생을 위한 미국 대학 입시 컨설팅 플랫폼',
    tech_stack: [],
    featured: true,
    image: '/portfolio/prismedu.png',
    imageAlt: '프리즘 입시 — 미국 대학 합격 가능성 분석 대시보드 화면',
  },
  {
    id: 'conatusipsi',
    name: 'Conatus 입시',
    url: 'https://conatusipsi.com',
    category: '교육·입시',
    description:
      'AI가 1,000개 학과 합격 가능성을 분석해 수시·정시 전략을 잡아주는 입시 서비스',
    tech_stack: [],
    featured: true,
    image: '/portfolio/conatusipsi.png',
    imageAlt: 'Conatus 입시 — 내 성적으로 갈 수 있는 학과 분석 메인 화면',
  },
  {
    id: 'digitalst',
    name: '디지털스토어',
    url: 'https://digitalst.kr',
    category: '쇼핑몰',
    description:
      '정식 AI 소프트웨어 라이센스를 즉시 발급받을 수 있는 온라인 스토어',
    tech_stack: ['Next.js'],
    featured: true,
    image: '/portfolio/digitalst.png',
    imageAlt: '디지털스토어 — AI 소프트웨어 라이센스 베스트셀러 진열 화면',
  },
  {
    id: 'ps-company',
    name: 'PS Company',
    url: 'https://pscp.to',
    category: '회사소개·MCN',
    description:
      '유튜브·치지직 등 4개 플랫폼 BJ를 전문 매니징하는 크리에이터 회사',
    tech_stack: ['Next.js'],
    featured: true,
    image: '/portfolio/ps-company.png',
    imageAlt: 'PS Company — 크리에이터 매니지먼트 회사 메인 비주얼',
  },
  {
    id: 'prism-print',
    name: 'Prism Print',
    url: 'https://prismprint.vercel.app',
    category: '인쇄·서비스',
    description: '명함·스티커·포스터를 2~5일 안에 받아보는 사내 인쇄 주문 서비스',
    tech_stack: ['Vercel'],
    featured: true,
    image: '/portfolio/prism-print.png',
    imageAlt: 'Prism Print — 사내 인쇄 주문 서비스 메인 화면',
  },
  {
    id: 'soc-architects',
    name: 'SOC Architects',
    url: 'https://www.socarchitects.com/en',
    category: '건축',
    description: '주택·농장·상업시설을 설계하는 건축사무소의 프로젝트 포트폴리오',
    tech_stack: ['Next.js', 'Sanity CMS'],
    featured: true,
    image: '/portfolio/soc-architects.png',
    imageAlt: 'SOC Architects — 건축사무소 프로젝트 포트폴리오 상세 화면',
  },
  {
    id: 'kbgroup',
    name: '케이비개발',
    url: 'https://kbgroup.kr',
    category: '회사소개·시설관리',
    description:
      '아파트 주택관리·위생청소·경비보안·시행건설을 아우르는 종합 시설관리 회사 소개 사이트',
    tech_stack: ['Next.js', 'Vercel'],
    featured: true,
    image: '/portfolio/kbgroup.png',
    imageAlt: '케이비개발(KB GROUP) — 종합 시설관리 회사 메인 화면',
  },
  {
    id: 'nomorenusu',
    name: '유레카 누수탐지',
    url: 'https://nomorenusu.com',
    category: '설비·수리',
    description:
      '수도권 24시간 긴급출동으로 누수탐지·배관 수리를 해결하는 설비 전문 업체 사이트',
    tech_stack: ['Next.js', 'Vercel'],
    featured: true,
    image: '/portfolio/nomorenusu.png',
    imageAlt: '유레카 누수탐지 — 24시간 긴급출동 누수탐지·설비 수리 서비스 메인 화면',
  },
  {
    id: 'grassflowerhealing',
    name: '풀밭꽃밭 치유센터',
    url: 'https://grassflowerhealing.com',
    category: '원예치유·교육',
    description:
      '원예 치유 수업과 웰니스 원예지도사 자격 교육을 운영하는 치유·힐링 전문 센터',
    tech_stack: ['Next.js', 'Vercel'],
    featured: true,
    image: '/portfolio/grassflowerhealing.png',
    imageAlt: '풀밭꽃밭 치유센터 — 원예 치유·힐링 프로그램 안내 메인 화면',
  },
]

export const featuredPortfolio: PortfolioItem[] = portfolio.filter(
  (p) => p.featured,
)
