<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/shared/components/AppHeader.vue'
import UiField from '@/shared/ui/UiField.vue'
import UiButton from '@/shared/ui/UiButton.vue'
import { moneyModel } from '@/shared/lib/money'

const router = useRouter()
const kind = ref<'expense' | 'income'>('expense')
const CATS = ['주거 보증금', '생활비', '교육·자기계발', '비상금']
const cat = ref('생활비')
const amountRaw = ref<number | null>(45000)
const amount = moneyModel(() => amountRaw.value, (n) => (amountRaw.value = n))
const date = ref('2026.08.16')
const memo = ref('')
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
            v-for="c in CATS"
            :key="c"
            type="button"
            role="radio"
            :aria-checked="cat === c"
            class="min-h-9 rounded-full px-3.5 text-body-sm font-medium transition-colors"
            :class="cat === c ? 'bg-primary-tint text-primary-dark' : 'border border-border-strong text-body'"
            @click="cat = c"
          >
            {{ c }}
          </button>
        </div>
      </div>

      <UiField v-model="amount" label="금액" placeholder="0" inputmode="numeric" suffix="원" />
      <UiField v-model="date" label="날짜" placeholder="YYYY.MM.DD" inputmode="numeric" />
      <UiField v-model="memo" label="메모 (선택)" placeholder="예: 마트 장보기" />
    </main>

    <div
      class="glass-strong sticky bottom-0 border-x-0 border-b-0 px-5 pb-7 pt-3"
      style="padding-bottom: max(1.75rem, env(safe-area-inset-bottom))"
    >
      <UiButton size="lg" block @click="router.push('/tracking')">저장</UiButton>
    </div>
  </div>
</template>
