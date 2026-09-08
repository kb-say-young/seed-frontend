<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import WizardChrome from '@/shared/components/WizardChrome.vue'
import UiField from '@/shared/ui/UiField.vue'
import { state } from '@/features/diagnosis/model/store'

const router = useRouter()
const loginId = ref(state.loginId)
// 비밀번호: 화면에는 두되 백엔드로 보내지 않는다 (현재 계약은 아이디만).
const pw = ref('')

// @Size(min=4, max=30) 아이디 + 비밀번호 8자 이상(클라이언트 형식 확인용).
// 실제 가입 요청(POST /api/users/signup)은 다음 단계(인적 사항)까지 마친 뒤 한 번만 보낸다.
const canNext = computed(() => {
  const v = loginId.value.trim()
  return v.length >= 4 && v.length <= 30 && pw.value.length >= 8
})

function next() {
  state.loginId = loginId.value.trim()
  router.push('/signup/profile')
}
</script>

<template>
  <WizardChrome
    title="회원가입"
    :step="1"
    :total="3"
    step-label="계정"
    back-to="/"
    :can-next="canNext"
    @next="next"
  >
    <p class="text-body-sm text-muted">로그인에 쓸 아이디와 비밀번호를 정해요</p>
    <div class="flex flex-col gap-4">
      <UiField
        v-model="loginId"
        label="아이디"
        required
        placeholder="영문·숫자 4~30자"
        :maxlength="30"
        autocomplete="username"
        hint="다른 사람에게 보이지 않아요"
      />
      <UiField
        v-model="pw"
        label="비밀번호"
        type="password"
        required
        placeholder="8자 이상"
        autocomplete="new-password"
        hint="영문·숫자·기호를 섞으면 더 안전해요"
      />
    </div>
  </WizardChrome>
</template>
