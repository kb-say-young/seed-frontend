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
      <div class="glass-tint w-full max-w-[320px] rounded-3xl px-6 py-8">
        <svg
          viewBox="0 0 260 150"
          fill="none"
          class="w-full"
          role="img"
          aria-label="자립 로드맵 성장 경로 일러스트"
        >
          <path
            d="M20 122 C 60 120 92 92 120 70 C 150 50 164 46 176 44 C 202 40 224 32 240 24"
            stroke="var(--color-primary-dark)"
            stroke-width="3"
            stroke-dasharray="0.5 11"
            stroke-linecap="round"
          />
          <circle cx="20" cy="122" r="14" fill="var(--color-primary-dark)" />
          <path
            d="M13 122 l5 5 l9 -11"
            stroke="#fff"
            stroke-width="2.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle cx="120" cy="70" r="8" fill="var(--color-cat-living)" />
          <circle cx="176" cy="44" r="8" fill="var(--color-cat-work)" />
          <circle cx="240" cy="24" r="11" fill="var(--color-primary-dark)" />
        </svg>
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
