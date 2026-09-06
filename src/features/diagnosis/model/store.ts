import { reactive } from 'vue'

// 진단 정보 입력(N1~N3) 답을 담는 가벼운 전역 상태. 서버 전송 전까지 메모리 보관.
// Figma "2026 트렌드 실험 · 진단" 플로우 + 카테고리별_요청_API_계약서.md 기준.

export type ProtectionType = 'facility' | 'foster' | 'group'
export type GoalCategory = 'housing' | 'living' | 'work' | 'finance'

export type SubCategoryCode =
  | 'JEONSE'
  | 'WOLSE'
  | 'PUBLIC_RENTAL'
  | 'SUPPLIES_SUPPORT'
  | 'LIVING_EXPENSE_LOAN'
  | 'MEDICAL_SUPPORT'
  | 'JOB_TRAINING'
  | 'STARTUP_EMPLOYMENT'
  | 'EDUCATION_SUBSIDY'
  | 'LOAN'
  | 'SAVINGS'

export interface GoalPick {
  category: GoalCategory
  sub: SubCategoryCode
  // sub_category 스키마별 추가질문 답변 (카테고리별_요청_API_계약서.md §4). 필드 구성은 goalSchemas.ts 참고.
  answers: Record<string, unknown>
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
  region: string // 시/군/구 레벨 region_code
  householdSize: number | null
  protectionType: ProtectionType | null

  // N2 소득·자산  (n2b = 수급자 분기)
  monthlyIncome: number | null // 월 평균 소득 금액 (user_profile.income)
  cdaBalance: number | null // 디딤씨앗통장 잔액

  // N3 목표 선택 — 카테고리당 최대 1개
  goals: GoalPick[]
}

export const state = reactive<State>({
  name: '',
  birth: '',
  phone: '',
  protectionEndDate: '',
  isYouthSupportApplied: null,
  isBasicRecipient: null,
  region: '',
  householdSize: null,
  protectionType: null,
  monthlyIncome: null,
  cdaBalance: null,
  goals: [],
})

export const CATEGORY_LABEL: Record<GoalCategory, string> = {
  housing: '주거',
  living: '생활',
  work: '취·창업',
  finance: '금융',
}

// N3 세부 목표 카탈로그 — 카테고리별_요청_API_계약서.md §4 sub_category 기준
export const GOAL_CATALOG: { category: GoalCategory; subs: { code: SubCategoryCode; label: string }[]; hint: string }[] = [
  {
    category: 'housing',
    subs: [
      { code: 'JEONSE', label: '전세' },
      { code: 'WOLSE', label: '월세' },
      { code: 'PUBLIC_RENTAL', label: '공공임대(LH·SH)' },
    ],
    hint: '전세, 월세, 공공임대(LH·SH)',
  },
  {
    category: 'living',
    subs: [
      { code: 'SUPPLIES_SUPPORT', label: '물품지원' },
      { code: 'LIVING_EXPENSE_LOAN', label: '생활비 대출' },
      { code: 'MEDICAL_SUPPORT', label: '의료' },
    ],
    hint: '물품지원, 생활비 대출, 의료',
  },
  {
    category: 'work',
    subs: [
      { code: 'JOB_TRAINING', label: '일자리 교육' },
      { code: 'STARTUP_EMPLOYMENT', label: '취·창업' },
      { code: 'EDUCATION_SUBSIDY', label: '교육 지원금' },
    ],
    hint: '일자리 교육, 취·창업, 교육 지원금',
  },
  {
    category: 'finance',
    subs: [
      { code: 'LOAN', label: '대출' },
      { code: 'SAVINGS', label: '적금' },
    ],
    hint: '대출, 적금',
  },
]
