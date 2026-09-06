<script setup lang="ts">
import { computed } from 'vue'
import { sum, srList } from './_util'
import ChartLegend from './ChartLegend.vue'

// Bklit 누적 막대 — 목적별 배분 1줄. 라운드 바깥 모서리 + 2px 세그먼트 간격.
const props = withDefaults(
  defineProps<{
    segments: { label: string; value: number; color: string; note?: string }[]
    height?: number
    legend?: boolean
    ariaLabel?: string
  }>(),
  { height: 14, legend: true },
)

const total = computed(() => sum(props.segments.map((s) => s.value)) || 1)
const parts = computed(() =>
  props.segments.map((s) => ({
    ...s,
    pct: Math.round((s.value / total.value) * 100),
  })),
)
const label = computed(
  () =>
    props.ariaLabel ??
    '목적별 배분: ' + srList(parts.value.map((p) => ({ label: p.label, text: `${p.pct}퍼센트` }))),
)
</script>

<template>
  <div>
    <div
      class="flex gap-[2px] overflow-hidden rounded-full bg-[var(--chart-track)]"
      :style="{ height: `${height}px` }"
      role="img"
      :aria-label="label"
    >
      <span
        v-for="p in parts"
        :key="p.label"
        class="h-full origin-left first:rounded-l-full last:rounded-r-full"
        :style="{
          width: `${p.pct}%`,
          background: p.color,
          animation: 'chart-fill-grow var(--chart-enter-dur) var(--chart-enter-ease) both',
        }"
      />
    </div>

    <ChartLegend
      v-if="legend"
      class="mt-3"
      :items="parts.map((p) => ({ label: p.label, color: p.color, value: p.note ?? `${p.pct}%` }))"
    />
  </div>
</template>
