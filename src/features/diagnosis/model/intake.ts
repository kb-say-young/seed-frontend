// 진단 정보 입력 store → 백엔드 제출 payload 변환.
// 계약: POST /api/users/me/intake (`카테고리별_요청_API_계약서.md` §3)
import { state, CATEGORY_LABEL, subLabel, goalFieldsFor, type GoalPick } from '@/features/diagnosis/model/store'
import type { IntakePayload, GoalPayload, UserProfilePayload } from '@/shared/api/user'

/** "YYYY.MM.DD" | "YYYY-MM-DD" → "YYYY-MM-DD" */
function toIsoDate(s: string): string {
  return s.trim().replace(/[./]/g, '-')
}

// §4(카테고리별 추가 질문). 백엔드는 description 구조를 해석하지 않고 그대로 저장하므로
// (GoalRequest 주석 참조), GOAL_FIELDS 카탈로그가 곧 스키마다 — 그 key 를 그대로 옮긴다.
// showIf 조건이 안 맞는(숨겨진) 필드는 답이 남아 있어도 보내지 않는다.
function buildDescription(g: GoalPick): Record<string, unknown> {
  const d: Record<string, unknown> = {}
  for (const f of goalFieldsFor(g.categoryId)) {
    if (f.showIf && g.answers[f.showIf.key] !== f.showIf.equals) continue
    const v = g.answers[f.key]
    if (v !== undefined && v !== '') d[f.key] = v
  }
  if (Object.keys(d).length === 0) d.note = '추가 질문 미구현' // @NotEmpty 대응(카탈로그에 없는 카테고리 등)
  return d
}

export class IntakeIncompleteError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'IntakeIncompleteError'
  }
}

export function buildIntakePayload(): IntakePayload {
  const {
    protectionEndDate,
    isYouthSupportApplied,
    isBasicRecipient,
    regionCode,
    educationLevel,
    householdSize,
    monthlyIncome,
    cdaBalance,
    goals,
  } = state

  if (
    !protectionEndDate ||
    isYouthSupportApplied == null ||
    isBasicRecipient == null ||
    !regionCode ||
    !educationLevel ||
    householdSize == null ||
    monthlyIncome == null ||
    cdaBalance == null ||
    goals.length === 0
  ) {
    throw new IntakeIncompleteError('진단 정보가 아직 다 입력되지 않았어요.')
  }

  const user_profile: UserProfilePayload = {
    protection_end_date: toIsoDate(protectionEndDate),
    is_youth_support: isYouthSupportApplied,
    fixed_budget: cdaBalance,
    region_code: regionCode,
    education: educationLevel,
    income: monthlyIncome,
    is_basic_recipient: isBasicRecipient,
    household_size: householdSize,
  }

  const goalPayloads: GoalPayload[] = goals.map((g) => ({
    parent_category_id: g.parentId,
    category_id: g.categoryId,
    category_id_display: subLabel(g.categoryId),
    parent_category_id_display: CATEGORY_LABEL[g.parentId],
    description: buildDescription(g),
  }))

  return { user_profile, goals: goalPayloads }
}
