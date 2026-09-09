<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Share2, ChevronRight } from 'lucide-vue-next'
import FloatingNav from '@/shared/components/FloatingNav.vue'
import UiButton from '@/shared/ui/UiButton.vue'
import MilestoneSlideCard from '@/features/diagnosis/components/MilestoneSlideCard.vue'
import { roadmapApi, diagnosisApi, ApiError } from '@/shared/api'
import type { MilestoneBucket, MilestoneCategory } from '@/shared/api/roadmap'
import type { Recommendation, RecommendationCategory } from '@/shared/api/diagnosis'
import { setDiagnosisId } from '@/shared/lib/diagnosis'
import { useResource, AUTH_REQUIRED_ERROR_CODE } from '@/shared/lib/useResource'
import { manwon } from '@/shared/lib/money'

// Reading this as: 진단결과 페이지네이션 슬라이드 for 취약계층 청소년, trust-first, DENSITY 3.

const router = useRouter()

const {
  data: roadmap,
  loading,
  error,
  errorCode,
  reload,
} = useResource(roadmapApi.getRoadmap, {
  requireAuth: true,
})

// 백엔드가 그 사용자 명의의 진단을 하나도 못 찾으면 DIAGNOSIS_404_001 로 내려준다
// (아직 진단을 한 번도 안 끝낸 경우). 이땐 재시도가 무의미하므로 진단 입력으로 보낸다.
const noDiagnosis = computed(() => errorCode.value === 'DIAGNOSIS_404_001')
const authRequired = computed(() => errorCode.value === AUTH_REQUIRED_ERROR_CODE)

function goToIntake() {
  router.push('/intake')
}

type Tab = 'all' | MilestoneCategory
const TABS: { v: Tab; label: string }[] = [
  { v: 'all', label: '전체' },
  { v: 'housing', label: '주거' },
  { v: 'living', label: '생활' },
  { v: 'work', label: '취·창업' },
  { v: 'finance', label: '금융' },
]
const tab = ref<Tab>('all')

// 4구간 슬라이드 — 짧은 라벨(선택 pill)과 긴 라벨(본문 heading)
const SLIDE_LABELS = ['6개월 이내', '1년 이내', '1~3년', '3~5년']
const BUCKET_LABELS = ['지금 · 앞으로 6개월', '6개월 ~ 1년', '1 ~ 3년', '3 ~ 5년 (자립수당 종료 대비)']
const BUCKET_ORDER: MilestoneBucket[] = ['within6m', 'within1y', 'y1to3', 'y3to5']
const slide = ref(0)

const items = computed(() => {
  const list = roadmap.value?.milestones ?? []
  return list.filter(
    (m) =>
      m.bucket === BUCKET_ORDER[slide.value] && (tab.value === 'all' || m.category === tab.value),
  )
})

// 백엔드 로드맵 응답에는 아직 milestones 가 없고 기준 diagnosisId 만 온다.
// 그 id 로 추천(로드맵) 목록을 불러 카드로 보여준다. milestones 가 생기면 그쪽이 우선.
const hasMilestones = computed(() => (roadmap.value?.milestones?.length ?? 0) > 0)

const CATEGORY_PARAM: Record<MilestoneCategory, RecommendationCategory> = {
  housing: 'HOUSING',
  living: 'LIVING',
  work: 'JOB_STARTUP',
  finance: 'FINANCE',
}

const recos = ref<Recommendation[]>([])
const recosLoading = ref(false)
const recosError = ref<string | null>(null)

async function loadRecommendations() {
  const id = roadmap.value?.diagnosisId
  if (id == null || hasMilestones.value) {
    recos.value = []
    return
  }
  setDiagnosisId(id)

  recosLoading.value = true
  recosError.value = null
  try {
    recos.value = await diagnosisApi.getRecommendations(
      id,
      tab.value === 'all' ? undefined : CATEGORY_PARAM[tab.value],
    )
  } catch (e) {
    recos.value = []
    recosError.value = e instanceof ApiError ? e.message : '진단 결과를 불러오지 못했어요.'
  } finally {
    recosLoading.value = false
  }
}

// 진단이 바뀌거나(최초 로드 포함) 카테고리 탭을 옮기면 다시 불러온다.
watch(() => [roadmap.value?.diagnosisId, tab.value], loadRecommendations, { immediate: true })

const securedPct = computed(() => {
  const s = roadmap.value?.summary
  if (!s || !s.totalCost) return 0
  return Math.round((s.securedAmount / s.totalCost) * 100)
})

// 슬라이드 전환 방향(다음=오른쪽에서, 이전=왼쪽에서). reduced-motion 이면 style.css 에서 정지.
const slideDir = ref<'fwd' | 'back'>('fwd')
function goSlide(i: number) {
  if (i < 0 || i > 3 || i === slide.value) return
  slideDir.value = i > slide.value ? 'fwd' : 'back'
  slide.value = i
}

// 스와이프(강화용). 드래그 전용 금지 규칙 준수 위해 pill 버튼이 1차 수단.
let touchX = 0
function onTouchStart(e: TouchEvent) {
  touchX = e.changedTouches[0].clientX
}
function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - touchX
  if (Math.abs(dx) < 56) return
  goSlide(slide.value + (dx < 0 ? 1 : -1))
}
</script>

<template>
  <div class="relative min-h-svh bg-transparent px-6 pb-32 pt-14">
    <header class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-h2 text-ink">내 진단결과</h1>
      </div>
      <button
        type="button"
        class="tap-target -mr-2 flex items-center justify-center rounded-full text-muted"
        aria-label="진단결과 공유"
      >
        <Share2 :size="20" aria-hidden="true" />
      </button>
    </header>

    <main id="main" class="mt-8 space-y-4">
      <p v-if="loading" class="py-16 text-center text-body-sm text-muted">불러오는 중…</p>

      <div v-else-if="error" class="py-16 text-center">
        <p class="text-body-sm text-muted">{{ error }}</p>
        <UiButton v-if="noDiagnosis" class="mt-3" @click="goToIntake">진단하러 가기</UiButton>
        <UiButton v-else-if="authRequired" class="mt-3" @click="router.push('/login')"
          >로그인하러 가기</UiButton
        >
        <UiButton v-else variant="secondary" class="mt-3" @click="reload">다시 시도</UiButton>
      </div>

      <template v-else-if="roadmap">
        <!-- 예산 확보 현황 -->
        <section class="glass rounded-2xl p-4" aria-labelledby="runway-label">
          <div class="flex items-end justify-between">
            <span id="runway-label" class="text-body-sm text-muted">예산 확보 현황</span>
            <span class="tabular text-[1.75rem] font-extrabold leading-none text-ink"
              >{{ securedPct }}%</span
            >
          </div>
          <div
            class="mt-3 flex h-2 overflow-hidden rounded-full bg-[var(--chart-track)]"
            role="img"
            :aria-label="`전체 예상 비용의 ${securedPct}퍼센트 확보`"
          >
            <span class="h-full bg-amber" :style="{ width: `${100 - securedPct}%` }" />
            <span class="h-full bg-primary-bright" :style="{ width: `${securedPct}%` }" />
          </div>
          <p class="mt-2 text-caption text-muted">
            전체 예상 비용 {{ manwon(roadmap.summary.totalCost) }} · 현재 확보
            {{ manwon(roadmap.summary.securedAmount) }}
          </p>
        </section>

        <!-- 자금 계획 바로가기 -->
        <RouterLink
          to="/fund"
          class="glass-tint flex items-center gap-3 rounded-2xl p-4 no-underline"
        >
          <span class="min-w-0 flex-1">
            <span class="block text-label font-bold text-primary-dark">나의 자금 계획 보기</span>
            <span class="mt-0.5 block text-body-sm text-body"
              >AI 추천 예산과 나의 예산 배분 확인</span
            >
          </span>
          <ChevronRight :size="20" class="shrink-0 text-primary-dark" aria-hidden="true" />
        </RouterLink>

        <!-- 카테고리 필터 -->
        <div class="-mx-6 overflow-x-auto px-6">
          <div class="flex gap-2" role="tablist" aria-label="영역 필터">
            <button
              v-for="t in TABS"
              :key="t.v"
              type="button"
              role="tab"
              :aria-selected="tab === t.v"
              class="min-h-9 shrink-0 rounded-full px-4 text-body-sm font-medium transition-colors"
              :class="tab === t.v ? 'bg-primary text-on-primary' : 'glass-field text-body'"
              @click="tab = t.v"
            >
              {{ t.label }}
            </button>
          </div>
        </div>

        <!-- 구간 슬라이드 선택 — 추천 목록에는 시점 구간 정보가 없어 milestones 가 있을 때만 -->
        <div v-if="hasMilestones" class="-mx-6 overflow-x-auto px-6">
          <div class="flex gap-2" role="tablist" aria-label="시점 구간">
            <button
              v-for="(label, i) in SLIDE_LABELS"
              :key="i"
              type="button"
              role="tab"
              :aria-selected="slide === i"
              class="min-h-9 shrink-0 rounded-full px-4 text-body-sm font-medium transition-colors"
              :class="slide === i ? 'bg-primary-tint font-bold text-primary-dark' : 'text-muted'"
              @click="goSlide(i)"
            >
              {{ label }}
            </button>
          </div>
        </div>

        <section
          aria-label="타임라인"
          @touchstart.passive="onTouchStart"
          @touchend.passive="onTouchEnd"
        >
          <p v-if="hasMilestones" class="text-caption font-bold tracking-wide text-muted">
            {{ BUCKET_LABELS[slide] }}
          </p>

          <!-- :key 리마운트 + CSS 애니메이션. Vue <Transition> 미사용(숨은 탭에서 rAF 스로틀 시 스턱 방지). -->
          <div
            v-if="hasMilestones"
            :key="slide"
            class="mt-3 space-y-2.5"
            :class="`slide-in-${slideDir}`"
          >
            <MilestoneSlideCard
              v-for="m in items"
              :key="m.id"
              :to="`/roadmap/${m.id}`"
              :title="m.title"
              :status="m.status"
              :tasks-done="m.checklist.filter((c) => c.done).length"
              :tasks-total="m.checklist.length"
            />
            <p v-if="items.length === 0" class="glass rounded-2xl p-4 text-body-sm text-muted">
              이 구간에는 해당 영역 목표가 없어요.
            </p>
          </div>

          <!-- milestones 가 오기 전까지는 진단 추천 목록을 그대로 보여준다. -->
          <div v-else class="mt-3 space-y-2.5">
            <p v-if="recosLoading" class="py-10 text-center text-body-sm text-muted">
              진단 결과를 불러오는 중…
            </p>
            <div v-else-if="recosError" class="glass rounded-2xl p-4">
              <p class="text-body-sm text-muted">{{ recosError }}</p>
              <UiButton variant="secondary" class="mt-3" @click="reload">다시 시도</UiButton>
            </div>
            <template v-else>
              <MilestoneSlideCard
                v-for="r in recos"
                :key="r.recommendationId"
                :to="`/roadmap/${r.recommendationId}`"
                :title="r.title"
                :status="r.status"
                :tasks-done="0"
                :tasks-total="0"
              />
              <p v-if="recos.length === 0" class="glass rounded-2xl p-4 text-body-sm text-muted">
                이 영역에 해당하는 목표가 없어요.
              </p>
            </template>
          </div>

          <!-- 슬라이드 위치 표시 -->
          <div v-if="hasMilestones" class="mt-4 flex items-center justify-center gap-2" aria-hidden="true">
            <span
              v-for="i in 4"
              :key="i"
              class="h-1.5 rounded-full transition-all"
              :class="slide === i - 1 ? 'w-5 bg-primary-bright' : 'w-1.5 bg-border-strong'"
            />
          </div>
          <p v-if="hasMilestones" class="sr-only" role="status">
            전체 4개 구간 중 {{ slide + 1 }}번째
          </p>

          <div v-if="hasMilestones" class="mt-3 flex justify-between">
            <button
              type="button"
              class="tap-target rounded-full px-4 text-body-sm font-semibold text-primary-dark disabled:opacity-30"
              :disabled="slide === 0"
              @click="goSlide(slide - 1)"
            >
              ← 이전 구간
            </button>
            <button
              type="button"
              class="tap-target rounded-full px-4 text-body-sm font-semibold text-primary-dark disabled:opacity-30"
              :disabled="slide === 3"
              @click="goSlide(slide + 1)"
            >
              다음 구간 →
            </button>
          </div>
        </section>
      </template>
    </main>

    <FloatingNav />
  </div>
</template>

<style scoped>
/* 구간 전환 시 방향 힌트(16px 슬라이드-인). :key 리마운트로 매번 재생. */
.slide-in-fwd {
  animation: slide-in-fwd 0.2s var(--ease-out-soft);
}
.slide-in-back {
  animation: slide-in-back 0.2s var(--ease-out-soft);
}
@keyframes slide-in-fwd {
  from {
    opacity: 0;
    transform: translateX(16px);
  }
}
@keyframes slide-in-back {
  from {
    opacity: 0;
    transform: translateX(-16px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .slide-in-fwd,
  .slide-in-back {
    animation: none;
  }
}
</style>
