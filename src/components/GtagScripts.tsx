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
  // 프라이빗 아카이브(/letters)에선 config 를 아예 실행하지 않는다 → 페이지뷰·전환 전송 0.
  // (레이아웃은 서버 컴포넌트라 경로를 알 수 없으므로 브라우저에서 pathname 으로 가드한다.
  //  headers() 를 쓰면 전 페이지가 동적 렌더가 되어 성능 손해가 크다.)
  const config = [
    GA_ID ? `gtag('config','${GA_ID}');` : '',
    GOOGLE_ADS_ID ? `gtag('config','${GOOGLE_ADS_ID}');` : '',
  ].join('')
  const guardedConfig = `if(!location.pathname.startsWith('/letters')){${config}}`
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_GTAG_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${guardedConfig}`,
        }}
      />
    </>
  )
}
