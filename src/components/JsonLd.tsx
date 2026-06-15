// 구조화 데이터(JSON-LD) 주입용 서버 컴포넌트.
// `<` 를 이스케이프해 </script> 조기 종료(XSS)를 막는다.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
