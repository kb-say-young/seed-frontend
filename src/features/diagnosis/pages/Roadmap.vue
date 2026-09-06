<script setup lang="ts">
// TODO(#14): GET /api/diagnoses/{diagnosisId}/recommendations 로 교체.
//   차단: me/intake 응답이 204라 diagnosisId 를 못 받음 → BE #30/#33 확정 대기.
//   현재는 shared/lib/roadmap.ts 목데이터 사용.
import { ref, computed } from 'vue'
import { Share2, ChevronRight } from 'lucide-vue-next'
import FloatingNav from '@/shared/components/FloatingNav.vue'
import MilestoneSlideCard from '@/features/diagnosis/components/MilestoneSlideCard.vue'
import { BUCKETS, MILESTONES, ROADMAP_SUMMARY } from '@/shared/lib/roadmap'
import { manwon } from '@/shared/lib/money'

// Reading this as: 진단결과 페이지네이션 슬라이드 for 취약계층 청소년, trust-first, DENSITY 3.

type Tab = 'all' | 'housing' | 'living' | 'work' | 'finance'
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
const slide = ref(0)

const items = computed(() =>
  MILESTONES.filter(
    (m) => m.bucket === BUCKETS[slide.value] && (tab.value === 'all' || m.category === tab.value),
  ),
)

const s = ROADMAP_SUMMARY
const securedPct = Math.round((s.securedAmount / s.totalCost) * 100)

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
  <div class="relative bg-transparent">
    <header
      class="glass-strong z-10 flex items-start justify-between border-x-0 border-t-0 px-5 pb-3 pt-3"
      style="padding-top: max(0.75rem, env(safe-area-inset-top))"
    >
      <div>
        <h1 class="text-h3 text-ink">내 진단결과</h1>
        <p class="mt-0.5 text-caption text-muted">보호종료 2024.02 기준 · 2029.02까지 5년 계획</p>
      </div>
      <button
        type="button"
        class="tap-target -mr-2 flex items-center justify-center rounded-full text-muted"
        aria-label="진단결과 공유"
      >
        <Share2 :size="20" aria-hidden="true" />
      </button>
    </header>

    <main id="main" class="space-y-4 px-5 pb-32 pt-3">
      <!-- 예산 확보 런웨이 -->
      <section class="glass rounded-2xl p-4" aria-labelledby="runway-label">
        <div class="flex items-end justify-between">
          <span id="runway-label" class="text-body-sm text-muted">예산 확보까지</span>
          <span class="tabular text-[1.75rem] font-extrabold leading-none text-ink"
            >{{ s.securedMonths }}개월</span
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
          전체 예상 비용 {{ manwon(s.totalCost) }} · 현재 확보 {{ manwon(s.securedAmount) }}
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
      <div class="-mx-5 overflow-x-auto px-5">
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

      <!-- 구간 슬라이드 선택 -->
      <div class="-mx-5 overflow-x-auto px-5">
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
        <p class="text-caption font-bold tracking-wide text-muted">{{ BUCKETS[slide] }}</p>
        <!-- :key 리마운트 + CSS 애니메이션. Vue <Transition> 미사용(숨은 탭에서 rAF 스로틀 시 스턱 방지). -->
        <div :key="slide" class="mt-3 space-y-2.5" :class="`slide-in-${slideDir}`">
          <MilestoneSlideCard
            v-for="m in items"
            :key="m.id"
            :to="`/roadmap/${m.id}`"
            :title="m.title"
            :status="m.status"
            :tasks-done="m.checklist?.filter((c) => c.done).length ?? 0"
            :tasks-total="m.checklist?.length ?? 0"
          />
          <p v-if="items.length === 0" class="glass rounded-2xl p-4 text-body-sm text-muted">
            이 구간에는 해당 영역 목표가 없어요.
          </p>
        </div>

        <!-- 슬라이드 위치 표시 -->
        <div class="mt-4 flex items-center justify-center gap-2" aria-hidden="true">
          <span
            v-for="i in 4"
            :key="i"
            class="h-1.5 rounded-full transition-all"
            :class="slide === i - 1 ? 'w-5 bg-primary-bright' : 'w-1.5 bg-border-strong'"
          />
        </div>
        <p class="sr-only" role="status">전체 4개 구간 중 {{ slide + 1 }}번째</p>

        <div class="mt-3 flex justify-between">
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
