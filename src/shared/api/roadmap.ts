// 로드맵 API — 진단 결과(요약 + 마일스톤 + 체크리스트) 및 정책 상세.
// 서버가 "내 최신 진단"을 세션으로 해석하므로 diagnosisId 를 프론트가 들고 다니지 않는다.
// (연동 계약: 이슈 #23 · GET /api/users/me/* 계열)
import { http } from '@/shared/api/http'

export type MilestoneStatus = 'done' | 'progress' | 'review' | 'planned' | 'risk'
export type MilestoneCategory = 'housing' | 'living' | 'work' | 'finance'
export type MilestoneBucket = 'within6m' | 'within1y' | 'y1to3' | 'y3to5'
export type PolicyMatchStatus = 'eligible' | 'review' | 'ineligible'

export interface ChecklistItem {
  id: number
  title: string
  done: boolean
  plannedAmount: number // 예상 비용(원). 없으면 0
}

export interface MilestonePolicyRef {
  policyId: string
  title: string
  provider: string
  summary: string
  status: PolicyMatchStatus
  reason: string | null
}

export interface Milestone {
  id: string
  bucket: MilestoneBucket
  category: MilestoneCategory
  flowType: 'mixed' | 'policyOnly'
  title: string
  status: MilestoneStatus
  statusText: string // "완료 · 2024.03" 등
  desc: string
  progress: number | null // 0~100
  action: string | null
  why: string | null
  goalAmount: number | null // 원
  currentAmount: number | null // 원
  targetDate: string | null // "2025.04" 달성 예상
  checklist: ChecklistItem[]
  policy: MilestonePolicyRef | null
}

export interface RoadmapSummary {
  targetMonths: number // 자립수당 종료 시점(개월)
  totalCost: number // 로드맵 전체 예상 비용(원)
  securedAmount: number // 현재 확보액(원)
}

export interface RoadmapResponse {
  protectionEndYm: string | null // "2024.02"
  planUntilYm: string | null // "2029.02"
  summary: RoadmapSummary
  milestones: Milestone[]
}

export interface PolicyDetail {
  policyId: string
  title: string
  provider: string
  status: PolicyMatchStatus
  amount: string
  period: string
  applyPeriod: string
  eligibility: string[]
  documents: string[]
  applyUrl: string | null
}

/** 내 로드맵 전체 (요약 + 마일스톤). */
export function getRoadmap(): Promise<RoadmapResponse> {
  return http.get<RoadmapResponse>('/api/users/me/roadmap')
}

/** 마일스톤에 연결된 정책 상세. */
export function getMilestonePolicy(milestoneId: string): Promise<PolicyDetail> {
  return http.get<PolicyDetail>(`/api/users/me/roadmap/milestones/${milestoneId}/policy`)
}

/** 체크리스트 항목 완료 처리(+ 선택적으로 비용 기록). */
export interface CompleteChecklistBody {
  cost?: number // 원. 비용 없이 완료면 생략
  date?: string // "YYYY-MM-DD"
}
export function completeChecklistItem(
  itemId: number,
  body: CompleteChecklistBody = {},
): Promise<void> {
  return http.post<void>(`/api/users/me/roadmap/checklist-items/${itemId}/complete`, body)
}
