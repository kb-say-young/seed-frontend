<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import WizardChrome from '@/shared/components/WizardChrome.vue'
import UiField from '@/shared/ui/UiField.vue'
import { state } from '@/features/diagnosis/model/store'

const router = useRouter()

// 백엔드 user_profile.income 은 수급자 여부와 무관하게 필수(@NotNull). 0 허용.
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
    intro="기초생활수급자로 확인되었어요. 자립 자금 현황을 알려주세요."
    :step="2"
    :total="3"
    step-label="자립 자금"
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
        hint="일해서 버는 소득이 없으면 0 을 입력해요"
      />
      <UiField
        v-model="cda"
        label="디딤씨앗통장 잔액"
        required
        placeholder="0"
        inputmode="numeric"
        suffix="원"
        hint="만 18세 이후 적립된 금액을 입력해주세요"
      />
    </div>
  </WizardChrome>
</template>
