# seed-frontend

자립준비청년·아동양육시설 청소년을 위한 **모바일 기반 웹 앱**의 프론트엔드.

## 스택

- Vite + Vue 3 (`<script setup lang="ts">`) + TypeScript
- vue-router 4 · Tailwind CSS v4 (CSS-first `@theme`, `@tailwindcss/vite`)
- lucide-vue-next (아이콘) · Pretendard (본문 서체)

## 개발

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 타입 체크 + 프로덕션 빌드
```

## 화면 (`src/router.ts`)

서비스 흐름: **온보딩 → 회원가입 → 진단 정보 입력 → AI 로드맵 → 계획(목돈 배분) → 실행(체크리스트·지출)**

| 경로 | 화면 | 파일 |
|---|---|---|
| `/` | 온보딩 | `pages/Onboarding.vue` |
| `/landing` | 인트로 랜딩 (비로그인) | `pages/Landing.vue` |
| `/login` | 로그인 | `pages/Login.vue` |
| `/signup` · `/signup/profile` · `/signup/done` | 회원가입 (계정 → 인적사항 → 완료) | `pages/Signup*.vue` |
| `/intake` · `/intake/income` · `/intake/welfare` · `/intake/goals` · `/intake/priority` | 진단 정보 입력 4단계 위저드 (수급자 분기 포함) | `pages/Intake*.vue` |
| `/diagnosing` | 로드맵 생성 중 (로딩) | `pages/Diagnosing.vue` |
| `/roadmap` · `/roadmap/:id` · `/roadmap/:id/cost` | 진단결과 타임라인 · 마일스톤 상세 · 비용 기록 | `pages/Roadmap.vue` · `MilestoneDetail.vue` · `CostRecord.vue` |
| `/fund` · `/fund/ai` · `/fund/allocation` | 자금 계획 (목적별 배분 / AI 추천) · 배분 비율 조정 | `pages/FundPlan.vue` · `FundPlanAi.vue` · `AllocationEdit.vue` |
| `/tracking` · `/tracking/add` · `/tracking/budget` | 지출 기록 · 지출/수입 추가 · 예산 대비 | `pages/Tracking.vue` · `ExpenseAdd.vue` · `TrackingBudget.vue` |
| `/home` | 홈 대시보드 | `pages/Home.vue` |
| `/me` · `/me/edit` | 내정보 · 조건 수정 | `pages/MyInfo.vue` · `EditConditions.vue` |

공용: `components/` — `WizardChrome`(다단계 골격) · `OptionRow`(선택 행) · `FloatingNav`(하단 탭바) ·
`ViewToggle`(뷰 전환) · `UiButton` · `UiField` · `UiChip` · `AlertCard` · `MilestoneCard` ·
`PolicyCard` · `SustainMeter` · `StatCard` · `AppHeader`.
진단 입력 답 상태: `src/lib/store.ts` (`reactive` 싱글턴, Pinia 도입 전).
그 외 `src/lib/` — `money.ts`(금액 포맷) · `roadmap.ts`(타임라인 대표 데이터).

## 디자인 시스템

| 파일 | 역할 |
|---|---|
| [`DESIGN.md`](./DESIGN.md) | 시각 언어의 단일 기준(SSOT). 색·타이포·간격·컴포넌트 스펙. |
| [`src/style.css`](./src/style.css) `@theme` | 위 문서의 기계 판독본. Tailwind 토큰이 여기서 생성됨. **DESIGN.md와 항상 함께 수정.** |
| [`.claude/CLAUDE.md`](./.claude/CLAUDE.md) | 에이전트 작업 규칙 — 대상 사용자 제약, 세 디자인 리소스의 역할·우선순위, 머지 전 체크리스트. |
| `.claude/skills/` | `ui-ux-pro-max` · `ui-styling` · `design-system` · `brand` (생성·검색 엔진) + `design-taste-frontend` (리뷰 게이트). |

### 디자인 원칙 (요약)

대상이 취약계층이라 **접근성·신뢰·저불안**이 미적 선호보다 우선한다.
`DESIGN_VARIANCE 3 / MOTION_INTENSITY 2 / VISUAL_DENSITY 3` — 예측 가능하고, 조용하고, 화면당 한 가지 일.
쉬운 한국어, 모든 숫자에 의미, 48px 터치 타깃, 3px 포커스 링, `prefers-reduced-motion` 준수.
자세한 내용은 `DESIGN.md`와 `.claude/CLAUDE.md`.

### pro-max 검색 도구

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<질의>" --design-system
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<질의>" --domain ux
```
