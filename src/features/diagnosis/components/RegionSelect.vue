<script setup lang="ts">
import { computed, useId } from 'vue'
import { sidoList, sigunguListOf, findRegion } from '@/features/diagnosis/model/regions'

// 시/도 → 시/군/구 캐스케이딩 선택. modelValue 는 항상 시/군/구 레벨 5자리 region_code.
// 시/도를 고르면 그 시/도의 첫 시/군/구로 자동 세팅해 "시/도까지만 선택된" 상태가 생기지 않게 한다
// (카테고리별_요청_API_계약서.md §3.1 — region_code 는 시/군/구 레벨만 허용).
const props = withDefaults(defineProps<{ label: string; modelValue: string; required?: boolean }>(), {
  required: false,
})
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const sidos = sidoList()
const uid = useId()

const currentSidoCode = computed(() => findRegion(props.modelValue)?.parent ?? '')
const sigungus = computed(() => (currentSidoCode.value ? sigunguListOf(currentSidoCode.value) : []))

function onSidoChange(e: Event) {
  const sidoCode = (e.target as HTMLSelectElement).value
  const first = sigunguListOf(sidoCode)[0]
  emit('update:modelValue', first ? first.code : '')
}
function onSigunguChange(e: Event) {
  emit('update:modelValue', (e.target as HTMLSelectElement).value)
}
</script>

<template>
  <div>
    <label :for="`${uid}-sido`" class="mb-1.5 block text-label text-ink">
      {{ label }}<span v-if="required" class="text-danger" aria-hidden="true"> *</span>
      <span v-if="required" class="sr-only"> (필수)</span>
    </label>
    <div class="flex gap-2">
      <select
        :id="`${uid}-sido`"
        class="glass-field tap-target min-w-0 flex-1 rounded-md border-[1.5px] px-3 text-body text-ink focus:border-primary"
        :value="currentSidoCode"
        @change="onSidoChange"
      >
        <option value="" disabled>시/도</option>
        <option v-for="s in sidos" :key="s.code" :value="s.code">{{ s.sido }}</option>
      </select>
      <select
        class="glass-field tap-target min-w-0 flex-1 rounded-md border-[1.5px] px-3 text-body text-ink focus:border-primary"
        :disabled="!currentSidoCode"
        :value="modelValue"
        aria-label="시/군/구"
        @change="onSigunguChange"
      >
        <option v-if="!currentSidoCode" value="" disabled>시/군/구</option>
        <option v-for="g in sigungus" :key="g.code" :value="g.code">{{ g.sigungu }}</option>
      </select>
    </div>
  </div>
</template>
