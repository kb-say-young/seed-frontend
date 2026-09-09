<script setup lang="ts">
import { computed } from 'vue'
import { CircleCheck, CircleAlert, ChevronRight } from 'lucide-vue-next'
import UiButton from '@/shared/ui/UiButton.vue'
import ViewTogglePage from '@/shared/components/ViewTogglePage.vue'
import { won, manwon } from '@/shared/lib/money'
import { StackedBar } from '@/shared/ui/charts'
import { fundApi } from '@/shared/api'
import type { FundCategoryKey } from '@/shared/api/fund'
import { useResource, AUTH_REQUIRED_ERROR_CODE } from '@/shared/lib/useResource'

// Figma "자금 계획 · 목적별 배분". AI 추천(/fund/ai)과 토글로 전환.
const { data: plan, loading, error, errorCode, reload } = useResource(
  () => fundApi.getFundPlan(),
  { requireAuth: true },
)

// 부족분은 백엔드가 따로 주지 않는다 — 전체 비용에서 확보액을 뺀다.
const shortfall = computed(() =>
  Math.max(0, (plan.value?.totalFund ?? 0) - (plan.value?.securedAmount ?? 0)),
)

const CAT_STYLE: Record<FundCategoryKey, { cls: string; color: string }> = {
  housing: { cls: 'bg-cat-housing', color: 'var(--color-cat-housing)' },
  living: { cls: 'bg-cat-living', color: 'var(--color-cat-living)' },
  work: { cls: 'bg-cat-work', color: 'var(--color-cat-work)' },
  saving: { cls: 'bg-cat-finance', color: 'var(--color-cat-finance)' },
}
</script>

<template>
  <ViewTogglePage
    title="자금 계획"
    :options="[
      { label: 'AI 추천', to: '/fund/ai' },
      { label: '목적별 배분', to: '/fund' },
    ]"
    active="목적별 배분"
    :loading="loading"
    :show-error="!!error || !plan"
    :error-message="error ?? '자금 계획을 불러오지 못했어요.'"
    :auth-required="errorCode === AUTH_REQUIRED_ERROR_CODE"
    @reload="reload"
  >
    <template v-if="plan">
      <section class="glass rounded-2xl p-5">
        <p class="text-body-sm text-muted">전체 예상 비용</p>
        <p class="tabular mt-1 text-h1 text-ink">{{ won(plan.totalFund) }}</p>
        <p class="mt-1 text-caption text-muted">
          현재 확보 {{ won(plan.securedAmount) }} · 앞으로 {{ won(shortfall) }} 더 필요해요
        </p>
      </section>

      <RouterLink
        to="/savings"
        class="glass-tint flex items-center gap-3 rounded-2xl p-4 no-underline"
      >
        <span class="min-w-0 flex-1">
          <span class="block text-label font-bold text-primary-dark">모은 돈 보기</span>
          <span class="mt-0.5 block text-body-sm text-body">
            카테고리별 적립 현황 확인 · 적립 내역 작성
          </span>
        </span>
        <ChevronRight :size="20" class="shrink-0 text-primary-dark" aria-hidden="true" />
      </RouterLink>

      <section>
        <h2 class="text-label text-ink">목적별 배분</h2>
        <StackedBar
          class="mt-3"
          :height="14"
          :legend="false"
          :segments="plan.buckets.map((b) => ({ label: b.label, value: b.pct, color: CAT_STYLE[b.key].color }))"
        />
        <ul class="mt-3 space-y-3">
          <li v-for="b in plan.buckets" :key="b.key" class="flex items-center gap-2">
            <span class="size-2.5 shrink-0 rounded-full" :class="CAT_STYLE[b.key].cls" aria-hidden="true" />
            <span class="flex-1 truncate text-body-sm text-ink">{{ b.label }}</span>
            <span class="shrink-0 text-caption text-muted">{{ b.pct }}%</span>
            <span class="shrink-0 whitespace-nowrap tabular text-body-sm font-semibold text-ink">
              <template v-if="b.budget">{{ manwon(b.actual ?? 0) }}/{{ manwon(b.budget) }}</template>
              <template v-else>{{ won(b.amount ?? 0) }}</template>
            </span>
          </li>
        </ul>
      </section>

      <section v-if="plan.principles.length" class="glass rounded-2xl p-4">
        <h2 class="text-label text-ink">자산관리 원칙 점검</h2>
        <ul class="mt-2.5 space-y-2.5">
          <li v-for="(c, i) in plan.principles" :key="i" class="flex items-center gap-2 text-body-sm">
            <CircleCheck v-if="c.ok" :size="17" class="shrink-0 text-primary-bright" aria-hidden="true" />
            <CircleAlert v-else :size="17" class="shrink-0 text-amber" aria-hidden="true" />
            <span :class="c.ok ? 'text-ink' : 'text-amber'">{{ c.text }}</span>
          </li>
        </ul>
      </section>

      <UiButton size="lg" block class="mt-1" @click="$router.push('/fund/allocation')">
        배분 비율 조정하기
      </UiButton>
    </template>
  </ViewTogglePage>
</template>
