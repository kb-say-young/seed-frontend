import type { SubCategoryCode } from './store'

// 온통청년 코드 매핑 — 카테고리별_요청_API_계약서.md §4(sub_category별 고정 codes) + §5(jobCd/schoolCd) 이식.
// 요청 조립 시(intakeRequest.ts)에만 호출하는 순수 함수. 반응형 상태로 저장하지 않는다.

const JOB_CD: Record<string, string> = {
  EMPLOYED: '0013001',
  SELF_EMPLOYED: '0013002',
  UNEMPLOYED: '0013003',
  JOB_SEEKING: '0013003', // 미취업자로 매핑, 정밀도 손실 있음(§5)
}

const SCHOOL_CD_STANDALONE: Record<string, string> = {
  HIGH_SCHOOL: '0049004',
  COLLEGE: '0049007',
  GRAD_SCHOOL: '0049008',
}

// 학교급 × 재학_상태 → schoolCd (§4.2 EDUCATION_SUBSIDY 표). 정의되지 않은 조합은 undefined.
const EDUCATION_SCHOOL_CD: Record<string, Record<string, string | undefined>> = {
  HIGH_SCHOOL: { ENROLLED: '0049002', LEAVE_OF_ABSENCE: '0049009', GRADUATED: '0049004', NOT_ENROLLED: '0049001' },
  UNIVERSITY: { ENROLLED: '0049005', LEAVE_OF_ABSENCE: '0049009', GRADUATED: '0049007', NOT_ENROLLED: undefined },
  GRAD_SCHOOL: { ENROLLED: '0049008', LEAVE_OF_ABSENCE: '0049009', GRADUATED: '0049008', NOT_ENROLLED: undefined },
}

export function buildCodes(sub: SubCategoryCode, answers: Record<string, unknown>): Record<string, unknown> {
  switch (sub) {
    case 'JEONSE':
    case 'WOLSE':
      return { lclsfNm: '주거', mclsfNm: '전월세 및 주거급여 지원', plcyKywdNm: '주거지원' }

    case 'PUBLIC_RENTAL':
      return { lclsfNm: '주거', mclsfNm: '주택 및 거주지', plcyKywdNm: '공공임대주택' }

    case 'JOB_TRAINING':
      return {
        lclsfNm: '일자리',
        mclsfNm: '미래역량강화',
        plcyKywdNm: '교육지원',
        jobCd: JOB_CD[answers['현재_상태'] as string],
        schoolCd: SCHOOL_CD_STANDALONE[answers['최종_학력'] as string],
      }

    case 'STARTUP_EMPLOYMENT': {
      const isStartup = answers['희망_진로'] === 'STARTUP'
      return {
        lclsfNm: '일자리',
        mclsfNm: isStartup ? '창업' : '취업',
        plcyKywdNm: isStartup ? '벤처' : null,
      }
    }

    case 'EDUCATION_SUBSIDY': {
      const schoolLevel = answers['학교급'] as string
      const enrollStatus = answers['재학_상태'] as string
      return {
        lclsfNm: '교육',
        mclsfNm: '교육비지원',
        plcyKywdNm: '교육지원',
        schoolCd: EDUCATION_SCHOOL_CD[schoolLevel]?.[enrollStatus],
      }
    }

    case 'SUPPLIES_SUPPORT':
      return { lclsfNm: '복지문화' }

    case 'LIVING_EXPENSE_LOAN':
      return {
        lclsfNm: '복지문화',
        mclsfNm: '취약계층 및 금융지원',
        plcyKywdNm: '대출',
        jobCd: JOB_CD[answers['현재_재직_여부'] as string],
      }

    case 'MEDICAL_SUPPORT':
      return { lclsfNm: '복지문화', mclsfNm: '건강' }

    case 'LOAN': {
      const creditBand = answers['신용점수_구간'] as string
      const lowCredit = creditBand === 'R500_699' || creditBand === 'UNDER_500'
      return {
        lclsfNm: '복지문화',
        mclsfNm: '취약계층 및 금융지원',
        plcyKywdNm: lowCredit ? ['대출', '신용회복'] : '대출',
      }
    }

    case 'SAVINGS':
      return { lclsfNm: '복지문화', mclsfNm: '취약계층 및 금융지원' }
  }
}
