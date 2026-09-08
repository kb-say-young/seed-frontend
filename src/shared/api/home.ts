// 홈 대시보드 API — 인사말/지속가능 개월수/이번 달 할 일/다음 마일스톤/받을 지원/신규 매칭.
// (연동 계약: 이슈 #23 · GET /api/users/me/* 계열)
import { http } from '@/shared/api/http'
import type { MilestoneStatus, MilestoneCategory } from '@/shared/api/roadmap'

export interface HomeTask {
  id: number
  title: string
  tag: string // "D-3", "이번 주", "완료" 등
  done: boolean
}

export interface HomeNextMilestone {
  id: string
  title: string
  status: MilestoneStatus
  statusText: string
  desc: string
  progress: number | null
  action: string | null
  category: MilestoneCategory
}

export interface HomeSummary {
  userName: string | null
  headline: string // "자립수당 종료까지 51개월 · 한 걸음씩 가요"
  sustainMonths: number
  targetMonths: number
  monthlyTasks: HomeTask[]
  taskProgress: { done: number; total: number }
  nextMilestone: HomeNextMilestone | null
  expectedSupport: { amount: number; label: string } | null // "이번 달 받을 지원"
  nextDeadline: { title: string; dday: number } | null // "다음 신청 마감"
  newMatch: { policyId: string; title: string; note: string } | null
}

export function getHome(): Promise<HomeSummary> {
  return http.get<HomeSummary>('/api/users/me/home')
}
