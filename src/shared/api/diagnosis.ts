// 진단 API — 추천(로드맵) 목록 및 상세. 백엔드 RecommendationController 계약.
// 로드맵 상세/체크리스트는 이 모듈을 쓴다. (roadmap.ts 의 milestones 계열은 백엔드 미구현)
import { http } from '@/shared/api/http'

export type RecommendationCategory = 'HOUSING' | 'LIVING' | 'JOB_STARTUP' | 'FINANCE'

/** 하위 체크리스트 완료 여부로 파생. */
export type RecommendationStatus = 'done' | 'review' | 'progress'

/** 체크리스트 항목 진행 상태. */
export type ChecklistItemStatus = 'todo' | 'done' | 'skipped'

export interface Recommendation {
  recommendationId: number
  title: string
  category: string // 세부 카테고리명 ("월세" 등)
  targetAmount: number | null
  nextAction: string | null
  status: RecommendationStatus
  taskDoneCount: number // 완료한 하위 체크리스트 항목 수
  taskTotalCount: number // 전체 하위 체크리스트 항목 수
}

export interface ChecklistItem {
  id: number
  itemKey: string // "open_saving_account" 등
  contents: string
  orderNo: number
  estimatedAmount: number | null
  status: ChecklistItemStatus
  completedAt: string | null // "2026-08-01T10:00:00"
}

export interface RecommendationDetail {
  recommendationId: number
  category: string // 세부 카테고리명 ("월세" 등)
  title: string
  content: string | null
  orderNo: number | null
  startOffsetValue: number | null
  startOffsetUnit: string | null // "week" | "month"
  durationValue: number | null
  durationUnit: string | null // "week" | "month"
  targetAmount: number | null
  amountType: string | null // "saving" | "expense" | "income"
  targetCondition: string | null
  nextAction: string | null
  citation: string | null
  checklistItems: ChecklistItem[]
  status: RecommendationStatus
}

/** 진단 1건의 추천(로드맵) 목록. */
export function getRecommendations(
  diagnosisId: number,
  category?: RecommendationCategory,
): Promise<Recommendation[]> {
  const q = category ? `?category=${category}` : ''
  return http.get<Recommendation[]>(`/api/diagnoses/${diagnosisId}/recommendations${q}`)
}

/** 추천 항목 상세 + 체크리스트. (C1 체크 리스트 화면) */
export function getRecommendationDetail(recommendationId: number): Promise<RecommendationDetail> {
  return http.get<RecommendationDetail>(`/api/diagnoses/recommendations/${recommendationId}`)
}
