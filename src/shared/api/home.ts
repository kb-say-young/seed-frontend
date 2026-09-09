// 홈 대시보드 API — 인사말/지속가능 개월수/이번 달 할 일/다음 마일스톤/받을 지원/신규 매칭.
// (연동 계약: 이슈 #23 · GET /api/users/me/* 계열)
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

// ⚠️ 목업 — GET /api/users/me/home 은 백엔드에 없다.
// 백엔드가 생기면 아래 값을 지우고 실제 http.get 호출로 되돌린다.
export function getHome(): Promise<HomeSummary> {
  return Promise.resolve({
    userName: null, // null 이면 화면이 me.data.name 을 우선 쓴다
    headline: '자립수당 종료까지 51개월 · 한 걸음씩 가요',
    sustainMonths: 9,
    targetMonths: 60,
    monthlyTasks: [
      { id: 1, title: '전세임대 서류 준비하기', tag: 'D-5', done: false },
      { id: 2, title: '이번 달 예산 확인하기', tag: '이번 주', done: true },
      { id: 3, title: '적금 자동이체 등록하기', tag: '이번 주', done: false },
    ],
    taskProgress: { done: 1, total: 3 },
    nextMilestone: {
      id: '11',
      title: '전세보증금 마련 계획 세우기',
      status: 'progress',
      statusText: '진행 중',
      desc: '희망 월세 수준과 보증금 기준을 정리하고 있어요.',
      progress: 42,
      action: '필요 서류 목록화하기',
      category: 'housing',
    },
    expectedSupport: { amount: 350000, label: '자립수당' },
    nextDeadline: { title: 'LH 전세임대 접수', dday: 12 },
    newMatch: {
      policyId: '11',
      title: 'LH 전세임대주택',
      note: '보호종료 5년 이내면 지금 신청할 수 있어요',
    },
  })
}
