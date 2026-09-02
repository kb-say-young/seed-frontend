// 로드맵 타임라인 대표 데이터 (Figma 진단결과 슬라이드 1~4).
// 실제로는 diagnosis_recommendations / checklist_items / policy_matches 에서 조립.

export type MStatus = 'done' | 'progress' | 'review' | 'planned' | 'risk'

export interface Milestone {
  id: string
  bucket: string
  category: 'housing' | 'work' | 'finance' | 'living'
  flowType: 'mixed' | 'policyOnly'
  title: string
  status: MStatus
  statusText: string
  desc: string
  progress?: number
  action?: string
  // 상세용
  why?: string
  goalAmount?: number
  currentAmount?: number
  checklist?: { title: string; planned: number; done: boolean; desc?: string }[]
  policy?: { title: string; provider: string; summary: string; status: 'eligible' | 'review' | 'ineligible'; reason?: string }
}

export const BUCKETS = ['지금 · 앞으로 6개월', '6개월 ~ 1년', '1 ~ 3년', '3 ~ 5년 (자립수당 종료 대비)']

export const MILESTONES: Milestone[] = [
  {
    id: 'temp-house',
    bucket: BUCKETS[0],
    category: 'housing',
    flowType: 'mixed',
    title: '임시 거처 확정하기',
    status: 'done',
    statusText: '완료 · 2024.03',
    desc: 'LH 청년 매입임대 입주 완료',
    progress: 100,
    action: '주거급여도 함께 신청됨',
  },
  {
    id: 'welfare-check',
    bucket: BUCKETS[0],
    category: 'living',
    flowType: 'mixed',
    title: '소득 공백 대비 — 수급 자격 확인',
    status: 'review',
    statusText: '진행 중 · 이번 달',
    desc: '구직 기간 동안 기초생활보장 신청 가능 여부 확인',
    progress: 15,
    action: '주민센터 상담 예약하기',
    why: '소득이 끊기거나 갑작스러운 지출이 생겼을 때, 주거·목돈을 헐지 않도록 지켜주는 첫 번째 방어선이에요.',
    checklist: [
      { title: '최근 3개월 소득 서류 준비', planned: 0, done: true },
      { title: '주민센터 상담 예약', planned: 0, done: false },
      { title: '수급 신청서 제출', planned: 0, done: false },
    ],
  },
  {
    id: 'emergency-fund',
    bucket: BUCKETS[1],
    category: 'finance',
    flowType: 'mixed',
    title: '비상금 3개월치 모으기',
    status: 'progress',
    statusText: '진행 중',
    desc: '목표 2,700,000원 · 현재 900,000원 (33%)',
    progress: 33,
    action: '자동이체 30만원 설정하기',
    why: '소득이 끊기거나 갑작스러운 지출이 생겼을 때, 주거·목돈을 헐지 않도록 지켜주는 첫 번째 방어선이에요. 비상금이 없으면 계획이 한 번에 무너집니다.',
    goalAmount: 2_700_000,
    currentAmount: 900_000,
    checklist: [
      { title: '비상금 통장 분리하기', planned: 0, done: true },
      { title: '매달 30만원 자동이체 설정', planned: 0, done: false },
      { title: '모은 돈 CMA로 옮기기', planned: 0, done: false },
    ],
    policy: {
      title: '청년내일저축계좌',
      provider: '보건복지부 · 자산형성',
      summary: '본인 10만원 저축 시 정부 30만원 매칭 · 3년',
      status: 'eligible',
    },
  },
  {
    id: 'job-support',
    bucket: BUCKETS[1],
    category: 'work',
    flowType: 'policyOnly',
    title: '국민취업지원제도 1유형 신청',
    status: 'planned',
    statusText: '예정 · 2024.11',
    desc: '구직촉진수당 월 50만원 + 취업지원 서비스',
    action: '자격 요건 미리 보기',
    policy: {
      title: '국민내일배움카드',
      provider: '고용노동부 · 직업교육',
      summary: '직업능력개발 교육비 지원 (연령 18~75세)',
      status: 'eligible',
      reason: '직업교육 목표와 일치하며 연령 조건을 충족합니다.',
    },
  },
  {
    id: 'jeonse',
    bucket: BUCKETS[2],
    category: 'housing',
    flowType: 'mixed',
    title: '전세보증금 마련 (자립정착금 활용)',
    status: 'planned',
    statusText: '예정 · 2026',
    desc: '목표 30,000,000원 · 현재 12,000,000원 (40%)',
    progress: 40,
    action: '청년 버팀목 전세자금대출 조건 보기',
    goalAmount: 30_000_000,
    currentAmount: 12_000_000,
    checklist: [
      { title: '자립정착금 신청', planned: 0, done: true },
      { title: '전세 매물 조사 (관악구)', planned: 0, done: false },
      { title: '버팀목 전세자금대출 심사', planned: 0, done: false },
    ],
  },
  {
    id: 'career',
    bucket: BUCKETS[2],
    category: 'work',
    flowType: 'mixed',
    title: '정규직 전환 · 자격증 취득',
    status: 'planned',
    statusText: '예정',
    desc: '목표 월소득 200만원 · 내일배움카드 훈련비 지원',
    action: '관련 훈련과정 찾기',
  },
  {
    id: 'balance',
    bucket: BUCKETS[3],
    category: 'finance',
    flowType: 'mixed',
    title: '지원 없이도 수지 균형 맞추기',
    status: 'risk',
    statusText: '위험 · 목표 2029.02',
    desc: '월소득 ≥ 월지출 달성 · 현재 -320,000원',
    progress: 62,
    action: '시뮬레이션에서 경로 확인하기',
  },
]
