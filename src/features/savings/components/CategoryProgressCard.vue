<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { won } from '@/shared/lib/money'
import type { SavingsCategory } from '@/features/savings/model/savings'

// A1 "현황" 카테고리별 카드 — 목표/실제 + 진행바 + %
const props = defineProps<{ cat: SavingsCategory }>()

const pct = computed(() => Math.min(100, Math.round((props.cat.saved / props.cat.goal) * 100)))
</script>

<template>
  <RouterLink
    :to="`/savings/${cat.key}`"
    class="block glass rounded-2xl p-4 no-underline"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-label font-bold text-ink">{{ cat.label }}</h3>
      <ChevronRight :size="16" class="shrink-0 text-muted" aria-hidden="true" />
    </div>
    <div class="mt-2 flex items-baseline justify-between gap-3 text-body-sm">
      <span class="text-muted">목표 금액 {{ won(cat.goal) }}</span>
      <span class="tabular font-bold text-ink">실제 모은 돈 {{ won(cat.saved) }}</span>
    </div>
    <div
      class="mt-2.5 h-2 overflow-hidden rounded-full bg-[var(--chart-track)]"
      role="img"
      :aria-label="`목표의 ${pct}퍼센트 모음`"
    >
      <span class="block h-full rounded-full bg-primary-bright" :style="{ width: `${pct}%` }" />
    </div>
    <p
      class="mt-1.5 text-right text-caption font-bold"
      :class="pct >= 80 ? 'text-primary-dark' : 'text-muted'"
    >
      {{ pct }}%
    </p>
  </RouterLink>
</template>
