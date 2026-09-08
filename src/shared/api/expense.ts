// 지출/예산 API — 기록 탭(요약 + 최근 내역), 예산 대비, 지출/수입 추가.
// (연동 계약: 이슈 #23 · GET /api/users/me/* 계열)
import { http } from '@/shared/api/http'
import type { FundCategoryKey } from '@/shared/api/fund'

export interface ExpenseItem {
  id: number
  date: string // "YYYY-MM-DD"
  title: string
  category: string
  amount: number // 지출은 음수, 수입은 양수(원)
}

export interface TrackingSummary {
  month: string // "YYYY-MM"
  spent: number // 이번 달 지출 합계(원, 양수)
  plan: number // 이번 달 계획(원)
  roadmapProgress: { done: number; total: number }
  nextMilestone: { title: string; progress: number } | null
  recent: ExpenseItem[]
}

export interface BudgetCategory {
  key: FundCategoryKey
  label: string
  budget: number // AI 추천 예산(원)
  actual: number // 실제 지출(원)
  saving: boolean // 저축 카테고리 여부(초과=나쁨이 아님)
}

export interface BudgetResponse {
  month: string
  spent: number
  plan: number
  categories: BudgetCategory[]
}

export interface ExpenseCategory {
  key: string
  label: string
}

export interface ExpenseCreateBody {
  kind: 'expense' | 'income'
  category: string
  amount: number // 원(양수). kind 로 부호 결정
  date: string // "YYYY-MM-DD"
  memo: string | null
}

/** 기록 탭 요약 + 최근 내역. month 미지정 시 이번 달. */
export function getTrackingSummary(month?: string): Promise<TrackingSummary> {
  const q = month ? `?month=${month}` : ''
  return http.get<TrackingSummary>(`/api/users/me/expenses/summary${q}`)
}

/** 예산 대비 지출. */
export function getBudgets(month?: string): Promise<BudgetResponse> {
  const q = month ? `?month=${month}` : ''
  return http.get<BudgetResponse>(`/api/users/me/budgets${q}`)
}

/** 지출/수입 추가에 쓰는 카테고리 목록. */
export function getExpenseCategories(): Promise<ExpenseCategory[]> {
  return http.get<ExpenseCategory[]>('/api/expense-categories')
}

export function createExpense(body: ExpenseCreateBody): Promise<ExpenseItem> {
  return http.post<ExpenseItem>('/api/users/me/expenses', body)
}
