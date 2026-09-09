import { reactive } from 'vue'

// 진단 정보 입력(N1~N3) 답을 담는 가벼운 전역 상태. 서버 전송 전까지 메모리 보관.
// 필드는 백엔드 계약(POST /api/users/me/intake · user_profile snake_case)에 대응한다.
// (우선순위 단계는 제거됨 — issue #8)

// 학력 드롭다운 — 문자열 그대로 education_level 값으로 전송한다(별도 코드 매핑 없음).
export const EDUCATION_LEVELS = [
  '고졸미만',
  '고교재학',
  '고졸예정',
  '고교졸업',
  '대학재학',
  '대졸예정',
  '대학졸업',
  '석박사',
  '기타',
] as const

export interface GoalPick {
  parentId: string // "1"~"4"  (categories.parent_category_id)
  categoryId: string // "11"~"42" (categories.category_id)
  // 세부 목표별 추가 질문 응답 (§4). 키는 GOAL_FIELDS 의 field key, 그대로 description JSON 키가 된다.
  answers: Record<string, string | number | boolean>
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
  educationLevel: string // education_level — 드롭다운 메뉴 문자열 그대로 전송
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
  educationLevel: '',
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

// --- 세부 목표별 추가 질문 (§4 카테고리별 추가 질문 스키마) ---
// 백엔드는 description 의 구조를 해석하지 않고 그대로 저장하므로(GoalRequest 주석 참조),
// 이 카탈로그가 곧 §4 스키마의 단일 기준이다. key 는 그대로 description JSON 키가 된다.
export type GoalFieldType = 'select' | 'number' | 'boolean' | 'region' | 'text'

export interface GoalFieldDef {
  key: string
  label: string
  type: GoalFieldType
  options?: string[] // type: 'select'
  suffix?: string // type: 'number' — 단위 표시
  // 다른 답이 특정 값일 때만 노출·필수. 예: 경력 유무가 "경력"일 때만 "경력 개월수".
  showIf?: { key: string; equals: string }
}

export const GOAL_FIELDS: Record<string, GoalFieldDef[]> = {
  // 주거
  '11': [{ key: 'desired_region', label: '희망 거주지', type: 'region' }], // 전세
  '12': [{ key: 'desired_region', label: '희망 거주지', type: 'region' }], // 월세
  '13': [
    // 공공임대(LH/SH)
    { key: 'desired_region', label: '희망 거주 지역', type: 'region' },
    {
      key: 'housing_type',
      label: '희망 입주 유형',
      type: 'select',
      options: ['전세임대', '매입임대', '행복주택', '영구임대'],
    },
    { key: 'no_house_owned', label: '무주택 여부', type: 'boolean' },
    { key: 'household_size', label: '세대원 수', type: 'number', suffix: '명' },
    { key: 'move_in_within_months', label: '희망 입주 시기', type: 'number', suffix: '개월 이내' },
  ],

  // 취·창업
  '21': [
    // 일자리 교육
    {
      key: 'desired_job_field',
      label: '희망 직무',
      type: 'select',
      options: ['사무', '기술', '서비스', 'IT', '기타'],
    },
    { key: 'current_status', label: '현재 상태', type: 'select', options: ['재직', '구직중', '미취업'] },
    { key: 'desired_education_months', label: '희망 교육 기간', type: 'number', suffix: '개월' },
    { key: 'final_education', label: '최종 학력', type: 'select', options: ['고졸', '대졸', '대학원졸'] },
  ],
  '22': [
    // 취창업
    { key: 'career_path', label: '희망 진로', type: 'select', options: ['취업', '창업'] },
    { key: 'desired_job', label: '희망 직업(직종)', type: 'text' },
    { key: 'career_status', label: '경력 유무', type: 'select', options: ['신입', '경력'] },
    {
      key: 'career_months',
      label: '경력 개월수',
      type: 'number',
      suffix: '개월',
      showIf: { key: 'career_status', equals: '경력' },
    },
  ],
  '23': [
    // 교육 지원금
    { key: 'enrollment_status', label: '재학 상태', type: 'select', options: ['재학', '휴학', '졸업', '미진학'] },
    { key: 'school_level', label: '학교급', type: 'select', options: ['고등학교', '대학교', '대학원'] },
    {
      key: 'desired_support_item',
      label: '희망 지원 항목',
      type: 'select',
      options: ['학비', '교재비', '자격증 응시료', '기타'],
    },
  ],

  // 생활
  '31': [
    // 물품지원
    {
      key: 'needed_items',
      label: '필요 품목',
      type: 'select',
      options: ['침구', '가전', '가구', '생필품세트'],
    },
  ],
  '32': [
    // 생활비 대출
    { key: 'desired_loan_amount', label: '희망 대출 금액', type: 'number', suffix: '만원' },
    { key: 'loan_purpose', label: '대출 목적', type: 'select', options: ['생계비', '의료비', '주거비', '기타'] },
    { key: 'employment_status', label: '현재 재직 여부', type: 'select', options: ['재직', '무직', '자영업'] },
    { key: 'has_overdue_history', label: '연체 이력 여부', type: 'boolean' },
  ],
  '33': [
    // 의료
    {
      key: 'needed_medical_field',
      label: '필요 진료 분야',
      type: 'select',
      options: ['치과', '정신건강', '일반질환', '기타'],
    },
    {
      key: 'insurance_type',
      label: '건강보험 가입 유형',
      type: 'select',
      options: ['직장가입자', '지역가입자', '의료급여수급자'],
    },
  ],

  // 금융
  '41': [
    // 대출
    { key: 'loan_purpose', label: '대출 목적', type: 'select', options: ['주거', '생활', '학자금', '사업', '기타'] },
    { key: 'desired_loan_amount', label: '희망 대출 금액', type: 'number', suffix: '만원' },
    { key: 'repayment_period_months', label: '상환 희망 기간', type: 'number', suffix: '개월' },
    {
      key: 'credit_score_range',
      label: '신용점수 구간',
      type: 'select',
      options: ['900이상', '700~899', '500~699', '500미만', '모름'],
    },
  ],
  '42': [
    // 적금
    { key: 'monthly_saving_amount', label: '월 저축 가능 금액', type: 'number', suffix: '만원' },
    {
      key: 'saving_goal',
      label: '저축 목표',
      type: 'select',
      options: ['주거자금', '비상금', '학자금', '창업자금', '기타'],
    },
    { key: 'saving_period_months', label: '저축 목표 기간', type: 'number', suffix: '개월' },
    { key: 'has_similar_product', label: '유사 상품 가입 중 여부', type: 'boolean' },
  ],
}

export function goalFieldsFor(categoryId: string): GoalFieldDef[] {
  return GOAL_FIELDS[categoryId] ?? []
}

// 지금 값 기준으로 해당 필드가 보여야(=필수) 하는지 — showIf 조건 없으면 항상 필수.
function fieldApplies(f: GoalFieldDef, answers: Record<string, string | number | boolean>): boolean {
  return !f.showIf || answers[f.showIf.key] === f.showIf.equals
}

export function isGoalComplete(g: GoalPick): boolean {
  return goalFieldsFor(g.categoryId).every((f) => {
    if (!fieldApplies(f, g.answers)) return true
    const v = g.answers[f.key]
    if (f.type === 'boolean') return v === true || v === false
    if (f.type === 'number') return typeof v === 'number' && v > 0
    return typeof v === 'string' && v !== ''
  })
}
