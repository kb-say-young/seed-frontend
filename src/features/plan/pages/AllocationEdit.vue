<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/shared/components/AppHeader.vue'
import UiButton from '@/shared/ui/UiButton.vue'
import { won } from '@/shared/lib/money'
import { fundApi, ApiError } from '@/shared/api'
import type { FundCategoryKey } from '@/shared/api/fund'
import { useResource } from '@/shared/lib/useResource'

const router = useRouter()
const { data: plan, loading, error, reload } = useResource(() => fundApi.getFundPlan(), {
  requireAuth: true,
})

const CAT_STYLE: Record<FundCategoryKey, { dot: string; accent: string }> = {
  housing: { dot: 'bg-cat-housing', accent: 'var(--color-cat-housing)' },
  living: { dot: 'bg-cat-living', accent: 'var(--color-cat-living)' },
  work: { dot: 'bg-cat-work', accent: 'var(--color-cat-work)' },
  saving: { dot: 'bg-cat-finance', accent: 'var(--color-cat-finance)' },
}

const total = computed(() => plan.value?.totalFund ?? 0)
const rows = ref<{ key: FundCategoryKey; label: string; pct: number; dot: string; accent: string }[]>([])
watch(
  plan,
  (v) => {
    if (!v) return
    rows.value = v.buckets.map((b) => ({
      key: b.key,
      label: b.label,
      pct: b.pct,
      dot: CAT_STYLE[b.key].dot,
      accent: CAT_STYLE[b.key].accent,
    }))
  },
  { immediate: true },
)

const sum = computed(() => rows.value.reduce((a, r) => a + r.pct, 0))
const submitting = ref(false)
const saveError = ref('')

async function save() {
  if (submitting.value) return
  submitting.value = true
  saveError.value = ''
  try {
    await fundApi.saveAllocation({
      allocations: rows.value.map((r) => ({ key: r.key, pct: r.pct })),
    })
    router.push('/fund')
  } catch (e) {
    saveError.value = e instanceof ApiError ? e.message : '저장에 실패했어요. 잠시 후 다시 시도해 주세요.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-svh flex-col bg-transparent">
    <AppHeader title="배분 비율 조정" to="/fund" />
    <main id="main" class="flex-1 space-y-3 px-5 pt-2">
      <p v-if="loading" class="py-16 text-center text-body-sm text-muted">불러오는 중…</p>

      <div v-else-if="error || !plan" class="py-16 text-center">
        <p class="text-body-sm text-muted">{{ error ?? '자금 계획을 불러오지 못했어요.' }}</p>
        <UiButton variant="secondary" class="mt-3" @click="reload">다시 시도</UiButton>
      </div>

      <template v-else>
        <div class="flex items-center justify-between">
          <span class="text-body-sm text-muted">계획할 자립 자금</span>
          <span class="tabular text-label font-bold text-ink">{{ won(total) }}</span>
        </div>

        <div v-for="r in rows" :key="r.key" class="rounded-2xl border border-border p-4">
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
        <p v-if="saveError" role="alert" class="text-body-sm text-danger">{{ saveError }}</p>
      </template>
    </main>

    <div
      class="glass-strong sticky bottom-0 border-x-0 border-b-0 px-5 pb-7 pt-3"
      style="padding-bottom: max(1.75rem, env(safe-area-inset-bottom))"
    >
      <UiButton size="lg" block :disabled="submitting || sum !== 100" @click="save">
        {{ submitting ? '저장 중…' : '저장' }}
      </UiButton>
    </div>
  </div>
</template>
