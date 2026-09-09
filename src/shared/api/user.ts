// 사용자 API — 회원가입 / 로그인 / 진단 정보 제출. (연동: issue #12, #13, #14)
import { http } from '@/shared/api/http'
import type { TokenResponse } from '@/shared/api/auth'

// 회원가입 요청 — 백엔드 `SignUpRequest` 계약. 1·2단계 입력을 모아 한 번에 보낸다.
export interface SignUpRequest {
  loginId: string // 영문·숫자 4~30자
  name: string // 이름 (20자 이하)
  birthDate: string // 생년월일 "yyyy-MM-dd" (BE LocalDate — ISO)
  phoneNumber: string // 휴대폰 번호 "010" + 숫자 8자리 (하이픈 제외)
}

export interface SignUpResponse {
  id: number
  loginId: string
}

export function signup(body: SignUpRequest): Promise<SignUpResponse> {
  return http.post<SignUpResponse>('/api/users/signup', body, { auth: false })
}

export function login(loginId: string): Promise<TokenResponse> {
  return http.post<TokenResponse>('/api/users/login', { loginId }, { auth: false })
}

// --- 진단 정보 제출 (POST /api/users/me/intake) — `카테고리별_요청_API_계약서.md` §3 ---
// JSON 키는 백엔드 계약(snake_case)을 그대로 따른다.

export interface UserProfilePayload {
  protection_end_date: string // "YYYY-MM-DD"
  is_youth_support: boolean
  fixed_budget: number // 디딤씨앗통장(CDA) 잔액(원)
  region_code: string // 시/군/구 5자리
  region_display?: string
  education: string // 학력 드롭다운 메뉴 문자열 그대로("고졸미만" 등, 코드 매핑 없음). BE 필드명 그대로(JsonProperty 없음)
  income: number // 월 평균 소득(원)
  is_basic_recipient: boolean
  household_size: number
}

export interface GoalPayload {
  parent_category_id: string // "1"~"4"
  category_id: string // "11"~"42"
  category_id_display?: string
  parent_category_id_display?: string
  description: Record<string, unknown> // §4 카테고리별 추가질문 응답
}

export interface IntakePayload {
  user_profile: UserProfilePayload
  goals: GoalPayload[]
}

// intake 제출 응답 — 백엔드 `DiagnosisStatusResponse`.
// 서버가 프로필/목표 저장 후 AI 진단까지 동기로 끝내고, 방금 만든 진단의 id 와 상태를 돌려준다.
// 이 diagnosisId 로 `GET /api/diagnoses/{id}/recommendations` 를 조회한다.
export type DiagnosisRunStatus = 'running' | 'completed' | 'failed'

export interface IntakeResult {
  diagnosisId: number
  status: DiagnosisRunStatus
}

export function submitIntake(payload: IntakePayload): Promise<IntakeResult> {
  return http.post<IntakeResult>('/api/users/me/intake', payload)
}

// --- 내 프로필 조회 (GET /api/users/me) — issue #23 ---

export interface MeProfile {
  protectionEndDate: string | null // "YYYY-MM-DD"
  isYouthSupport: boolean | null
  isBasicRecipient: boolean | null
  regionCode: string | null // 시/군/구 5자리
  regionDisplay: string | null // "서울특별시 강남구" — 없으면 코드로 조회
  education: string | null // 온보딩 드롭다운 문자열 그대로("고졸미만" 등, 코드 매핑 없음)
  income: number | null // 월 평균 소득(원)
  householdSize: number | null
  fixedBudget: number | null // 디딤씨앗통장(CDA) 잔액(원)
  budget: number | null
  hasCda: boolean | null
}

export interface MeResponse {
  id: number
  loginId: string
  name: string | null
  birthDate: string | null // "YYYY-MM-DD"
  phone: string | null
  profile: MeProfile | null // 진단(intake) 미제출이면 null
}

export function getMe(): Promise<MeResponse> {
  return http.get<MeResponse>('/api/users/me')
}

// --- 내 목표 목록 (GET /api/users/me/goals) — issue #23 ---
export interface MeGoal {
  parentCategoryId: string // "1"~"4" (주거/취·창업/생활/금융)
  parentCategoryName: string
  categoryId: string // "11"~"42"
  categoryName: string
  priority: number | null // 우선순위 (없으면 null)
}

// ⚠️ 목업 — GET /api/users/me/goals 는 백엔드에 없다.
// 백엔드가 생기면 아래 값을 지우고 실제 http.get 호출로 되돌린다.
export function getGoals(): Promise<MeGoal[]> {
  return Promise.resolve([
    { parentCategoryId: '1', parentCategoryName: '주거', categoryId: '13', categoryName: '공공임대', priority: 1 },
    { parentCategoryId: '4', parentCategoryName: '금융', categoryId: '42', categoryName: '적금', priority: 2 },
  ])
}
