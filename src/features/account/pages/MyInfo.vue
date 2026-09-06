<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'
import FloatingNav from '@/shared/components/FloatingNav.vue'

const router = useRouter()
const menu = [
  { t: '입력한 조건 수정', to: '/me/edit' },
  { t: '목표·우선순위 수정', to: '/me/edit' },
  { t: '로드맵 다시 만들기', to: '/me/edit' },
  { t: '알림 설정', to: '/me' },
  { t: '자주 묻는 질문', to: '/me' },
]
</script>

<template>
  <div class="min-h-svh bg-transparent">
    <header class="px-5 pb-2 pt-6" style="padding-top: max(1.5rem, env(safe-area-inset-top))">
      <h1 class="text-h2 text-ink">내정보</h1>
    </header>

    <main id="main" class="px-5 pb-32 pt-3">
      <section class="flex items-center glass gap-3.5 rounded-2xl p-4">
        <span
          class="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-tint text-h3 font-bold text-primary-dark"
          >지</span
        >
        <span>
          <span class="block text-label font-bold text-ink">지현님</span>
          <span class="block text-caption text-muted">보호종료 2024.02 · 자립준비청년</span>
        </span>
      </section>

      <nav class="mt-2">
        <RouterLink
          v-for="m in menu"
          :key="m.t"
          :to="m.to"
          class="tap-target flex items-center justify-between border-b border-border py-4 text-body-sm text-ink no-underline"
        >
          {{ m.t }}
          <ChevronRight :size="16" class="text-text-muted" aria-hidden="true" />
        </RouterLink>
        <button
          type="button"
          class="tap-target w-full border-b border-border py-4 text-left text-body-sm font-medium text-danger"
          @click="router.push('/login')"
        >
          로그아웃
        </button>
      </nav>
    </main>
    <FloatingNav />
  </div>
</template>
