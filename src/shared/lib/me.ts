// 로그인한 사용자의 프로필(내 정보) — 앱 전역에서 1회 fetch 후 공유. (issue #23)
// account / home / diagnosis 세 feature 가 소비하므로 shared 에 둔다.
// ⚠️ BE GET /api/users/me 미구현 — 없으면 error 상태로 degrade, 소비 화면은 "미입력" 폴백.

import { reactive } from 'vue'
import { userApi, ApiError } from '@/shared/api'
import type { MeResponse } from '@/shared/api/user'
import { isLoggedIn } from '@/shared/lib/auth'

interface MeStore {
  data: MeResponse | null
  loading: boolean
  loaded: boolean // fetch 시도를 1회라도 마쳤는가 (성공/실패 무관)
  error: string | null
}

export const me = reactive<MeStore>({
  data: null,
  loading: false,
  loaded: false,
  error: null,
})

let inflight: Promise<void> | null = null

/** 내 정보를 불러온다. 이미 로드했거나 진행 중이면 재요청하지 않는다(force 로 강제). */
export function loadMe(force = false): Promise<void> {
  if (inflight) return inflight
  if (me.loaded && !force) return Promise.resolve()

  if (!isLoggedIn()) {
    me.data = null
    me.error = null
    me.loaded = true
    return Promise.resolve()
  }

  me.loading = true
  me.error = null
  inflight = userApi
    .getMe()
    .then((res) => {
      me.data = res
      me.error = null
    })
    .catch((e) => {
      me.data = null
      me.error = e instanceof ApiError ? e.message : '내 정보를 불러오지 못했어요.'
    })
    .finally(() => {
      me.loading = false
      me.loaded = true
      inflight = null
    })
  return inflight
}

/** 로그아웃 등으로 세션이 바뀔 때 호출. */
export function resetMe(): void {
  me.data = null
  me.loading = false
  me.loaded = false
  me.error = null
}

// --- 표시용 파생 헬퍼 ---

/** "YYYY-MM-DD" → "YYYY.MM" */
export function ymShort(iso: string | null | undefined): string | null {
  if (!iso) return null
  const m = /^(\d{4})-(\d{2})/.exec(iso)
  return m ? `${m[1]}.${m[2]}` : null
}

/** "YYYY-MM-DD" → "YYYY. MM. DD" */
export function ymdDotted(iso: string | null | undefined): string | null {
  if (!iso) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  return m ? `${m[1]}. ${m[2]}. ${m[3]}` : null
}

/** ISO date 에서 n년 뒤의 "YYYY.MM" */
export function ymPlusYears(iso: string | null | undefined, years: number): string | null {
  if (!iso) return null
  const m = /^(\d{4})-(\d{2})/.exec(iso)
  return m ? `${Number(m[1]) + years}.${m[2]}` : null
}
