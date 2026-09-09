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

// 금액 구조는 로드맵 요약(MyRoadmapResponse.summary)과 같은 개념을 쓴다.
// 전체 예상 비용 · 확보액 두 값만 받고, 부족분은 화면에서 뺄셈으로 구한다
// (두 곳에서 따로 계산해 서로 어긋나는 걸 막는다).
export interface FundPlanResponse {
  totalFund: number // 전체 예상 비용(원) — 로드맵 추천들의 목표 금액 합
  securedAmount: number // 현재 확보액(원) — 디딤씨앗통장 잔액 등
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

// ⚠️ 목업 — GET /api/users/me/fund-plan/ai 는 백엔드에 없다(목적별 배분 GET만 있음).
// 백엔드가 생기면 아래 값을 지우고 실제 http.get 호출로 되돌린다.
export function getFundAi(): Promise<FundAiResponse> {
  const recommended: FundBucket[] = [
    { key: 'housing', label: '주거', pct: 40, actual: null, budget: 5000000, amount: null },
    { key: 'living', label: '생활', pct: 25, actual: null, budget: 3125000, amount: null },
    { key: 'work', label: '취·창업', pct: 20, actual: null, budget: 2500000, amount: null },
    { key: 'saving', label: '금융', pct: 15, actual: null, budget: null, amount: 1875000 },
  ]
  return Promise.resolve({
    recommendedTotal: 12500000,
    recommended,
    monthlyBudget: 1500000,
    myAllocation: recommended.map((r) => ({ key: r.key, label: r.label, pct: r.pct })),
  })
}

export interface AllocationSaveBody {
  allocations: { key: FundCategoryKey; pct: number }[]
}
export function saveAllocation(body: AllocationSaveBody): Promise<void> {
  return http.put<void>('/api/users/me/fund-plan/allocation', body)
}
