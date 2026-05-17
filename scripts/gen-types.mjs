#!/usr/bin/env node
// Supabase Management API로 TypeScript 타입 자동 생성
// 사용법: npm run db:types
//   .env.local의 SUPABASE_ACCESS_TOKEN을 자동 로드합니다.

import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const PROJECT_REF = 'zowoytknvuwlvkwcvesg'
const OUT_PATH = 'src/types/database.types.ts'
const SCHEMAS = 'public'

// .env.local 로드 (이미 환경에 있으면 덮어쓰지 않음)
if (existsSync('.env.local')) {
  for (const raw of readFileSync('.env.local', 'utf8').split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const idx = line.indexOf('=')
    if (idx < 0) continue
    const key = line.slice(0, idx).trim()
    const val = line.slice(idx + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
}

const token = process.env.SUPABASE_ACCESS_TOKEN
if (!token) {
  console.error('❌ SUPABASE_ACCESS_TOKEN이 없습니다. .env.local에 추가해주세요.')
  process.exit(1)
}

const url = `https://api.supabase.com/v1/projects/${PROJECT_REF}/types/typescript?included_schemas=${SCHEMAS}`

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${token}`,
    'User-Agent': 'easysite-claude-code/1.0',
  },
})

if (!res.ok) {
  console.error(`❌ HTTP ${res.status}: ${await res.text()}`)
  process.exit(1)
}

const { types } = await res.json()
if (!types || typeof types !== 'string') {
  console.error('❌ 응답에 types 필드가 없습니다.')
  process.exit(1)
}

mkdirSync(dirname(OUT_PATH), { recursive: true })
writeFileSync(OUT_PATH, types, 'utf8')

const lines = types.split('\n').length
console.log(`✅ ${OUT_PATH} 생성 완료 (${lines}줄, ${types.length} bytes)`)
