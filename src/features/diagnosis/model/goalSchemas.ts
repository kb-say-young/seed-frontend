import type { SubCategoryCode } from './store'

// sub_category 별 추가질문 필드 스키마 — 카테고리별_요청_API_계약서.md §4 그대로 이식.
// GoalAnswerForm.vue 가 이 스키마를 순회해 폼을 렌더링한다.

export type FieldKind =
  | 'enum-chip'
  | 'multi-chip'
  | 'money'
  | 'int'
  | 'boolean-chip'
  | 'text'
  | 'region'
  | 'experience'

export interface FieldOption {
  value: string
  label: string
}

export interface FieldSchema {
  key: string
  label: string
  kind: FieldKind
  required?: boolean
  suffix?: string
  hint?: string
  options?: FieldOption[]
  /** 다른 필드 답에 따라 옵션이 달라질 때 (예: EDUCATION_SUBSIDY 재학_상태) */
  optionsFor?: (answers: Record<string, unknown>) => FieldOption[]
}

export interface ExperienceValue {
  type: 'NEW' | 'EXPERIENCED'
  months: number | null
}

const JOB_STATUS_OPTIONS: FieldOption[] = [
  { value: 'EMPLOYED', label: '재직' },
  { value: 'JOB_SEEKING', label: '구직중' },
  { value: 'UNEMPLOYED', label: '미취업' },
]

export const GOAL_ANSWER_SCHEMA: Record<SubCategoryCode, FieldSchema[]> = {
  // --- 주거 ---
  JEONSE: [{ key: '희망_거주지_code', label: '희망 거주 지역', kind: 'region', required: true }],
  WOLSE: [{ key: '희망_거주지_code', label: '희망 거주 지역', kind: 'region', required: true }],
  PUBLIC_RENTAL: [
    { key: '희망_거주지_code', label: '희망 거주 지역', kind: 'region', required: true },
    {
      key: '희망_입주_유형',
      label: '희망 입주 유형',
      kind: 'enum-chip',
      required: true,
      options: [
        { value: 'JEONSE_RENTAL', label: '전세임대' },
        { value: 'PURCHASE_RENTAL', label: '매입임대' },
        { value: 'HAPPY_HOUSING', label: '행복주택' },
        { value: 'PERMANENT_RENTAL', label: '영구임대' },
      ],
    },
    { key: '무주택_여부', label: '무주택 여부', kind: 'boolean-chip', required: true },
    { key: '세대원_수', label: '세대원 수', kind: 'int', required: true, suffix: '명' },
    { key: '희망_입주_시기_개월', label: '희망 입주 시기', kind: 'int', required: true, suffix: '개월 이내' },
  ],

  // --- 취·창업 ---
  JOB_TRAINING: [
    {
      key: '희망_직무',
      label: '희망 직무',
      kind: 'enum-chip',
      required: true,
      options: [
        { value: 'OFFICE', label: '사무' },
        { value: 'TECH', label: '기술' },
        { value: 'MANUFACTURING', label: '생산·제조' },
        { value: 'SERVICE', label: '서비스' },
        { value: 'IT', label: 'IT' },
        { value: 'DESIGN_MEDIA', label: '디자인·미디어' },
        { value: 'OTHER', label: '기타' },
      ],
    },
    { key: '현재_상태', label: '현재 상태', kind: 'enum-chip', required: true, options: JOB_STATUS_OPTIONS },
    { key: '희망_교육_기간_개월', label: '희망 교육 기간', kind: 'int', required: true, suffix: '개월' },
    {
      key: '최종_학력',
      label: '최종 학력',
      kind: 'enum-chip',
      required: true,
      options: [
        { value: 'HIGH_SCHOOL', label: '고졸' },
        { value: 'COLLEGE', label: '대졸' },
        { value: 'GRAD_SCHOOL', label: '대학원졸' },
      ],
    },
  ],
  STARTUP_EMPLOYMENT: [
    {
      key: '희망_진로',
      label: '희망 진로',
      kind: 'enum-chip',
      required: true,
      options: [
        { value: 'EMPLOYMENT', label: '취업' },
        { value: 'STARTUP', label: '창업' },
      ],
    },
    { key: '희망_직업', label: '희망 직업', kind: 'text', required: true },
    { key: '경력_유무', label: '경력', kind: 'experience', required: true },
  ],
  EDUCATION_SUBSIDY: [
    {
      key: '학교급',
      label: '학교급',
      kind: 'enum-chip',
      required: true,
      options: [
        { value: 'HIGH_SCHOOL', label: '고등학교' },
        { value: 'UNIVERSITY', label: '대학교' },
        { value: 'GRAD_SCHOOL', label: '대학원' },
      ],
    },
    {
      key: '재학_상태',
      label: '재학 상태',
      kind: 'enum-chip',
      required: true,
      // UNIVERSITY·GRAD_SCHOOL + NOT_ENROLLED 조합은 정의되지 않음(§4.2) — 고졸일 때만 미진학 노출
      optionsFor: (answers) => {
        const base: FieldOption[] = [
          { value: 'ENROLLED', label: '재학' },
          { value: 'LEAVE_OF_ABSENCE', label: '휴학' },
          { value: 'GRADUATED', label: '졸업' },
        ]
        return answers['학교급'] === 'HIGH_SCHOOL' ? [...base, { value: 'NOT_ENROLLED', label: '미진학' }] : base
      },
    },
    {
      key: '희망_지원_항목',
      label: '희망 지원 항목',
      kind: 'multi-chip',
      required: true,
      hint: '여러 개 선택 가능',
      options: [
        { value: 'TUITION', label: '학비' },
        { value: 'TEXTBOOK', label: '교재비' },
        { value: 'CERT_EXAM_FEE', label: '자격증 응시료' },
        { value: 'OTHER', label: '기타' },
      ],
    },
  ],

  // --- 생활 ---
  SUPPLIES_SUPPORT: [
    {
      key: '필요_품목',
      label: '필요 품목',
      kind: 'multi-chip',
      required: true,
      hint: '여러 개 선택 가능',
      options: [
        { value: 'BEDDING', label: '침구' },
        { value: 'APPLIANCE', label: '가전' },
        { value: 'FURNITURE', label: '가구' },
        { value: 'DAILY_NECESSITIES_SET', label: '생필품세트' },
      ],
    },
  ],
  LIVING_EXPENSE_LOAN: [
    { key: '희망_대출_금액', label: '희망 대출 금액', kind: 'money', required: true, suffix: '원' },
    {
      key: '대출_목적',
      label: '대출 목적',
      kind: 'enum-chip',
      required: true,
      options: [
        { value: 'LIVING_COST', label: '생계비' },
        { value: 'MEDICAL', label: '의료비' },
        { value: 'HOUSING', label: '주거비' },
        { value: 'OTHER', label: '기타' },
      ],
    },
    {
      key: '현재_재직_여부',
      label: '현재 재직 여부',
      kind: 'enum-chip',
      required: true,
      options: [
        { value: 'EMPLOYED', label: '재직' },
        { value: 'UNEMPLOYED', label: '무직' },
        { value: 'SELF_EMPLOYED', label: '자영업' },
      ],
    },
    { key: '연체_이력_여부', label: '연체 이력 여부', kind: 'boolean-chip', required: true },
  ],
  MEDICAL_SUPPORT: [
    {
      key: '필요_진료_분야',
      label: '필요 진료 분야',
      kind: 'enum-chip',
      required: true,
      options: [
        { value: 'DENTAL', label: '치과' },
        { value: 'MENTAL_HEALTH', label: '정신건강' },
        { value: 'GENERAL_ILLNESS', label: '일반질환' },
        { value: 'OTHER', label: '기타' },
      ],
    },
    {
      key: '건강보험_가입_유형',
      label: '건강보험 가입 유형',
      kind: 'enum-chip',
      required: true,
      options: [
        { value: 'EMPLOYEE_INSURED', label: '직장가입자' },
        { value: 'REGION_INSURED', label: '지역가입자' },
        { value: 'MEDICAL_AID_RECIPIENT', label: '의료급여수급자' },
      ],
    },
  ],

  // --- 금융 ---
  LOAN: [
    {
      key: '대출_목적',
      label: '대출 목적',
      kind: 'enum-chip',
      required: true,
      options: [
        { value: 'HOUSING', label: '주거' },
        { value: 'LIVING', label: '생활' },
        { value: 'TUITION', label: '학자금' },
        { value: 'BUSINESS', label: '사업' },
        { value: 'OTHER', label: '기타' },
      ],
    },
    { key: '희망_대출_금액', label: '희망 대출 금액', kind: 'money', required: true, suffix: '원' },
    { key: '상환_희망_기간_개월', label: '상환 희망 기간', kind: 'int', required: true, suffix: '개월' },
    {
      key: '신용점수_구간',
      label: '신용점수 구간',
      kind: 'enum-chip',
      required: true,
      options: [
        { value: 'OVER_900', label: '900 이상' },
        { value: 'R700_899', label: '700~899' },
        { value: 'R500_699', label: '500~699' },
        { value: 'UNDER_500', label: '500 미만' },
        { value: 'UNKNOWN', label: '모름' },
      ],
    },
  ],
  SAVINGS: [
    { key: '월_저축_가능_금액', label: '월 저축 가능 금액', kind: 'money', required: true, suffix: '원' },
    {
      key: '저축_목표',
      label: '저축 목표',
      kind: 'enum-chip',
      required: true,
      options: [
        { value: 'HOUSING_FUND', label: '주거자금' },
        { value: 'EMERGENCY_FUND', label: '비상금' },
        { value: 'TUITION', label: '학자금' },
        { value: 'STARTUP_FUND', label: '창업자금' },
        { value: 'OTHER', label: '기타' },
      ],
    },
    { key: '저축_목표_기간_개월', label: '저축 목표 기간', kind: 'int', required: true, suffix: '개월' },
    { key: '유사_상품_가입_중_여부', label: '유사 상품 가입 중 여부', kind: 'boolean-chip', required: true, hint: '중복 수혜 확인용' },
  ],
}
