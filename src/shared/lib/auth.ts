// 인증 토큰 보관 — localStorage. 서버 연동 전까지의 유일한 세션 저장소.
// 로그인 없이 둘러보기가 가능한 앱이므로(§CLAUDE.md), 토큰 없음 = 비로그인 상태로 취급.

const ACCESS_KEY = 'seed.accessToken'
const REFRESH_KEY = 'seed.refreshToken'

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
function write(key: string, value: string | null) {
  try {
    if (value == null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    /* private mode 등 — 무시 */
  }
}

export function getAccessToken(): string | null {
  return read(ACCESS_KEY)
}
export function getRefreshToken(): string | null {
  return read(REFRESH_KEY)
}
export function setTokens(accessToken: string, refreshToken: string) {
  write(ACCESS_KEY, accessToken)
  write(REFRESH_KEY, refreshToken)
}
export function clearTokens() {
  write(ACCESS_KEY, null)
  write(REFRESH_KEY, null)
}
export function isLoggedIn(): boolean {
  return getAccessToken() != null
}
