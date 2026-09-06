<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import WizardChrome from '@/shared/components/WizardChrome.vue'
import UiField from '@/shared/ui/UiField.vue'
import UiChip from '@/shared/ui/UiChip.vue'
import { state } from '@/features/diagnosis/model/store'

const router = useRouter()
const REGIONS = ['서울시', '경기도', '인천시', '부산시', '대구시', '광주시', '대전시', '강원도', '제주도']

const canNext = computed(
  () =>
    /^\d{4}[.\-/ ]*\d{2}[.\-/ ]*\d{2}$/.test(state.protectionEndDate.trim()) &&
    state.isYouthSupportApplied !== null &&
    state.isBasicRecipient !== null &&
    state.region !== '' &&
    (state.householdSize ?? 0) > 0,
)
function next() {
  router.push(state.isBasicRecipient ? '/intake/welfare' : '/intake/income')
}
const household = computed({
  get: () => (state.householdSize == null ? '' : String(state.householdSize)),
  set: (v: string) => (state.householdSize = Number(v.replace(/\D/g, '')) || null),
})
</script>

<template>
  <WizardChrome
    title="정보 입력"
    intro="3분이면 끝나요. 정확할수록 로드맵이 더 잘 맞아요."
    :step="1"
    :total="3"
    step-label="기본 정보"
    back-to="/signup/done"
    :can-next="canNext"
    @next="next"
  >
    <div class="flex flex-col gap-4">
      <UiField
        v-model="state.protectionEndDate"
        label="보호종료(예정)일"
        required
        placeholder="YYYY.MM.DD"
        inputmode="numeric"
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

      <div>
        <label for="region" class="mb-1.5 block text-label text-ink">
          거주지<span class="text-danger" aria-hidden="true"> *</span>
        </label>
        <select
          id="region"
          v-model="state.region"
          class="glass-field min-h-12 w-full rounded-md border-[1.5px] px-4 text-body text-ink focus:border-primary"
        >
          <option value="" disabled>지역을 선택하세요</option>
          <option v-for="r in REGIONS" :key="r" :value="r">{{ r }}</option>
        </select>
      </div>

      <UiField
        v-model="household"
        label="현재 가구원 수"
        required
        placeholder="1"
        inputmode="numeric"
        suffix="명"
      />
    </div>
  </WizardChrome>
</template>
