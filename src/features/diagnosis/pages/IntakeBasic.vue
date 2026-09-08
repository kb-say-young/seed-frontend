<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import WizardChrome from '@/shared/components/WizardChrome.vue'
import UiField from '@/shared/ui/UiField.vue'
import UiChip from '@/shared/ui/UiChip.vue'
import DateWheelField from '@/shared/components/DateWheelField.vue'
import RegionSelect from '@/shared/components/RegionSelect.vue'
import { state } from '@/features/diagnosis/model/store'

const router = useRouter()
const thisYear = new Date().getFullYear()

const canNext = computed(
  () =>
    /^\d{4}\.\d{2}\.\d{2}$/.test(state.protectionEndDate.trim()) &&
    state.isYouthSupportApplied !== null &&
    state.isBasicRecipient !== null &&
    state.regionCode !== '' &&
    (state.householdSize ?? 0) > 0,
)
function next() {
  router.push(state.isBasicRecipient ? '/intake/welfare' : '/intake/income')
}
const household = computed({
  get: () => (state.householdSize == null ? '' : String(state.householdSize)),
  set: (v: string) => {
    let n = parseInt(v.replace(/\D/g, '').slice(0, 2), 10)
    if (!Number.isFinite(n) || n <= 0) {
      state.householdSize = null
      return
    }
    if (n > 10) n = 10
    state.householdSize = n
  },
})
</script>

<template>
  <WizardChrome
    title="정보 입력"
    :step="1"
    :total="3"
    step-label="기본 정보"
    back-to="/signup/done"
    :can-next="canNext"
    @next="next"
  >
    <div class="flex flex-col gap-4">
      <DateWheelField
        v-model="state.protectionEndDate"
        label="보호종료(예정)일"
        required
        :min-year="thisYear - 20"
        :max-year="thisYear + 5"
      />

      <fieldset>
        <legend class="mb-1.5 text-label text-ink">
          자립준비청년 신청 여부<span class="text-danger" aria-hidden="true"> *</span>
        </legend>
        <div class="flex gap-2" role="radiogroup" aria-label="자립준비청년 신청 여부">
          <UiChip label="신청함" :selected="state.isYouthSupportApplied === true" @toggle="state.isYouthSupportApplied = true" />
          <UiChip label="아직 안 함" :selected="state.isYouthSupportApplied === false" @toggle="state.isYouthSupportApplied = false" />
        </div>
      </fieldset>

      <fieldset>
        <legend class="mb-1.5 text-label text-ink">
          기초생활수급자 여부<span class="text-danger" aria-hidden="true"> *</span>
        </legend>
        <div class="flex gap-2" role="radiogroup" aria-label="기초생활수급자 여부">
          <UiChip label="예" :selected="state.isBasicRecipient === true" @toggle="state.isBasicRecipient = true" />
          <UiChip label="아니오" :selected="state.isBasicRecipient === false" @toggle="state.isBasicRecipient = false" />
        </div>
      </fieldset>

      <RegionSelect v-model="state.regionCode" label="현재 거주지" required />

      <UiField
        v-model="household"
        label="현재 가구원 수"
        required
        placeholder="예: 1"
        inputmode="numeric"
        :maxlength="2"
        suffix="명"
      />
    </div>
  </WizardChrome>
</template>
