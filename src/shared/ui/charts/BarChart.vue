<script setup lang="ts">
import { computed } from 'vue'
import type { ApexOptions } from 'apexcharts'
import VueApexCharts from 'vue3-apexcharts/core'
import 'apexcharts/bar'
import { seriesColor, srList } from './_util'

// ApexCharts 기반 세로 막대. 겉모습 규칙(둥근 캡·세로 그라디언트·gridless·계획 마커·
// reduced-motion 시 무모션)은 유지하고, 렌더링·애니메이션·툴팁만 라이브러리에 맡긴다.
// prop 구성은 손그림 버전과 동일 — 쓰는 화면(TrackingBudget 등)은 그대로 둔다.
const props = withDefaults(
  defineProps<{
    data: { label: string; value: number; plan?: number; color?: string }[]
    max?: number
    height?: number
    /** 막대 위에 값 표시 */
    showValues?: boolean
    format?: (n: number) => string
    ariaLabel?: string
    caption?: string
  }>(),
  { height: 128, showValues: false },
)

const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const fmt = (n: number) => (props.format ? props.format(n) : n.toLocaleString('ko-KR'))
const maxV = computed(
  () => props.max ?? Math.max(1, ...props.data.flatMap((d) => [d.value, d.plan ?? 0])) * 1.15,
)
const colors = computed(() => props.data.map((d, i) => d.color ?? seriesColor(i)))
const label = computed(
  () =>
    props.ariaLabel ??
    srList(props.data.map((d) => ({ label: d.label, text: fmt(d.value) }))),
)

const series = computed(() => [{ name: '실제', data: props.data.map((d) => d.value) }])

// 계획(plan) 값을 막대 위 짧은 마커로 — annotations.points 는 category 축에서
// x 를 라벨 문자열로 받는다.
const planAnnotations = computed(() =>
  props.data
    .filter((d) => d.plan != null)
    .map((d) => ({
      x: d.label,
      y: d.plan,
      marker: {
        size: 5,
        shape: 'square' as const,
        strokeWidth: 0,
        fillColor: 'var(--color-ink)',
      },
    })),
)

const options = computed<ApexOptions>(() => ({
  chart: {
    type: 'bar',
    background: 'transparent',
    toolbar: { show: false },
    zoom: { enabled: false },
    dropShadow: { enabled: false },
    animations: {
      enabled: !reduceMotion,
      speed: 260,
      easing: 'easeout',
    },
    fontFamily: 'Pretendard, -apple-system, sans-serif',
  },
  colors: colors.value,
  plotOptions: {
    bar: {
      borderRadius: 6,
      borderRadiusApplication: 'end',
      distributed: true,
      columnWidth: '55%',
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      shadeIntensity: 0,
      opacityFrom: 1,
      opacityTo: 0.14,
      stops: [0, 100],
    },
  },
  stroke: { width: 0 },
  grid: { show: false, padding: { left: 0, right: 0 } },
  legend: { show: false },
  dataLabels: {
    enabled: props.showValues,
    formatter: (v: number) => fmt(v),
    offsetY: -6,
    style: { fontSize: '13px', fontWeight: 600, colors: ['var(--color-ink)'] },
    background: { enabled: false },
  },
  xaxis: {
    categories: props.data.map((d) => d.label),
    axisBorder: { show: true, color: 'var(--chart-grid)' },
    axisTicks: { show: false },
    labels: { style: { colors: 'var(--color-muted)', fontSize: '13px' } },
  },
  yaxis: { max: maxV.value, min: 0, show: false },
  annotations: { points: planAnnotations.value },
  tooltip: {
    theme: 'light',
    y: { formatter: (v: number) => fmt(v) },
  },
}))
</script>

<template>
  <figure class="m-0" role="img" :aria-label="label">
    <div aria-hidden="true">
      <VueApexCharts type="bar" :height="height" :options="options" :series="series" />
    </div>
    <figcaption v-if="caption" class="mt-1 text-caption text-muted">{{ caption }}</figcaption>
  </figure>
</template>
