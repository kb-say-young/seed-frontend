<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Check } from 'lucide-vue-next'
import AppHeader from '@/shared/components/AppHeader.vue'
import UiButton from '@/shared/ui/UiButton.vue'
import PolicyCard from '@/features/diagnosis/components/PolicyCard.vue'
import { ProgressMeter } from '@/shared/ui/charts'
import { MILESTONES } from '@/shared/lib/roadmap'
import { won } from '@/shared/lib/money'

const route = useRoute()
const router = useRouter()
const m = computed(() => MILESTONES.find((x) => x.id === route.params.id) ?? MILESTONES[2])

const CAT_LABEL: Record<string, string> = { housing: '주거', living: '안전망', work: '소득·취업', finance: '자금' }
const CAT_CHIP: Record<string, string> = {
  housing: 'bg-cat-housing text-white',
  living: 'bg-cat-living text-white',
  work: 'bg-cat-work text-white',
  finance: 'bg-amber text-white',
}
const remaining = computed(() =>
  m.value.goalAmount && m.value.currentAmount ? m.value.goalAmount - m.value.currentAmount : 0,
)
</script>

<template>
  <div class="min-h-svh bg-transparent">
    <AppHeader title="체크 리스트" to="/roadmap" />
    <main id="main" class="space-y-4 px-5 pb-10 pt-2">
      <div>
        <div class="flex items-center gap-2">
          <span class="rounded-full px-2.5 py-0.5 text-caption font-semibold" :class="CAT_CHIP[m.category]">
            {{ CAT_LABEL[m.category] }}
          </span>
          <span
            class="rounded-full px-2.5 py-0.5 text-caption font-semibold"
            :class="m.status === 'risk' ? 'bg-danger-tint text-danger' : 'bg-primary-tint text-primary-dark'"
            >{{ m.statusText.split(' · ')[0] }}</span
          >
        </div>
        <h1 class="mt-2 text-h3 text-ink">{{ m.title }}</h1>
      </div>

      <section v-if="m.why" class="glass-tint rounded-2xl p-4">
        <h2 class="text-label text-primary-dark">왜 먼저 해야 하나요?</h2>
        <p class="mt-1.5 text-body-sm leading-relaxed text-body">{{ m.why }}</p>
      </section>

      <section v-if="m.flowType === 'mixed' && m.goalAmount" class="glass rounded-2xl p-4">
        <div class="flex items-end justify-between">
          <span class="text-body-sm text-muted">모은 금액</span>
          <span class="tabular text-h3 font-bold text-ink">{{ won(m.currentAmount ?? 0) }}</span>
        </div>
        <ProgressMeter
          class="mt-2.5"
          :value="m.progress ?? 0"
          tone="amber"
          :aria-label="`목표 금액의 ${m.progress ?? 0}퍼센트 모음`"
        />
        <p class="mt-2 text-caption text-muted">
          목표 {{ won(m.goalAmount) }} · 남은 {{ won(remaining) }} · 이 속도면 2025.04 달성
        </p>
      </section>

      <section
        v-if="m.flowType === 'mixed' && m.checklist"
        class="glass rounded-2xl p-4"
      >
        <h2 class="text-label text-ink">지금 할 일</h2>
        <ul class="mt-1 divide-y divide-border">
          <li v-for="(c, i) in m.checklist" :key="i" class="flex items-center gap-3 py-2.5">
            <span
              class="flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border"
              :class="c.done ? 'border-primary bg-primary text-on-primary' : 'border-border-strong'"
              aria-hidden="true"
            >
              <Check v-if="c.done" :size="13" :stroke-width="3" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-body-sm" :class="c.done ? 'text-muted' : 'text-ink'">{{
                c.title
              }}</span>
              <span v-if="c.planned > 0" class="mt-0.5 block text-caption text-muted">
                예상 비용 {{ won(c.planned) }}
              </span>
            </span>
          </li>
        </ul>
      </section>

      <section v-if="m.policy">
        <h2 class="text-label text-ink">이 목표에 도움되는 지원</h2>
        <PolicyCard
          class="mt-2"
          :title="m.policy.title"
          :provider="m.policy.provider"
          :summary="m.policy.summary"
          :status="m.policy.status"
          :reason="m.policy.reason"
          :to="`/roadmap/${m.id}/policy`"
        />
      </section>

      <div class="grid grid-cols-2 gap-3 pt-2">
        <UiButton variant="secondary" @click="router.push(`/roadmap/${m.id}/cost`)">완료 표시</UiButton>
        <UiButton>자동이체 설정하기</UiButton>
      </div>
    </main>
  </div>
</template>
