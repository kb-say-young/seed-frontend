<script setup lang="ts">
import { computed, useId } from 'vue'

// DESIGN.md §4 Input / Form — 라벨 항상 보이게(필드 위), 도움말·오류는 필드 아래
const props = withDefaults(
  defineProps<{
    label: string
    modelValue?: string
    placeholder?: string
    hint?: string
    error?: string
    required?: boolean
    type?: 'text' | 'password' | 'tel' | 'email'
    inputmode?: 'text' | 'numeric' | 'decimal'
    suffix?: string
  }>(),
  { type: 'text' },
)
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const uid = useId()
const describedby = computed(() =>
  [props.hint ? `${uid}-hint` : null, props.error ? `${uid}-error` : null]
    .filter(Boolean)
    .join(' ') || undefined,
)
</script>

<template>
  <div>
    <label :for="uid" class="mb-1.5 block text-label text-ink">
      {{ label }}<span v-if="required" class="text-danger" aria-hidden="true"> *</span>
      <span v-if="required" class="sr-only"> (필수)</span>
    </label>
    <div class="relative">
      <input
        :id="uid"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :inputmode="inputmode"
        :required="required"
        :aria-required="required ? 'true' : undefined"
        :aria-describedby="describedby"
        :aria-invalid="error ? 'true' : undefined"
        class="glass-field min-h-12 w-full rounded-md border-[1.5px] px-4 text-body text-ink placeholder:text-muted"
        :class="[
          error ? 'border-danger' : 'focus:border-primary',
          suffix ? 'pr-12' : '',
        ]"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <span
        v-if="suffix"
        class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-body text-muted"
        >{{ suffix }}</span
      >
    </div>
    <p v-if="hint && !error" :id="`${uid}-hint`" class="mt-1.5 text-body-sm text-muted">
      {{ hint }}
    </p>
    <p
      v-if="error"
      :id="`${uid}-error`"
      class="mt-1.5 flex items-center gap-1 text-body-sm text-danger"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 8v5M12 16.5h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      {{ error }}
    </p>
  </div>
</template>
