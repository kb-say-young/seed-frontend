<script setup lang="ts">
import { computed } from 'vue'

// 월별 누적 적립 추이 라인 차트 (Figma A2). 의존성 없이 인라인 SVG.
const props = withDefaults(
  defineProps<{ values: number[]; height?: number; ariaLabel?: string }>(),
  { height: 96 },
)

const W = 300 // viewBox 폭 (반응형: width 100%)
const PAD = 6

const pts = computed(() => {
  const v = props.values
  if (v.length < 2) return []
  const max = Math.max(...v, 1)
  const stepX = (W - PAD * 2) / (v.length - 1)
  const h = props.height - PAD * 2
  return v.map((n, i) => ({
    x: PAD + i * stepX,
    y: PAD + h - (n / max) * h,
  }))
})

const linePath = computed(() =>
  pts.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' '),
)
const areaPath = computed(() => {
  if (pts.value.length === 0) return ''
  const first = pts.value[0]
  const last = pts.value[pts.value.length - 1]
  return `M ${first.x} ${props.height - PAD} ${linePath.value.slice(2)} L ${last.x} ${props.height - PAD} Z`
})
</script>

<template>
  <svg
    :viewBox="`0 0 ${W} ${height}`"
    class="h-auto w-full"
    preserveAspectRatio="none"
    role="img"
    :aria-label="ariaLabel ?? '월별 누적 적립 추이'"
  >
    <defs>
      <linearGradient id="savings-area" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--color-primary-bright)" stop-opacity="0.28" />
        <stop offset="100%" stop-color="var(--color-primary-bright)" stop-opacity="0.02" />
      </linearGradient>
    </defs>
    <path :d="areaPath" fill="url(#savings-area)" />
    <path
      :d="linePath"
      fill="none"
      stroke="var(--color-primary-bright)"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      vector-effect="non-scaling-stroke"
    />
    <circle
      v-for="(p, i) in pts"
      :key="i"
      :cx="p.x"
      :cy="p.y"
      r="3"
      fill="#fff"
      stroke="var(--color-primary-bright)"
      stroke-width="2"
      vector-effect="non-scaling-stroke"
    />
  </svg>
</template>
