<script setup lang="ts">
// 라우팅은 src/router.ts. 레이아웃(위저드/하단내비)은 각 페이지가 소유.
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
    <RouterView />
  </div>
</template>
