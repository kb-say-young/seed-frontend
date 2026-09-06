import type { State } from './store'
import { CATEGORY_ID, SUB_CATEGORY_ID } from './categories'
import { buildCodes } from './goalCodes'
import { regionLabel } from './regions'

// 카테고리별_요청_API_계약서.md §3/§8 형태의 제출 payload 조립. 값 조립까지만 —
// 실제 엔드포인트(POST /api/v1/diagnosis/intake)로의 네트워크 호출은 아직 연결하지 않는다
// (백엔드 미배포, README "실제 API 연동" 후속 항목).
//
// 문서 내 불일치 주의: §3.1 표는 필드명을 protection_end_date/is_youth_support/fixed_budget/
// is_basic_recipient 로 정의하지만, §8 예시는 is_independence_youth/didimseed_account_balance/
// is_basic_livelihood_recipient 등 다른 이름을 쓴다. 이 함수는 정의 표(§3.1)를 따른다 —
// 백엔드와 실제 연동하기 전에 필드명을 서로 맞춰야 한다.
// `income`은 계약서 §3.1에 enum(구간) 타입으로 정의돼 있지만, 제품 결정으로 구간 선택 대신
// 월 평균 소득 금액(원 단위 정수)을 직접 입력받아 보낸다 — 백엔드와 타입을 맞춰야 한다.

const toIsoDate = (v: string) => v.replaceAll('.', '-')

export function buildIntakeRequest(state: State) {
  return {
    user_profile: {
      protection_end_date: toIsoDate(state.protectionEndDate),
      is_youth_support: state.isYouthSupportApplied,
      fixed_budget: state.cdaBalance ?? 0,
      region_code: state.region,
      region_display: regionLabel(state.region),
      income: state.monthlyIncome ?? 0,
      is_basic_recipient: state.isBasicRecipient,
      household_size: state.householdSize ?? 0,
    },
    goals: state.goals.map((g) => ({
      category: CATEGORY_ID[g.category],
      sub_category: SUB_CATEGORY_ID[g.sub],
      codes: buildCodes(g.sub, g.answers),
      answers: g.answers,
    })),
  }
}
