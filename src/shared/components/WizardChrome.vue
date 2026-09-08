<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import UiButton from '@/shared/ui/UiButton.vue'

// 회원가입 화면과 동일한 골격: 인라인 제목 + 진행바 → 본문(slot) → 비고정 하단 CTA.
const props = withDefaults(
  defineProps<{
    title: string
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

const targetWidth = computed(() => `${Math.round((props.step / props.total) * 100)}%`)
const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const barWidth = ref(reduceMotion ? targetWidth.value : '0%')
onMounted(() => {
  if (reduceMotion) return
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      barWidth.value = targetWidth.value
    }),
  )
})
</script>

<template>
  <div class="flex min-h-svh flex-col bg-transparent px-6 pb-7 pt-14">
    <h1 class="text-h2 text-ink">{{ props.title }}</h1>
    <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-primary-tint" aria-hidden="true">
      <div
        class="bar-fill h-full rounded-full"
        :style="{
          width: barWidth,
          background:
            'linear-gradient(90deg, color-mix(in srgb, var(--color-primary-bright) 40%, white), var(--color-primary-bright))',
        }"
      />
    </div>
    <p class="sr-only">
      전체 {{ props.total }}단계 중 {{ props.step }}단계<span v-if="props.stepLabel"> · {{ props.stepLabel }}</span>
    </p>

    <main id="main" class="mt-8 flex flex-col gap-5">
      <slot />
    </main>

    <div class="flex-1" />

    <div class="flex flex-col items-center gap-3.5">
      <UiButton size="lg" block :disabled="!props.canNext" @click="emit('next')">
        {{ props.nextLabel }}
      </UiButton>
      <RouterLink
        v-if="props.backTo"
        :to="props.backTo"
        class="text-body-sm font-medium text-primary-dark"
      >
        이전 단계로
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
/* 진입 시 0 → 현재 단계 폭까지 한 번 채워지는 진행바. */
.bar-fill {
  transition: width 360ms var(--ease-out-soft, ease-out);
}
@media (prefers-reduced-motion: reduce) {
  .bar-fill {
    transition: none;
  }
}
</style>
