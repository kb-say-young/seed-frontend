<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import UiButton from '@/shared/ui/UiButton.vue'

// Figma N1~N4 / 회원가입 공통 골격:
// AppHeader(‹ + 제목) → 안내문 → "N단계 / M · 라벨" + 진행바 → 본문(slot) → 하단 고정 CTA
const props = withDefaults(
  defineProps<{
    title: string
    intro?: string
    step: number
    total: number
    stepLabel?: string
    nextLabel?: string
    canNext?: boolean
    backTo?: string
  }>(),
  { nextLabel: '다음', canNext: true },
)
const emit = defineEmits<{ next: [] }>()
</script>

<template>
  <div class="flex min-h-svh flex-col bg-transparent">
    <AppHeader :title="props.title" :to="props.backTo" />

    <main id="main" class="flex flex-1 flex-col gap-5 px-5 pt-2">
      <p v-if="props.intro" class="text-body-sm text-muted">{{ props.intro }}</p>

      <div>
        <p class="text-caption font-bold text-primary-dark">
          {{ props.step }}단계 / {{ props.total }}
          <span v-if="props.stepLabel"> · {{ props.stepLabel }}</span>
        </p>
        <p class="sr-only">전체 {{ props.total }}단계 중 {{ props.step }}단계</p>
        <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-primary-tint" aria-hidden="true">
          <div
            class="h-full rounded-full bg-primary-bright transition-all"
            :style="{ width: `${Math.round((props.step / props.total) * 100)}%` }"
          />
        </div>
      </div>

      <slot />
    </main>

    <div
      class="glass-strong sticky bottom-0 border-x-0 border-b-0 px-5 pb-7 pt-3"
      style="padding-bottom: max(1.75rem, env(safe-area-inset-bottom))"
    >
      <UiButton size="lg" block :disabled="!props.canNext" @click="emit('next')">
        {{ props.nextLabel }}
      </UiButton>
    </div>
  </div>
</template>
