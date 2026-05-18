import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

/**
 * 서비스 롤 클라이언트 — RLS 우회. 서버 액션·라우트 핸들러 전용.
 * 절대 클라이언트 번들에 노출 금지 (env 키도 NEXT_PUBLIC 아님).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Supabase admin credentials missing')
  }
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
