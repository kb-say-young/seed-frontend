<script setup lang="ts">
// Bklit 범례: 점 + 라벨 (+ 옵션 값). 링/누적바와 함께 사용.
withDefaults(
  defineProps<{
    items: { label: string; color: string; value?: string }[]
    columns?: 1 | 2
  }>(),
  { columns: 1 },
)
</script>

<template>
  <ul
    class="grid gap-x-4 gap-y-2"
    :class="columns === 2 ? 'grid-cols-2' : 'grid-cols-1'"
  >
    <li v-for="it in items" :key="it.label" class="flex items-center gap-2 text-body-sm">
      <span
        class="size-2.5 shrink-0 rounded-full"
        :style="{ background: it.color }"
        aria-hidden="true"
      />
      <span class="min-w-0 flex-1 truncate text-ink">{{ it.label }}</span>
      <span v-if="it.value" class="tabular shrink-0 font-semibold text-ink">{{ it.value }}</span>
    </li>
  </ul>
</template>
