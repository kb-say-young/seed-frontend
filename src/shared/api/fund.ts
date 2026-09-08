// 자금 계획 API — 목적별 배분 / AI 추천 예산 / 배분 비율 저장.
// (연동 계약: 이슈 #23 · GET /api/users/me/* 계열)
import { http } from '@/shared/api/http'

export type FundCategoryKey = 'housing' | 'living' | 'work' | 'saving'

export interface FundBucket {
  key: FundCategoryKey
  label: string
  pct: number // 배분 비율 0~100
  actual: number | null // 현재 확보/사용액(원)
  budget: number | null // 목표액(원)
  amount: number | null // budget 없이 단일 금액만 있는 버킷(예: 저축)
}

export interface FundPrinciple {
  text: string
  ok: boolean
}

export interface FundPlanResponse {
  totalFund: number // 계획할 자립 자금 총액(원)
  settlementMoney: number // 자립정착금(원)
  supportMoney: number // 지원금(원)
  buckets: FundBucket[]
  principles: FundPrinciple[]
}

export interface FundAiResponse {
  recommendedTotal: number // AI 추천 자립 자금 총액(원)
  recommended: FundBucket[] // AI 추천 배분
  monthlyBudget: number // 총 가용 예산(월, 원)
  myAllocation: { key: FundCategoryKey; label: string; pct: number }[] // 사용자 저장 배분
}

export function getFundPlan(): Promise<FundPlanResponse> {
  return http.get<FundPlanResponse>('/api/users/me/fund-plan')
}

export function getFundAi(): Promise<FundAiResponse> {
  return http.get<FundAiResponse>('/api/users/me/fund-plan/ai')
}

export interface AllocationSaveBody {
  allocations: { key: FundCategoryKey; pct: number }[]
}
export function saveAllocation(body: AllocationSaveBody): Promise<void> {
  return http.put<void>('/api/users/me/fund-plan/allocation', body)
}
