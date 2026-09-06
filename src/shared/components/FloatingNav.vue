<script setup lang="ts">
import { useRoute } from 'vue-router'
import { House, Sprout, Wallet, ReceiptText, User } from 'lucide-vue-next'

// Figma: 하단 탭바 — 라운드 pill + 그림자로 플로팅. 5탭. 활성 탭은 아이콘 뒤 tint 알약.
const items = [
  { to: '/home', label: '홈', icon: House },
  { to: '/roadmap', label: '로드맵', icon: Sprout },
  { to: '/fund', label: '자금', icon: Wallet },
  { to: '/tracking', label: '기록', icon: ReceiptText },
  { to: '/me', label: '내정보', icon: User },
]

const route = useRoute()
function isOn(to: string) {
  if (to === '/home') return route.path === '/home'
  return route.path === to || route.path.startsWith(to + '/')
}
</script>

<template>
  <nav
    aria-label="주요 메뉴"
    class="fixed inset-x-0 bottom-0 z-20 px-4"
    style="padding-bottom: max(1rem, env(safe-area-inset-bottom))"
  >
    <ul
      class="glass-strong app-container mx-auto flex rounded-full px-1 py-1.5 shadow-[0_16px_38px_-10px_rgb(31_91_58/0.28),0_3px_10px_rgb(31_91_58/0.1)]"
    >
      <li v-for="item in items" :key="item.to" class="flex-1">
        <RouterLink
          :to="item.to"
          class="tap-target flex w-full flex-col items-center gap-0.5 rounded-full py-1 text-caption font-medium no-underline transition-colors"
          :class="isOn(item.to) ? 'text-primary-dark' : 'text-muted'"
          :aria-current="isOn(item.to) ? 'page' : undefined"
        >
          <span
            class="flex items-center justify-center rounded-full px-4 py-0.5 transition-colors"
            :class="isOn(item.to) ? 'bg-primary-tint' : ''"
          >
            <component :is="item.icon" :size="22" :stroke-width="2" aria-hidden="true" />
          </span>
          {{ item.label }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
