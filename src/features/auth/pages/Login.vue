<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import UiField from '@/shared/ui/UiField.vue'
import UiButton from '@/shared/ui/UiButton.vue'
import { userApi, ApiError } from '@/shared/api'
import { setTokens } from '@/shared/lib/auth'
import { resetMe, loadMe } from '@/shared/lib/me'
import { state } from '@/features/diagnosis/model/store'

const router = useRouter()
const loginId = ref(state.loginId)
// 비밀번호: 화면에는 두되 백엔드로 보내지 않는다 (현재 계약은 아이디만).
const pw = ref('')
const error = ref('')
const submitting = ref(false)

const canSubmit = computed(
  () => loginId.value.trim().length >= 4 && pw.value.length >= 1 && !submitting.value,
)

async function submit() {
  if (!canSubmit.value) return
  submitting.value = true
  error.value = ''
  try {
    const tokens = await userApi.login(loginId.value.trim())
    setTokens(tokens.accessToken, tokens.refreshToken)
    state.loginId = loginId.value.trim()
    resetMe()
    void loadMe(true)
    router.push('/roadmap')
  } catch (e) {
    error.value =
      e instanceof ApiError
        ? '아이디를 다시 확인해 주세요. 가입한 적이 없다면 회원가입을 해주세요.'
        : '로그인에 실패했어요. 잠시 후 다시 시도해 주세요.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-svh flex-col bg-transparent px-6 pb-7 pt-14">
    <h1 class="text-h2 text-ink">로그인</h1>
    <p class="mt-2 text-body-sm text-muted">아이디와 비밀번호를 입력해 주세요</p>

    <form id="main" class="mt-8 flex flex-col gap-4" @submit.prevent="submit">
      <UiField
        v-model="loginId"
        label="아이디"
        placeholder="아이디 입력"
        autocomplete="username"
        :error="error"
      />
      <UiField
        v-model="pw"
        label="비밀번호"
        type="password"
        placeholder="비밀번호 입력"
        autocomplete="current-password"
      />
      <button type="submit" class="sr-only">로그인</button>
    </form>

    <div class="flex-1" />

    <div class="flex flex-col items-center gap-3.5">
      <UiButton size="lg" block :disabled="!canSubmit" @click="submit">
        {{ submitting ? '로그인 중…' : '로그인' }}
      </UiButton>
      <p class="text-body-sm text-muted">
        계정이 없으신가요?
        <RouterLink to="/signup" class="font-bold text-primary-dark">회원가입</RouterLink>
      </p>
    </div>
  </div>
</template>
