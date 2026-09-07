<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import WizardChrome from '@/shared/components/WizardChrome.vue'
import UiField from '@/shared/ui/UiField.vue'
import { userApi, ApiError } from '@/shared/api'
import { state } from '@/features/diagnosis/model/store'

const router = useRouter()
const loginId = ref(state.loginId)
const error = ref('')
const submitting = ref(false)

// 백엔드는 아이디만으로 회원가입 (비밀번호 없음). @Size(min=4, max=30)
const canNext = computed(() => {
  const v = loginId.value.trim()
  return v.length >= 4 && v.length <= 30 && !submitting.value
})

async function next() {
  if (submitting.value) return
  submitting.value = true
  error.value = ''
  try {
    const res = await userApi.signup(loginId.value.trim())
    state.loginId = res.loginId
    router.push('/signup/profile')
  } catch (e) {
    error.value =
      e instanceof ApiError ? e.message : '회원가입에 실패했어요. 잠시 후 다시 시도해 주세요.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <WizardChrome
    title="회원가입"
    :step="1"
    :total="3"
    step-label="계정"
    back-to="/"
    :next-label="submitting ? '확인 중…' : '다음'"
    :can-next="canNext"
    @next="next"
  >
    <p class="text-body-sm text-muted">로그인에 쓸 아이디를 정해요</p>
    <div class="flex flex-col gap-4">
      <UiField
        v-model="loginId"
        label="아이디"
        required
        placeholder="영문·숫자 4~30자"
        :maxlength="30"
        autocomplete="username"
        hint="아이디만으로 로그인해요. 다른 사람에게 보이지 않아요"
        :error="error"
      />
    </div>
  </WizardChrome>
</template>
