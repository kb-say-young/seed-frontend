// 지역 API — 시도 / 시군구 조회. (연동: issue #12)
import { http } from '@/shared/api/http'

export interface Sido {
  regionCode: string // 5자리 시도 코드
  sidoName: string
}
export interface Sigungu {
  regionCode: string // 5자리 시군구 코드 — 사용자 지역은 항상 이 값을 서버에 전달
  sigunguName: string
}

export function getSidos(): Promise<Sido[]> {
  return http.get<Sido[]>('/api/regions/sidos', { auth: false })
}
export function getSigungus(sidoCode: string): Promise<Sigungu[]> {
  return http.get<Sigungu[]>(`/api/regions/${sidoCode}/sigungus`, { auth: false })
}
