<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import WizardChrome from '@/shared/components/WizardChrome.vue'
import UiField from '@/shared/ui/UiField.vue'
import UiChip from '@/shared/ui/UiChip.vue'
import { state, type IncomeBand } from '@/features/diagnosis/model/store'
import { moneyModel } from '@/shared/lib/money'

const router = useRouter()
const BANDS: { v: IncomeBand; label: string }[] = [
  { v: 'none', label: '없음' },
  { v: 'lt100', label: '100만원 미만' },
  { v: '100to200', label: '100~200만원' },
  { v: '200to300', label: '200~300만원' },
  { v: 'gte300', label: '300만원 이상' },
]

const budget = moneyModel(() => state.monthlyBudget, (n) => (state.monthlyBudget = n))
const cda = moneyModel(() => state.cdaBalance, (n) => (state.cdaBalance = n))
const allowance = moneyModel(() => state.youthAllowance, (n) => (state.youthAllowance = n))

const canNext = computed(() => state.incomeBand !== null && state.monthlyBudget != null)
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
      <fieldset>
        <legend class="mb-1.5 text-label text-ink">
          월 평균 소득 구간<span class="text-danger" aria-hidden="true"> *</span>
        </legend>
        <div class="flex flex-wrap gap-2" role="radiogroup" aria-label="월 평균 소득 구간">
          <UiChip
            v-for="b in BANDS"
            :key="b.v"
            :label="b.label"
            :selected="state.incomeBand === b.v"
            @toggle="state.incomeBand = b.v"
          />
        </div>
      </fieldset>

      <UiField v-model="budget" label="월 예산 (자립 자금)" required placeholder="0" inputmode="numeric" suffix="원" />
      <UiField v-model="cda" label="디딤씨앗통장 잔액" required placeholder="0" inputmode="numeric" suffix="원" />
      <UiField v-model="allowance" label="월 자립수당 금액" required placeholder="0" inputmode="numeric" suffix="원" />
    </div>
  </WizardChrome>
</template>
