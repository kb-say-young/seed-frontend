<script setup lang="ts">
import { computed } from 'vue'
import { seriesColor, srList } from './_util'

// Bklit 세로 막대 — 세로 그라디언트 채움 · 라운드 상단 캡 · gridless(옅은 베이스라인만)
// · 막대별 "계획(plan)" 틱 마커 · 스태거드 grow 애니메이션(reduced-motion 시 정지).
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

const fmt = (n: number) => (props.format ? props.format(n) : n.toLocaleString('ko-KR'))
const maxV = computed(
  () => props.max ?? Math.max(1, ...props.data.flatMap((d) => [d.value, d.plan ?? 0])) * 1.15,
)
const bars = computed(() =>
  props.data.map((d, i) => ({
    ...d,
    color: d.color ?? seriesColor(i),
    h: (d.value / maxV.value) * 100,
    planH: d.plan != null ? (d.plan / maxV.value) * 100 : null,
  })),
)
const label = computed(
  () =>
    props.ariaLabel ??
    srList(bars.value.map((b) => ({ label: b.label, text: fmt(b.value) }))),
)
</script>

<template>
  <figure class="m-0" role="img" :aria-label="label">
    <div class="relative flex items-stretch gap-2.5" :style="{ height: `${height}px` }">
      <!-- 베이스라인 -->
      <span class="absolute inset-x-0 bottom-0 h-px bg-[var(--chart-grid)]" aria-hidden="true" />
      <div
        v-for="(b, i) in bars"
        :key="b.label"
        class="relative flex h-full min-w-0 flex-1 flex-col items-center justify-end"
      >
        <span
          v-if="showValues"
          class="tabular mb-1 text-caption font-semibold text-ink"
        >{{ fmt(b.value) }}</span>
        <div
          class="relative w-full max-w-[36px] origin-bottom overflow-visible rounded-t-md"
          :style="{
            height: `${b.h}%`,
            background: `linear-gradient(180deg, ${b.color} 0%, color-mix(in srgb, ${b.color} 14%, transparent) 100%)`,
            boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${b.color} 22%, transparent)`,
            animation: `chart-bar-grow var(--chart-enter-dur) var(--chart-enter-ease) both`,
            animationDelay: `${i * 45}ms`,
          }"
        >
          <!-- 계획(plan) 틱 -->
          <span
            v-if="b.planH != null"
            class="absolute inset-x-[-3px] h-[2px] rounded-full bg-ink/55"
            :style="{ bottom: `calc(${(b.planH / (b.h || 1)) * 100}% - 1px)` }"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
    <div class="mt-1.5 flex gap-2.5">
      <span
        v-for="b in bars"
        :key="b.label"
        class="min-w-0 flex-1 truncate text-center text-caption text-muted"
      >{{ b.label }}</span>
    </div>
    <figcaption v-if="caption" class="mt-1 text-caption text-muted">{{ caption }}</figcaption>
  </figure>
</template>
