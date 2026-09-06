<script setup lang="ts">
import { ref, computed, watch, useId } from 'vue'

// 전화번호 [___]-[____]-[____] 3칸 입력.
// 각 칸을 누르면 숫자 키패드가 뜨고(inputmode=numeric), 칸이 다 차면 다음 칸으로 자동 이동.
// 각 칸을 눌러 그 부분만 수정 가능. v-model 값은 "010-1234-5678" 형식(부분 입력 허용).
const props = defineProps<{ modelValue: string; label: string; required?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const LENS = [3, 4, 4] as const
const uid = useId()
const parts = ref<[string, string, string]>(['010', '', ''])
const els = ref<(HTMLInputElement | null)[]>([null, null, null])

// 외부 값 → 3칸 동기화
watch(
  () => props.modelValue,
  (v) => {
    const d = (v || '').replace(/\D/g, '')
    const next: [string, string, string] = [
      d.slice(0, 3) || (d ? '' : '010'),
      d.slice(3, 7),
      d.slice(7, 11),
    ]
    if (next.join('-') !== parts.value.join('-')) parts.value = next
  },
  { immediate: true },
)

const joined = computed(() => parts.value.filter((_, i) => i === 0 || parts.value[i - 1]).join('-'))

function emitUp() {
  emit('update:modelValue', parts.value.join('-').replace(/-+$/, ''))
}

function onInput(i: number, e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, LENS[i])
  parts.value[i] = raw
  emitUp()
  // 칸이 다 차면 다음 칸으로
  if (raw.length === LENS[i] && i < 2) els.value[i + 1]?.focus()
}
function onKeydown(i: number, e: KeyboardEvent) {
  if (e.key === 'Backspace' && parts.value[i] === '' && i > 0) {
    e.preventDefault()
    const prev = els.value[i - 1]
    prev?.focus()
    // 이전 칸 끝으로 커서
    requestAnimationFrame(() => prev?.setSelectionRange(prev.value.length, prev.value.length))
  }
}

defineExpose({ joined })
</script>

<template>
  <div>
    <label :for="`${uid}-0`" class="mb-1.5 block text-label text-ink">
      {{ label }}<span v-if="required" class="text-danger" aria-hidden="true"> *</span>
      <span v-if="required" class="sr-only"> (필수)</span>
    </label>
    <div class="flex items-center gap-2">
      <template v-for="(len, i) in LENS" :key="i">
        <span v-if="i > 0" class="text-body text-muted" aria-hidden="true">-</span>
        <input
          :id="`${uid}-${i}`"
          :ref="(el) => (els[i] = el as HTMLInputElement)"
          :value="parts[i]"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          :maxlength="len"
          :aria-label="`${label} ${i + 1}번째 칸 (${len}자리)`"
          class="glass-field min-h-12 w-full rounded-md border-[1.5px] text-center text-body font-semibold tracking-wide text-ink focus:border-primary"
          :class="i === 0 ? 'basis-[22%]' : 'basis-[34%]'"
          @input="onInput(i, $event)"
          @keydown="onKeydown(i, $event)"
          @focus="($event.target as HTMLInputElement).select()"
        />
      </template>
    </div>
  </div>
</template>
