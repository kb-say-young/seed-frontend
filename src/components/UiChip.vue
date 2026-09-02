<script setup lang="ts">
// DESIGN.md §4 Chip / Tag (선택형) — 토글: role=button + aria-pressed
const props = defineProps<{ label: string; selected?: boolean }>()
const emit = defineEmits<{ toggle: [] }>()
</script>

<template>
  <button
    type="button"
    :aria-pressed="props.selected ? 'true' : 'false'"
    class="inline-flex min-h-9 items-center rounded-full px-3 py-1.5 text-body-sm font-medium transition-colors"
    :class="
      props.selected
        ? 'bg-primary-tint text-primary-dark'
        : 'border border-border-strong bg-surface text-body hover:bg-surface-subtle'
    "
    @click="emit('toggle')"
  >
    {{ props.label }}
  </button>
</template>
