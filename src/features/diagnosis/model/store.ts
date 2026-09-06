import { reactive } from 'vue'

// 진단 정보 입력(N1~N3) 답을 담는 가벼운 전역 상태. 서버 전송 전까지 메모리 보관.
// Figma "2026 트렌드 실험 · 진단" 플로우 기준. (우선순위 단계는 제거됨 — issue #8)

export type ProtectionType = 'facility' | 'foster' | 'group'
export type IncomeBand = 'none' | 'lt100' | '100to200' | '200to300' | 'gte300'
export type GoalCategory = 'housing' | 'living' | 'work' | 'finance'

export interface GoalPick {
  category: GoalCategory
  sub: string // 세부 목표 라벨
  targetAmount?: number // 희망 금액 (원)
  regionCode?: string // 주거: 희망 거주 지역 (시군구 코드 5자리)
}

export interface State {
  // 회원가입
  name: string
  birth: string
  phone: string

  // N1 기본 정보
  protectionEndDate: string
  isYouthSupportApplied: boolean | null
  isBasicRecipient: boolean | null
  regionCode: string // 현재 거주지 (시군구 코드 5자리)
  householdSize: number | null
  protectionType: ProtectionType | null

  // N2 소득·예산  (n2b = 수급자 분기)
  incomeBand: IncomeBand | null
  monthlyBudget: number | null // 월 예산(자립 자금)
  cdaBalance: number | null // 디딤씨앗통장 잔액
  youthAllowance: number | null // 월 자립수당 금액

  // N3 목표 선택
  goals: GoalPick[]
}

export const state = reactive<State>({
  name: '',
  birth: '',
  phone: '',
  protectionEndDate: '',
  isYouthSupportApplied: null,
  isBasicRecipient: null,
  regionCode: '',
  householdSize: null,
  protectionType: null,
  incomeBand: null,
  monthlyBudget: null,
  cdaBalance: null,
  youthAllowance: null,
  goals: [],
})

export const goalKey = (g: GoalPick) => `${g.category}:${g.sub}`

export const CATEGORY_LABEL: Record<GoalCategory, string> = {
  housing: '주거',
  living: '생활',
  work: '취·창업',
  finance: '금융',
}

// N3 세부 목표 카탈로그 (Figma 기준)
export const GOAL_CATALOG: { category: GoalCategory; subs: string[]; hint: string }[] = [
  { category: 'housing', subs: ['청년월세지원', '공공임대', '전세대출', '보험'], hint: '청년월세지원, 공공임대, 전세대출, 보험' },
  { category: 'living', subs: ['물품지원', '생활비 대출', '의료'], hint: '물품지원, 생활비 대출, 의료' },
  { category: 'work', subs: ['일자리 교육', '취창업 지원금', '교육 지원금'], hint: '일자리 교육, 취창업 지원금, 교육 지원금' },
  { category: 'finance', subs: ['대출', '적금'], hint: '대출, 적금' },
]
