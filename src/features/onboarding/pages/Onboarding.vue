<script setup lang="ts">
import { useRouter } from 'vue-router'
import UiButton from '@/shared/ui/UiButton.vue'

// Figma "온보딩" — 진행 점 + 건너뛰기(좌측 그룹) → 성장 경로 일러스트 → 카피 → 하단 CTA.
const router = useRouter()
</script>

<template>
  <div class="flex min-h-svh flex-col bg-transparent px-6 pb-7 pt-5">
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-1.5" aria-hidden="true">
        <span class="h-1.5 w-6 rounded-full bg-primary-bright" />
        <span class="h-1.5 w-1.5 rounded-full bg-border" />
        <span class="h-1.5 w-1.5 rounded-full bg-border" />
      </div>
      <button
        type="button"
        class="tap-target text-body-sm font-medium text-muted"
        @click="router.push('/landing')"
      >
        건너뛰기
      </button>
    </div>

    <div class="mt-8 flex flex-col items-center text-center">
      <div class="glass-tint grid w-full max-w-[320px] place-items-center rounded-3xl px-6 py-8">
        <img
          src="/sprout.png"
          alt="씨앗 로고 — 새싹"
          width="444"
          height="434"
          class="h-auto w-40 max-w-full"
        />
      </div>

      <p class="mt-6 text-caption font-bold tracking-wide text-primary">씨앗 SEEAT</p>
      <p id="main" class="mt-2 text-body-lg leading-relaxed text-body">
        보호종료 후 5년, 주거·취업·자금을<br />언제 무엇부터 할지 타임라인 로드맵으로<br />그려드릴게요.
      </p>
    </div>

    <div class="flex-1" />

    <div class="flex flex-col items-center gap-3">
      <UiButton size="lg" block @click="router.push('/signup')">다음</UiButton>
      <RouterLink to="/login" class="text-body-sm font-medium text-primary-dark">
        이미 계정이 있어요
      </RouterLink>
    </div>
  </div>
</template>
