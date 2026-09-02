<script setup lang="ts">
import { reactive, computed } from 'vue'
import { Lock, Pencil } from 'lucide-vue-next'
import AppHeader from '../components/AppHeader.vue'
import FloatingNav from '../components/FloatingNav.vue'
import ViewToggle from '../components/ViewToggle.vue'
import { won, manwon } from '../lib/money'

// Figma "자금 계획 · AI 추천 예산" 변형. 목적별 배분 요약(/fund)과 토글로 전환.
// 배분 슬라이더는 도넛을 즉시 갱신하되 저장은 배분 비율 조정(/fund/allocation)에서.
interface Rec {
  label: string
  pct: number
  dot: string
  actual?: number
  budget?: number
  amount?: number
}
const recTotal = 12_532_000
const rec: Rec[] = [
  { label: '주거', pct: 48, actual: 6_000_000, budget: 10_000_000, dot: 'bg-cat-housing' },
  { label: '생활', pct: 23, actual: 3_500_000, budget: 4_000_000, dot: 'bg-cat-living' },
  { label: '취·창업', pct: 14, actual: 1_800_000, budget: 5_000_000, dot: 'bg-cat-work' },
  { label: '저축', pct: 15, amount: 1_232_000, dot: 'bg-cat-finance' },
]

const monthly = 1_500_000
const rows = reactive([
  { label: '주거', pct: 40, accent: 'var(--color-cat-housing)' },
  { label: '생활', pct: 25, accent: 'var(--color-cat-living)' },
  { label: '취·창업', pct: 20, accent: 'var(--color-cat-work)' },
  { label: '저축', pct: 15, accent: 'var(--color-cat-finance)' },
])
const sum = computed(() => rows.reduce((a, r) => a + r.pct, 0))
const amount = (pct: number) => Math.round((monthly * pct) / 100)
const donut = computed(() => {
  const total = sum.value || 1
  let acc = 0
  return rows
    .map((r) => {
      const start = (acc / total) * 100
      acc += r.pct
      return `${r.accent} ${start}% ${(acc / total) * 100}%`
    })
    .join(', ')
})
</script>

<template>
  <div class="min-h-svh bg-surface-subtle">
    <AppHeader title="자금 계획" to="/roadmap" />
    <main id="main" class="space-y-4 px-5 pb-32 pt-2">
      <ViewToggle
        :options="[
          { label: 'AI 추천', to: '/fund/ai' },
          { label: '목적별 배분', to: '/fund' },
        ]"
        active="AI 추천"
      />

      <section>
        <div class="flex items-center gap-1.5">
          <h2 class="text-label text-ink">AI 추천 예산</h2>
          <Lock :size="13" class="text-muted" aria-hidden="true" />
          <span class="text-caption text-muted">로드맵 기반 자동 산출</span>
        </div>

        <div class="mt-3 rounded-2xl border border-border bg-surface p-4">
          <div class="rounded-xl bg-surface-subtle p-4">
            <p class="text-body-sm text-muted">추천 자립 자금 총액</p>
            <p class="tabular mt-1 text-h1 text-ink">{{ won(recTotal) }}</p>
            <div class="mt-3 flex h-3 overflow-hidden rounded-full" aria-hidden="true">
              <span
                v-for="r in rec"
                :key="r.label"
                class="h-full"
                :class="r.dot"
                :style="{ width: `${r.pct}%` }"
              />
            </div>
          </div>

          <ul class="mt-3 space-y-2.5">
            <li v-for="r in rec" :key="r.label" class="flex items-center gap-2">
              <span class="size-2.5 shrink-0 rounded-full" :class="r.dot" aria-hidden="true" />
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

        <div class="mt-3 rounded-2xl border border-border bg-surface p-4">
          <p class="text-body-sm text-muted">총 가용 예산</p>
          <p class="tabular mt-0.5 text-h2 text-primary-dark">월 {{ won(monthly) }}</p>

          <div class="mt-4 space-y-4 border-t border-border pt-4">
            <div v-for="r in rows" :key="r.label">
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

          <div
            class="mx-auto mt-5 grid size-40 place-items-center rounded-full"
            :style="{ background: `conic-gradient(${donut})` }"
            aria-hidden="true"
          >
            <div class="grid size-24 place-items-center rounded-full bg-surface text-center">
              <span class="text-caption text-muted">배분비율</span>
              <span class="text-label font-bold" :class="sum === 100 ? 'text-ink' : 'text-amber'">
                {{ sum }}%
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
    <FloatingNav />
  </div>
</template>
