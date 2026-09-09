// 페이지 단위 단건 조회용 미니 컴포저블. { data, loading, error, errorCode, reload } 노출.
// - 마운트 시 자동 fetch (immediate: false 로 끔)
// - requireAuth: true 면 비로그인 시 요청하지 않고 안내 문구를 error 로 세팅
// - ApiError.message 를 그대로 노출 (백엔드 공통 응답의 message)
// - errorCode 는 보통 백엔드 공통 응답의 code (예: "DIAGNOSIS_404_001") 지만, 비로그인으로
//   막힌 경우엔 서버까지 가지도 않으므로 클라이언트 쪽 의사 코드 AUTH_REQUIRED_ERROR_CODE 를 쓴다.
//   화면이 에러 종류별로 다른 액션(재시도 대신 로그인으로 이동 등)을 보여줘야 할 때
//   message 대신 이 코드로 분기한다.

import { ref, shallowRef, onMounted, type Ref } from 'vue'
import { ApiError } from '@/shared/api'
import { isLoggedIn } from '@/shared/lib/auth'

/** requireAuth 화면에서 비로그인으로 막혔을 때의 errorCode. 서버 코드가 아니다. */
export const AUTH_REQUIRED_ERROR_CODE = 'AUTH_REQUIRED'

export interface Resource<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  errorCode: Ref<string | null>
  reload: () => Promise<void>
}

export function useResource<T>(
  fetcher: () => Promise<T>,
  opts: { immediate?: boolean; requireAuth?: boolean } = {},
): Resource<T> {
  const data = shallowRef<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const errorCode = ref<string | null>(null)

  async function reload() {
    if (opts.requireAuth && !isLoggedIn()) {
      data.value = null
      error.value = '로그인하면 내 정보를 볼 수 있어요.'
      errorCode.value = AUTH_REQUIRED_ERROR_CODE
      return
    }
    loading.value = true
    error.value = null
    errorCode.value = null
    try {
      data.value = await fetcher()
    } catch (e) {
      data.value = null
      error.value = e instanceof ApiError ? e.message : '데이터를 불러오지 못했어요.'
      errorCode.value = e instanceof ApiError ? e.code : null
    } finally {
      loading.value = false
    }
  }

  if (opts.immediate !== false) onMounted(reload)

  return { data, loading, error, errorCode, reload }
}
