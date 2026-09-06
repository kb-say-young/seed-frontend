<script setup lang="ts">
// Bklit 이산 세그먼트 트래커 — 로드맵 진척(N칸 중 M칸 완료).
withDefaults(
  defineProps<{
    total: number
    done: number
    color?: string
    height?: number
    ariaLabel?: string
  }>(),
  { color: 'var(--color-primary-bright)', height: 8 },
)
</script>

<template>
  <div
    class="flex gap-1"
    role="img"
    :aria-label="ariaLabel ?? `전체 ${total}단계 중 ${done}단계 완료`"
  >
    <span
      v-for="i in total"
      :key="i"
      class="flex-1 rounded-full"
      :style="{
        height: `${height}px`,
        background: i <= done ? color : 'var(--chart-track)',
      }"
    />
  </div>
</template>
