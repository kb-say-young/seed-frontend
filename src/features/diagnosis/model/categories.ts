// categories 테이블 시드 데이터 매핑 (seed-backend). category_id/parent_category_id는 VARCHAR(2).
// 카테고리별_요청_API_계약서.md §3.2 의 `category`/`sub_category` 필드에 그대로 실어 보낸다.
import type { GoalCategory, SubCategoryCode } from './store'

export const CATEGORY_ID: Record<GoalCategory, string> = {
  housing: '1',
  work: '2',
  living: '3',
  finance: '4',
}

export const SUB_CATEGORY_ID: Record<SubCategoryCode, string> = {
  JEONSE: '11',
  WOLSE: '12',
  PUBLIC_RENTAL: '13',
  JOB_TRAINING: '21',
  STARTUP_EMPLOYMENT: '22',
  EDUCATION_SUBSIDY: '23',
  SUPPLIES_SUPPORT: '31',
  LIVING_EXPENSE_LOAN: '32',
  MEDICAL_SUPPORT: '33',
  LOAN: '41',
  SAVINGS: '42',
}
