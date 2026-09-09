<script setup lang="ts">
// 같은 데이터를 다른 관점으로 보는 두 화면이 ViewToggle 로 서로를 오가는 공통 골격.
// (기록 ↔ 예산 대비, 자금계획 AI 추천 ↔ 목적별 배분) 헤더·토글·로딩/에러 처리를
// 한 곳에서 관리해, 화면 하나만 고치고 짝을 빠뜨리는 일(헤더 드리프트)을 막는다.
// 본문은 slot 으로 받는다 — 각 화면은 이 안에 자기 콘텐츠만 채운다.
import UiButton from '@/shared/ui/UiButton.vue'
import FloatingNav from '@/shared/components/FloatingNav.vue'
import ViewToggle from '@/shared/ui/ViewToggle.vue'

withDefaults(
  defineProps<{
    title: string
    options: { label: string; to: string }[]
    active: string
    loading: boolean
    /** 에러 배너를 보여줄지 — 보통 `!!error || !data` */
    showError: boolean
    /** 에러 배너 문구. 보통 `error ?? '기본 안내 문구'` */
    errorMessage: string
    /** 본문 섹션 간 간격. 기본 space-y-4 */
    spacing?: 'sm' | 'md'
  }>(),
  { spacing: 'md' },
)
const emit = defineEmits<{ reload: [] }>()
</script>

<template>
  <div class="min-h-svh bg-transparent px-6 pb-32 pt-14">
    <h1 class="text-h2 text-ink">{{ title }}</h1>
    <main id="main" class="mt-8" :class="spacing === 'sm' ? 'space-y-3' : 'space-y-4'">
      <ViewToggle :options="options" :active="active" />

      <slot name="intro" />

      <p v-if="loading" class="py-16 text-center text-body-sm text-muted">불러오는 중…</p>

      <div v-else-if="showError" class="py-16 text-center">
        <p class="text-body-sm text-muted">{{ errorMessage }}</p>
        <UiButton variant="secondary" class="mt-3" @click="emit('reload')">다시 시도</UiButton>
      </div>

      <template v-else>
        <slot />
      </template>
    </main>
    <FloatingNav />
  </div>
</template>
