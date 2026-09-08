<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UiField from '@/shared/ui/UiField.vue'
import UiButton from '@/shared/ui/UiButton.vue'
import DateWheelField from '@/shared/components/DateWheelField.vue'
import PhoneSegments from '@/shared/components/PhoneSegments.vue'
import { userApi, ApiError } from '@/shared/api'
import { EDUCATIONS, type Education } from '@/shared/api/user'
import { setTokens } from '@/shared/lib/auth'
import { state } from '@/features/diagnosis/model/store'

// 1·2단계를 한 컴포넌트가 소유한다(?step 쿼리로 전환).
// 경로(/signup)가 그대로라 App.vue 가 리마운트하지 않음 → 헤더·진행바가 유지되고
// 진행바는 33% → 67% 로 이어서 채워진다.
const route = useRoute()
const router = useRouter()

const step = computed<1 | 2>(() => (route.query.step === '2' ? 2 : 1))
const targetWidth = computed(() => (step.value === 1 ? '33.333%' : '66.666%'))

const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const barWidth = ref(reduceMotion ? targetWidth.value : '0%')

onMounted(() => {
  // 2단계로 직접 진입(새로고침·딥링크)했는데 1단계 정보가 없으면 되돌린다.
  if (step.value === 2 && !state.loginId.trim()) {
    void router.replace('/signup')
    return
  }
  if (!reduceMotion) {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        barWidth.value = targetWidth.value
      }),
    )
  }
})
watch(targetWidth, (w) => {
  barWidth.value = w
})

// --- 1단계: 계정 ---
const loginId = ref(state.loginId)
// 비밀번호: 화면에는 두되 백엔드로 보내지 않는다 (로그인은 아이디만 — 저장 경로 없음).
const pw = ref('')
// 아이디 중복(409)은 2단계 제출 때 알 수 있지만, 아이디 필드가 여기 있으므로
// 이 필드의 에러로 되돌려 표시한다.
const idError = ref('')
watch(loginId, () => {
  idError.value = ''
})
const canNext = computed(() => {
  const v = loginId.value.trim()
  return v.length >= 4 && v.length <= 30 && pw.value.length >= 8
})
function goProfile() {
  if (!canNext.value) return
  state.loginId = loginId.value.trim()
  router.push({ path: '/signup', query: { step: '2' } })
}

// --- 2단계: 인적 사항 ---
// 가구원 수는 여기서 받지 않는다 — 진단 정보 입력(IntakeBasic)에서 받아 me/intake 로 전송.
const thisYear = new Date().getFullYear()
const error = ref('')
const submitting = ref(false)
const canSubmit = computed(
  () =>
    !submitting.value &&
    state.name.trim() !== '' &&
    /^\d{4}\.\d{2}\.\d{2}$/.test(state.birth.trim()) &&
    /^010\d{8}$/.test(state.phone.replace(/\D/g, '')) &&
    state.education !== '',
)

// 학력 선택지 — 옵션이 9개라 칩 대신 네이티브 <select>(모바일 기본 피커·접근성).
// RegionSelect 와 같은 방식. 값은 백엔드 @Pattern 과 정확히 일치해야 한다.
const selectCls =
  'glass-field min-h-12 w-full rounded-md border-[1.5px] px-4 text-body text-ink focus:border-primary'

// 아이디(1단계) + 이름·생년월일·전화번호·학력(2단계)을 모두 입력한 뒤, 여기서 가입 요청을 한 번만 보낸다.
// 백엔드 계약(POST /api/users/signup)은 loginId·name·birthDate(yyyy-MM-dd · LocalDate)·phoneNumber(010########)·education 을 받는다.
// 비밀번호는 서버에 저장 경로가 없어(로그인은 아이디만) 화면 입력만 받고 전송하지 않는다.
async function submit() {
  if (!canSubmit.value) return
  submitting.value = true
  error.value = ''
  try {
    const res = await userApi.signup({
      loginId: state.loginId,
      name: state.name.trim(),
      birthDate: state.birth.trim().replace(/\./g, '-'), // "1999.01.01" → "1999-01-01" (BE LocalDate)
      phoneNumber: state.phone.replace(/\D/g, ''), // "010-1234-5678" → "01012345678"
      education: state.education as Education,
    })
    state.loginId = res.loginId

    // 가입 완료 = 로그인 상태로. 바로 이어지는 진단 정보 입력(POST /api/users/me/intake)이
    // 인증을 요구하므로, 가입 직후 로그인 요청까지 보내 토큰을 확보한다.
    // 로그인 호출이 실패해도 가입 자체는 성공 — /diagnosing 이 비로그인 상태로 degrade 한다.
    try {
      const tokens = await userApi.login(res.loginId)
      setTokens(tokens.accessToken, tokens.refreshToken)
    } catch (e) {
      console.warn('[signup] 자동 로그인 실패', e)
    }

    router.push('/signup/done')
  } catch (e) {
    if (e instanceof ApiError && e.status === 409) {
      // 아이디 중복 — 1단계로 돌려보내 아이디 필드에 에러 표시
      idError.value = e.message || '이미 사용 중인 아이디예요. 다른 아이디를 입력해 주세요.'
      router.push('/signup')
    } else if (e instanceof ApiError) {
      error.value = e.message
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
    <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-primary-tint" aria-hidden="true">
      <div
        class="bar-fill h-full rounded-full"
        :style="{
          width: barWidth,
          background:
            'linear-gradient(90deg, color-mix(in srgb, var(--color-primary-bright) 40%, white), var(--color-primary-bright))',
        }"
      />
    </div>
    <p class="sr-only">
      전체 3단계 중 {{ step }}단계 · {{ step === 1 ? '계정' : '인적 사항' }}
    </p>

    <!-- 1단계: 계정 -->
    <template v-if="step === 1">
      <form id="main" class="mt-8 flex flex-col gap-4" @submit.prevent="goProfile">
        <UiField
          v-model="loginId"
          label="아이디"
          required
          placeholder="영문·숫자 4~30자"
          :maxlength="30"
          autocomplete="username"
          :error="idError"
        />
        <UiField
          v-model="pw"
          label="비밀번호"
          type="password"
          required
          placeholder="8자 이상"
          autocomplete="new-password"
        />
        <button type="submit" class="sr-only">다음</button>
      </form>

      <div class="flex-1" />

      <div class="flex flex-col items-center gap-3.5">
        <UiButton size="lg" block :disabled="!canNext" @click="goProfile">다음</UiButton>
        <p class="text-body-sm text-muted">
          이미 계정이 있으신가요?
          <RouterLink to="/login" class="font-bold text-primary-dark">로그인</RouterLink>
        </p>
      </div>
    </template>

    <!-- 2단계: 인적 사항 -->
    <template v-else>
      <form id="main" class="mt-8 flex flex-col gap-4" @submit.prevent="submit">
        <p v-if="error" role="alert" class="text-body-sm text-danger">{{ error }}</p>
        <UiField
          v-model="state.name"
          label="이름"
          required
          placeholder="홍길동"
          :maxlength="20"
          autocomplete="name"
        />
        <DateWheelField
          v-model="state.birth"
          label="생년월일"
          required
          :min-year="thisYear - 60"
          :max-year="thisYear"
        />
        <PhoneSegments v-model="state.phone" label="전화번호" required />
        <fieldset>
          <legend class="mb-1.5 text-label text-ink">
            학력<span class="text-danger" aria-hidden="true"> *</span>
            <span class="sr-only"> (필수)</span>
          </legend>
          <select v-model="state.education" aria-label="학력" :class="selectCls">
            <option value="" disabled>선택해 주세요</option>
            <option v-for="e in EDUCATIONS" :key="e" :value="e">{{ e }}</option>
          </select>
        </fieldset>
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
    </template>
  </div>
</template>

<style scoped>
/* 진행바 채움: 마운트 시 0 → 현재 단계, 단계 전환 시 33% → 67% 로 이어서. */
.bar-fill {
  transition: width 360ms var(--ease-out-soft, ease-out);
}
@media (prefers-reduced-motion: reduce) {
  .bar-fill {
    transition: none;
  }
}
</style>
