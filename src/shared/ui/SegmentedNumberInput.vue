<script setup lang="ts">
import { ref, watch } from 'vue'

// 생년월일·전화번호 등 "칸으로 나뉜" 숫자 입력. 각 칸은 inputmode=numeric 입력창이라
// 탭하면 기기 기본 숫자 키패드가 뜬다(커스텀 온스크린 키패드 아님).
// 칸이 다 채워지면 다음 칸으로 자동 이동, 빈 칸에서 Backspace 시 이전 칸으로 이동.
const props = withDefaults(
  defineProps<{
    label: string
    modelValue: string
    /** 칸별 자릿수. 예: [4,2,2] = 생년월일, [3,4,4] = 전화번호 */
    segments: number[]
    separator: string
    required?: boolean
    hint?: string
    /** 칸별 스크린리더 라벨. 생략 시 "n번째 칸" */
    segmentAriaLabels?: string[]
  }>(),
  { required: false },
)
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const parts = ref<string[]>(splitValue(props.modelValue))
const inputs = ref<(HTMLInputElement | null)[]>([])

function splitValue(v: string): string[] {
  const raw = v.split(props.separator)
  return props.segments.map((_, i) => raw[i] ?? '')
}

watch(
  () => props.modelValue,
  (v) => {
    if (v !== parts.value.join(props.separator)) parts.value = splitValue(v)
  },
)

function onInput(i: number, e: Event) {
  const el = e.target as HTMLInputElement
  const digits = el.value.replace(/\D/g, '').slice(0, props.segments[i])
  parts.value[i] = digits
  el.value = digits
  emit('update:modelValue', parts.value.join(props.separator))
  if (digits.length === props.segments[i] && i < props.segments.length - 1) {
    inputs.value[i + 1]?.focus()
  }
}

function onKeydown(i: number, e: KeyboardEvent) {
  if (e.key === 'Backspace' && parts.value[i] === '' && i > 0) {
    inputs.value[i - 1]?.focus()
  }
}

function onFocus(e: FocusEvent) {
  ;(e.target as HTMLInputElement).select()
}

const widthCh = (n: number) => `${n + 1.5}ch`
const ariaLabel = (i: number) => props.segmentAriaLabels?.[i] ?? `${props.label} ${i + 1}번째 칸`
</script>

<template>
  <fieldset class="min-w-0 border-0 p-0">
    <legend class="mb-1.5 block text-label text-ink">
      {{ label }}<span v-if="required" class="text-danger" aria-hidden="true"> *</span>
      <span v-if="required" class="sr-only"> (필수)</span>
    </legend>
    <div class="flex items-center gap-2">
      <template v-for="(len, i) in segments" :key="i">
        <input
          :ref="(el) => (inputs[i] = el as HTMLInputElement)"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          :maxlength="len"
          :value="parts[i]"
          :aria-label="ariaLabel(i)"
          class="glass-field tap-target min-h-12 rounded-md border-[1.5px] text-center text-body text-ink focus:border-primary"
          :style="{ width: widthCh(len) }"
          @input="onInput(i, $event)"
          @keydown="onKeydown(i, $event)"
          @focus="onFocus"
        />
        <span v-if="i < segments.length - 1" class="text-body text-muted" aria-hidden="true">{{
          separator
        }}</span>
      </template>
    </div>
    <p v-if="hint" class="mt-1.5 text-body-sm text-muted">{{ hint }}</p>
  </fieldset>
</template>
