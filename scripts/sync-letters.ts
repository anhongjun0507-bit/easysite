/**
 * /letters 캡쳐 동기화 — 폴더에 넣은 스캔을 화면에 뜨는 상태까지 한 번에 만든다.
 *
 *   public/letters/YYYY-MM-DD_letter_01.jpg   ← 이렇게 넣고
 *   npm run sync:letters                      ← 이거 한 줄
 *
 * 하는 일
 *   1) 규칙에 맞는 파일을 (날짜, 종류) 로 묶는다
 *   2) webp 로 변환 — EXIF 회전 반영, 긴 변 1600px 상한.
 *      결과 파일명에 원본 해시 6자를 붙인다: `2026-03-14_letter_01.a3f9k2.webp`
 *      public/ 은 게이트와 무관하게 URL 만 알면 열리는 자리라, 날짜만으로는 주소를 못 맞추게 한다.
 *   3) blur 미리보기(10×14 JPEG)를 만들어 src/content/letters-blur.ts 를 갱신
 *   4) src/content/letters.ts 의 AUTO 구간을 다시 쓴다.
 *      기존 파일을 그대로 import 해서 reply·transcript·alt 를 옮겨 담으므로 직접 쓴 글은 남는다.
 *   5) 원본 jpg/png 는 public/letters/_src/ 로 옮긴다(.gitignore 대상 — 원본이 배포에 안 실린다)
 *
 * 실행:  npm run sync:letters
 */

import { createHash } from 'node:crypto'
import { mkdir, readdir, readFile, rename, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { LETTERS as WRITTEN, type LetterEntry, type LetterImage } from '../src/content/letters.ts'
import { koDate } from '../src/lib/letters/format.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC_DIR = path.join(ROOT, 'public', 'letters')
const ARCHIVE_DIR = path.join(PUBLIC_DIR, '_src')
const LETTERS_TS = path.join(ROOT, 'src', 'content', 'letters.ts')
const BLUR_TS = path.join(ROOT, 'src', 'content', 'letters-blur.ts')

const INPUT = /^(\d{4}-\d{2}-\d{2})_(letter|diary)_(\d{2})\.(jpe?g|png)$/i
const OUTPUT = /^(\d{4}-\d{2}-\d{2})_(letter|diary)_(\d{2})\.[0-9a-f]{6}\.webp$/i

const MAX_EDGE = 1600
const WEBP_QUALITY = 82

type Kind = LetterEntry['kind']
type Input = { file: string; date: string; kind: Kind; nn: string }

/** 대체 텍스트 기본값 — 직접 고친 값이 있으면 그쪽을 쓴다 */
function defaultAlt(date: string, kind: Kind, page: number, total: number): string {
  const head = kind === 'letter' ? `${koDate(date)}에 받은 손편지` : `${koDate(date)} 일기`
  return total > 1 ? `${head} 캡쳐 ${page}쪽` : `${head} 캡쳐`
}

/** 문자열 리터럴 — 레포 스타일(작은따옴표)에 맞춘다. 줄바꿈은 \n 으로 남는다 */
function ts(value: string): string {
  const json = JSON.stringify(value)
  return value.includes("'") ? json : `'${json.slice(1, -1).replace(/\\"/g, '"')}'`
}

async function collect(): Promise<{ inputs: Input[]; existingOutputs: string[]; names: string[] }> {
  const names = (await readdir(PUBLIC_DIR)).sort()
  const inputs: Input[] = []
  const existingOutputs: string[] = []
  for (const file of names) {
    const m = INPUT.exec(file)
    if (m) inputs.push({ file, date: m[1], kind: m[2].toLowerCase() as Kind, nn: m[3] })
    else if (OUTPUT.test(file)) existingOutputs.push(file)
  }
  return { inputs, existingOutputs, names }
}

async function convert(input: Input): Promise<{ image: LetterImage; blur: string; outName: string }> {
  const buf = await readFile(path.join(PUBLIC_DIR, input.file))
  const hash = createHash('sha256').update(buf).digest('hex').slice(0, 6)
  const outName = `${input.date}_${input.kind}_${input.nn}.${hash}.webp`
  const outPath = path.join(PUBLIC_DIR, outName)

  const webp = await sharp(buf)
    .rotate() // EXIF 방향 반영 — 폰으로 찍은 캡쳐가 눕는 사고 방지
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer()
  await writeFile(outPath, webp)

  const meta = await sharp(webp).metadata()
  const blur = await sharp(webp).resize(10, 14, { fit: 'fill' }).jpeg({ quality: 40 }).toBuffer()

  console.log(
    `  · ${input.file} → ${outName}  ${(buf.length / 1024).toFixed(0)}KB → ${(webp.length / 1024).toFixed(0)}KB ` +
      `(-${Math.round((1 - webp.length / buf.length) * 100)}%)`,
  )

  return {
    outName,
    blur: `data:image/jpeg;base64,${blur.toString('base64')}`,
    image: {
      src: `/letters/${outName}`,
      alt: '',
      width: meta.width ?? 0,
      height: meta.height ?? 0,
    },
  }
}

function renderEntries(entries: LetterEntry[]): string {
  const lines: string[] = ['const REAL: LetterEntry[] = [']
  for (const e of entries) {
    lines.push('  {')
    lines.push(`    id: ${ts(e.id)},`)
    lines.push(`    date: ${ts(e.date)},`)
    lines.push(`    kind: ${ts(e.kind)},`)
    lines.push('    images: [')
    for (const img of e.images) {
      lines.push(
        `      { src: ${ts(img.src)}, alt: ${ts(img.alt)}, width: ${img.width}, height: ${img.height} },`,
      )
    }
    lines.push('    ],')
    if (e.transcript !== undefined) lines.push(`    transcript: ${ts(e.transcript)},`)
    lines.push('    reply: {')
    lines.push(`      date: ${ts(e.reply?.date ?? e.date)},`)
    lines.push(`      body: ${ts(e.reply?.body ?? '')},`)
    lines.push('    },')
    lines.push('  },')
  }
  lines.push(']')
  return lines.join('\n')
}

/** 기존 맵에서 **파일이 아직 있는 것**만 남기고 새로 만든 것을 얹는다(더미 blur 도 그대로 산다) */
async function writeBlurMap(fresh: Map<string, string>, onDisk: Set<string>) {
  const current = [...(await readFile(BLUR_TS, 'utf8')).matchAll(/'([^']+)':\s*'([^']+)'/g)]
  const merged = new Map<string, string>()
  for (const [, src, data] of current) if (onDisk.has(src)) merged.set(src, data)
  for (const [src, data] of fresh) merged.set(src, data)

  const out = [
    '// 자동 생성 파일 — 수정하지 말 것.',
    '// 실제 캡쳐는 `npm run sync:letters`, 더미는 `python3 scripts/gen-letter-dummies.py` 가 채운다.',
    '// next/image placeholder="blur" 용 저해상도 미리보기.',
    '',
    'export const LETTER_BLUR: Record<string, string> = {',
    ...[...merged].map(([src, data]) => `  '${src}': '${data}',`),
    '}',
    '',
  ].join('\n')
  await writeFile(BLUR_TS, out, 'utf8')
  console.log(`· letters-blur.ts 갱신 (${merged.size}개)`)
}

async function main(): Promise<number> {
  const { inputs, existingOutputs, names } = await collect()
  if (!inputs.length) {
    console.log('· public/letters/ 에 새로 넣은 파일이 없습니다.')
    console.log('  파일명 규칙: YYYY-MM-DD_letter_01.jpg  (일기는 _diary_, 여러 장이면 _02, _03…)')
    return 0
  }
  console.log(`· 새 캡쳐 ${inputs.length}장`)

  // 직접 쓴 글 — 엔트리는 id 로, 대체 텍스트는 파일명(해시 포함이라 원본이 같으면 같다)으로 이어받는다
  const written = new Map(WRITTEN.map((e) => [e.id, e]))
  const altByName = new Map<string, string>()
  for (const e of WRITTEN) {
    for (const img of e.images) altByName.set(path.basename(img.src), img.alt)
  }

  // (날짜, 종류) 로 묶는다
  const groups = new Map<string, Input[]>()
  for (const input of inputs) {
    const id = `${input.date}-${input.kind}`
    groups.set(id, [...(groups.get(id) ?? []), input])
  }

  const entries: LetterEntry[] = []
  const blur = new Map<string, string>()
  const producedNames = new Set<string>()

  for (const [id, group] of [...groups].sort(([a], [b]) => a.localeCompare(b))) {
    const { date, kind } = group[0]
    console.log(`\n[${id}]`)
    const images: LetterImage[] = []
    for (const [i, input] of group.entries()) {
      const { image, blur: data, outName } = await convert(input)
      producedNames.add(outName)
      blur.set(image.src, data)
      image.alt = altByName.get(outName) || defaultAlt(date, kind, i + 1, group.length)
      images.push(image)
    }
    const before = written.get(id)
    entries.push({
      id,
      date,
      kind,
      images,
      ...(before?.transcript !== undefined ? { transcript: before.transcript } : {}),
      reply: before?.reply ?? { date, body: '' },
    })
    console.log(`  → ${images.length}장 · 답장 ${before?.reply?.body ? '있음' : '아직 안 씀'}`)
  }

  // 예전 해시로 남아 있는 웹피는 지운다(같은 자리를 다시 찍어 올린 경우)
  for (const stale of existingOutputs) {
    if (producedNames.has(stale)) continue
    const m = OUTPUT.exec(stale)!
    if (!groups.has(`${m[1]}-${m[2].toLowerCase()}`)) continue
    await unlink(path.join(PUBLIC_DIR, stale))
    console.log(`\n· 옛 파일 정리: ${stale}`)
  }

  // letters.ts 의 AUTO 구간만 교체
  const source = await readFile(LETTERS_TS, 'utf8')
  const marked = /(^\/\/ <<< AUTO[\s\S]*?\n)const REAL: LetterEntry\[\] = [\s\S]*?\n(^\/\/ >>> AUTO$)/m
  if (!marked.test(source)) {
    console.error('letters.ts 의 AUTO 마커를 찾지 못했습니다. 마커를 지우지 마세요.')
    return 1
  }
  await writeFile(LETTERS_TS, source.replace(marked, `$1${renderEntries(entries)}\n$2`), 'utf8')
  console.log(`\n· letters.ts AUTO 구간 갱신 (엔트리 ${entries.length}건 — 더미는 자동으로 빠집니다)`)

  await writeBlurMap(blur, new Set(names.map((n) => `/letters/${n}`)))

  // 원본은 배포 자산에서 빼 둔다
  await mkdir(ARCHIVE_DIR, { recursive: true })
  for (const input of inputs) {
    await rename(path.join(PUBLIC_DIR, input.file), path.join(ARCHIVE_DIR, input.file))
  }
  console.log(`· 원본 ${inputs.length}장을 public/letters/_src/ 로 옮겼습니다`)
  console.log('\n다음: src/content/letters.ts 에서 reply.body 를 채우세요.')
  return 0
}

main().then((code) => process.exit(code))
