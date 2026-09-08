// 페이지 단위 단건 조회용 미니 컴포저블. { data, loading, error, reload } 노출.
// - 마운트 시 자동 fetch (immediate: false 로 끔)
// - requireAuth: true 면 비로그인 시 요청하지 않고 안내 문구를 error 로 세팅
// - ApiError.message 를 그대로 노출 (백엔드 공통 응답의 message)

import { ref, shallowRef, onMounted, type Ref } from 'vue'
import { ApiError } from '@/shared/api'
import { isLoggedIn } from '@/shared/lib/auth'

export interface Resource<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  reload: () => Promise<void>
}

export function useResource<T>(
  fetcher: () => Promise<T>,
  opts: { immediate?: boolean; requireAuth?: boolean } = {},
): Resource<T> {
  const data = shallowRef<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function reload() {
    if (opts.requireAuth && !isLoggedIn()) {
      data.value = null
      error.value = '로그인하면 내 정보를 볼 수 있어요.'
      return
    }
    loading.value = true
    error.value = null
    try {
      data.value = await fetcher()
    } catch (e) {
      data.value = null
      error.value = e instanceof ApiError ? e.message : '데이터를 불러오지 못했어요.'
    } finally {
      loading.value = false
    }
  }

  if (opts.immediate !== false) onMounted(reload)

  return { data, loading, error, reload }
}
