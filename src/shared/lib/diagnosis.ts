// 현재 진단 세션의 diagnosisId 보관.
// intake 제출 응답(POST /api/users/me/intake)과 로드맵 조회 응답(GET /api/users/me/roadmap)이
// 모두 diagnosisId 를 주므로, 먼저 받은 쪽이 채워 두고 화면 간 이동·새로고침에도 유지한다.
// 추천(로드맵) 목록·상세 조회가 이 id 를 필요로 한다.

const KEY = 'seed.diagnosisId'

export function getDiagnosisId(): number | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw == null) return null
    const n = Number(raw)
    return Number.isFinite(n) ? n : null
  } catch {
    return null
  }
}

export function setDiagnosisId(id: number | null | undefined): void {
  try {
    if (id == null) localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, String(id))
  } catch {
    /* private mode 등 — 무시 */
  }
}

export function clearDiagnosisId(): void {
  setDiagnosisId(null)
}
