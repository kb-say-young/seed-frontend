// 지출/예산 API — 기록 탭(요약 + 최근 내역), 예산 대비, 지출/수입 추가.
// (연동 계약: 이슈 #23 · GET /api/users/me/* 계열)
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

// ⚠️ 목업 — 아래 네 함수는 백엔드에 해당 엔드포인트가 없어 임시로 고정 데이터를 반환한다.
// 백엔드가 생기면 각 함수 본문을 http 호출로 되돌린다 (지워둔 원래 호출은 git 히스토리 참고).
const CURRENT_MONTH = new Date().toISOString().slice(0, 7)

const mockRecent: ExpenseItem[] = [
  { id: 1, date: `${CURRENT_MONTH}-03`, title: '월세', category: '주거', amount: -350000 },
  { id: 2, date: `${CURRENT_MONTH}-07`, title: '장보기', category: '생활비', amount: -62000 },
  { id: 3, date: `${CURRENT_MONTH}-12`, title: '아르바이트 급여', category: '소득', amount: 480000 },
  { id: 4, date: `${CURRENT_MONTH}-15`, title: '교통비', category: '생활비', amount: -48000 },
]

/** 기록 탭 요약 + 최근 내역. month 미지정 시 이번 달. */
export function getTrackingSummary(month?: string): Promise<TrackingSummary> {
  return Promise.resolve({
    month: month ?? CURRENT_MONTH,
    spent: 920000,
    plan: 1100000,
    roadmapProgress: { done: 4, total: 9 },
    nextMilestone: { title: '전세보증금 마련', progress: 42 },
    recent: mockRecent,
  })
}

/** 예산 대비 지출. */
export function getBudgets(month?: string): Promise<BudgetResponse> {
  return Promise.resolve({
    month: month ?? CURRENT_MONTH,
    spent: 920000,
    plan: 1100000,
    categories: [
      { key: 'housing', label: '주거', budget: 400000, actual: 350000, saving: false },
      { key: 'living', label: '생활비', budget: 400000, actual: 460000, saving: false },
      { key: 'work', label: '교육·자기계발', budget: 150000, actual: 60000, saving: false },
      { key: 'saving', label: '저축', budget: 150000, actual: 50000, saving: true },
    ],
  })
}

const mockCategories: ExpenseCategory[] = [
  { key: 'housing', label: '주거 보증금' },
  { key: 'living', label: '생활비' },
  { key: 'work', label: '교육·자기계발' },
  { key: 'saving', label: '비상금' },
]

/** 지출/수입 추가에 쓰는 카테고리 목록. */
export function getExpenseCategories(): Promise<ExpenseCategory[]> {
  return Promise.resolve(mockCategories)
}

export function createExpense(body: ExpenseCreateBody): Promise<ExpenseItem> {
  // 실제로 저장되지 않는다 — 입력값을 그대로 돌려줘 화면 흐름(저장 → /tracking 이동)만 유지한다.
  return Promise.resolve({
    id: Date.now(),
    date: body.date,
    title: body.memo || body.category,
    category: body.category,
    amount: body.kind === 'income' ? body.amount : -body.amount,
  })
}
