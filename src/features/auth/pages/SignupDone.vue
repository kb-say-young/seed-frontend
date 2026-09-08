<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import lottie from 'lottie-web/build/player/lottie_light'
import type { AnimationItem } from 'lottie-web'
import UiButton from '@/shared/ui/UiButton.vue'
import successCheck from '@/features/auth/success-check.json'

// 가입 완료 체크 애니메이션 (LottieFiles "Success Check"). 1회 재생, 반복 없음.
// 애니메이션이 끝나면 나머지 UI(제목 → 설명 → 버튼)가 차례로 나타난다.
// prefers-reduced-motion 이면 애니메이션은 마지막 프레임 정지, UI 는 즉시 표시.
const router = useRouter()
const box = ref<HTMLElement | null>(null)
const revealed = ref(false)
let anim: AnimationItem | null = null
let fallback: ReturnType<typeof setTimeout> | undefined

function reveal() {
  revealed.value = true
  if (fallback) clearTimeout(fallback)
}

onMounted(() => {
  if (!box.value) {
    reveal()
    return
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  anim = lottie.loadAnimation({
    container: box.value,
    renderer: 'svg',
    loop: false,
    autoplay: !reduce,
    animationData: successCheck,
  })
  if (reduce) {
    anim.goToAndStop(Math.max(0, anim.totalFrames - 1), true)
    reveal()
    return
  }
  anim.addEventListener('complete', reveal)
  // 재생이 막히는 상황(백그라운드 탭 등) 대비 — 애니메이션 길이(약 2.2초) + 여유
  fallback = setTimeout(reveal, 2600)
})

onBeforeUnmount(() => {
  if (fallback) clearTimeout(fallback)
  anim?.destroy()
  anim = null
})
</script>

<template>
  <div class="flex min-h-svh flex-col bg-transparent px-6 pb-7 pt-7">
    <div class="flex flex-1 flex-col items-center justify-center text-center">
      <div ref="box" class="size-28" role="img" aria-label="가입 완료"></div>
      <h1
        id="main"
        class="reveal mt-4 text-h3 text-ink"
        :class="{ shown: revealed }"
        style="transition-delay: 0ms"
      >
        가입이 끝났어요
      </h1>
      <p
        class="reveal mt-2 text-body-sm text-muted"
        :class="{ shown: revealed }"
        style="transition-delay: 90ms"
      >
        이제 진단에 필요한 정보를 입력하면<br />AI가 나에게 맞는 로드맵을 그려줘요.
      </p>
    </div>
    <UiButton
      size="lg"
      block
      class="reveal"
      :class="{ shown: revealed }"
      style="transition-delay: 180ms"
      @click="router.push('/intake')"
      >진단 정보 입력하기</UiButton
    >
  </div>
</template>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 320ms var(--ease-out-soft, ease-out),
    transform 320ms var(--ease-out-soft, ease-out);
}
.reveal.shown {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .reveal {
    transition: none;
  }
}
</style>
