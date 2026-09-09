<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'
import FloatingNav from '@/shared/components/FloatingNav.vue'
import { authApi } from '@/shared/api'
import { me, loadMe, resetMe, ymShort } from '@/shared/lib/me'

const router = useRouter()

onMounted(() => {
  void loadMe()
})

const displayName = computed(() => me.data?.name?.trim() || '회원')
const initial = computed(() => displayName.value.charAt(0))
const subtitle = computed(() => {
  if (me.loading) return '불러오는 중…'
  const p = me.data?.profile
  if (!p) return '진단 정보 입력 전'
  const ym = ymShort(p.protectionEndDate)
  const type = p.isYouthSupport ? '자립준비청년' : '보호 종료 예정'
  return ym ? `보호종료 ${ym} · ${type}` : type
})

// 이동 가능한 메뉴
const menu = [
  { t: '조건 수정', to: '/me/edit' },
  { t: '목표 수정', to: '/me/edit' },
  { t: '진단 다시하기', to: '/intake' },
]
// 화면 준비 중 (이동 안 함)
const upcoming = ['알림 설정', '자주 묻는 질문']

async function logout() {
  try {
    await authApi.logout()
  } finally {
    resetMe()
    router.push('/login')
  }
}
</script>

<template>
  <div class="min-h-svh bg-transparent px-6 pb-32 pt-14">
    <h1 class="text-h2 text-ink">내정보</h1>

    <main id="main" class="mt-8">
      <section class="flex items-center glass gap-3.5 rounded-2xl p-4">
        <span
          class="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-tint text-h3 font-bold text-primary-dark"
          >{{ initial }}</span
        >
        <span>
          <span class="block text-label font-bold text-ink">{{ displayName }}님</span>
          <span class="block text-caption text-muted">{{ subtitle }}</span>
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

        <div
          v-for="t in upcoming"
          :key="t"
          class="flex items-center justify-between border-b border-border py-4 text-body-sm text-ink"
        >
          {{ t }}
        </div>

        <button
          type="button"
          class="tap-target w-full border-b border-border py-4 text-left text-body-sm font-medium text-danger"
          @click="logout"
        >
          로그아웃
        </button>
      </nav>
    </main>
    <FloatingNav />
  </div>
</template>
