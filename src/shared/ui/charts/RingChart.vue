<script setup lang="ts">
import { computed } from 'vue'
import { sum, srList } from './_util'

// Bklit 링/도넛 — 라운드 캡 세그먼트 + 배경 트랙 + 중앙 슬롯 + 아주 옅은 글로우.
const props = withDefaults(
  defineProps<{
    segments: { label: string; value: number; color: string }[]
    size?: number
    thickness?: number
    /** 세그먼트 사이 간격(px, 원주 기준) */
    gap?: number
    glow?: boolean
    ariaLabel?: string
  }>(),
  { size: 168, thickness: 14, gap: 4, glow: true },
)

const r = computed(() => (props.size - props.thickness) / 2)
const c = computed(() => 2 * Math.PI * r.value)
const total = computed(() => sum(props.segments.map((s) => s.value)) || 1)

const arcs = computed(() => {
  let acc = 0
  return props.segments.map((s) => {
    const frac = s.value / total.value
    const len = Math.max(0, frac * c.value - props.gap)
    const startOffset = -acc * c.value
    acc += frac
    return {
      ...s,
      pct: Math.round(frac * 100),
      dash: `${len} ${c.value - len}`,
      // enter: dashoffset (startOffset + len) → startOffset
      offEnd: startOffset,
      offStart: startOffset + len,
    }
  })
})

const label = computed(
  () =>
    props.ariaLabel ??
    '비율: ' + srList(arcs.value.map((a) => ({ label: a.label, text: `${a.pct}퍼센트` }))),
)
</script>

<template>
  <div
    class="relative grid place-items-center"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      role="img"
      :aria-label="label"
    >
      <g :transform="`rotate(-90 ${size / 2} ${size / 2})`">
        <circle
          :cx="size / 2"
          :cy="size / 2"
          :r="r"
          fill="none"
          :stroke-width="thickness"
          stroke="var(--chart-track)"
        />
        <circle
          v-for="a in arcs"
          :key="a.label"
          :cx="size / 2"
          :cy="size / 2"
          :r="r"
          fill="none"
          :stroke="a.color"
          :stroke-width="thickness"
          stroke-linecap="round"
          :stroke-dasharray="a.dash"
          :style="{
            '--arc-len': `${a.offStart}px`,
            '--arc-off': `${a.offEnd}px`,
            strokeDashoffset: `${a.offEnd}px`,
            animation: 'chart-arc-sweep var(--chart-enter-dur) var(--chart-enter-ease) both',
            filter: glow ? `drop-shadow(0 0 5px color-mix(in srgb, ${a.color} 35%, transparent))` : 'none',
          }"
        />
      </g>
    </svg>
    <div class="absolute inset-0 grid place-items-center text-center">
      <slot />
    </div>
  </div>
</template>
