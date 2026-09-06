import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // 0.0.0.0 바인딩 — 같은 Wi-Fi의 폰 등 다른 기기에서 PC IP로 접속 가능하게.
    // 기본값(host 미지정)은 localhost 전용 바인딩이라 방화벽을 열어도 외부 접속이 안 된다.
    host: true,
    // 로컬 백엔드(seed-backend, 기본 8080)로 /api 요청을 프록시.
    // 브라우저는 항상 프론트 origin(5173)에만 요청하므로 CORS 설정 없이도 동작 —
    // seed-backend SecurityConfig 에 CORS 설정이 아직 없어 이 방식이 가장 간단하다.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
