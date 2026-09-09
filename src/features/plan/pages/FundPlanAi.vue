<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Lock, Pencil } from 'lucide-vue-next'
import ViewTogglePage from '@/shared/components/ViewTogglePage.vue'
import { won, manwon } from '@/shared/lib/money'
import { StackedBar, RingChart } from '@/shared/ui/charts'
import { fundApi } from '@/shared/api'
import type { FundCategoryKey } from '@/shared/api/fund'
import { useResource } from '@/shared/lib/useResource'

// Figma "자금 계획 · AI 추천 예산" 변형. 목적별 배분 요약(/fund)과 토글로 전환.
// 배분 슬라이더는 도넛을 즉시 갱신하되 저장은 배분 비율 조정(/fund/allocation)에서.
const { data: ai, loading, error, reload } = useResource(() => fundApi.getFundAi(), {
  requireAuth: true,
})

const CAT_STYLE: Record<FundCategoryKey, { dot: string; color: string }> = {
  housing: { dot: 'bg-cat-housing', color: 'var(--color-cat-housing)' },
  living: { dot: 'bg-cat-living', color: 'var(--color-cat-living)' },
  work: { dot: 'bg-cat-work', color: 'var(--color-cat-work)' },
  saving: { dot: 'bg-cat-finance', color: 'var(--color-cat-finance)' },
}

// 슬라이더용 로컬 편집 상태 — 응답의 myAllocation 으로 초기화
const rows = ref<{ key: FundCategoryKey; label: string; pct: number; accent: string }[]>([])
watch(
  ai,
  (v) => {
    if (!v) return
    rows.value = v.myAllocation.map((a) => ({
      key: a.key,
      label: a.label,
      pct: a.pct,
      accent: CAT_STYLE[a.key].color,
    }))
  },
  { immediate: true },
)

const sum = computed(() => rows.value.reduce((a, r) => a + r.pct, 0))
const amount = (pct: number) => Math.round(((ai.value?.monthlyBudget ?? 0) * pct) / 100)
</script>

<template>
  <ViewTogglePage
    title="자금 계획"
    :options="[
      { label: 'AI 추천', to: '/fund/ai' },
      { label: '목적별 배분', to: '/fund' },
    ]"
    active="AI 추천"
    :loading="loading"
    :show-error="!!error || !ai"
    :error-message="error ?? '추천 예산을 불러오지 못했어요.'"
    @reload="reload"
  >
    <template v-if="ai">
      <section>
        <div class="flex items-center gap-1.5">
          <h2 class="text-label text-ink">AI 추천 예산</h2>
          <Lock :size="13" class="text-muted" aria-hidden="true" />
          <span class="text-caption text-muted">로드맵 기반 자동 산출</span>
        </div>

        <div class="mt-3 glass rounded-2xl p-4">
          <div class="glass rounded-xl p-4">
            <p class="text-body-sm text-muted">추천 자립 자금 총액</p>
            <p class="tabular mt-1 text-h1 text-ink">{{ won(ai.recommendedTotal) }}</p>
            <StackedBar
              class="mt-3"
              :height="12"
              :legend="false"
              :segments="ai.recommended.map((r) => ({ label: r.label, value: r.pct, color: CAT_STYLE[r.key].color }))"
            />
          </div>

          <ul class="mt-3 space-y-2.5">
            <li v-for="r in ai.recommended" :key="r.key" class="flex items-center gap-2">
              <span class="size-2.5 shrink-0 rounded-full" :class="CAT_STYLE[r.key].dot" aria-hidden="true" />
              <span class="flex-1 truncate text-body-sm text-ink">
                {{ r.label }} <span class="text-muted">({{ r.pct }}%)</span>
              </span>
              <span class="shrink-0 whitespace-nowrap tabular text-body-sm font-semibold text-ink">
                <template v-if="r.budget">{{ manwon(r.actual ?? 0) }}/{{ manwon(r.budget) }}</template>
                <template v-else>{{ won(r.amount ?? 0) }}</template>
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section>
        <div class="flex items-center justify-between">
          <h2 class="text-label text-ink">나의 예산 배분</h2>
          <RouterLink
            to="/fund/allocation"
            class="flex items-center gap-1 text-caption font-semibold text-primary-dark no-underline"
          >
            <Pencil :size="13" aria-hidden="true" />직접 조정 가능
          </RouterLink>
        </div>

        <div class="mt-3 glass rounded-2xl p-4">
          <p class="text-body-sm text-muted">총 가용 예산</p>
          <p class="tabular mt-0.5 text-h2 text-primary-dark">월 {{ won(ai.monthlyBudget) }}</p>

          <div class="mt-4 space-y-4 border-t border-border pt-4">
            <div v-for="r in rows" :key="r.key">
              <div class="flex items-center justify-between text-body-sm">
                <span class="text-ink">{{ r.label }}</span>
                <span class="tabular text-muted">{{ r.pct }}% · {{ won(amount(r.pct)) }}</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                v-model.number="r.pct"
                class="mt-1.5 w-full"
                :style="{
                  '--range-thumb': r.accent,
                  '--range-track': `linear-gradient(90deg, ${r.accent} 0 ${(r.pct / 80) * 100}%, var(--color-surface-subtle) ${(r.pct / 80) * 100}% 100%)`,
                }"
                :aria-label="`${r.label} 배분 비율`"
              />
            </div>
          </div>

          <RingChart
            class="mx-auto mt-5"
            :size="168"
            :thickness="16"
            :segments="rows.map((r) => ({ label: r.label, value: r.pct, color: r.accent }))"
            :aria-label="`예산 배분: ${rows.map((r) => `${r.label} ${r.pct}퍼센트`).join(', ')} · 합계 ${sum}퍼센트`"
          >
            <span class="text-caption text-muted">배분비율</span>
            <span class="text-h3 font-bold" :class="sum === 100 ? 'text-ink' : 'text-amber'">
              {{ sum }}%
            </span>
          </RingChart>
        </div>
      </section>
    </template>
  </ViewTogglePage>
</template>
