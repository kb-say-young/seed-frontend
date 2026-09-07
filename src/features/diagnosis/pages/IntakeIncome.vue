<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import WizardChrome from '@/shared/components/WizardChrome.vue'
import UiField from '@/shared/ui/UiField.vue'
import { state } from '@/features/diagnosis/model/store'

const router = useRouter()

// 백엔드 user_profile: income(월 평균 소득, 원 · 0 허용), fixed_budget(디딤씨앗통장 잔액).
// 0 도 유효값이므로 moneyModel(0→null) 대신 직접 computed.
function amountModel(get: () => number | null, set: (n: number | null) => void) {
  return computed({
    get: () => {
      const n = get()
      return n == null ? '' : n.toLocaleString('ko-KR')
    },
    set: (v: string) => {
      const digits = v.replace(/[^\d]/g, '')
      set(digits === '' ? null : Number(digits))
    },
  })
}

const income = amountModel(
  () => state.monthlyIncome,
  (n) => (state.monthlyIncome = n),
)
const cda = amountModel(
  () => state.cdaBalance,
  (n) => (state.cdaBalance = n),
)

const canNext = computed(() => state.monthlyIncome != null && state.cdaBalance != null)
</script>

<template>
  <WizardChrome
    title="정보 입력"
    intro="정확할수록 내게 꼭 맞는 자금 매칭 혜택을 찾을 수 있어요."
    :step="2"
    :total="3"
    step-label="소득·예산"
    back-to="/intake"
    :can-next="canNext"
    @next="router.push('/intake/goals')"
  >
    <div class="flex flex-col gap-4">
      <UiField
        v-model="income"
        label="월 평균 소득"
        required
        placeholder="0"
        inputmode="numeric"
        suffix="원"
        hint="최근 3개월 평균. 소득이 없으면 0"
      />
      <UiField
        v-model="cda"
        label="디딤씨앗통장 잔액"
        required
        placeholder="0"
        inputmode="numeric"
        suffix="원"
        hint="만 18세 이후 적립된 금액"
      />
    </div>
  </WizardChrome>
</template>
