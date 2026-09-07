import { reactive } from 'vue'

// 진단 정보 입력(N1~N3) 답을 담는 가벼운 전역 상태. 서버 전송 전까지 메모리 보관.
// 필드는 백엔드 계약(POST /api/users/me/intake · user_profile snake_case)에 대응한다.
// (우선순위 단계는 제거됨 — issue #8)

export interface GoalPick {
  parentId: string // "1"~"4"  (categories.parent_category_id)
  categoryId: string // "11"~"42" (categories.category_id)
  targetAmount?: number // 희망 금액 (원)
  regionCode?: string // 주거: 희망 거주 시군구 코드 5자리
  // description(§4 카테고리별 추가질문 응답) 은 후속 — issue #14 / 계약서 확정 대기
}

export interface State {
  // 회원가입
  loginId: string // 백엔드 회원가입/로그인 식별자 (아이디만)
  name: string // BE 저장 위치 미확정 (issue #33 대기) — 우선 클라이언트 보관
  birth: string
  phone: string

  // N1 기본 정보 → user_profile
  protectionEndDate: string // "YYYY.MM.DD" (제출 시 "YYYY-MM-DD" 로 변환) → protection_end_date
  isYouthSupportApplied: boolean | null // is_youth_support
  isBasicRecipient: boolean | null // is_basic_recipient
  regionCode: string // region_code (시군구 5자리)
  householdSize: number | null // household_size

  // N2 소득·예산
  monthlyIncome: number | null // income (월 평균 소득, 원 · 0 허용)
  cdaBalance: number | null // fixed_budget (디딤씨앗통장 잔액, 원)

  // N3 목표
  goals: GoalPick[]
}

export const state = reactive<State>({
  loginId: '',
  name: '',
  birth: '',
  phone: '',
  protectionEndDate: '',
  isYouthSupportApplied: null,
  isBasicRecipient: null,
  regionCode: '',
  householdSize: null,
  monthlyIncome: null,
  cdaBalance: null,
  goals: [],
})

// --- 목표 카테고리 (categories 테이블 · V5__insert_categories.sql) ---
export const CATEGORY_LABEL: Record<string, string> = {
  '1': '주거',
  '2': '취·창업',
  '3': '생활',
  '4': '금융',
}

export const CATEGORY_DOT: Record<string, string> = {
  '1': 'bg-cat-housing',
  '2': 'bg-cat-work',
  '3': 'bg-cat-living',
  '4': 'bg-cat-finance',
}

export interface SubGoal {
  id: string
  label: string
}
export interface GoalCategoryDef {
  parentId: string
  label: string
  hint: string
  subs: SubGoal[]
}

export const GOAL_CATALOG: GoalCategoryDef[] = [
  {
    parentId: '1',
    label: '주거',
    hint: '전세, 월세, 공공임대',
    subs: [
      { id: '11', label: '전세' },
      { id: '12', label: '월세' },
      { id: '13', label: '공공임대' },
    ],
  },
  {
    parentId: '2',
    label: '취·창업',
    hint: '일자리 교육, 취창업, 교육 지원금',
    subs: [
      { id: '21', label: '일자리 교육' },
      { id: '22', label: '취창업' },
      { id: '23', label: '교육 지원금' },
    ],
  },
  {
    parentId: '3',
    label: '생활',
    hint: '물품 지원, 생활비 대출, 의료',
    subs: [
      { id: '31', label: '물품 지원' },
      { id: '32', label: '생활비 대출' },
      { id: '33', label: '의료' },
    ],
  },
  {
    parentId: '4',
    label: '금융',
    hint: '대출, 적금',
    subs: [
      { id: '41', label: '대출' },
      { id: '42', label: '적금' },
    ],
  },
]

export function subLabel(categoryId: string): string {
  for (const c of GOAL_CATALOG) {
    const s = c.subs.find((x) => x.id === categoryId)
    if (s) return s.label
  }
  return categoryId
}
