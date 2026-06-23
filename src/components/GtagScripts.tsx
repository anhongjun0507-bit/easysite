import { GA_ID, GOOGLE_ADS_ID, GA_GTAG_ID, HAS_GTAG } from '@/lib/tracking/analytics'

/**
 * gtag 기반 스니펫을 SSR HTML 에 직접 렌더한다(표준 gtag 스니펫과 동일 형태).
 * - 초기 로드 즉시 실행 → 페이지뷰·전환 누락 방지(클라 주입 afterInteractive 대비 안정적)
 * - 정적 HTML 에 포함되어 배포 검증(curl)도 가능
 * - 측정 ID(env) 없으면 아무것도 렌더하지 않음(무동작)
 * SPA 라우트 변경 페이지뷰·tel 클릭·전환 전송은 Analytics(client)가 담당한다.
 */
export function GtagScripts() {
  if (!HAS_GTAG) return null
  const config = [
    GA_ID ? `gtag('config','${GA_ID}');` : '',
    GOOGLE_ADS_ID ? `gtag('config','${GOOGLE_ADS_ID}');` : '',
  ].join('')
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_GTAG_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${config}`,
        }}
      />
    </>
  )
}
