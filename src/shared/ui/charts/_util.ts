// charts 공용 헬퍼 — 의존성 없이 (d3 미사용). Bklit UI 시각 언어를 Vue·토큰으로 이식.
export const clamp = (n: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, n))
export const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

/** 시리즈 색 토큰 순환 (--chart-c1..c5) */
export const seriesColor = (i: number) => `var(--chart-c${(i % 5) + 1})`

/** 화면에 안 보이지만 스크린리더가 읽는 데이터 목록 텍스트 */
export const srList = (rows: { label: string; text: string }[]) =>
  rows.map((r) => `${r.label}: ${r.text}`).join(', ')
