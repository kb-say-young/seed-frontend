<script setup lang="ts">
import { computed } from 'vue'
import { clamp } from './_util'

// Bklit 선형 미터 — 트랙 + 채움(라운드 캡). 단일 값 진행/예산 대비.
const props = withDefaults(
  defineProps<{
    value: number
    max?: number
    /** 채움 색: 토큰명 없이 CSS 색. auto 면 tone 규칙 적용 */
    tone?: 'primary' | 'amber' | 'danger'
    color?: string
    height?: number
    /** 100% 초과분을 트랙 위 앰버/레드로 표시 */
    over?: boolean
    ariaLabel?: string
  }>(),
  { max: 100, tone: 'primary', height: 8 },
)

const pct = computed(() => (props.value / (props.max || 1)) * 100)
const fillPct = computed(() => clamp(pct.value, 0, 100))
const toneColor = { primary: 'var(--color-primary)', amber: 'var(--color-amber)', danger: 'var(--color-danger)' }
const fillColor = computed(() => props.color ?? toneColor[props.tone])
const label = computed(
  () => props.ariaLabel ?? `${Math.round(pct.value)}퍼센트`,
)
</script>

<template>
  <div
    class="w-full overflow-hidden rounded-full bg-[var(--chart-track)]"
    :style="{ height: `${height}px` }"
    role="img"
    :aria-label="label"
  >
    <div
      class="h-full origin-left rounded-full"
      :style="{
        width: `${fillPct}%`,
        background: over && pct > 100 ? 'var(--color-danger)' : fillColor,
        animation: 'chart-fill-grow var(--chart-enter-dur) var(--chart-enter-ease) both',
      }"
    />
  </div>
</template>
