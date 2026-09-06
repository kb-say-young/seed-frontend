<script setup lang="ts">
// Figma 홈 하단 StatCard — 라벨 / 값 / 보조
defineProps<{ label: string; value: string; sub?: string; tone?: 'default' | 'primary' }>()
</script>

<template>
  <div
    class="rounded-2xl p-4"
    :class="tone === 'primary' ? 'glass-tint' : 'glass'"
  >
    <p class="text-caption text-muted">{{ label }}</p>
    <p class="tabular mt-1 text-h3 font-bold text-ink">{{ value }}</p>
    <p v-if="sub" class="mt-0.5 text-caption text-muted">{{ sub }}</p>
  </div>
</template>
