/**
 * ⚠️ 임시 — 제목·UI 서체 후보 3종을 라이브에서 비교하려고 둔 스위처. 확정되면 통째로 지운다.
 *
 * `?font=1` 배민 주아 · `?font=2` 카페24 써라운드 · `?font=3` 카페24 동동 (기본 1)
 *
 * 클래스가 아니라 `.letters-root` 의 변수를 다시 묶는 이유: 라이트박스·우편함은
 * `.letters-root` 로 포털되기 때문에, 페이지 안쪽 래퍼에 클래스를 걸면 오버레이만 서체가 어긋난다.
 * 서버에서 렌더되는 <style> 한 줄이라 클라이언트 JS 는 늘지 않는다.
 */
export function FontSwitch({ font }: { font?: string | string[] }) {
  const n = Number(Array.isArray(font) ? font[0] : font)
  if (n !== 2 && n !== 3) return null
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `.letters-root{--font-display:var(--font-d${n});--font-ui:var(--font-u${n})}`,
      }}
    />
  )
}
