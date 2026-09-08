// 사용자 API — 회원가입 / 로그인 / 진단 정보 제출. (연동: issue #12, #13, #14)
import { http } from '@/shared/api/http'
import type { TokenResponse } from '@/shared/api/auth'

export interface SignUpResponse {
  id: number
  loginId: string
}

export function signup(loginId: string): Promise<SignUpResponse> {
  return http.post<SignUpResponse>('/api/users/signup', { loginId }, { auth: false })
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

export function submitIntake(payload: IntakePayload): Promise<void> {
  return http.post<void>('/api/users/me/intake', payload)
}

// --- 내 프로필 조회 (GET /api/users/me) — issue #23 ---
// ⚠️ 백엔드 미구현. 아래 타입/호출은 이슈 #23 의 "제안 계약" 기준이며,
//    엔드포인트가 없으면 404 → 소비 화면은 폴백(미입력) 처리된다.
// User 엔티티에 컬럼은 이미 존재하나 name·birthDate·phone 은 저장 경로가 없어 당분간 null.

export interface MeProfile {
  protectionEndDate: string | null // "YYYY-MM-DD"
  isYouthSupport: boolean | null
  isBasicRecipient: boolean | null
  regionCode: string | null // 시/군/구 5자리
  regionDisplay: string | null // "서울특별시 강남구" — 없으면 코드로 조회
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
