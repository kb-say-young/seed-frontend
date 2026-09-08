<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import lottie from 'lottie-web/build/player/lottie_light'
import type { AnimationItem } from 'lottie-web'
import { userApi, ApiError } from '@/shared/api'
import { isLoggedIn } from '@/shared/lib/auth'
import { buildIntakePayload, IntakeIncompleteError } from '@/features/diagnosis/model/intake'
import plantLoader from '@/features/diagnosis/plant-loader.json'

const router = useRouter()
const errorMsg = ref('')

// 로드맵 생성(LLM 응답) 대기 로더 — LottieFiles "Animated plant loader".
// 대기 화면이라 재생 중 반복하지만, prefers-reduced-motion 이면 정지 프레임만 보여준다.
const box = ref<HTMLElement | null>(null)
let anim: AnimationItem | null = null

// 로그인 상태면 진단 정보를 서버에 제출한다.
// ⚠️ 현재 BE 응답이 204라 diagnosisId 를 못 받음 → 로드맵 조회 연동은 BE #30/#33 확정 후.
// (issue #14). 제출 성공/실패와 무관하게 로드맵 화면(현재 목데이터)으로 진행한다.
async function submit() {
  if (!isLoggedIn()) return
  try {
    await userApi.submitIntake(buildIntakePayload())
  } catch (e) {
    if (e instanceof IntakeIncompleteError) errorMsg.value = e.message
    else if (e instanceof ApiError) errorMsg.value = e.message
    else errorMsg.value = '진단 정보 제출에 실패했어요.'
    // 데모 흐름은 유지 — 콘솔에만 남긴다.
    console.warn('[intake]', e)
  }
}

let t: ReturnType<typeof setTimeout> | undefined
onMounted(() => {
  void submit()
  t = setTimeout(() => router.replace('/roadmap'), 2200)

  if (!box.value) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  anim = lottie.loadAnimation({
    container: box.value,
    renderer: 'svg',
    loop: !reduce,
    autoplay: !reduce,
    animationData: plantLoader,
  })
  if (reduce) anim.goToAndStop(0, true)
})
onUnmounted(() => {
  if (t) clearTimeout(t)
  anim?.destroy()
  anim = null
})

const steps = [
  { t: '받을 수 있는 지원 찾는 중', done: true },
  { t: '시점별 타임라인 배치 중', done: true },
  { t: '자금 배분 계산 중', done: false },
]
</script>

<template>
  <div class="flex min-h-svh flex-col items-center justify-center bg-transparent px-8 text-center">
    <div ref="box" class="size-32" role="img" aria-label="로드맵을 그리는 중"></div>

    <h1 id="main" class="mt-5 text-h3 text-ink">로드맵을 그리고 있어요</h1>
    <p class="mt-2 text-body-sm leading-relaxed text-muted">
      입력한 조건으로 보호종료 후 5년<br />주거·취업·자금 계획을 만드는 중이에요.
    </p>

    <ul class="mt-6 flex flex-col gap-2.5">
      <li v-for="s in steps" :key="s.t" class="flex items-center gap-2.5">
        <span
          class="size-4 rounded-full"
          :class="s.done ? 'bg-primary-bright' : 'bg-border'"
          aria-hidden="true"
        />
        <span class="text-body-sm" :class="s.done ? 'text-ink' : 'text-text-muted'">{{ s.t }}</span>
      </li>
    </ul>

    <p v-if="errorMsg" class="mt-6 text-caption text-amber">{{ errorMsg }}</p>
  </div>
</template>
