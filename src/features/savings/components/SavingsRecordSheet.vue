<script setup lang="ts">
import { ref, watch } from 'vue'
import BottomSheet from '@/shared/components/BottomSheet.vue'
import UiField from '@/shared/ui/UiField.vue'
import UiButton from '@/shared/ui/UiButton.vue'
import type { SavingsCat } from '@/features/savings/model/savings'

// Figma S3 "적립 내역 작성" — 카테고리 토글 + 항목 + 금액.
// (백엔드 적립 엔드포인트 전까지는 submit 이벤트만 — 상위에서 로컬 반영/알림)
const props = defineProps<{ open: boolean; defaultCat?: SavingsCat }>()
const emit = defineEmits<{
  close: []
  submit: [value: { category: SavingsCat; item: string; amount: number }]
}>()

const CATS: { v: SavingsCat; label: string }[] = [
  { v: 'housing', label: '주거' },
  { v: 'work', label: '취·창업' },
]

const category = ref<SavingsCat>(props.defaultCat ?? 'housing')
const item = ref('')
const amountText = ref('')

watch(
  () => props.open,
  (o) => {
    if (o) {
      category.value = props.defaultCat ?? 'housing'
      item.value = ''
      amountText.value = ''
    }
  },
)

const amount = () => Number(amountText.value.replace(/[^\d]/g, ''))
function onAmountInput(v: string) {
  const n = Number(v.replace(/[^\d]/g, ''))
  amountText.value = n > 0 ? n.toLocaleString('ko-KR') : ''
}

function submit() {
  if (!item.value.trim() || amount() <= 0) return
  emit('submit', { category: category.value, item: item.value.trim(), amount: amount() })
  emit('close')
}
</script>

<template>
  <BottomSheet :open="open" title="적립 내역 작성" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <fieldset>
        <legend class="mb-1.5 text-label text-ink">카테고리 선택</legend>
        <div class="flex gap-2">
          <button
            v-for="c in CATS"
            :key="c.v"
            type="button"
            class="min-h-11 flex-1 rounded-full border-[1.5px] text-body-sm font-semibold transition-colors"
            :class="
              category === c.v
                ? 'border-primary bg-primary text-on-primary'
                : 'border-border-strong text-body'
            "
            :aria-pressed="category === c.v"
            @click="category = c.v"
          >
            {{ c.label }}
          </button>
        </div>
      </fieldset>

      <UiField v-model="item" label="적립 항목" placeholder="예: 월세 적립, 보증금 저축" />
      <UiField
        :model-value="amountText"
        label="적립 금액"
        placeholder="0"
        inputmode="numeric"
        suffix="원"
        @update:model-value="onAmountInput"
      />

      <UiButton type="submit" size="lg" block :disabled="!item.trim() || amount() <= 0">
        확인
      </UiButton>
    </form>
  </BottomSheet>
</template>
