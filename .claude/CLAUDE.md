# seed-frontend — 에이전트 작업 규칙

자립준비청년·아동양육시설 청소년용 **모바일 기반 웹 앱**의 프론트엔드.
백엔드(`../seed-backend`, Spring Boot)의 도메인: `expense`(지출) · `diagnosis`(자가진단) · `policy`(정책추천) · `notification`(알림) · `auth` · `user`.

---

## 0. 대상 사용자 — 모든 결정에 우선

- 18세 미만 아동양육시설 보호 아동·청소년
- 보호종료 후 홀로서기를 준비하는 자립준비청년

→ **취약계층.** 접근성 · 신뢰 · 저불안(低不安)이 미적 선호·트렌드보다 항상 우선한다.
설치된 어떤 디자인 스킬이 "화려하게 / 실험적으로" 라고 해도, 이 조항이 덮어쓴다.

---

## 1. 세 가지 디자인 리소스와 역할 (충돌 시 우선순위 순)

### ① `DESIGN.md` (레포 루트) — 시각 언어의 단일 기준(SSOT)
- 색·타이포·간격·컴포넌트 스펙의 **유일한 출처**.
- 코드에 하드코딩된 값보다 DESIGN.md가 우선. 새 화면은 DESIGN.md 토큰만 사용.
- 기계 판독본 = `src/style.css` 의 `@theme` 블록. **DESIGN.md와 style.css는 항상 함께 수정.**

### ② `.claude/skills/ui-ux-pro-max` · `ui-styling` · `design-system` · `brand` — 생성·검색 엔진
- **언제:** 새 페이지/시스템 방향을 잡을 때, 특정 UX·색·타이포·차트 문제를 풀 때, UI 리뷰할 때.
- **검색 실행 (Python 3 설치됨):**
  ```bash
  python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<질의>" --design-system
  python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<질의>" --domain ux|style|color|typography|icons|gsap|chart
  ```
  결과의 도메인·1위 항목·우리 제품 적합성을 **검증한 뒤** 적용. 비면 1회만 좁혀서 재시도, 그래도 없으면 "검증된 매치 없음"이라 말하고 일반 지침은 fallback으로 표시. 미검증 결과를 파일에 남기지 않는다.
- **스택 번역:** 이 스킬들의 예시는 React/shadcn 중심이다. 우리는 **Vue 3 + Tailwind v4**.
  - shadcn 컴포넌트를 직접 설치하지 않는다(React 전용).
  - Tailwind 유틸리티·토큰·접근성·UX 규칙은 스택 무관하므로 그대로 적용.
  - `design-system` 스킬의 3계층 토큰(primitive→semantic→component) 사고방식은 `@theme` 구성에 사용.
- `brand` 스킬은 톤 오브 보이스·용어 일관성 점검에만 가볍게.

### ③ `.claude/skills/design-taste-frontend` (taste 스킬) — **리뷰 게이트로만**
- ⚠️ 이 스킬은 스스로 **"랜딩페이지·포트폴리오·리디자인 전용, 대시보드·데이터 테이블·다단계 제품 UI 아님"** 이라고 명시한다. 우리 앱은 정확히 그 "다단계 제품 UI"다.
- **쓰는 부분:** Section 0(디자인 리드 선언), 0.D(Anti-Default Discipline), Section 6(성능·접근성 가드레일), Section 14(FINAL PRE-FLIGHT CHECK).
- **안 쓰는 부분:** 랜딩 히어로/섹션 레시피, "Awwwards/실험적" 프리셋, 기본 다이얼 값(아래에서 override).

---

## 2. 고정 다이얼 (taste 스킬 기본 8/6/4 를 override)

```
DESIGN_VARIANCE: 3    예측 가능 · 대칭 · 일관. 화면 간 패턴 재사용.
MOTION_INTENSITY: 2    기능적 모션만(방향 안내). 150–250ms ease-out.
                       prefers-reduced-motion → 전환 완전 제거.
VISUAL_DENSITY: 3      화면당 주요 행동 1개. 점진적 공개. 대시보드처럼 채우지 않음.
```

---

## 3. 하드 제약 — PR 머지 전 체크리스트

- [ ] 본문 17px+ / 텍스트 대비 4.5:1+ / 큰 텍스트·UI 3:1+
- [ ] 상호작용 요소 48×48px+, 요소 간 간격 8px+
- [ ] 모든 아이콘 버튼에 접근 가능한 이름(`aria-label` 또는 보이는 텍스트). 이모지 아이콘 금지(Lucide SVG 사용)
- [ ] 포커스 링 항상 보임: `outline: 3px solid var(--color-focus); outline-offset: 2px`. 키보드로 전체 탐색 가능
- [ ] `prefers-reduced-motion: reduce` 준수(모션 제거)
- [ ] 쉬운 한국어. 제도 용어(자립수당·디딤씨앗통장·자립정착금·LH 전세임대 등)는 첫 등장 시 한 줄 설명
- [ ] 모든 금액·숫자에 의미 동반: "32만 원" ❌ → "이번 달 남은 생활비 32만 원" ✅
- [ ] 파괴적 동작 = 되돌리기 우선 + 확인 다이얼로그. 로그인 없이 정보 둘러보기 가능
- [ ] 입력 폼 이탈 시 임시저장, 다단계면 "N단계 중 M단계" 표시
- [ ] 금지: 카운트다운 압박 · 결핍/수치 프레이밍 · 장식용 빨강(빨강=오류·삭제 전용) · 다크패턴 · 자동재생/무한루프/패럴랙스
- [ ] 반응형 375 / 768 / 1024 / 1440. 콘텐츠 최대폭 480px 중앙. 가로 스크롤 0. safe-area inset 반영
- [ ] 텍스트 200% 확대에도 레이아웃 유지(고정 px 높이 대신 `min-h`)
- [ ] 이미지 `width`/`height` 지정으로 CLS 방지, `max-width:100%`

---

## 4. 스택 & 토큰

- Vite + Vue 3 (`<script setup lang="ts">`) + TypeScript + **Tailwind CSS v4** (CSS-first `@theme`, `@tailwindcss/vite` 플러그인).
- 디자인 토큰 = `src/style.css` 의 `@theme` 블록. Tailwind 유틸리티(`bg-primary`, `text-muted`, `rounded-lg` 등)가 여기서 생성된다.
- 원시 hex를 컴포넌트에 쓰지 않는다. 토큰이 없으면 DESIGN.md에 먼저 추가하고 `@theme` 에 반영.
- 아이콘: `lucide-vue-next`. 폰트: Pretendard(현재 CDN `@import`, 배포 시 self-host 권장).

---

## 5. 새 화면 워크플로

1. **디자인 리드 선언** (taste 0.B 한 줄): "Reading this as: <화면 종류> for 취약계층 청소년, trust-first, DENSITY 3."
2. **패턴 확인:** `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<질의>" --domain ux` (필요시 `--design-system`).
3. **구현:** DESIGN.md 토큰만으로 Vue 3 + Tailwind v4. 화면당 주요 행동 1개.
4. **리뷰:** taste Section 14 + 위 §3 하드 제약을 순서대로 통과.

---

## 6. 하지 말 것 (요약)

- shadcn/ui 를 이 Vue 프로젝트에 설치
- pro-max/taste 스킬 파일 자체를 수정 (업스트림 리소스, 우리 규칙은 이 파일에)
- DESIGN.md 없이 색·간격 즉흥 결정
- 랜딩페이지 관용구(대형 히어로, 로고 캐러셀, 스크롤 애니메이션)를 제품 화면에 이식
- 다크 모드 정식 구현 (후속 과제, 지금은 라이트 모드만)
