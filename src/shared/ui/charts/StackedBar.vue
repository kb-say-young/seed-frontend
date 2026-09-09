<script setup lang="ts">
import { computed } from 'vue'
import type { ApexOptions } from 'apexcharts'
import VueApexCharts from 'vue3-apexcharts/core'
import 'apexcharts/bar'
import { sum, srList } from './_util'
import ChartLegend from './ChartLegend.vue'

// ApexCharts 기반 누적 막대(1줄). sparkline 모드로 축·격자를 다 지우고 막대만 남긴다.
// ⚠️ ApexCharts 는 세그먼트마다 둥근 모서리를 넣어서, 맨 앞·맨 뒤만 둥글던 손그림
// 버전과 달리 세그먼트 전부가 살짝 둥글다 — 라이브러리 한계로 받아들인 절충.
const props = withDefaults(
  defineProps<{
    segments: { label: string; value: number; color: string; note?: string }[]
    height?: number
    legend?: boolean
    ariaLabel?: string
  }>(),
  { height: 14, legend: true },
)

const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

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

const series = computed(() => parts.value.map((p) => ({ name: p.label, data: [p.pct] })))
const colors = computed(() => parts.value.map((p) => p.color))

const options = computed<ApexOptions>(() => ({
  chart: {
    type: 'bar',
    stacked: true,
    background: 'transparent',
    sparkline: { enabled: true },
    animations: { enabled: !reduceMotion, speed: 260, easing: 'easeout' },
  },
  colors: colors.value,
  plotOptions: {
    bar: { horizontal: true, borderRadius: 6, borderRadiusApplication: 'around' },
  },
  stroke: { width: 2, colors: ['var(--color-bg)'] }, // 배경색 얇은 테두리로 세그먼트 간 틈을 흉내
  fill: { opacity: 1 },
  states: { hover: { filter: { type: 'darken' } } },
  legend: { show: false },
  tooltip: {
    theme: 'light',
    y: { formatter: (v: number, o) => parts.value[o?.seriesIndex ?? -1]?.note ?? `${v}%` },
  },
}))
</script>

<template>
  <div>
    <div :style="{ height: `${height}px` }" role="img" :aria-label="label">
      <VueApexCharts type="bar" :height="height" :options="options" :series="series" />
    </div>

    <ChartLegend
      v-if="legend"
      class="mt-3"
      :items="parts.map((p) => ({ label: p.label, color: p.color, value: p.note ?? `${p.pct}%` }))"
    />
  </div>
</template>
