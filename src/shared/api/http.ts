// 백엔드 공통 응답 `{ success, code, message, data }` 를 다루는 fetch 래퍼.
// - 성공: data 를 반환
// - 실패(success:false 또는 비 2xx): ApiError(code, message, status) throw
// - 401: refreshToken 있으면 /api/auth/reissue 로 1회 재발급 후 원요청 1회 재시도.
//   재발급 실패 시 토큰 삭제 + /login 이동.

import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/shared/lib/auth'

// 비어 있으면 상대경로(/api/...) → 개발 서버 프록시(vite.config server.proxy)로 전달.
// 배포 시 VITE_API_BASE_URL 에 실제 API 오리진을 지정.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export class ApiError extends Error {
  readonly code: string
  readonly status: number

  constructor(code: string, message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

interface ApiEnvelope<T> {
  success: boolean
  code: string
  message: string
  data: T
}

export interface RequestOptions {
  /** JSON 본문 (객체를 그대로 넘기면 직렬화) */
  body?: unknown
  /** 인증 헤더 첨부 여부. 기본 true(토큰 있으면 첨부, 없으면 생략) */
  auth?: boolean
  /** 내부용 — 재발급 후 재시도 여부 (무한 루프 방지) */
  _retried?: boolean
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

async function toEnvelope<T>(res: Response): Promise<ApiEnvelope<T>> {
  const text = await res.text()
  if (!text) {
    // 204 등 본문 없음 — 상태코드로 성공 판단
    return { success: res.ok, code: String(res.status), message: '', data: undefined as T }
  }
  try {
    return JSON.parse(text) as ApiEnvelope<T>
  } catch {
    throw new ApiError('PARSE_ERROR', '응답을 해석할 수 없어요.', res.status)
  }
}

let reissuing: Promise<boolean> | null = null

async function reissueTokens(): Promise<boolean> {
  // 동시 401 이 여러 건이어도 재발급은 한 번만
  if (reissuing) return reissuing
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  reissuing = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/reissue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })
      const env = await toEnvelope<{ accessToken: string; refreshToken: string }>(res)
      if (!res.ok || !env.success || !env.data?.accessToken) return false
      setTokens(env.data.accessToken, env.data.refreshToken)
      return true
    } catch {
      return false
    } finally {
      reissuing = null
    }
  })()
  return reissuing
}

async function forceLogin() {
  clearTokens()
  const { router } = await import('@/router')
  if (router.currentRoute.value.path !== '/login') router.push('/login')
}

async function request<T>(method: Method, path: string, opts: RequestOptions = {}): Promise<T> {
  const { body, auth = true, _retried = false } = opts

  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = getAccessToken()
  if (auth && token) headers['Authorization'] = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('NETWORK_ERROR', '서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.', 0)
  }

  if (res.status === 401 && auth && !_retried && path !== '/api/auth/reissue') {
    const ok = await reissueTokens()
    if (ok) return request<T>(method, path, { ...opts, _retried: true })
    await forceLogin()
    throw new ApiError('UNAUTHORIZED', '로그인이 필요해요.', 401)
  }

  const env = await toEnvelope<T>(res)
  if (!res.ok || !env.success) {
    throw new ApiError(env.code || String(res.status), env.message || '요청을 처리하지 못했어요.', res.status)
  }
  return env.data
}

export const http = {
  get: <T>(path: string, opts?: RequestOptions) => request<T>('GET', path, opts),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>('POST', path, { ...opts, body }),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>('PUT', path, { ...opts, body }),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>('PATCH', path, { ...opts, body }),
  delete: <T>(path: string, opts?: RequestOptions) => request<T>('DELETE', path, opts),
}
