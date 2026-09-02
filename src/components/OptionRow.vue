<script setup lang="ts">
import { Check } from 'lucide-vue-next'

// Figma 진단입력 ③④ 선택 행. 단일선택=radio, 다중선택=checkbox 시맨틱.
const props = withDefaults(
  defineProps<{
    label: string
    sublabel?: string
    selected?: boolean
    multi?: boolean
    name?: string
  }>(),
  { multi: false },
)
const emit = defineEmits<{ toggle: [] }>()
</script>

<template>
  <button
    type="button"
    :role="props.multi ? 'checkbox' : 'radio'"
    :aria-checked="props.selected ? 'true' : 'false'"
    class="flex w-full items-center justify-between gap-3 rounded-md px-4 py-3.5 text-left transition-colors"
    :class="
      props.selected
        ? 'border-[1.5px] border-primary bg-primary-tint'
        : 'border border-border bg-surface hover:bg-surface-subtle'
    "
    @click="emit('toggle')"
  >
    <span class="min-w-0">
      <span
        class="block text-body-sm"
        :class="props.selected ? 'font-bold text-primary-dark' : 'text-ink'"
        >{{ props.label }}</span
      >
      <span v-if="props.sublabel" class="mt-0.5 block text-caption text-muted">{{
        props.sublabel
      }}</span>
    </span>
    <Check
      v-if="props.selected"
      :size="18"
      class="shrink-0 text-primary-dark"
      aria-hidden="true"
    />
  </button>
</template>
