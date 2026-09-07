<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import WizardChrome from '@/shared/components/WizardChrome.vue'
import UiField from '@/shared/ui/UiField.vue'
import DateWheelField from '@/shared/components/DateWheelField.vue'
import PhoneSegments from '@/shared/components/PhoneSegments.vue'
import { state } from '@/features/diagnosis/model/store'

const router = useRouter()
const thisYear = new Date().getFullYear()

// 가구원 수: 1~10 정수만
const household = computed({
  get: () => (state.householdSize == null ? '' : String(state.householdSize)),
  set: (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 2)
    let n = parseInt(digits, 10)
    if (!Number.isFinite(n) || n <= 0) {
      state.householdSize = null
      return
    }
    if (n > 10) n = 10
    state.householdSize = n
  },
})

const canNext = computed(
  () =>
    state.name.trim() !== '' &&
    /^\d{4}\.\d{2}\.\d{2}$/.test(state.birth.trim()) &&
    state.phone.replace(/\D/g, '').length >= 10 &&
    state.householdSize != null,
)
</script>

<template>
  <WizardChrome
    title="회원가입"
    :step="2"
    :total="3"
    step-label="인적 사항"
    back-to="/signup"
    :can-next="canNext"
    @next="router.push('/signup/done')"
  >
    <p class="text-body-sm text-muted">지원 자격과 지원금 계산에 사용해요</p>
    <div class="flex flex-col gap-4">
      <UiField
        v-model="state.name"
        label="이름"
        required
        placeholder="홍길동"
        :maxlength="20"
        autocomplete="name"
        hint="최대 20자"
      />
      <DateWheelField
        v-model="state.birth"
        label="생년월일"
        required
        :min-year="thisYear - 60"
        :max-year="thisYear - 10"
        hint="연·월·일 칸을 눌러 다이얼로 선택해요"
      />
      <PhoneSegments v-model="state.phone" label="전화번호" required />
      <UiField
        v-model="household"
        label="가구원 수"
        required
        placeholder="예: 1"
        inputmode="numeric"
        :maxlength="2"
        suffix="명"
        hint="함께 생계를 꾸리는 사람 수 (혼자 살면 1명 · 최대 10명)"
      />
    </div>
  </WizardChrome>
</template>
