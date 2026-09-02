<script setup lang="ts">
// Figma "자립 지속 가능 N개월" 카드. 목표(60개월) 대비 부족분을 위험 게이지로.
const props = withDefaults(
  defineProps<{ months: number; targetMonths?: number; note?: string }>(),
  { targetMonths: 60 },
)
const shortBy = props.targetMonths - props.months
const risky = shortBy > 0
</script>

<template>
  <section
    class="rounded-2xl border border-border bg-surface p-4"
    aria-labelledby="sustain-label"
  >
    <div class="flex items-end justify-between">
      <span id="sustain-label" class="text-body-sm text-muted">자립 지속 가능</span>
      <span
        class="tabular text-[1.75rem] font-extrabold leading-none"
        :class="risky ? 'text-danger' : 'text-ink'"
        >{{ props.months }}개월</span
      >
    </div>
    <div
      class="mt-3 flex h-2 overflow-hidden rounded-full"
      aria-hidden="true"
    >
      <span class="h-full" style="width: 22%; background: var(--color-danger)" />
      <span class="h-full" style="width: 20%; background: var(--color-amber)" />
      <span class="h-full flex-1" style="background: var(--color-primary)" />
    </div>
    <p class="mt-2 text-caption text-muted">
      목표: {{ props.targetMonths }}개월(자립수당 종료)까지 ·
      <template v-if="risky">현재 {{ shortBy }}개월 부족</template>
      <template v-else>여유 있음</template>
      <template v-if="props.note"> · {{ props.note }}</template>
    </p>
  </section>
</template>
