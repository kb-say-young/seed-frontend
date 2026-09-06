<script setup lang="ts">
import { ZoneMeter } from '@/shared/ui/charts'

// Figma "자립 지속 가능 N개월" 카드. 목표(60개월) 대비 부족분을 위험 게이지로.
const props = withDefaults(
  defineProps<{ months: number; targetMonths?: number; note?: string }>(),
  { targetMonths: 60 },
)
const shortBy = props.targetMonths - props.months
const risky = shortBy > 0

// 존: ~22% 부족(앰버) · ~42% 주의(옅은 앰버) · 이후 여유(그린)
const zones = [
  { upTo: 0.22, color: '#e7b15a' },
  { upTo: 0.42, color: '#f0d08c' },
  { upTo: 1, color: 'var(--color-primary-bright)' },
]
</script>

<template>
  <section
    class="glass rounded-2xl p-4"
    aria-labelledby="sustain-label"
  >
    <div class="flex items-end justify-between">
      <span id="sustain-label" class="text-body-sm text-muted">자립 지속 가능</span>
      <span
        class="tabular text-[1.75rem] font-extrabold leading-none"
        :class="risky ? 'text-amber' : 'text-ink'"
        >{{ props.months }}개월</span
      >
    </div>
    <ZoneMeter
      class="mt-3"
      :value="props.months"
      :max="props.targetMonths"
      :zones="zones"
      :aria-label="`자립 지속 가능 ${props.months}개월 · 목표 ${props.targetMonths}개월`"
    />
    <p class="mt-2 text-caption text-muted">
      목표: {{ props.targetMonths }}개월(자립수당 종료)까지 ·
      <template v-if="risky">현재 {{ shortBy }}개월 부족</template>
      <template v-else>여유 있음</template>
      <template v-if="props.note"> · {{ props.note }}</template>
    </p>
  </section>
</template>
