<script setup lang="ts">
// 라우팅은 src/router. 레이아웃(위저드/하단내비)은 각 페이지가 소유.
// 화면 전환: 이동 방향(앞으로/뒤로)만 14px 슬라이드-인으로 힌트(enter만, opacity 없음).
// navDir 은 router 에서 계산. mode="out-in" 미사용 — 데드타임·스턱 방지.
import { navDir } from '@/router'
</script>

<template>
  <a
    href="#main"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary"
  >
    본문으로 건너뛰기
  </a>
  <div class="app-glow" aria-hidden="true" />
  <div class="app-container min-h-svh bg-transparent">
    <RouterView v-slot="{ Component, route }">
      <Transition :name="navDir === 'back' ? 'nav-back' : 'nav-fwd'">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </div>
</template>
