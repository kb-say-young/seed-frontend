<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { SIDO, SIGUNGU, findRegion } from '@/shared/lib/regions'

// 시/도 → 시/군/구 2단 선택. v-model 값은 항상 시군구 코드(5자리) — 서버엔 이 값을 넘긴다.
// 취약계층 대상 앱: 커스텀 드롭다운 대신 네이티브 <select>(모바일 기본 피커·접근성) 사용.
const props = defineProps<{
  modelValue: string
  label: string
  required?: boolean
  hint?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [code: string] }>()

const sidoCode = ref('')
const sigunguCode = ref('')

// 외부 값 → 내부 두 select 동기화 (초기값·복원)
watch(
  () => props.modelValue,
  (code) => {
    if (code === sigunguCode.value) return
    const r = code ? findRegion(code) : null
    sidoCode.value = r?.sidoCode ?? ''
    sigunguCode.value = r?.sigunguCode ?? ''
  },
  { immediate: true },
)

const sigunguList = computed(() => (sidoCode.value ? (SIGUNGU[sidoCode.value] ?? []) : []))

function onSido(e: Event) {
  sidoCode.value = (e.target as HTMLSelectElement).value
  sigunguCode.value = ''
  emit('update:modelValue', '')
}
function onSigungu(e: Event) {
  sigunguCode.value = (e.target as HTMLSelectElement).value
  emit('update:modelValue', sigunguCode.value)
}

const selectCls =
  'glass-field min-h-12 w-full rounded-md border-[1.5px] px-4 text-body text-ink focus:border-primary disabled:text-muted'
</script>

<template>
  <fieldset>
    <legend class="mb-1.5 text-label text-ink">
      {{ label }}<span v-if="required" class="text-danger" aria-hidden="true"> *</span>
      <span v-if="required" class="sr-only"> (필수)</span>
    </legend>
    <div class="grid grid-cols-2 gap-2">
      <select
        :value="sidoCode"
        :aria-label="`${label} 시/도`"
        :class="selectCls"
        @change="onSido"
      >
        <option value="" disabled>시/도</option>
        <option v-for="s in SIDO" :key="s.code" :value="s.code">{{ s.name }}</option>
      </select>
      <select
        :value="sigunguCode"
        :aria-label="`${label} 시/군/구`"
        :class="selectCls"
        :disabled="!sidoCode"
        @change="onSigungu"
      >
        <option value="" disabled>{{ sidoCode ? '시/군/구' : '시/도 먼저' }}</option>
        <option v-for="g in sigunguList" :key="g.code" :value="g.code">{{ g.name }}</option>
      </select>
    </div>
    <p v-if="hint" class="mt-1.5 text-body-sm text-muted">{{ hint }}</p>
  </fieldset>
</template>
