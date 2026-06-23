import { portfolio, type PortfolioItem } from '@/config/portfolio'
import type { SiteType } from '@/app/wizard/lib/state'

/**
 * 위저드 답변(siteType + industry 자유 입력)으로 비슷한 포트폴리오 매칭.
 * 우선순위: industry 키워드 → siteType → fallback(인기 3건).
 */
export function matchPortfolio(input: {
  siteType?: SiteType
  industry?: string
}): PortfolioItem[] {
  const industry = (input.industry ?? '').trim().toLowerCase()

  const byId = (id: string) => portfolio.find((p) => p.id === id)

  // 1) 업종 키워드 매칭 — 우선순위 높음
  if (industry) {
    if (/(치유|힐링|명상|상담|웰니스|원예|가드닝|공방|요가|필라테스|스파|테라피|심리|돌봄)/.test(industry)) {
      return compact([byId('grassflowerhealing'), byId('prismedu'), byId('conatusipsi')])
    }
    if (/(학원|교육|입시|레슨|클래스)/.test(industry)) {
      return compact([byId('prismedu'), byId('conatusipsi'), byId('ps-company')])
    }
    if (/(쇼핑|커머스|상품|판매|스토어)/.test(industry)) {
      return compact([byId('digitalst'), byId('prism-print'), byId('ps-company')])
    }
    if (/(건축|디자인|인테리어|스튜디오)/.test(industry)) {
      return compact([byId('soc-architects'), byId('ps-company'), byId('prismedu')])
    }
    if (/(시설|청소|경비|건설|누수|설비|수리|배관|방수|하자|시공)/.test(industry)) {
      return compact([byId('kbgroup'), byId('nomorenusu'), byId('soc-architects')])
    }
    if (/(인쇄|명함|굿즈)/.test(industry)) {
      return compact([byId('prism-print'), byId('digitalst'), byId('ps-company')])
    }
    if (/(크리에이터|유튜브|방송|mcn)/i.test(industry)) {
      return compact([byId('ps-company'), byId('digitalst'), byId('prismedu')])
    }
  }

  // 2) siteType 기반 매칭
  switch (input.siteType) {
    case 'shop':
      return compact([byId('digitalst'), byId('prism-print'), byId('soc-architects')])
    case 'reservation':
      return compact([byId('conatusipsi'), byId('prismedu'), byId('ps-company')])
    case 'landing':
      return compact([byId('ps-company'), byId('digitalst'), byId('prismedu')])
    case 'company':
      return compact([byId('ps-company'), byId('kbgroup'), byId('soc-architects')])
    case 'app':
      // 앱 전용 포트폴리오는 없어 플랫폼/서비스 성격 사례로 매칭
      return compact([byId('sellfit'), byId('conatusipsi'), byId('digitalst')])
    case 'other':
    default:
      // 3) Fallback — 다양한 카테고리 한 개씩
      return compact([byId('prismedu'), byId('digitalst'), byId('ps-company')])
  }
}

function compact<T>(arr: Array<T | undefined>): T[] {
  return arr.filter((v): v is T => v !== undefined)
}
