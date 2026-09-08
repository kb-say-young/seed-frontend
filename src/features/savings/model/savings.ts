// 모은 돈(적립 추적) 대표 데이터 — 백엔드 적립 엔드포인트 전까지 목데이터.
// Figma "2026 트렌드 실험 · 진단" A1 / A2-1 / A2-2.

export type SavingsCat = 'housing' | 'work'

export interface SavingsRecord {
  date: string
  item: string
  amount: number
}

export interface SavingsCategory {
  key: SavingsCat
  label: string
  goal: number // 목표 금액(원)
  saved: number // 실제 모은 돈(원)
  monthlyGoal: number // 이번 달 목표(원)
  note: string
  trend: number[] // 4~9월 월말 누적 적립(원) — 6개
  records: SavingsRecord[]
}

export const TREND_MONTHS = ['4월', '5월', '6월', '7월', '8월', '9월']

export const SAVINGS_TOTAL = 1_240_000

export const SAVINGS: SavingsCategory[] = [
  {
    key: 'housing',
    label: '주거',
    goal: 600_000,
    saved: 520_000,
    monthlyGoal: 80_000,
    note: '순조롭게 모으고 있어요',
    trend: [80_000, 180_000, 260_000, 360_000, 450_000, 520_000],
    records: [
      { date: '9월 3일', item: '월세 적립', amount: 320_000 },
      { date: '9월 1일', item: '임시 거처 보증금 적립', amount: 200_000 },
    ],
  },
  {
    key: 'work',
    label: '취·창업',
    goal: 300_000,
    saved: 180_000,
    monthlyGoal: 60_000,
    note: '조금 더 힘내요',
    trend: [20_000, 50_000, 80_000, 120_000, 150_000, 180_000],
    records: [
      { date: '9월 5일', item: '교재 구입비 적립', amount: 100_000 },
      { date: '9월 2일', item: '자격증 응시료 적립', amount: 80_000 },
    ],
  },
]

export const findSavings = (key: string): SavingsCategory | undefined =>
  SAVINGS.find((s) => s.key === key)

/** 이번 달에 모은 금액 (trend 마지막 두 점의 차이) */
export const thisMonthSaved = (c: SavingsCategory): number =>
  c.trend.length >= 2 ? c.trend[c.trend.length - 1] - c.trend[c.trend.length - 2] : 0
