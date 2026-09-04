<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/shared/components/AppHeader.vue'
import UiButton from '@/shared/ui/UiButton.vue'
import { won } from '@/shared/lib/money'

const router = useRouter()
const total = 12_532_000
const rows = reactive([
  { label: '주거 보증금', pct: 48, dot: 'bg-cat-housing', accent: 'var(--color-cat-housing)' },
  { label: '생활비', pct: 28, dot: 'bg-cat-living', accent: 'var(--color-cat-living)' },
  { label: '교육·자기계발', pct: 14, dot: 'bg-cat-work', accent: 'var(--color-cat-work)' },
  { label: '비상금', pct: 10, dot: 'bg-cat-finance', accent: 'var(--color-cat-finance)' },
])
const sum = computed(() => rows.reduce((a, r) => a + r.pct, 0))
</script>

<template>
  <div class="flex min-h-svh flex-col bg-transparent">
    <AppHeader title="배분 비율 조정" to="/fund" />
    <main id="main" class="flex-1 space-y-3 px-5 pt-2">
      <div class="flex items-center justify-between">
        <span class="text-body-sm text-muted">계획할 자립 자금</span>
        <span class="tabular text-label font-bold text-ink">{{ won(total) }}</span>
      </div>

      <div v-for="r in rows" :key="r.label" class="rounded-2xl border border-border p-4">
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-2 text-body-sm text-ink">
            <span class="size-2.5 rounded-full" :class="r.dot" aria-hidden="true" />{{ r.label }}
          </span>
          <span class="text-h3 font-bold text-ink">{{ r.pct }}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="80"
          step="1"
          v-model.number="r.pct"
          class="mt-2 w-full"
          :style="{
            '--range-thumb': r.accent,
            '--range-track': `linear-gradient(90deg, ${r.accent} 0 ${(r.pct / 80) * 100}%, var(--color-surface-subtle) ${(r.pct / 80) * 100}% 100%)`,
          }"
          :aria-label="`${r.label} 배분 비율`"
        />
        <p class="tabular mt-1 text-caption text-muted">{{ won(Math.round((total * r.pct) / 100)) }}</p>
      </div>

      <div class="flex items-center justify-between pt-1">
        <span class="text-label font-bold text-ink">합계</span>
        <span
          class="text-label font-bold"
          :class="sum === 100 ? 'text-primary-dark' : 'text-amber'"
          >{{ sum }}%</span
        >
      </div>
      <p class="rounded-xl bg-amber-tint p-3 text-caption text-amber">
        비상금은 최소 10% 이상 유지하는 걸 권해요. 예상 못 한 일에 로드맵이 무너지지 않게요.
      </p>
    </main>

    <div
      class="glass-strong sticky bottom-0 border-x-0 border-b-0 px-5 pb-7 pt-3"
      style="padding-bottom: max(1.75rem, env(safe-area-inset-bottom))"
    >
      <UiButton size="lg" block @click="router.push('/fund')">저장</UiButton>
    </div>
  </div>
</template>
