<script setup lang="ts">
import { ref } from 'vue'
import { CircleCheck, CircleAlert, Plus, ChevronRight } from 'lucide-vue-next'
import AppHeader from '@/shared/components/AppHeader.vue'
import UiButton from '@/shared/ui/UiButton.vue'
import FloatingNav from '@/shared/components/FloatingNav.vue'
import ViewToggle from '@/shared/ui/ViewToggle.vue'
import SavingsRecordSheet from '@/features/plan/components/SavingsRecordSheet.vue'
import { won, manwon } from '@/shared/lib/money'
import { StackedBar } from '@/shared/ui/charts'

const sheetOpen = ref(false)

// Figma "자금 계획 · 목적별 배분". AI 추천(/fund/ai)과 토글로 전환.
const total = 12_532_000
interface Bucket {
  label: string
  pct: number
  cls: string
  color: string
  actual?: number
  budget?: number
  amount?: number
}
const buckets: Bucket[] = [
  { label: '주거 보증금', pct: 48, actual: 6_000_000, budget: 10_000_000, cls: 'bg-cat-housing', color: 'var(--color-cat-housing)' },
  { label: '생활비', pct: 28, actual: 3_500_000, budget: 4_000_000, cls: 'bg-cat-living', color: 'var(--color-cat-living)' },
  { label: '취·창업', pct: 14, actual: 1_800_000, budget: 5_000_000, cls: 'bg-cat-work', color: 'var(--color-cat-work)' },
  { label: '저축', pct: 10, amount: 1_232_000, cls: 'bg-cat-finance', color: 'var(--color-cat-finance)' },
]
const checks = [
  { t: '목돈을 생활비로 쓰지 않기', ok: true },
  { t: '주거비는 소득의 30% 이내', ok: true },
  { t: '비상금 3개월치 우선 확보', ok: false },
]
</script>

<template>
  <div class="min-h-svh bg-transparent">
    <AppHeader title="자금 계획" to="/roadmap" />
    <main id="main" class="space-y-4 px-5 pb-32 pt-2">
      <ViewToggle
        :options="[
          { label: 'AI 추천', to: '/fund/ai' },
          { label: '목적별 배분', to: '/fund' },
        ]"
        active="목적별 배분"
      />

      <section class="glass rounded-2xl p-5">
        <p class="text-body-sm text-muted">계획할 자립 자금</p>
        <p class="tabular mt-1 text-h1 text-ink">{{ won(total) }}</p>
        <p class="mt-1 text-caption text-muted">자립정착금 8,000,000 + 지원금 4,532,000</p>
      </section>

      <RouterLink
        to="/savings"
        class="glass-tint flex items-center gap-3 rounded-2xl p-4 no-underline"
      >
        <span class="min-w-0 flex-1">
          <span class="block text-label font-bold text-primary-dark">모은 돈 보기</span>
          <span class="mt-0.5 block text-body-sm text-body">카테고리별 적립 현황과 추이 확인</span>
        </span>
        <ChevronRight :size="20" class="shrink-0 text-primary-dark" aria-hidden="true" />
      </RouterLink>

      <section>
        <h2 class="text-label text-ink">목적별 배분</h2>
        <StackedBar
          class="mt-3"
          :height="14"
          :legend="false"
          :segments="buckets.map((b) => ({ label: b.label, value: b.pct, color: b.color }))"
        />
        <ul class="mt-3 space-y-3">
          <li v-for="b in buckets" :key="b.label" class="flex items-center gap-2">
            <span class="size-2.5 shrink-0 rounded-full" :class="b.cls" aria-hidden="true" />
            <span class="flex-1 truncate text-body-sm text-ink">{{ b.label }}</span>
            <span class="shrink-0 text-caption text-muted">{{ b.pct }}%</span>
            <span class="shrink-0 whitespace-nowrap tabular text-body-sm font-semibold text-ink">
              <template v-if="b.budget">{{ manwon(b.actual ?? 0) }}/{{ manwon(b.budget) }}</template>
              <template v-else>{{ won(b.amount ?? 0) }}</template>
            </span>
          </li>
        </ul>
      </section>

      <section class="glass rounded-2xl p-4">
        <h2 class="text-label text-ink">자산관리 원칙 점검</h2>
        <ul class="mt-2.5 space-y-2.5">
          <li v-for="c in checks" :key="c.t" class="flex items-center gap-2 text-body-sm">
            <CircleCheck v-if="c.ok" :size="17" class="shrink-0 text-primary-bright" aria-hidden="true" />
            <CircleAlert v-else :size="17" class="shrink-0 text-amber" aria-hidden="true" />
            <span :class="c.ok ? 'text-ink' : 'text-amber'">{{ c.t }}</span>
          </li>
        </ul>
      </section>

      <div class="space-y-2.5 pt-1">
        <UiButton size="lg" block @click="$router.push('/fund/allocation')">
          배분 비율 조정하기
        </UiButton>
        <UiButton variant="secondary" block @click="sheetOpen = true">
          <Plus :size="18" aria-hidden="true" /> 적립 내역 작성
        </UiButton>
      </div>
    </main>

    <SavingsRecordSheet :open="sheetOpen" @close="sheetOpen = false" />
    <FloatingNav />
  </div>
</template>
