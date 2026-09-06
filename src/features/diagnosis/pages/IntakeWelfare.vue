<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import WizardChrome from '@/shared/components/WizardChrome.vue'
import UiField from '@/shared/ui/UiField.vue'
import { state } from '@/features/diagnosis/model/store'
import { moneyModel } from '@/shared/lib/money'

const router = useRouter()
const cda = moneyModel(() => state.cdaBalance, (n) => (state.cdaBalance = n))

const canNext = computed(() => state.cdaBalance != null)
</script>

<template>
  <WizardChrome
    title="정보 입력"
    intro="기초생활수급자로 확인되었어요. 소득 대신 자립 자금 현황을 알려주세요."
    :step="2"
    :total="3"
    step-label="자립 자금"
    back-to="/intake"
    :can-next="canNext"
    @next="router.push('/intake/goals')"
  >
    <div class="flex flex-col gap-4">
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
