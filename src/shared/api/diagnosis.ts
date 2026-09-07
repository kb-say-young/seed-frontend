// 진단 API — 로드맵(추천) 조회. (연동: issue #14 — BE #30/#33 확정 대기)
import { http } from '@/shared/api/http'

export type RecommendationCategory = 'HOUSING' | 'LIVING' | 'JOB_STARTUP' | 'FINANCE'

export interface Recommendation {
  recommendationId: number
  title: string
  category: string // 세부 카테고리명
  targetAmount: number | null
  nextAction: string | null
}

export function getRecommendations(
  diagnosisId: number,
  category?: RecommendationCategory,
): Promise<Recommendation[]> {
  const q = category ? `?category=${category}` : ''
  return http.get<Recommendation[]>(`/api/diagnoses/${diagnosisId}/recommendations${q}`)
}
