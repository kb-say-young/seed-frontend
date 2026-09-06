<script setup lang="ts">
import { computed } from 'vue'
import { clamp } from './_util'

// Bklit 존 게이지 — 구간별 색(예: 부족·주의·여유) + 현재 위치 마커.
// SustainMeter("자립 지속 가능 N개월") 처럼 목표 대비 위험도를 한 줄로.
const props = withDefaults(
  defineProps<{
    value: number
    max: number
    /** upTo: 0~1 누적 경계. color: CSS 색. */
    zones: { upTo: number; color: string }[]
    height?: number
    ariaLabel?: string
  }>(),
  { height: 10 },
)

const markerPct = computed(() => clamp((props.value / (props.max || 1)) * 100, 0, 100))
const segs = computed(() => {
  let prev = 0
  return props.zones.map((z) => {
    const w = (z.upTo - prev) * 100
    prev = z.upTo
    return { w, color: z.color }
  })
})
</script>

<template>
  <div
    class="relative w-full"
    role="img"
    :aria-label="ariaLabel ?? `${value} / 목표 ${max}`"
  >
    <div class="flex overflow-hidden rounded-full" :style="{ height: `${height}px` }">
      <span
        v-for="(s, i) in segs"
        :key="i"
        class="h-full"
        :style="{ width: `${s.w}%`, background: s.color }"
      />
    </div>
    <span
      class="absolute top-1/2 size-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink shadow-[0_1px_4px_rgb(23_37_28/0.35)]"
      :style="{ left: `${markerPct}%` }"
      aria-hidden="true"
    />
  </div>
</template>
