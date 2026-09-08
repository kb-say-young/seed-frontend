<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import UiField from '@/shared/ui/UiField.vue'
import UiButton from '@/shared/ui/UiButton.vue'
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
  if (!canNext.value) return
  state.loginId = loginId.value.trim()
  router.push('/signup/profile')
}
</script>

<template>
  <div class="flex min-h-svh flex-col bg-transparent px-6 pb-7 pt-14">
    <h1 class="text-h2 text-ink">회원가입</h1>
    <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-primary-tint" aria-hidden="true">
      <div
        class="bar-fill h-full rounded-full"
        style="width: 33.333%; background: linear-gradient(90deg, color-mix(in srgb, var(--color-primary-bright) 40%, white), var(--color-primary-bright))"
      />
    </div>
    <p class="sr-only">전체 3단계 중 1단계 · 계정</p>

    <form id="main" class="mt-8 flex flex-col gap-4" @submit.prevent="next">
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
      <button type="submit" class="sr-only">다음</button>
    </form>

    <div class="flex-1" />

    <div class="flex flex-col items-center gap-3.5">
      <UiButton size="lg" block :disabled="!canNext" @click="next">다음</UiButton>
      <p class="text-body-sm text-muted">
        이미 계정이 있으신가요?
        <RouterLink to="/login" class="font-bold text-primary-dark">로그인</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* 진입 시 0 → 현재 단계 폭까지 한 번 채워지는 애니메이션. */
.bar-fill {
  animation: bar-fill 360ms var(--ease-out-soft, ease-out) both;
}
@keyframes bar-fill {
  from {
    width: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .bar-fill {
    animation: none;
  }
}
</style>
