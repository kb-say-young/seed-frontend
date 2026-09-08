// 진단 정보 입력 store → 백엔드 제출 payload 변환.
// 계약: POST /api/users/me/intake (`카테고리별_요청_API_계약서.md` §3)
import { state, CATEGORY_LABEL, subLabel, type GoalPick } from '@/features/diagnosis/model/store'
import type { IntakePayload, GoalPayload, UserProfilePayload } from '@/shared/api/user'

/** "YYYY.MM.DD" | "YYYY-MM-DD" → "YYYY-MM-DD" */
function toIsoDate(s: string): string {
  return s.trim().replace(/[./]/g, '-')
}

// §4(카테고리별 추가 질문) 스키마 미확정 — issue #14 / 계약서 대기.
// 지금 수집하는 값(희망 금액·희망 거주지)만 우선 담고, note 로 최소 1개 키를 보장한다.
function buildDescription(g: GoalPick): Record<string, unknown> {
  const d: Record<string, unknown> = {}
  if (g.targetAmount != null) d.target_amount = g.targetAmount
  if (g.regionCode) d.region_code = g.regionCode
  if (Object.keys(d).length === 0) d.note = '추가 질문 미구현' // @NotEmpty 대응 (TODO §4)
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
