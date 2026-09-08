<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import lottie from 'lottie-web/build/player/lottie_light'
import type { AnimationItem } from 'lottie-web'
import UiButton from '@/shared/ui/UiButton.vue'
import { userApi, roadmapApi, ApiError } from '@/shared/api'
import { isLoggedIn } from '@/shared/lib/auth'
import { buildIntakePayload, IntakeIncompleteError } from '@/features/diagnosis/model/intake'
import plantLoader from '@/features/diagnosis/plant-loader.json'

const router = useRouter()

// 실제 백엔드 흐름에 연동된 진행 단계.
//  submitting : POST /api/users/me/intake 제출 중
//  generating : 로드맵(LLM 결과) 준비 대기 — GET /api/users/me/roadmap
//  error      : 제출/생성 실패 → 재시도 안내 (로드맵으로 진행하지 않음)
type Phase = 'submitting' | 'generating' | 'error'
const phase = ref<Phase>('submitting')
const errorMsg = ref('')
const slow = ref(false) // 예상보다 오래 걸릴 때만 노출하는 안내(카운트다운·압박 아님)

// 로드맵 생성(LLM 응답) 대기 로더 — LottieFiles "Animated plant loader".
// 대기 화면이라 반복 재생하지만, prefers-reduced-motion 이면 정지 프레임만 보여준다.
const box = ref<HTMLElement | null>(null)
let anim: AnimationItem | null = null

const MIN_VISIBLE_MS = 1200 // 응답이 즉시 와도 로더가 깜빡이지 않도록 최소 노출
const ROADMAP_TRIES = 4 // 로드맵 조회 재시도 — LLM 처리 지연 대비
const ROADMAP_GAP_MS = 1500
const SLOW_AFTER_MS = 12000

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

let slowTimer: ReturnType<typeof setTimeout> | undefined
let cancelled = false

function armSlowTimer() {
  if (slowTimer) clearTimeout(slowTimer)
  slow.value = false
  slowTimer = setTimeout(() => (slow.value = true), SLOW_AFTER_MS)
}
function clearSlowTimer() {
  if (slowTimer) clearTimeout(slowTimer)
  slowTimer = undefined
}

// 로드맵이 준비될 때까지 짧게 재시도하며 기다린다. (intake 직후엔 아직 생성 중일 수 있음)
async function waitForRoadmap() {
  let lastErr: unknown
  for (let i = 0; i < ROADMAP_TRIES && !cancelled; i++) {
    try {
      return await roadmapApi.getRoadmap()
    } catch (e) {
      lastErr = e
      if (i < ROADMAP_TRIES - 1) await sleep(ROADMAP_GAP_MS)
    }
  }
  throw lastErr
}

async function run() {
  const startedAt = Date.now()
  armSlowTimer()
  try {
    // 비로그인(둘러보기)은 제출 대상이 없다 — 최소 노출 후 결과(목/폴백) 화면으로.
    if (isLoggedIn()) {
      phase.value = 'submitting'
      await userApi.submitIntake(buildIntakePayload())

      phase.value = 'generating'
      await waitForRoadmap()
    }

    const elapsed = Date.now() - startedAt
    if (elapsed < MIN_VISIBLE_MS) await sleep(MIN_VISIBLE_MS - elapsed)
    if (!cancelled) router.replace('/roadmap')
  } catch (e) {
    if (cancelled) return
    if (e instanceof IntakeIncompleteError) errorMsg.value = e.message
    else if (e instanceof ApiError) errorMsg.value = e.message
    else errorMsg.value = '진단 결과를 만드는 중 문제가 생겼어요.'
    phase.value = 'error'
    console.warn('[diagnosing]', e)
  } finally {
    clearSlowTimer()
  }
}

function retry() {
  errorMsg.value = ''
  phase.value = 'submitting'
  void run()
}

onMounted(() => {
  void run()

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
  cancelled = true
  clearSlowTimer()
  anim?.destroy()
  anim = null
})

// 제출이 끝나면 첫 단계 완료로 표시. 이후 단계는 로드맵 도착 직전까지 진행 중.
const submitted = computed(() => phase.value === 'generating')
const steps = computed(() => [
  { t: '받을 수 있는 지원 찾는 중', done: submitted.value },
  { t: '시점별 타임라인 배치 중', done: false },
  { t: '자금 배분 계산 중', done: false },
])
</script>

<template>
  <div class="flex min-h-svh flex-col items-center justify-center bg-transparent px-8 text-center">
    <div ref="box" class="size-32" role="img" aria-label="로드맵을 그리는 중"></div>

    <template v-if="phase !== 'error'">
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

      <p v-if="slow" class="mt-6 text-caption text-muted" role="status">
        거의 다 됐어요. 잠시만 기다려 주세요.
      </p>
    </template>

    <template v-else>
      <h1 id="main" class="mt-5 text-h3 text-ink">잠시 문제가 생겼어요</h1>
      <p class="mt-2 text-body-sm leading-relaxed text-muted" role="alert">{{ errorMsg }}</p>
      <div class="mt-6 flex w-full max-w-xs flex-col gap-2.5">
        <UiButton size="lg" block @click="retry">다시 시도</UiButton>
        <RouterLink
          to="/intake"
          class="tap-target text-body-sm font-semibold text-primary-dark no-underline"
        >
          입력 화면으로 돌아가기
        </RouterLink>
      </div>
    </template>
  </div>
</template>
