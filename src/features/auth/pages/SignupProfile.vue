<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import WizardChrome from '@/shared/components/WizardChrome.vue'
import UiField from '@/shared/ui/UiField.vue'
import { state } from '@/features/diagnosis/model/store'

const router = useRouter()

// 생년월일: 숫자만 → YYYY.MM.DD 로 . 자동 삽입 (최대 8자리)
function formatBirth(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 8)
  return [d.slice(0, 4), d.slice(4, 6), d.slice(6, 8)].filter(Boolean).join('.')
}
// 전화번호: 숫자만 → 010-1234-5678 로 - 자동 삽입 (최대 11자리)
function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
}

const birth = computed({
  get: () => state.birth,
  set: (v: string) => (state.birth = formatBirth(v)),
})
const phone = computed({
  get: () => state.phone,
  set: (v: string) => (state.phone = formatPhone(v)),
})

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
      <UiField
        v-model="birth"
        label="생년월일"
        required
        placeholder="YYYY.MM.DD"
        inputmode="numeric"
        :maxlength="10"
        autocomplete="bday"
        hint="숫자만 입력하면 점(.)이 자동으로 들어가요"
      />
      <UiField
        v-model="phone"
        label="전화번호"
        required
        placeholder="010-0000-0000"
        inputmode="numeric"
        :maxlength="13"
        autocomplete="tel"
        hint="숫자만 입력하면 하이픈(-)이 자동으로 들어가요"
      />
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
