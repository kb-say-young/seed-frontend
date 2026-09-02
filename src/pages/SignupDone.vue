<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Check } from 'lucide-vue-next'
import UiButton from '../components/UiButton.vue'

const router = useRouter()
</script>

<template>
  <div class="flex min-h-svh flex-col bg-surface px-6 pb-7 pt-7">
    <div class="flex flex-1 flex-col items-center justify-center text-center">
      <div class="flex size-14 items-center justify-center rounded-full bg-primary-tint">
        <Check :size="28" :stroke-width="2.5" class="text-primary-dark" aria-hidden="true" />
      </div>
      <h1 id="main" class="mt-4 text-h3 text-ink">가입이 끝났어요</h1>
      <p class="mt-2 text-body-sm text-muted">
        이제 진단에 필요한 정보를 입력하면<br />AI가 나에게 맞는 로드맵을 그려줘요.
      </p>
    </div>
    <UiButton size="lg" block @click="router.push('/intake')">진단 정보 입력하기</UiButton>
  </div>
</template>
