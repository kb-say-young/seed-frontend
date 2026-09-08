<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/shared/components/AppHeader.vue'
import UiButton from '@/shared/ui/UiButton.vue'
import FloatingNav from '@/shared/components/FloatingNav.vue'
import ViewToggle from '@/shared/ui/ViewToggle.vue'
import { ProgressMeter, SegmentBar } from '@/shared/ui/charts'
import { expenseApi } from '@/shared/api'
import { useResource } from '@/shared/lib/useResource'
import { won } from '@/shared/lib/money'

const router = useRouter()
const { data: t, loading, error, reload } = useResource(() => expenseApi.getTrackingSummary(), {
  requireAuth: true,
})

const planRoom = computed(() => (t.value ? t.value.plan - t.value.spent : 0))
// "MM.DD"
const mmdd = (iso: string) => iso.slice(5).replace('-', '.')
</script>

<template>
  <div class="min-h-svh bg-transparent">
    <AppHeader title="기록" to="/roadmap" />
    <main id="main" class="space-y-3 px-5 pb-32 pt-2">
      <ViewToggle
        :options="[
          { label: '기록', to: '/tracking' },
          { label: '예산 대비', to: '/tracking/budget' },
        ]"
        active="기록"
      />

      <p class="text-body-sm leading-snug text-muted">
        매일 적지 않아도 돼요. 큰 지출만 이따금 기록하면 로드맵이 스스로 맞춰져요.
      </p>

      <p v-if="loading" class="py-16 text-center text-body-sm text-muted">불러오는 중…</p>

      <div v-else-if="error || !t" class="py-16 text-center">
        <p class="text-body-sm text-muted">{{ error ?? '기록을 불러오지 못했어요.' }}</p>
        <UiButton variant="secondary" class="mt-3" @click="reload">다시 시도</UiButton>
      </div>

      <template v-else>
        <section class="glass rounded-2xl p-4">
          <div class="flex items-end justify-between">
            <span class="text-body-sm text-muted">이번 달 지출</span>
            <span class="tabular text-h3 font-bold text-ink">{{ won(t.spent) }}</span>
          </div>
          <ProgressMeter
            class="mt-2.5"
            :value="t.spent"
            :max="t.plan || 1"
            :over="true"
            :aria-label="`이번 달 지출 ${won(t.spent)} · 계획 ${won(t.plan)}`"
          />
          <p
            class="mt-2 text-caption font-medium"
            :class="planRoom >= 0 ? 'text-primary-dark' : 'text-danger'"
          >
            계획 {{ won(t.plan) }} ·
            {{ planRoom >= 0 ? '아직 여유 있어요' : `${won(-planRoom)} 초과` }}
          </p>
        </section>

        <section class="glass rounded-2xl p-4">
          <div class="flex items-center justify-between">
            <span class="text-label text-ink">로드맵 진척</span>
            <span class="text-caption font-semibold text-muted"
              >{{ t.roadmapProgress.done }} / {{ t.roadmapProgress.total }} 완료</span
            >
          </div>
          <SegmentBar
            class="mt-2.5"
            :total="t.roadmapProgress.total"
            :done="t.roadmapProgress.done"
            :aria-label="`로드맵 ${t.roadmapProgress.total}단계 중 ${t.roadmapProgress.done}단계 완료`"
          />
          <p v-if="t.nextMilestone" class="mt-2 flex items-center gap-1.5 text-body-sm text-body">
            <span class="size-2 rounded-full bg-amber" aria-hidden="true" />다음:
            {{ t.nextMilestone.title }} ({{ t.nextMilestone.progress }}%)
          </p>
        </section>

        <div class="grid grid-cols-2 gap-3">
          <UiButton @click="router.push('/tracking/add')">지출 추가</UiButton>
          <UiButton variant="secondary" @click="router.push('/tracking/add')">수입 추가</UiButton>
        </div>

        <section class="glass rounded-2xl p-4">
          <h2 class="text-label text-ink">최근 기록</h2>
          <p v-if="!t.recent.length" class="mt-2 text-body-sm text-muted">아직 기록이 없어요.</p>
          <ul v-else class="mt-1 divide-y divide-border">
            <li v-for="r in t.recent" :key="r.id" class="flex items-center gap-3 py-3">
              <span class="text-caption text-muted">{{ mmdd(r.date) }}</span>
              <span class="min-w-0 flex-1">
                <span class="block text-body-sm text-ink">{{ r.title }}</span>
                <span class="block text-caption text-muted">{{ r.category }}</span>
              </span>
              <span class="tabular text-body-sm font-semibold text-ink">{{
                r.amount.toLocaleString('ko-KR')
              }}</span>
            </li>
          </ul>
        </section>
      </template>
    </main>
    <FloatingNav />
  </div>
</template>
