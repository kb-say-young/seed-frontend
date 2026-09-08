<script setup lang="ts">
import { useRouter } from 'vue-router'
import UiButton from '@/shared/ui/UiButton.vue'

// Figma "온보딩" — 로고 → 카피 → 하단 CTA. (단일 화면)
const router = useRouter()
</script>

<template>
  <div class="flex min-h-svh flex-col bg-transparent px-6 pb-7 pt-5">
    <div class="mt-10 flex flex-col items-center text-center">
      <div class="reveal reveal-1 glass-tint grid w-full max-w-[320px] place-items-center rounded-3xl px-6 py-8">
        <img
          src="/sprout.png"
          alt="씨앗 로고 — 새싹"
          width="444"
          height="434"
          class="h-auto w-40 max-w-full"
        />
      </div>

      <p class="reveal reveal-2 mt-6 text-caption font-bold tracking-wide text-primary">씨앗 SEEAT</p>
      <p id="main" class="reveal reveal-3 mt-2 text-body-lg leading-relaxed text-body">
        보호종료 후 5년, 주거·취업·자금을<br />언제 무엇부터 할지 타임라인 로드맵으로<br />그려드릴게요.
      </p>
    </div>

    <div class="flex-1" />

    <div class="reveal reveal-4 flex flex-col items-center gap-3">
      <UiButton size="lg" block @click="router.push('/signup')">다음</UiButton>
      <RouterLink to="/login" class="text-body-sm font-medium text-primary-dark">
        이미 계정이 있어요
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
/* 진입 시 로고 → 카피 → CTA 를 위에서 아래로 한 번만 훑어 시선을 유도한다.
   기능적 모션(방향 안내)만. 반복 없음. prefers-reduced-motion 이면 애니메이션 자체를 걸지 않는다. */
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    animation: onboard-reveal 220ms var(--ease-out-soft) both;
  }
  .reveal-1 {
    animation-delay: 40ms;
  }
  .reveal-2 {
    animation-delay: 120ms;
  }
  .reveal-3 {
    animation-delay: 200ms;
  }
  .reveal-4 {
    animation-delay: 280ms;
  }
}

@keyframes onboard-reveal {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
