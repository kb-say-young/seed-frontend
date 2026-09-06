<script setup lang="ts">
import { ref, computed } from 'vue'
import { Share2 } from 'lucide-vue-next'
import SustainMeter from '@/shared/components/SustainMeter.vue'
import AlertCard from '@/shared/components/AlertCard.vue'
import MilestoneCard from '@/shared/components/MilestoneCard.vue'
import FloatingNav from '@/shared/components/FloatingNav.vue'
import { BUCKETS, MILESTONES } from '@/shared/lib/roadmap'

type Tab = 'all' | 'housing' | 'work' | 'finance' | 'living'
const TABS: { v: Tab; label: string }[] = [
  { v: 'all', label: '전체' },
  { v: 'housing', label: '주거' },
  { v: 'work', label: '소득·취업' },
  { v: 'finance', label: '자금' },
  { v: 'living', label: '안전망' },
]
const tab = ref<Tab>('all')

const buckets = computed(() =>
  BUCKETS.map((b) => ({
    name: b,
    items: MILESTONES.filter((m) => m.bucket === b && (tab.value === 'all' || m.category === tab.value)),
  })).filter((g) => g.items.length > 0),
)
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
      <button type="button" class="tap-target -mr-2 flex items-center justify-center rounded-full text-muted" aria-label="공유">
        <Share2 :size="20" aria-hidden="true" />
      </button>
    </header>

    <main id="main" class="space-y-4 px-5 pb-32 pt-2">
      <SustainMeter :months="34" />
      <AlertCard title="지원이 끝나는 시점이 위험해요" tone="amber">
        2029년 2월 자립수당이 끝나면 예상 월소득이 생활비보다 약 32만원 부족해요.
        지금부터 소득을 올리거나 지출을 줄이면 따라잡을 수 있어요.
      </AlertCard>

      <div class="flex flex-wrap gap-2" role="tablist" aria-label="영역 필터">
        <button
          v-for="t in TABS"
          :key="t.v"
          type="button"
          role="tab"
          :aria-selected="tab === t.v"
          class="min-h-9 rounded-full px-4 text-body-sm font-medium transition-colors"
          :class="tab === t.v ? 'bg-primary text-on-primary' : 'border border-border-strong text-body'"
          @click="tab = t.v"
        >
          {{ t.label }}
        </button>
      </div>

      <section aria-label="타임라인">
        <h2 class="text-label text-ink">타임라인</h2>
        <div v-for="g in buckets" :key="g.name" class="mt-4">
          <p class="flex items-center gap-2 text-body-sm font-semibold text-ink">
            <span class="size-2.5 rounded-full bg-primary-bright" aria-hidden="true" />{{ g.name }}
          </p>
          <div class="mt-3 space-y-3">
            <MilestoneCard
              v-for="m in g.items"
              :key="m.id"
              :to="`/roadmap/${m.id}`"
              :title="m.title"
              :status="m.status"
              :status-text="m.statusText"
              :desc="m.desc"
              :progress="m.progress"
              :action="m.action"
              :category="m.category"
            />
          </div>
        </div>
        <p v-if="buckets.length === 0" class="glass mt-4 rounded-xl p-4 text-body-sm text-muted">
          이 영역에는 아직 계획된 목표가 없어요.
        </p>
      </section>
    </main>

    <FloatingNav />
  </div>
</template>
