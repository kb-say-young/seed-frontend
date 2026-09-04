<script setup lang="ts">
// 라우팅은 src/router. 레이아웃(위저드/하단내비)은 각 페이지가 소유.
// 화면 전환: 이동 방향(앞으로/뒤로)만 12px 슬라이드로 힌트. navDir 은 router 에서 계산.
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
      <Transition :name="navDir === 'back' ? 'nav-back' : 'nav-fwd'" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </div>
</template>
