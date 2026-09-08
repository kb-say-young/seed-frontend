<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/shared/components/AppHeader.vue'
import UiField from '@/shared/ui/UiField.vue'
import UiButton from '@/shared/ui/UiButton.vue'
import { moneyModel } from '@/shared/lib/money'
import { expenseApi, ApiError } from '@/shared/api'
import { useResource } from '@/shared/lib/useResource'

const router = useRouter()
const kind = ref<'expense' | 'income'>('expense')

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

onMounted(() => {
  // 첫 카테고리 기본 선택
  if (!cat.value && cats.value.length) cat.value = cats.value[0].label
})

const canSave = computed(
  () => !submitting.value && cat.value !== '' && (amountRaw.value ?? 0) > 0 && /^\d{4}\.\d{2}\.\d{2}$/.test(date.value.trim()),
)

async function save() {
  if (!canSave.value) return
  submitting.value = true
  error.value = ''
  try {
    await expenseApi.createExpense({
      kind: kind.value,
      category: cat.value,
      amount: amountRaw.value ?? 0,
      date: date.value.trim().replace(/\./g, '-'),
      memo: memo.value.trim() || null,
    })
    router.push('/tracking')
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : '저장에 실패했어요. 잠시 후 다시 시도해 주세요.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-svh flex-col bg-transparent">
    <AppHeader title="지출 추가" to="/tracking" />
    <main id="main" class="flex-1 space-y-5 px-5 pt-2">
      <div class="glass-field flex rounded-xl p-1" role="radiogroup" aria-label="유형">
        <button
          v-for="k in (['expense', 'income'] as const)"
          :key="k"
          type="button"
          role="radio"
          :aria-checked="kind === k"
          class="flex-1 rounded-lg py-2.5 text-body-sm font-medium transition-colors"
          :class="kind === k ? 'bg-primary-tint text-primary-dark' : 'text-muted'"
          @click="kind = k"
        >
          {{ k === 'expense' ? '지출' : '수입' }}
        </button>
      </div>

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
    </main>

    <div
      class="glass-strong sticky bottom-0 border-x-0 border-b-0 px-5 pb-7 pt-3"
      style="padding-bottom: max(1.75rem, env(safe-area-inset-bottom))"
    >
      <UiButton size="lg" block :disabled="!canSave" @click="save">
        {{ submitting ? '저장 중…' : '저장' }}
      </UiButton>
    </div>
  </div>
</template>
