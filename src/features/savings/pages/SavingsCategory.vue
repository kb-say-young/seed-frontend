<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/shared/components/AppHeader.vue'
import SavingsLineChart from '@/features/savings/components/SavingsLineChart.vue'
import { won } from '@/shared/lib/money'
import { findSavings, thisMonthSaved, TREND_MONTHS, SAVINGS } from '@/features/savings/model/savings'

const route = useRoute()
const cat = computed(() => findSavings(String(route.params.category)) ?? SAVINGS[0])

const pct = computed(() => Math.min(100, Math.round((cat.value.saved / cat.value.goal) * 100)))
const monthRemain = computed(() => cat.value.monthlyGoal - thisMonthSaved(cat.value))
const monthPct = computed(() =>
  Math.min(100, Math.round((thisMonthSaved(cat.value) / cat.value.monthlyGoal) * 100)),
)
</script>

<template>
  <div class="min-h-svh bg-transparent">
    <AppHeader :title="`${cat.label} · 모은 돈 내역`" to="/savings" />

    <main id="main" class="space-y-5 px-5 pb-12 pt-2">
      <section class="glass-tint rounded-2xl p-4" aria-labelledby="cat-total">
        <p id="cat-total" class="text-caption font-bold text-muted">
          {{ cat.label }} 카테고리 모은 돈
        </p>
        <p class="tabular mt-1 text-h1 text-ink">{{ won(cat.saved) }}</p>
        <p class="mt-1 text-body-sm text-body">목표 {{ won(cat.goal) }} · {{ cat.note }}</p>

        <div class="mt-3">
          <div class="flex items-baseline justify-between text-caption">
            <span class="text-muted">이번 달 목표 {{ won(cat.monthlyGoal) }}</span>
            <span class="font-bold text-primary-dark">
              <template v-if="monthRemain > 0">{{ won(monthRemain) }} 더 모으기</template>
              <template v-else>이번 달 목표 달성!</template>
            </span>
          </div>
          <div
            class="mt-1.5 h-2 overflow-hidden rounded-full bg-[rgb(255_255_255/0.5)]"
            role="img"
            :aria-label="`이번 달 목표의 ${monthPct}퍼센트`"
          >
            <span
              class="block h-full rounded-full bg-primary-bright"
              :style="{ width: `${monthPct}%` }"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="trend-h">
        <div class="flex items-baseline justify-between">
          <h2 id="trend-h" class="text-label text-ink">월별 누적 적립 추이</h2>
          <span class="text-caption text-muted">{{ TREND_MONTHS[0] }} ~ {{ TREND_MONTHS[5] }}</span>
        </div>
        <SavingsLineChart
          class="mt-3"
          :values="cat.trend"
          :aria-label="`${cat.label} 월별 누적 적립 추이. 4월 ${won(cat.trend[0])}에서 9월 ${won(cat.saved)}까지 증가.`"
        />
        <div class="mt-1 flex justify-between px-1 text-caption text-muted">
          <span v-for="m in TREND_MONTHS" :key="m">{{ m }}</span>
        </div>
      </section>

      <section aria-labelledby="records-h">
        <h2 id="records-h" class="text-label text-ink">상세 적립 내역</h2>
        <ul class="mt-2 divide-y divide-border">
          <li
            v-for="(r, i) in cat.records"
            :key="i"
            class="flex items-center justify-between gap-3 py-3"
          >
            <span class="min-w-0">
              <span class="block text-caption text-muted">{{ r.date }}</span>
              <span class="block text-body-sm font-bold text-ink">{{ r.item }}</span>
            </span>
            <span class="tabular shrink-0 text-body-sm font-bold text-primary-dark"
              >{{ won(r.amount) }}</span
            >
          </li>
        </ul>
      </section>

      <p class="text-caption leading-relaxed text-muted">
        전체 목표의 {{ pct }}%를 모았어요. 이 속도면 목표 시점 안에 달성할 수 있어요.
      </p>
    </main>
  </div>
</template>
