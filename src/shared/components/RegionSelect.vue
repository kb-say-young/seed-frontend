<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { regionApi } from '@/shared/api'
import type { Sido, Sigungu } from '@/shared/api/region'

// 시/도 → 시/군/구 2단 선택. v-model 값은 항상 시군구 코드(5자리) — 서버엔 이 값을 넘긴다.
// 데이터는 백엔드 지역 API. 취약계층 대상 앱: 네이티브 <select>(모바일 기본 피커·접근성).
const props = defineProps<{
  modelValue: string
  label: string
  required?: boolean
  hint?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [code: string] }>()

const sidos = ref<Sido[]>([])
const sigungus = ref<Sigungu[]>([])
const sidoCode = ref('')
const sigunguCode = ref('')
const loadingSidos = ref(false)
const loadingSigungus = ref(false)
const errorMsg = ref('')

// 시군구 코드 → 상위 시도 코드 (코드 체계상 앞 2자리 + '000')
const sidoCodeOf = (sgg: string) => (sgg.length === 5 ? sgg.slice(0, 2) + '000' : '')

async function loadSidos() {
  loadingSidos.value = true
  errorMsg.value = ''
  try {
    sidos.value = await regionApi.getSidos()
    await restoreFromModel()
  } catch {
    errorMsg.value = '지역 목록을 불러오지 못했어요.'
  } finally {
    loadingSidos.value = false
  }
}

async function loadSigungus(code: string) {
  if (!code) {
    sigungus.value = []
    return
  }
  loadingSigungus.value = true
  try {
    sigungus.value = await regionApi.getSigungus(code)
  } catch {
    errorMsg.value = '시/군/구 목록을 불러오지 못했어요.'
    sigungus.value = []
  } finally {
    loadingSigungus.value = false
  }
}

// 외부 modelValue(시군구 코드) → 두 select 복원
async function restoreFromModel() {
  const code = props.modelValue
  if (!code || code === sigunguCode.value) return
  const parent = sidoCodeOf(code)
  if (!sidos.value.some((s) => s.regionCode === parent)) return
  sidoCode.value = parent
  await loadSigungus(parent)
  sigunguCode.value = code
}

watch(() => props.modelValue, restoreFromModel)

onMounted(loadSidos)

async function onSido(e: Event) {
  sidoCode.value = (e.target as HTMLSelectElement).value
  sigunguCode.value = ''
  emit('update:modelValue', '')
  await loadSigungus(sidoCode.value)
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
        :disabled="loadingSidos || sidos.length === 0"
        @change="onSido"
      >
        <option value="" disabled>{{ loadingSidos ? '불러오는 중…' : '시/도' }}</option>
        <option v-for="s in sidos" :key="s.regionCode" :value="s.regionCode">{{ s.sidoName }}</option>
      </select>
      <select
        :value="sigunguCode"
        :aria-label="`${label} 시/군/구`"
        :class="selectCls"
        :disabled="!sidoCode || loadingSigungus"
        @change="onSigungu"
      >
        <option value="" disabled>
          {{ !sidoCode ? '시/도 먼저' : loadingSigungus ? '불러오는 중…' : '시/군/구' }}
        </option>
        <option v-for="g in sigungus" :key="g.regionCode" :value="g.regionCode">
          {{ g.sigunguName }}
        </option>
      </select>
    </div>
    <p v-if="errorMsg" class="mt-1.5 flex items-center gap-2 text-body-sm text-danger">
      {{ errorMsg }}
      <button type="button" class="font-semibold underline" @click="loadSidos">다시 시도</button>
    </p>
    <p v-else-if="hint" class="mt-1.5 text-body-sm text-muted">{{ hint }}</p>
  </fieldset>
</template>
