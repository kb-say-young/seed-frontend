<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import UiField from '@/shared/ui/UiField.vue'
import UiButton from '@/shared/ui/UiButton.vue'
import DateWheelField from '@/shared/components/DateWheelField.vue'
import PhoneSegments from '@/shared/components/PhoneSegments.vue'
import { userApi, ApiError } from '@/shared/api'
import { state } from '@/features/diagnosis/model/store'

const router = useRouter()
const thisYear = new Date().getFullYear()
const error = ref('')
const submitting = ref(false)

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

const canSubmit = computed(
  () =>
    !submitting.value &&
    state.name.trim() !== '' &&
    /^\d{4}\.\d{2}\.\d{2}$/.test(state.birth.trim()) &&
    state.phone.replace(/\D/g, '').length >= 10 &&
    state.householdSize != null,
)

// 아이디·비밀번호(1단계) + 인적 사항(이 화면)을 모두 입력한 뒤, 여기서 가입 요청을 한 번만 보낸다.
// 현재 백엔드 계약(POST /api/users/signup)은 loginId 만 받는다 — 이름·생년월일·전화번호·가구원 수는
// 아직 서버에 저장되지 않고 클라이언트 상태로만 유지된다.
async function submit() {
  if (!canSubmit.value) return
  submitting.value = true
  error.value = ''
  try {
    const res = await userApi.signup(state.loginId)
    state.loginId = res.loginId
    router.push('/signup/done')
  } catch (e) {
    if (e instanceof ApiError) {
      error.value =
        e.status === 409
          ? `${e.message} 이전 단계에서 아이디를 바꿔 주세요.`
          : e.message
    } else {
      error.value = '가입에 실패했어요. 잠시 후 다시 시도해 주세요.'
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-svh flex-col bg-transparent px-6 pb-7 pt-14">
    <h1 class="text-h2 text-ink">회원가입</h1>
    <p class="mt-1 text-caption font-semibold text-primary-dark">2단계 / 3 · 인적 사항</p>
    <p class="sr-only">전체 3단계 중 2단계</p>
    <p class="mt-2 text-body-sm text-muted">지원 자격과 지원금 계산에 사용해요</p>

    <form id="main" class="mt-8 flex flex-col gap-4" @submit.prevent="submit">
      <p v-if="error" role="alert" class="text-body-sm text-danger">{{ error }}</p>
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
      <button type="submit" class="sr-only">다음</button>
    </form>

    <div class="flex-1" />

    <div class="flex flex-col items-center gap-3.5">
      <UiButton size="lg" block :disabled="!canSubmit" @click="submit">
        {{ submitting ? '가입 중…' : '다음' }}
      </UiButton>
      <p class="text-body-sm text-muted">
        <RouterLink to="/signup" class="font-bold text-primary-dark">이전 단계로</RouterLink>
      </p>
    </div>
  </div>
</template>
