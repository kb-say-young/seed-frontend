/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 백엔드 API base URL. 예) http://localhost:8080 */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
