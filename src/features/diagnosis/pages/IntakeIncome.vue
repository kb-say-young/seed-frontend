<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import WizardChrome from '@/shared/components/WizardChrome.vue'
import UiField from '@/shared/ui/UiField.vue'
import { state } from '@/features/diagnosis/model/store'
import { moneyModel } from '@/shared/lib/money'

const router = useRouter()

const income = moneyModel(() => state.monthlyIncome, (n) => (state.monthlyIncome = n))
const cda = moneyModel(() => state.cdaBalance, (n) => (state.cdaBalance = n))

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
      <UiField v-model="income" label="월 평균 소득 금액" required placeholder="0" inputmode="numeric" suffix="원" />
      <UiField v-model="cda" label="디딤씨앗통장 잔액" required placeholder="0" inputmode="numeric" suffix="원" />
    </div>
  </WizardChrome>
</template>
