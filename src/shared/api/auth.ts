// 인증 API — 토큰 재발급·로그아웃. (재발급 자동 처리는 http.ts 내부, 이건 명시 호출용)
import { http } from '@/shared/api/http'
import { getRefreshToken, setTokens, clearTokens } from '@/shared/lib/auth'

export interface TokenResponse {
  accessToken: string
  refreshToken: string
}

export async function reissue(): Promise<void> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) throw new Error('refreshToken 없음')
  const data = await http.post<TokenResponse>('/api/auth/reissue', { refreshToken }, { auth: false })
  setTokens(data.accessToken, data.refreshToken)
}

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken()
  try {
    if (refreshToken) await http.post<void>('/api/auth/logout', { refreshToken })
  } finally {
    clearTokens()
  }
}
