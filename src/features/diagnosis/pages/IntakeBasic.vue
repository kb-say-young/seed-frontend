<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import WizardChrome from '@/shared/components/WizardChrome.vue'
import UiField from '@/shared/ui/UiField.vue'
import UiChip from '@/shared/ui/UiChip.vue'
import RegionSelect from '@/features/diagnosis/components/RegionSelect.vue'
import { state } from '@/features/diagnosis/model/store'

const router = useRouter()

// 네이티브 <input type="date"> 는 항상 ISO(YYYY-MM-DD)로 값을 주고받는다.
// state.protectionEndDate 는 "YYYY.MM.DD" 형식(canNext 정규식·intakeRequest.ts 와 통일)이라 여기서만 변환.
const protectionEndDateIso = computed({
  get: () => state.protectionEndDate.replaceAll('.', '-'),
  set: (v: string) => (state.protectionEndDate = v.replaceAll('-', '.')),
})

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
      <UiField v-model="protectionEndDateIso" type="date" label="보호종료(예정)일" required />

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

      <RegionSelect v-model="state.region" label="현재 거주지" required />

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
