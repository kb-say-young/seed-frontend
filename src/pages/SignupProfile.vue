<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import WizardChrome from '../components/WizardChrome.vue'
import UiField from '../components/UiField.vue'
import { state } from '../lib/store'

const router = useRouter()

const household = computed({
  get: () => (state.householdSize == null ? '' : String(state.householdSize)),
  set: (v: string) => {
    const n = parseInt(v.replace(/\D/g, ''), 10)
    state.householdSize = Number.isFinite(n) && n > 0 ? n : null
  },
})

const canNext = computed(
  () =>
    state.name.trim() !== '' &&
    /^\d{4}[.\-/]\d{2}[.\-/]\d{2}$/.test(state.birth.trim()) &&
    state.phone.replace(/\D/g, '').length >= 9 &&
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
      <UiField v-model="state.name" label="이름" required placeholder="홍길동" />
      <UiField
        v-model="state.birth"
        label="생년월일"
        required
        placeholder="YYYY.MM.DD"
        inputmode="numeric"
        hint="만 17~18세 보호종료 예정 · 만 24세 이하 보호종료 청년"
      />
      <UiField
        v-model="state.phone"
        label="전화번호"
        required
        placeholder="010-0000-0000"
        inputmode="numeric"
      />
      <UiField
        v-model="household"
        label="가구원 수"
        required
        placeholder="예: 1"
        inputmode="numeric"
        suffix="명"
        hint="함께 생계를 꾸리는 사람 수 (혼자 살면 1명)"
      />
    </div>
  </WizardChrome>
</template>
