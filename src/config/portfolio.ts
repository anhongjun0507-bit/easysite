// 포트폴리오: 실제 운영 중인 클라이언트 사이트
// 사용처: Hero Trust Bar(featured=true만), /portfolio 페이지(전체),
//        추후 위저드 결과 페이지의 "비슷한 예시" 매칭

export type PortfolioItem = {
  id: string
  name: string
  url: string
  category: string
  description: string
  tech_stack: string[]
  featured: boolean
}

export const portfolio: PortfolioItem[] = [
  {
    id: 'prismedu',
    name: '프리즘 입시',
    url: 'https://prismedu.kr',
    category: '교육·입시',
    description: '한국 국제학교 학생을 위한 미국 대학 입시 컨설팅 플랫폼',
    tech_stack: [],
    featured: true,
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
  },
  {
    id: 'prism-print',
    name: 'Prism Print',
    url: 'https://prismprint.vercel.app',
    category: '인쇄·서비스',
    description: '명함·스티커·포스터를 2~5일 안에 받아보는 사내 인쇄 주문 서비스',
    tech_stack: ['Vercel'],
    featured: false,
  },
  {
    id: 'waylog',
    name: 'Waylog',
    url: 'https://waylog1.vercel.app',
    category: '라이프스타일',
    description: '라이프스타일 리뷰와 8주 챌린지를 한 곳에서 관리하는 서비스',
    tech_stack: ['Vercel'],
    featured: false,
  },
  {
    id: 'soc-architects',
    name: 'SOC Architects',
    url: 'https://www.socarchitects.com/en',
    category: '건축',
    description: '주택·농장·상업시설을 설계하는 건축사무소의 프로젝트 포트폴리오',
    tech_stack: ['Next.js', 'Sanity CMS'],
    featured: false,
  },
]

export const featuredPortfolio: PortfolioItem[] = portfolio.filter(
  (p) => p.featured,
)
