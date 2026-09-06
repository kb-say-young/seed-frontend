<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UiField from '@/shared/ui/UiField.vue'
import UiButton from '@/shared/ui/UiButton.vue'

const router = useRouter()
const id = ref('')
const pw = ref('')
</script>

<template>
  <div class="flex min-h-svh flex-col bg-transparent px-6 pb-7 pt-14">
    <h1 class="text-h2 text-ink">로그인</h1>
    <p class="mt-2 text-body-sm text-muted">아이디와 비밀번호를 입력해 주세요</p>

    <form id="main" class="mt-8 flex flex-col gap-4" @submit.prevent="router.push('/roadmap')">
      <UiField v-model="id" label="아이디" placeholder="아이디 입력" />
      <UiField v-model="pw" label="비밀번호" type="password" placeholder="비밀번호 입력" />
      <button type="button" class="self-start text-body-sm font-medium text-muted">
        비밀번호를 잊으셨나요?
      </button>
    </form>

    <div class="flex-1" />

    <div class="flex flex-col items-center gap-3.5">
      <UiButton size="lg" block @click="router.push('/roadmap')">
        로그인
      </UiButton>
      <p class="text-body-sm text-muted">
        계정이 없으신가요?
        <RouterLink to="/signup" class="font-bold text-primary-dark">회원가입</RouterLink>
      </p>
    </div>
  </div>
</template>
