---
version: 1.0
name: seed-frontend-design-system
description: >
  Calm, trustworthy, high-accessibility mobile web app ("씨앗 / Seed") that helps
  care-leaving young adults find the support programs they qualify for and plan the
  lump-sum funds they receive. Three stages: 진단(diagnose) → 계획(plan) → 실행(execute).
  Visual language is "Accessible & Ethical" on a muted 씨앗-green brand: white canvas,
  one forest green for primary action, soft green tint for calm surfaces, desaturated
  amber/blue/coral/purple only as categorical accents. Generous 17px+ type, pill
  primary buttons, soft 16px card radii, near-flat elevation, near-zero motion.
  Every product screen does one thing. Plain Korean, never jargon. No pressure,
  no deficit framing, no dark patterns.
audience:
  - 18세 미만 아동양육시설 보호 아동·청소년
  - 보호종료 자립준비청년 (홀로서기 준비 단계)
  note: 취약계층. 접근성·신뢰·저불안(低不安)이 미적 선호보다 항상 우선한다.
dials:
  DESIGN_VARIANCE: 3   # 1=완전 대칭 … 10=예술적 혼돈. 낮게: 예측 가능·일관.
  MOTION_INTENSITY: 2  # 기능적 모션만. prefers-reduced-motion 이면 완전 정지.
  VISUAL_DENSITY: 3    # 화면당 주요 행동 1개. 점진적 공개.
---

# DESIGN.md — seed-frontend

> 이 파일이 시각 언어의 **단일 기준(Single Source of Truth)** 이다.
> 코드에 박힌 색/간격 값보다 이 문서가 우선한다. 새 화면은 여기 정의된 토큰만 쓴다.
> 기계 판독본은 `src/styles/style.css` 의 `@theme` 블록이며, 이 문서와 항상 함께 수정한다.

---

## 1. Visual Theme & Atmosphere

| 항목 | 값 |
|---|---|
| 스타일 계열 | **Accessible & Ethical** (정부·의료·교육·포용 제품 계열) + 씨앗-그린 브랜드 |
| 분위기 | 차분함, 안심, 명료함. "잘 하고 있어" 라고 말해주는 톤. 새싹/성장의 은유. |
| 밀도 | 낮음. 제품 화면 = 한 가지 일. 인트로/홈만 히어로+CTA 허용(아래 Design read). |
| 깊이 | 거의 평면. 그림자는 "떠 있는 것"(시트·토스트)만. 홈 상단에 옅은 그린 그라디언트 장식 1회 허용. |
| 움직임 | 거의 없음. 전환은 방향을 알려주는 용도로만. |
| 톤 오브 보이스 | 쉬운 우리말. 반말 아님, 딱딱한 공문서체도 아님. "이번 달 생활비, 32만 원 남았어요." |
| 안 하는 것 | 마감 카운트다운, 결핍·수치 프레이밍("아직도 못 했어요"), 장식용 빨강, 다크패턴, 자동재생, 이모지 아이콘, AI 보라/분홍 그라디언트 |

**Design read (taste 스킬 0.B):**
> *Reading this as: 두 종류의 화면 —*
> *(1) 인트로/홈: 취약계층 청년 대상 신뢰 우선 랜딩. 히어로 헤드라인 + 단일 CTA + 3단계(진단·계획·실행) 안내 카드. taste 스킬의 랜딩 규율을 여기서만 적용하되 DENSITY는 낮게.*
> *(2) 제품 화면(진단 폼·계획·실행 대시보드): 다단계 제품 UI. 히어로 없음, 화면당 결정 1개, DENSITY 3.*
> *공통: Tailwind v4 + Pretendard + 씨앗-그린 토큰 + 최소 모션.*

---

## 2. Color Palette & Roles

출처: **씨앗 Seed 와이어프레임 · 진단 플로우** (Figma, file `dA4Z11FxLbcKG11iyDm7Os`).
값은 와이어프레임에서 확정. 이 표와 `src/styles/style.css` `@theme` 는 항상 함께 갱신한다. 모든 조합의 대비는 의도적으로 검증했다.

### Core

| 토큰 | HEX | 역할 | 대비 |
|---|---|---|---|
| `--color-bg` / `--color-surface` | `#FFFFFF` | 페이지·카드·시트·입력 표면 | ink 대비 ≈ 16:1 |
| `--color-surface-subtle` | `#F7F8F7` | 검색 필드·보조 카드·구분 배경 | — |
| `--color-ink` | `#17181A` | 제목·강조 텍스트 | white 위 ≈ 16:1 (AAA) |
| `--color-body` | `#3F4147` | 본문 텍스트 | white 위 ≈ 10:1 (AAA) |
| `--color-muted` | `#6B7280` | 보조 설명, 캡션, 진행 표시 "N/M" (**이보다 옅게 금지**) | white 위 ≈ 4.8:1 (AA) |
| `--color-border` | `#E5E7EB` | 카드 테두리, 미선택 옵션 행 | — |
| `--color-border-strong` | `#C9CDD2` | 입력 테두리(기본) | — |

### Brand (Primary)

| 토큰 | HEX | 역할 | 대비 |
|---|---|---|---|
| `--color-primary` | `#1F7A45` | 버튼·링크·선택 상태 텍스트·활성 내비 | 흰 텍스트 ≈ 4.8:1 (AA ✓) |
| `--color-primary-dark` | `#175C34` | hover/active/pressed | 흰 텍스트 ≈ 7:1 |
| `--color-primary-tint` | `#E8F5EC` | 선택된 옵션·칩·성공 배지·차분한 카드 배경 | 위 primary ≈ 4.4:1 |
| `--color-primary-bright` | `#2FA360` | **장식 전용** — 진행바 채움·차트·아이콘. 절대 텍스트를 얹지 않는다 (흰 텍스트 3.2:1, AA 미달). Figma 와이어프레임의 밝은 초록이 이 값. | — |
| `--color-on-primary` | `#FFFFFF` | primary/primary-dark 위 글자·아이콘 | — |
| `--color-focus` | `#1F7A45` | 포커스 링 (3px, offset 2px) | — |

> Figma 와이어프레임의 버튼 fill 은 `#2FA360` 이지만 흰 글자 대비가 AA(4.5:1)에 못 미쳐,
> 구현에서는 **버튼/링크/선택 텍스트 = `--color-primary` `#1F7A45`** 로 한 단계 어둡게 쓴다.
> `#2FA360` 은 텍스트가 없는 진행바·차트·장식에만.

### Status

| 토큰 | HEX | 역할 |
|---|---|---|
| `--color-danger` | `#C0392B` | **진짜 오류·파괴적 동작·예산 초과에만.** (흰 텍스트 ≈ 5.9:1) |
| `--color-danger-tint` | `#FDECEB` | 오류 메시지·초과 상태 배경 |
| `--color-amber` | `#8A6420` | 주의·조건 미충족("소득 기준 초과" 등). 압박 아님. (흰 텍스트 ≈ 5.1:1) |
| `--color-amber-tint` | `#F7EDDA` | 주의 배지 배경 |

> 빨강(danger)은 오류/삭제 + **예산 초과**에만. "아직 자격 안 됨"은 상태이지 오류가 아니다 → `--color-amber`.

### 목표·예산 카테고리 색

목표 4분류(주거·생활·취창업·금융)와 예산 버킷(주거보증금·생활비·교육비·비상금)에 **일관되게** 매핑.
의미는 항상 색 + 라벨 함께.

| 토큰 | HEX | tint | 매핑 |
|---|---|---|---|
| `--color-cat-housing` | `#1F7A45` | `#E8F5EC` | 주거 / 주거보증금 |
| `--color-cat-living` | `#3B6291` | `#E6EDF5` | 생활 / 생활비 |
| `--color-cat-work` | `#B45B41` | `#F7E6DF` | 취창업 / 교육비 |
| `--color-cat-finance` | `#5E4F97` | `#ECE8F5` | 금융 / 비상금 |

### Status badge 프리셋 (UiBadge tone)

| tone | 상태 예시 | 배경 | 텍스트 |
|---|---|---|---|
| `available` | 지금 신청 가능 | `--color-primary-tint` | `--color-primary` |
| `waiting` | N개월 뒤 · 대기 | `--color-surface-subtle` | `--color-muted` |
| `ineligible` | 소득 기준 초과 · 조건 미충족 | `--color-amber-tint` | `#6E4E18` |
| `closed` | 신청 마감 · 해당 없음 | `--color-danger-tint` | `#7A2F27` |

### Dark mode

지금은 **라이트 모드만** 공식 지원 (`<meta name="color-scheme" content="light">`).
`prefers-color-scheme: dark` 는 시스템 대비 최소값만 맞춰 깨지지 않게 처리하고, 정식 다크 팔레트는 후속 과제.

---

## 3. Typography Rules

| 항목 | 값 |
|---|---|
| 본문 서체 | **Pretendard** — `Pretendard, -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif` |
| 근거 | 한글 가독성·굵기 범위·무료(OFL). pro-max 추천은 Atkinson Hyperlegible이었으나 한글 글리프가 없어 UI 본문 부적합 → Pretendard 채택. (라틴 숫자 강조가 필요하면 Atkinson을 숫자 전용 보조로만.) |
| 숫자 | `font-variant-numeric: tabular-nums` (금액 정렬). 별도 mono 없음. |
| 기준 크기 | **17px** (일반 16px보다 크게: 대상 + 스트레스 맥락). 줄간 1.6. |
| 최소 크기 | 본문 15px, 캡션 13px. 13px 미만 금지. |

### Scale

| 이름 | size / line-height | weight | letter-spacing | 용도 |
|---|---|---|---|---|
| `display` | 40 / 1.2 | 700 | -0.5px | 온보딩·큰 화면 제목 (드물게) |
| `h1` | 32 / 1.25 | 700 | -0.3px | 화면 제목 |
| `h2` | 26 / 1.3 | 700 | -0.2px | 섹션 제목 |
| `h3` | 22 / 1.35 | 700 | 0 | 카드 제목 |
| `body-lg` | 19 / 1.6 | 400 | 0 | 중요한 본문, 질문 문장 |
| `body` | 17 / 1.6 | 400 | 0 | 기본 본문 |
| `body-sm` | 15 / 1.55 | 400 | 0 | 보조 설명 |
| `label` | 15 / 1.4 | 600 | 0 | 입력 라벨, 버튼 |
| `caption` | 13 / 1.5 | 400 | 0.1px | 메타 정보, 각주 |
| `amount` | 26 / 1.2 | 700 | -0.2px | 금액 표시 (tabular-nums) |

- 한 화면에 위계는 최대 3단계.
- 대문자 변형(`text-transform: uppercase`) 한글에 쓰지 않음.
- 링크는 색+밑줄 둘 다. 색만으로 구분 금지.

---

## 4. Component Stylings

공통: 상호작용 요소 최소 **48×48px**, 요소 간 간격 **8px+**. 모든 상태(hover/active/focus/disabled) 정의. 전환 150–200ms ease-out.

### Button

| variant | 배경 | 텍스트 | 테두리 | 용도 |
|---|---|---|---|---|
| `primary` | `--color-primary` | `--color-on-primary` | 없음 | 화면당 1개 |
| `secondary` | `--color-surface` | `--color-primary-dark` | 1.5px `--color-primary` | 보조 행동 |
| `ghost` | 투명 | `--color-primary-dark` | 없음 | 3순위, 목록 내 |
| `destructive` | `--color-danger` | `#FFFFFF` | 없음 | 삭제 확인 화면에서만 |

- 모양: **알약(pill)** — radius `--radius-full`. (파운데이션 시트 기준.)
- 높이 48+ / 패딩 좌우 24 / weight 600 / size 17.
- 큰 CTA(홈 "무료로 진단 시작하기")는 전체 폭 pill, 높이 56.
- hover/active → 배경 `--color-primary-dark`. 150–200ms.
- `:focus-visible` → `outline: 3px solid var(--color-focus); outline-offset: 2px`.
- `:disabled` → 배경 `--color-surface-subtle`, 텍스트 `--color-muted`, `cursor: not-allowed`, 안내 문구를 버튼 밖에. (파운데이션의 회색 "다음" 상태.)
- 로딩 시 스피너 + "저장 중…" 텍스트, 버튼 폭 유지(레이아웃 이동 금지).
- 전체 폭 버튼이 기본(모바일). 아이콘만 있는 버튼 금지 — 아니면 `aria-label` 필수.

### Input / Form

- 라벨은 **항상 보이게**, 필드 위. placeholder를 라벨로 쓰지 않음.
- 높이 48+ / radius `--radius-md` (10) / 테두리 1.5px `--color-border-strong` / 배경 `--color-surface`.
- `:focus` → 테두리 `--color-primary` + 3px 포커스 링.
- 금액 필드는 오른쪽에 단위 접미사(`원`)를 겹치지 않게 배치(`UiField` `suffix` prop).
- 도움말은 필드 **아래** 회색 `body-sm`. 오류도 필드 **바로 아래**(상단 요약 금지) + `aria-describedby` 연결.
- 오류 상태: 테두리 `--color-danger`, 아이콘 + 텍스트(색만으로 표시 금지).
- 숫자 입력은 `inputmode="numeric"`, 금액은 자릿수 콤마 자동.
- 한 화면에 입력 3개 이하 권장. 넘으면 단계 분할 + 진행 표시.

### Card

- 배경 `--color-surface` / 테두리 1px `--color-border` / radius `--radius-lg` (16px) / 패딩 20 / 그림자 `--shadow-sm`.
- 카드 전체가 링크면 `<a>`/`<button>` 로 감싸고 포커스 링을 카드에 표시.

### Wizard step (다단계 입력) — `WizardChrome.vue`

Figma 진단입력 ①~④ / 계획 1~4 공통 골격. 회원가입·진단정보·계획이 모두 이 틀을 재사용한다.

- 세로 구성: safe-area 여백 → (뒤로 `‹` 48×48 · 오른쪽 "N / M" `body-sm` muted) → **세그먼트 진행바** → 질문블록 → 본문(slot) → 하단 고정 CTA.
- 세그먼트 진행바: `total` 칸, 각 `h-1 rounded-full gap-1.5`. 지난·현재 단계 = `--color-primary-bright`, 이후 = `--color-border`. 스크린리더용 `"전체 N단계 중 M단계"` 텍스트 별도(`sr-only`).
- 질문블록: 제목 `h3`(22, bold, ink) + 보조문 `body-sm` muted. 화면당 **질문 1개**.
- 하단 CTA: `sticky bottom-0`, 표면색 배경, 전체 폭 pill(lg). `canNext=false` 면 disabled(회색). 라벨은 단계별로("다음" / "가입 완료" / "AI 진단 받기" …).
- 뒤로: 첫 단계면 이전 화면으로 라우팅, 아니면 `step -= 1`.

### Option row (선택 행) — `OptionRow.vue`

Figma 진단입력 ③④ 리스트. 단일선택 `role="radio"`, 다중선택 `role="checkbox"` + `aria-checked`.

- 미선택: `border border-border rounded-md px-4 py-3.5` + `text-ink`.
- 선택됨: `border-[1.5px] border-primary bg-primary-tint` + 라벨 `font-bold text-primary` + 오른쪽 `check` 아이콘.
- 보조 라벨(`sublabel`)은 `caption` muted 한 줄.

### Bottom Navigation — `BottomNav.vue`

- 항목 **5개**: `홈` / `진단` / `계획` / `실행` / (`마이` 로그인 시 · `로그인` 로그아웃 시).
- 높이 64 + safe-area inset. 아이콘(22, Lucide) + 라벨(caption) **항상 표시**(아이콘만 금지, 이모지 금지).
- 활성: 아이콘·라벨 `--color-primary`, 아이콘 뒤 `--color-primary-tint` 알약 배경. 비활성: `--color-muted`.
- `홈`은 정확 매칭(`isExactActive`), 나머지는 접두사 매칭. 위치 고정, 본문 `padding-bottom` 으로 가림 방지.
- 아이콘 매핑: 홈=`house` · 진단=`sprout` · 계획=`chart-pie` · 실행=`wallet` · 마이=`user` · 로그인=`log-in`.
- 결과·대시보드처럼 하단 CTA가 있는 화면은 CTA를 `sticky bottom-16`(내비 위) + 표면색 그라디언트로 띄우고, 본문 `pb-44`.

### Bottom Sheet / Dialog

- 아래에서 슬라이드 업 200ms(감속). reduced-motion 이면 페이드 없이 즉시.
- 배경 딤 `rgba(15,23,42,0.4)`. 상단에 grabber(4×36, `--color-border-strong`).
- 첫 포커스는 시트 제목. `Esc`/바깥 탭/닫기 버튼으로 닫힘. 포커스 트랩.
- radius 상단만 20.

### List row

- 최소 높이 56 / 좌우 패딩 16 / 구분선 `--color-border`.
- 왼쪽 아이콘·오른쪽 값(금액은 tabular-nums). 탭 가능하면 오른쪽 chevron.

### Chip / Tag (선택형)

- radius `--radius-full` / 패딩 좌우 12 세로 6 / size 15 / 최소 높이 36 (터치 시 44+ 영역 확보).
- 미선택: `--color-surface` + 1px `--color-border-strong` 테두리 + `--color-body` 텍스트.
- 선택됨: `--color-primary-tint` 배경 + `--color-primary-dark` 텍스트 + 테두리 없음. (파운데이션 "생활비 / 교육비".)
- 토글이면 `role="button"` + `aria-pressed`, 필터면 체크박스 시맨틱.

### Status Badge (읽기 전용)

- radius `--radius-full` / 패딩 좌우 10 세로 4 / size 13 / weight 600.
- §2 "Status badge 프리셋" 표의 배경·텍스트 조합만 사용. 색만으로 의미 전달 금지 — 항상 문구 포함.

### Progress

- 다단계 폼: 세그먼트 진행바(위 Wizard step) + `sr-only` "전체 N단계 중 M단계". 퍼센트만 표시 금지.
- 배분/사용률 막대: 높이 8, radius full, 채움 = 카테고리 색(또는 초과 시 `--color-danger`), 트랙 `--color-surface-subtle`.
- 진행바 채움에 텍스트를 얹지 않으므로 장식용 `--color-primary-bright` 사용 가능.

### Empty state

- 중립 일러스트/아이콘(작게) + 한 줄 설명 + 다음 행동 버튼 1개. "아무것도 없음"으로 끝내지 않음.

### Toast

- 하단(내비 위) 등장, 4초 후 자동 사라짐 + 수동 닫기. 성공 `--color-primary-tint`, 오류 `--color-danger-tint`.
- 중요한 확인/오류는 토스트만으로 처리하지 말 것.

---

## 5. Layout Principles

| 항목 | 값 |
|---|---|
| 접근 | 모바일 우선. 주 타깃 폭 360–430px. |
| 콘텐츠 최대폭 | **480px**, 그 이상 화면에선 중앙 정렬(모바일 앱 형태 유지). |
| 그리드 | 단일 컬럼. 좌우 여백 16px(기본), 20px(카드 내부). |
| 간격 스케일 (4px 기준) | 0 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 |
| 섹션 간격 | 24 (밀접) / 32 (기본) / 40 (큰 구분) |
| 세로 리듬 | 요소 사이 최소 12. 관련 요소 8, 무관 요소 24+. |
| safe-area | `env(safe-area-inset-*)` 상·하단 반영(내비·헤더). |
| 헤더 | 높이 56, 제목 `h1`, 뒤로가기 버튼 왼쪽(48×48). sticky. |
| 스크롤 | 세로만. 가로 스크롤 절대 금지(테이블·칩 줄바꿈 처리). |
| 터치 여백 | 화면 가장자리에서 액션 버튼 16px 이상 띄움. |

---

## 6. Depth & Elevation

거의 평면. 그림자는 "표면 위에 뜬 것"에만.

| 토큰 | 값 | 용도 |
|---|---|---|
| `--shadow-none` | none | 페이지 위 카드 기본(테두리로 구분) |
| `--shadow-sm` | `0 1px 2px rgb(15 23 42 / 0.06)` | 카드, 고정 헤더 하단 |
| `--shadow-md` | `0 6px 16px rgb(15 23 42 / 0.12)` | 바텀시트, 다이얼로그, 토스트 |

- blur 큰 몽환적 그림자, 다중 그림자, colored glow 금지.
- 표면 위계: `bg` → `surface`(카드) → `surface` + `shadow-md`(시트). 3단계면 충분.

---

## 7. Do's and Don'ts

### Do
- 화면마다 한 줄로 "지금 뭐 하는 화면인지" 말해준다.
- 모든 숫자에 의미를 붙인다: "32만 원" ❌ → "이번 달 남은 생활비 32만 원" ✅.
- 제도 용어(자립수당, 디딤씨앗통장, 자립정착금, LH 전세임대 등)는 **첫 등장 시 한 줄 설명**.
- 되돌리기(undo)를 먼저 제공하고, 그다음에 확인 다이얼로그.
- 입력 중 이탈해도 임시저장. 다시 오면 이어서.
- 진행 상황을 항상 보여준다(몇 단계 중 몇 단계).
- 로그인 없이도 정책·정보를 둘러볼 수 있게 한다.
- 아이콘은 Lucide SVG. 라벨을 항상 동반.

### Don't
- 마감·시간 압박 카운트다운.
- "아직 안 했어요 / 부족해요" 식 결핍·수치 프레이밍. 중립적·미래지향적으로.
- 빨강을 오류·삭제 외에 사용(잔액 낮음 등에 빨강 금지).
- 이모지를 아이콘으로.
- placeholder-only 라벨, 상단 일괄 오류 요약, 색만으로 의미 전달.
- 자동재생 영상/캐러셀, 무한 루프 애니메이션, 패럴랙스.
- 한 화면에 결정 2개 이상 강요.
- 12px 이하 텍스트, 44px 미만 터치 타깃.
- 계정 생성 강제(둘러보기 차단).

---

## 8. Responsive Behavior

| Breakpoint | 처리 |
|---|---|
| 320–430px (주) | 단일 컬럼, 전체 폭 버튼, 바텀 내비. |
| 431–767px | 좌우 여백만 증가, 콘텐츠 480px 도달 시 중앙 고정. |
| 768–1024px | 콘텐츠 480px 중앙, 배경 `--color-bg`. 바텀 내비 유지(사이드바로 바꾸지 않음). |
| 1025px+ | 동일. 최대폭 그대로. 데스크톱 전용 레이아웃 없음. |

- 터치 타깃 48×48 유지(전 구간). 마우스에서도 축소하지 않음.
- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`, 확대 차단(`user-scalable=no`) 금지.
- 텍스트 200% 확대에도 레이아웃 깨지지 않게(고정 px 높이 지양, `min-h`).
- 이미지 `max-width:100%`, `width`/`height` 지정으로 CLS 방지.
- 칩·배지·긴 단어는 줄바꿈/래핑, 잘라내기 금지.

---

## 9. Agent Prompt Guide

### Quick color reference (씨앗-그린)

```
primary        #1F7A45  on #FFFFFF   버튼·링크·선택 텍스트·활성 내비 (AA 4.8:1)
primary-dark   #175C34  on #FFFFFF   hover/active
primary-tint   #E8F5EC  on #1F7A45   선택 옵션·칩·성공 배지·차분한 카드
primary-bright  #2FA360  장식 전용   진행바·차트·아이콘. 텍스트 얹기 금지
danger         #C0392B  on #FFFFFF   오류·삭제·예산 초과
amber          #8A6420  on #FFFFFF   주의·조건 미충족(압박 아님)
cat-housing #1F7A45 · cat-living #3B6291 · cat-work #B45B41 · cat-finance #5E4F97
   (+ 각 -tint: #E8F5EC / #E6EDF5 / #F7E6DF / #ECE8F5)  목표·예산 카테고리
ink   #17181A   body #3F4147   muted #6B7280 (이보다 옅게 금지)
bg/surface #FFFFFF   surface-subtle #F7F8F7
border #E5E7EB   border-strong #C9CDD2
focus ring 3px #1F7A45, offset 2px
radius: 버튼 full(pill) · 입력·옵션행 10 · 카드 16 · 시트 상단 20
type: 본문 17/1.6 Pretendard · 터치 48×48 · 모션 ≤200ms
```

### 홈(인트로) 화면 구조 — `pages/Landing.vue`

```
헤더:   "씨앗" 워드마크(primary, 700) 왼쪽 · "로그인 / 가입" 보조 버튼 오른쪽
히어로: h1 "받을 돈, 지금 확인해요"(2줄) + 보조문 + 상단 우측 옅은 그린 글로우(장식, aria-hidden)
지표카드: primary-tint 배경, "평균 진단 금액" + "1,847만원"  ← 평균 안내임을 캡션에 명시(오해 금지)
CTA:    전체 폭 pill "무료로 진단 시작하기" → /signup   (+ "비회원으로 먼저 둘러보기" → /intake)
3단계:  진단(→/intake, 전체 폭 행) · 계획(→/plan) · 실행(→/execute, 2열 카드)
하단내비: 홈(활성)·진단·계획·실행·로그인
```

### 새 화면 만들 때 (붙여넣어 쓰는 프롬프트)

```
seed-frontend/DESIGN.md 를 읽고 그 토큰만 사용해.
이건 18세 미만 시설 청소년·자립준비청년용 모바일 웹앱이고,
접근성·신뢰·저불안이 최우선이야 (DESIGN_VARIANCE 3 / MOTION 2 / DENSITY 3).

먼저 .claude/skills/ui-ux-pro-max/scripts/search.py 로 해당 패턴을 확인해:
  python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<질의>" --domain ux

그다음 한 줄 디자인 리드를 선언하고 (taste 스킬 0.B), Vue 3 + Tailwind v4 로 구현해.
끝나면 .claude/CLAUDE.md 의 하드 제약 체크리스트를 통과시켜.
화면당 주요 행동 1개, 쉬운 한국어, 모든 숫자에 의미, 48px 터치, 3px 포커스 링.
```

### 리뷰할 때

taste 스킬 Section 14 (FINAL PRE-FLIGHT CHECK) + `.claude/CLAUDE.md` 하드 제약을 순서대로 적용.
`ui-ux-pro-max --domain ux` 로 접근성 항목을 관찰 가능한 결과 단위로 각각 확인.

---

## 10. 서비스 흐름 & 화면 목록 (2026-08 개편)

출처: Figma `씨앗 Seed 와이어프레임 · 진단 플로우` + 서비스 흐름 문서.
**개편 요지:** 생년월일이 진단 → 회원가입으로 이동. 진단 정보에 `자립준비청년 신청 여부`,
`예산`, `목표(4분류→세부목표)`, `구체적 목표`, `우선순위` 추가. 진단 = LLM(RAG) 계획 추천.
지원금은 예산에 더하지 않음 — 예산·지출은 전부 사용자가 직접 입력.

### 흐름

```
1. 회원가입   /signup    아이디·비밀번호 → 이름·생년월일·전화번호·가구원 수 → 완료
2. 진단 정보  /intake    8단계 위저드:
     ① 보호종료(예정)일(예정/완료 토글 + 날짜)
     ② 자립준비청년 신청 여부(예/아니오)
     ③ 거주지(검색 + 시·도 선택)
     ④ 소득구간(중위소득 대비 5구간, 기초수급 여부가 혜택에 영향)
     ⑤ 예산(직접 입력, 원)
     ⑥ 목표: 4분류(주거·생활·취창업·금융) 아코디언 → 세부 목표 다중 선택
     ⑦ 구체적 목표(직업·거주지·대출금액 등 자유 입력)
     ⑧ 우선순위(선택한 목표를 ↑↓ 버튼으로 정렬 — 드래그 전용 금지, WCAG 2.2)
3. AI 계획 추천  /diagnosis
     예상 총액 카드 + "AI가 세운 목표별 계획"(우선순위별 절차 N단계·매칭 정책 수)
     + 3분류 아코디언: 받을 수 있는 / 지금은 어려운(이유·근거) / 곧 가능해지는 지원
     → "목돈 계획 세우러 가기"
4. 계획      /plan       3단계 위저드: 총액 확인(수정 가능) → 목적별 배분(우선순위 반영, 4버킷)
                          → 완성(+매달 고정비 입력 → 예상 소진 시점) → "저장하고 시작하기"
5. 실행      /execute            대시보드: 계획 대비 사용률 + 계획선 대비 실제 지출 차트
                                 + 카테고리별 잔액/초과. → "지출 기록하기"
             /execute/record     카테고리 칩 · 금액 · 날짜 · 메모 → 저장
                                 (체크리스트 항목 완료 시 지출 입력 → 예산 계획과 대조·시각화)
```

### 우선순위 → 예산 배분

우선순위가 높은 목표부터 계획하고 예산 비율을 더 배분하는 것을 전제로 한다.
기본 버킷 비율(주거보증금 40 / 생활비 30 / 교육비 20 / 비상금 10)은 "자립준비청년 목돈사용 가이드" 근거,
우선순위에 따라 조정. 정책으로 받은 지원금은 예산에 **더하지 않는다**.

### 상태 관리

`src/features/diagnosis/model/store.ts` — `reactive` 싱글턴(Pinia 도입 전). 회원가입·진단 위저드 답을 담고
서버 전송 전까지 메모리 보관. 하드 리로드 시 초기화(SPA 내 이동은 유지).

### 미구현(후속)

정책 상세(SCR-DGN-10), 진단 이력(SCR-DGN-11), 중복수급 모달(SCR-DGN-09),
카테고리 상세(비상금 등)·월별 요약, 알림 목록, 마이페이지, 실제 API 연동, vue-router 가드/인증.

---

## 부록 A. Glassmorphism 스킨 (씨앗 · 화이트 + 연두)

> Figma `제안 · Glassmorphism` (file `dA4Z11FxLbcKG11iyDm7Os`, page `578:412`) 기준.
> "거의 평면" 기본 시각 언어 위에 얹는 **표면 처리 스킨**이다. 색·타이포·간격·모션 규칙은
> 위 본문 그대로 유지되고, 카드/헤더/탭바/입력의 표면만 프로스티드 유리로 바뀐다.

### A.1 왜 이 스킨이 §0(취약계층 우선)과 충돌하지 않는가

전통적 글래스모피즘의 약점은 **저대비**와 **저사양 기기 성능**이다. 이 스킨은:

- 배경 연두는 "있는듯 없는듯"으로만 둔다(`.app-glow`, radial-gradient 4개, 알파 0.10–0.14). 카드는 사실상 흰색 위 대비 환경.
- 본문 텍스트는 항상 **불투명 잉크색**(`--color-ink` / `--color-body`, 대비 4.5:1↑). 유리 위 텍스트에
  반투명색을 쓰지 않는다.
- 카드는 유리 **테두리(흰 1px)와 연두빛 소프트 섀도우**로 정의한다. 채움 투명도에 기대지 않는다.
- 경고 상태는 **앰버**(`.glass-amber` / `text-amber`), 빨강은 오류·삭제·로그아웃에만(§본문 규칙 유지).
- `backdrop-filter` 미지원 브라우저는 `@supports` 로 **거의 불투명 흰색**으로 폴백(대비 보존).

### A.2 토큰 (`src/styles/style.css` `:root`)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--glass-bg` | `rgb(255 255 255 / 0.62)` | 기본 유리 카드 |
| `--glass-bg-strong` | `rgb(255 255 255 / 0.8)` | 헤더·탭바·하단 CTA 바(가독성 우선) |
| `--glass-field-bg` | `rgb(255 255 255 / 0.55)` | 입력·칩·토글 |
| `--glass-tint-bg` | `color-mix(#2fa360 12% + 흰 72%)` | 연두 강조 카드(새 지원 매칭 등) |
| `--glass-amber-bg` | `color-mix(#b7791f 13% + 흰 72%)` | 주의 카드(위험 경고) |
| `--glass-border` | `rgb(255 255 255 / 0.85)` | 유리 테두리(흰 1px) |
| `--glass-blur` | `16px` | 기본 backdrop blur (strong = 22px, field = 10px) |
| `--shadow-glass` / `--shadow-glass-lg` | 연두빛 y10/y16 소프트 섀도우 | `shadow-glass` 유틸 |

### A.3 유틸리티 (`@utility`)

| 클래스 | 표면 |
|---|---|
| `glass` | 기본 프로스티드 카드 (bg 0.62 + blur 16 + 흰 테두리 + 연두 섀도우) |
| `glass-strong` | 더 불투명·더 강한 blur. 헤더·`FloatingNav`·위저드 하단 바 |
| `glass-tint` | 연두 강조 카드 |
| `glass-amber` | 주의 카드 (빨강 아님) |
| `glass-field` | 입력·칩·세그먼트 토글의 얇은 유리 |

`@supports not (backdrop-filter)` → 위 클래스들 배경을 `rgb(255 255 255 / 0.96)`(틴트는 `color-mix … + 흰색`)로 폴백.

### A.4 컴포넌트 매핑

- `AppHeader` · `FloatingNav` · `WizardChrome` 하단 바 · 페이지 sticky 푸터·헤더 → `glass-strong`
- `SustainMeter` · `MilestoneCard` · `PolicyCard` · `StatCard`(default) · 페이지 카드 → `glass`
- `StatCard`(primary) · 홈 "새 지원 매칭" · `MilestoneDetail` "왜 먼저" · 온보딩 일러스트 패널 → `glass-tint`
- `AlertCard`(tone="amber") · 자금계획 원칙 미충족 → `glass-amber`
- `UiField` input · `UiChip`(비선택) · `OptionRow`(비선택) · `ViewToggle` 트랙 · `ExpenseAdd` 세그먼트 → `glass-field`
- `UiButton` primary = 여전히 **불투명 그린 pill** + `shadow-glass` (대비·명확성 최우선). secondary = `glass-field` + 그린 테두리
- 앱 배경 = 흰색 + `.app-glow`(App.vue 고정 레이어, 알파 0.10–0.14 아주 옅게). 페이지 래퍼의 `bg-surface-subtle` → `bg-white` / `bg-transparent`. 유리는 배경 굴절이 아니라 테두리·섀도우로만 읽힘.
- `SustainMeter` 부족분 숫자·게이지 = 빨강 → **앰버**(오류 아님)

---

## 부록 B. 차트 키트 (`src/shared/ui/charts/`) — Bklit UI 시각 언어 이식

> [Bklit UI](https://bklit.com) (React·shadcn·visx 기반)를 **직접 쓰지 않고** 그 시각 언어만
> Vue + 디자인 토큰으로 재현. 의존성 0 (SVG·CSS만). `.claude/CLAUDE.md` §6 "shadcn 설치 금지",
> §0 "저불안·접근성 우선"을 지키기 위한 선택 — Bklit의 shimmer/sweep/멀티페이즈 로딩 연출은 채택하지 않음.

### 공통 규칙
- **라운드 캡** (막대·링 끝 둥글게), **gridless** (옅은 베이스라인만), **세로 그라디언트 채움** (색 → 14% 알파).
- 시리즈 색 = 목표 카테고리 토큰 재사용 (`--chart-c1..c5` = `--color-cat-*` + `--color-amber`).
- 트랙 = `--chart-track`. 그리드 = `--chart-grid`.
- 진입 모션: `--chart-enter-dur` (기본 420ms, `prefers-reduced-motion` → **0ms**), ease `cubic-bezier(.22,1,.36,1)`.
- 값이 바뀔 때(체크리스트 완료/취소 등)도 같은 `--chart-enter-dur`/ease 로 채움이 부드럽게 늘고 준다 (`ProgressMeter`).
- 접근성: 각 차트 `role="img"` + 의미 있는 한국어 `aria-label`(숫자에 항상 의미). 색만으로 정보 전달 안 함.

### 컴포넌트
| 컴포넌트 | 용도 | 적용처 |
|---|---|---|
| `BarChart` | 세로 막대 + 막대별 `plan` 틱(계획선) | 예산 대비(카테고리별 실제 vs 추천) |
| `StackedBar` | 1줄 누적 막대 (2px 세그먼트 간격) | 자금계획 목적별 배분 · AI 추천 배분 |
| `RingChart` | 도넛 (라운드 캡 세그먼트 + 트랙 + 중앙 슬롯 + 옅은 글로우) | AI 추천 배분 비율 |
| `ProgressMeter` | 선형 진행/예산 대비 (tone: primary·amber·danger, `over` 초과 표시) | 이번 달 지출 · 카테고리 예산 · 마일스톤 진척 |
| `ZoneMeter` | 구간별 색 게이지 + 현재 위치 마커 | `SustainMeter` (자립 지속 가능 N개월) |
| `SegmentBar` | N칸 이산 트래커 | 로드맵 진척 (2/9) |
| `ChartLegend` | 점 + 라벨 (+ 값) | 링·누적바 범례 |

배럴: `import { RingChart, StackedBar } from '@/shared/ui/charts'`
