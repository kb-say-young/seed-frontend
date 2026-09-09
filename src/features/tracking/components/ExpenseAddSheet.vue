<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BottomSheet from '@/shared/components/BottomSheet.vue'
import UiField from '@/shared/ui/UiField.vue'
import UiButton from '@/shared/ui/UiButton.vue'
import { moneyModel } from '@/shared/lib/money'
import { expenseApi, ApiError } from '@/shared/api'
import { useResource } from '@/shared/lib/useResource'

// 기록(/tracking) 화면의 "지출 추가"·"수입 추가" 버튼용 시트. 예전엔 /tracking/add
// 페이지로 이동했는데, 다른 화면으로 안 넘어가고 그 자리에서 바로 적도록 바꿨다.
// 어느 버튼으로 열었는지에 따라 종류가 고정된다 — 시트 안에서 지출·수입을 서로
// 바꿀 수 있으면, "지출 추가"를 눌렀는데 수입도 넣을 수 있어 헷갈린다.
const props = defineProps<{ open: boolean; kind: 'expense' | 'income' }>()
const emit = defineEmits<{ close: []; saved: [] }>()

// 카테고리 목록은 API 로. 실패 시 최소 폴백.
const FALLBACK_CATS = [
  { key: 'housing', label: '주거 보증금' },
  { key: 'living', label: '생활비' },
  { key: 'work', label: '교육·자기계발' },
  { key: 'saving', label: '비상금' },
]
const { data: catList } = useResource(() => expenseApi.getExpenseCategories())
const cats = computed(() => catList.value ?? FALLBACK_CATS)

const cat = ref('')
const amountRaw = ref<number | null>(null)
const amount = moneyModel(() => amountRaw.value, (n) => (amountRaw.value = n))
const date = ref(new Date().toISOString().slice(0, 10).replace(/-/g, '.'))
const memo = ref('')
const submitting = ref(false)
const error = ref('')

// 열릴 때마다 초기 상태로 — 이전에 쓰던 값이 남아 있지 않게.
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    cat.value = cats.value[0]?.label ?? ''
    amountRaw.value = null
    date.value = new Date().toISOString().slice(0, 10).replace(/-/g, '.')
    memo.value = ''
    error.value = ''
  },
)

const canSave = computed(
  () => !submitting.value && cat.value !== '' && (amountRaw.value ?? 0) > 0 && /^\d{4}\.\d{2}\.\d{2}$/.test(date.value.trim()),
)

async function save() {
  if (!canSave.value) return
  submitting.value = true
  error.value = ''
  try {
    await expenseApi.createExpense({
      kind: props.kind,
      category: cat.value,
      amount: amountRaw.value ?? 0,
      date: date.value.trim().replace(/\./g, '-'),
      memo: memo.value.trim() || null,
    })
    emit('saved')
    emit('close')
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : '저장에 실패했어요. 잠시 후 다시 시도해 주세요.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <BottomSheet :open="open" :title="props.kind === 'expense' ? '지출 추가' : '수입 추가'" @close="emit('close')">
    <form class="space-y-5" @submit.prevent="save">
      <div>
        <p class="mb-2 text-label text-ink">카테고리</p>
        <div class="flex flex-wrap gap-2" role="radiogroup" aria-label="카테고리">
          <button
            v-for="c in cats"
            :key="c.key"
            type="button"
            role="radio"
            :aria-checked="cat === c.label"
            class="min-h-9 rounded-full px-3.5 text-body-sm font-medium transition-colors"
            :class="cat === c.label ? 'bg-primary-tint text-primary-dark' : 'border border-border-strong text-body'"
            @click="cat = c.label"
          >
            {{ c.label }}
          </button>
        </div>
      </div>

      <UiField v-model="amount" label="금액" placeholder="0" inputmode="numeric" suffix="원" />
      <UiField v-model="date" label="날짜" placeholder="YYYY.MM.DD" inputmode="numeric" />
      <UiField v-model="memo" label="메모 (선택)" placeholder="예: 마트 장보기" />

      <p v-if="error" role="alert" class="text-body-sm text-danger">{{ error }}</p>

      <UiButton type="submit" size="lg" block :disabled="!canSave">
        {{ submitting ? '저장 중…' : '저장' }}
      </UiButton>
    </form>
  </BottomSheet>
</template>
