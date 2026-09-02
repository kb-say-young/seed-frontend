<script setup lang="ts">
import { computed } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import FloatingNav from '../components/FloatingNav.vue'
import ViewToggle from '../components/ViewToggle.vue'
import { won } from '../lib/money'

// Figma "기록 · 예산 대비 지출 기록" 변형. 기본 기록(/tracking)과 토글로 전환.
interface Cat {
  label: string
  budget: number
  actual: number
  dot: string
  saving?: boolean
}
const cats: Cat[] = [
  { label: '주거', budget: 600_000, actual: 520_000, dot: 'bg-cat-housing' },
  { label: '생활', budget: 375_000, actual: 410_000, dot: 'bg-cat-living' },
  { label: '취·창업', budget: 300_000, actual: 180_000, dot: 'bg-cat-work' },
  { label: '저축', budget: 225_000, actual: 130_000, dot: 'bg-cat-finance', saving: true },
]

function meta(c: Cat) {
  const pct = Math.round((c.actual / c.budget) * 100)
  if (c.saving) {
    return pct >= 100
      ? { pct, text: '목표 달성', badge: 'bg-primary-tint text-primary-dark', bar: 'var(--color-primary)', pctCls: 'text-primary-dark' }
      : { pct, text: '더 모아야 해요', badge: 'bg-amber-tint text-amber', bar: 'var(--color-primary)', pctCls: 'text-primary-dark' }
  }
  if (pct > 100)
    return { pct, text: '초과', badge: 'bg-danger-tint text-danger', bar: 'var(--color-danger)', pctCls: 'text-danger' }
  if (pct >= 80)
    return { pct, text: '절약 중', badge: 'bg-primary-tint text-primary-dark', bar: 'var(--color-amber)', pctCls: 'text-amber' }
  return { pct, text: '여유 있음', badge: 'bg-primary-tint text-primary-dark', bar: 'var(--color-primary)', pctCls: 'text-muted' }
}

const rows = computed(() => cats.map((c) => ({ ...c, m: meta(c) })))
</script>

<template>
  <div class="min-h-svh bg-surface-subtle">
    <AppHeader title="기록" to="/roadmap" />
    <main id="main" class="space-y-3 px-5 pb-32 pt-2">
      <ViewToggle
        :options="[
          { label: '기록', to: '/tracking' },
          { label: '예산 대비', to: '/tracking/budget' },
        ]"
        active="예산 대비"
      />

      <section class="rounded-2xl border border-border bg-surface p-4">
        <div class="flex items-end justify-between">
          <span class="text-body-sm text-muted">이번 달 지출</span>
          <span class="tabular text-h3 font-bold text-ink">{{ won(1_240_000) }}</span>
        </div>
        <p class="mt-1 text-caption text-muted">계획 1,300,000원 · 아직 여유 있어요</p>
      </section>

      <h2 class="text-label text-ink">예산 대비 지출 기록</h2>

      <section
        v-for="r in rows"
        :key="r.label"
        class="rounded-2xl border border-border bg-surface p-4"
      >
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-2 text-label font-bold text-ink">
            <span class="size-2.5 rounded-full" :class="r.dot" aria-hidden="true" />{{ r.label }}
          </span>
          <span class="rounded-full px-2.5 py-1 text-caption font-semibold" :class="r.m.badge">
            {{ r.m.text }}
          </span>
        </div>

        <div class="mt-3 flex items-end justify-between">
          <div>
            <p class="text-caption text-muted">AI 추천 예산</p>
            <p class="tabular text-body-sm font-semibold text-body">{{ won(r.budget) }}</p>
          </div>
          <div class="text-right">
            <p class="text-caption text-muted">실제 지출</p>
            <p class="tabular text-body-sm font-bold text-ink">{{ won(r.actual) }}</p>
          </div>
        </div>

        <div
          class="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-surface-subtle"
          aria-hidden="true"
        >
          <div
            class="h-full rounded-full"
            :style="{ width: `${Math.min(r.m.pct, 100)}%`, background: r.m.bar }"
          />
        </div>
        <p class="tabular mt-1 text-right text-caption font-semibold" :class="r.m.pctCls">
          {{ r.m.pct }}%
        </p>
      </section>
    </main>
    <FloatingNav />
  </div>
</template>
