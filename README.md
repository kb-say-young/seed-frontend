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

## 디렉터리 구조 (기능 기준 / feature-based)

경로 별칭 **`@/` = `src/`**. `features/*` 끼리 직접 import 금지 — 공유는 `shared/` 로 승격.
자세한 규칙은 [`.claude/CLAUDE.md`](./.claude/CLAUDE.md) §4a.

```
src/
  app/         부트스트랩 — main.ts, App.vue
  styles/      style.css (@theme·glass 토큰)
  router/      index.ts — 각 feature pages/ 를 lazy import
  shared/
    ui/          UiButton · UiField · UiChip · OptionRow · ViewToggle · StatCard  (+ index.ts 배럴)
    components/  AppHeader · FloatingNav · WizardChrome · SustainMeter · MilestoneCard · AlertCard
    lib/         money.ts(금액 포맷) · roadmap.ts(타임라인 대표 데이터, 후속 API 대체)
  features/
    onboarding/  Onboarding · Landing
    auth/        Login · SignupAccount · SignupProfile · SignupDone
    diagnosis/   pages: Intake{Basic,Income,Welfare,Goals,Priority} · Diagnosing · Roadmap · MilestoneDetail · CostRecord
                 components: PolicyCard   model: store.ts (진단 위저드 답, reactive 싱글턴)
    plan/        FundPlan · FundPlanAi · AllocationEdit
    tracking/    Tracking · ExpenseAdd · TrackingBudget
    account/     MyInfo · EditConditions
    home/        Home (대시보드)
```

## 화면 (`src/router/index.ts`)

서비스 흐름: **온보딩 → 회원가입 → 진단 정보 입력 → AI 로드맵 → 계획(목돈 배분) → 실행(체크리스트·지출)**

| 경로 | 화면 | feature |
|---|---|---|
| `/` · `/landing` | 온보딩 · 인트로 랜딩 | `onboarding` |
| `/login` · `/signup` · `/signup/profile` · `/signup/done` | 로그인 · 회원가입 3단계 | `auth` |
| `/intake` · `/intake/income` · `/intake/welfare` · `/intake/goals` · `/intake/priority` | 진단 정보 입력 4단계 위저드 (수급자 분기) | `diagnosis` |
| `/diagnosing` | 로드맵 생성 중 (로딩) | `diagnosis` |
| `/roadmap` · `/roadmap/:id` · `/roadmap/:id/cost` | 진단결과 타임라인 · 마일스톤 상세 · 비용 기록 | `diagnosis` |
| `/fund` · `/fund/ai` · `/fund/allocation` | 자금 계획 (목적별 배분 / AI 추천) · 배분 비율 조정 | `plan` |
| `/tracking` · `/tracking/add` · `/tracking/budget` | 지출 기록 · 지출/수입 추가 · 예산 대비 | `tracking` |
| `/home` | 홈 대시보드 | `home` |
| `/me` · `/me/edit` | 내정보 · 조건 수정 | `account` |

## 디자인 시스템

| 파일 | 역할 |
|---|---|
| [`DESIGN.md`](./DESIGN.md) | 시각 언어의 단일 기준(SSOT). 색·타이포·간격·컴포넌트 스펙. |
| [`src/styles/style.css`](./src/styles/style.css) `@theme` | 위 문서의 기계 판독본. Tailwind 토큰이 여기서 생성됨. **DESIGN.md와 항상 함께 수정.** |
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
