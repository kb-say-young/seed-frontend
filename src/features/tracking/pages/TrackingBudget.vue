<script setup lang="ts">
import { computed } from 'vue'
import ViewTogglePage from '@/shared/components/ViewTogglePage.vue'
import { won } from '@/shared/lib/money'
import { ProgressMeter, BarChart } from '@/shared/ui/charts'
import { expenseApi } from '@/shared/api'
import type { BudgetCategory } from '@/shared/api/expense'
import type { FundCategoryKey } from '@/shared/api/fund'
import { useResource, AUTH_REQUIRED_ERROR_CODE } from '@/shared/lib/useResource'

// Figma "기록 · 예산 대비 지출 기록" 변형. 기본 기록(/tracking)과 토글로 전환.
const { data: budget, loading, error, errorCode, reload } = useResource(
  () => expenseApi.getBudgets(),
  { requireAuth: true },
)

const CAT_STYLE: Record<FundCategoryKey, { dot: string; color: string }> = {
  housing: { dot: 'bg-cat-housing', color: 'var(--color-cat-housing)' },
  living: { dot: 'bg-cat-living', color: 'var(--color-cat-living)' },
  work: { dot: 'bg-cat-work', color: 'var(--color-cat-work)' },
  saving: { dot: 'bg-cat-finance', color: 'var(--color-cat-finance)' },
}

function meta(c: BudgetCategory) {
  const pct = c.budget ? Math.round((c.actual / c.budget) * 100) : 0
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

const rows = computed(() =>
  (budget.value?.categories ?? []).map((c) => ({
    ...c,
    style: CAT_STYLE[c.key],
    m: meta(c),
  })),
)
const planRoom = computed(() => (budget.value ? budget.value.plan - budget.value.spent : 0))
</script>

<template>
  <ViewTogglePage
    title="기록"
    :options="[
      { label: '기록', to: '/tracking' },
      { label: '예산 대비', to: '/tracking/budget' },
    ]"
    active="예산 대비"
    spacing="sm"
    :loading="loading"
    :show-error="!!error || !budget"
    :error-message="error ?? '예산 정보를 불러오지 못했어요.'"
    :auth-required="errorCode === AUTH_REQUIRED_ERROR_CODE"
    @reload="reload"
  >
    <template v-if="budget">
      <section class="glass rounded-2xl p-4">
        <div class="flex items-end justify-between">
          <span class="text-body-sm text-muted">이번 달 지출</span>
          <span class="tabular text-h3 font-bold text-ink">{{ won(budget.spent) }}</span>
        </div>
        <p class="mt-1 text-caption text-muted">
          계획 {{ won(budget.plan) }} ·
          {{ planRoom >= 0 ? '아직 여유 있어요' : `${won(-planRoom)} 초과` }}
        </p>
        <BarChart
          class="mt-4"
          :height="116"
          :data="rows.map((c) => ({ label: c.label, value: c.actual, plan: c.budget, color: c.style.color }))"
          :format="(n) => `${Math.round(n / 10000)}만`"
          caption="막대 = 실제 지출 · 가로선 = AI 추천 예산"
        />
      </section>

      <h2 class="text-label text-ink">예산 대비 지출 기록</h2>

      <section v-for="r in rows" :key="r.key" class="glass rounded-2xl p-4">
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-2 text-label font-bold text-ink">
            <span class="size-2.5 rounded-full" :class="r.style.dot" aria-hidden="true" />{{ r.label }}
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

        <ProgressMeter
          class="mt-2.5"
          :value="r.actual"
          :max="r.budget || 1"
          :color="r.m.bar"
          :over="!r.saving"
          :aria-label="`${r.label} 실제 지출 ${won(r.actual)} · 예산 ${won(r.budget)}의 ${r.m.pct}퍼센트 (${r.m.text})`"
        />
        <p class="tabular mt-1 text-right text-caption font-semibold" :class="r.m.pctCls">
          {{ r.m.pct }}%
        </p>
      </section>
    </template>
  </ViewTogglePage>
</template>
