import { computed, type WritableComputedRef } from 'vue'

/** 원 단위 숫자 <-> 콤마 문자열 양방향 바인딩. get/set 은 store 필드에 직접 연결. */
export function moneyModel(
  get: () => number | null,
  set: (n: number | null) => void,
): WritableComputedRef<string> {
  return computed({
    get: () => {
      const n = get()
      return n == null ? '' : n.toLocaleString('ko-KR')
    },
    set: (v: string) => {
      const n = Number(v.replace(/[^\d]/g, ''))
      set(Number.isFinite(n) && n > 0 ? n : null)
    },
  })
}

export const won = (n: number) => n.toLocaleString('ko-KR') + '원'
export const manwon = (n: number) => `${Math.round(n / 10000).toLocaleString('ko-KR')}만원`
