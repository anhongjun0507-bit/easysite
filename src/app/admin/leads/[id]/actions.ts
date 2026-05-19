'use server'

import { revalidatePath } from 'next/cache'
import { isAdminSessionValid } from '@/lib/admin/auth'
import { isLeadStatusKey } from '@/lib/admin/status'
import { createAdminClient } from '@/lib/supabase/admin'

const UUID_RE = /^[0-9a-f-]{36}$/i
const MEMO_MAX = 5000

export type ActionResult = { ok: true } | { ok: false; error: string }

/** 어드민 인증 + UUID 검증 공통 가드 */
function guard(id: string): ActionResult | null {
  if (!isAdminSessionValid()) return { ok: false, error: '인증이 만료됐어요. 다시 로그인해주세요.' }
  if (!UUID_RE.test(id)) return { ok: false, error: '잘못된 리드 ID' }
  return null
}

export async function updateLeadStatusAction(
  id: string,
  status: string,
): Promise<ActionResult> {
  const denied = guard(id)
  if (denied) return denied
  if (!isLeadStatusKey(status)) {
    return { ok: false, error: '잘못된 상태 값' }
  }
  const admin = createAdminClient()
  const { error } = await admin
    .from('leads')
    .update({ status })
    .eq('id', id)
  if (error) {
    // CHECK 제약 위반 등 — 사용자에게 friendly 메시지
    return {
      ok: false,
      error:
        error.code === '23514'
          ? 'DB 상태 제약이 옛 값이라 막혔어요. supabase/migrations/20260519000001_leads_status_canonical.sql 적용 필요'
          : '저장 실패: ' + error.message,
    }
  }
  revalidatePath(`/admin/leads/${id}`)
  revalidatePath('/admin/leads')
  revalidatePath('/admin')
  return { ok: true }
}

export async function updateLeadMemoAction(
  id: string,
  memo: string,
): Promise<ActionResult> {
  const denied = guard(id)
  if (denied) return denied
  if (typeof memo !== 'string') return { ok: false, error: '잘못된 입력' }
  if (memo.length > MEMO_MAX) {
    return { ok: false, error: `메모는 ${MEMO_MAX}자 이내로 적어주세요` }
  }
  const admin = createAdminClient()
  const { error } = await admin
    .from('leads')
    .update({ admin_memo: memo })
    .eq('id', id)
  if (error) {
    return { ok: false, error: '저장 실패: ' + error.message }
  }
  // 메모는 list 페이지엔 안 보이므로 detail만 revalidate
  revalidatePath(`/admin/leads/${id}`)
  return { ok: true }
}
