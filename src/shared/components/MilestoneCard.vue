<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { ProgressMeter } from '@/shared/ui/charts'

// Figma 로드맵 타임라인 카드: 카테고리 점 + 제목 + 상태배지 + 메타 + 진척 막대 + 다음 행동
type Status = 'done' | 'progress' | 'review' | 'planned' | 'risk'
type Cat = 'housing' | 'living' | 'work' | 'finance'
const props = defineProps<{
  to: string
  title: string
  status: Status
  statusText: string
  desc: string
  progress?: number // 0~100
  action?: string
  category?: Cat
}>()

const badge = computed(() => {
  const m: Record<Status, string> = {
    done: 'bg-primary-tint text-primary-dark',
    progress: 'bg-primary-tint text-primary-dark',
    review: 'bg-amber-tint text-amber',
    planned: 'bg-surface-subtle text-muted',
    risk: 'bg-danger-tint text-danger',
  }
  return m[props.status]
})
const badgeText = computed(() => {
  const m: Record<Status, string> = {
    done: '완료',
    progress: '진행 중',
    review: '진행 중',
    planned: '예정',
    risk: '위험',
  }
  return m[props.status]
})
const dotColor = computed(() => {
  // 로드맵 맥락의 카테고리 색: 자금(finance)은 앰버(§Figma 진단결과).
  const m: Record<Cat, string> = {
    housing: 'bg-cat-housing',
    living: 'bg-cat-living',
    work: 'bg-cat-work',
    finance: 'bg-amber',
  }
  return props.category ? m[props.category] : 'bg-border-strong'
})
const barColor = computed(() =>
  props.status === 'risk' ? 'var(--color-danger)' : 'var(--color-primary-bright)',
)
</script>

<template>
  <RouterLink
    :to="props.to"
    class="block glass rounded-2xl p-4 no-underline"
  >
    <div class="flex items-start justify-between gap-2">
      <h3 class="flex items-center gap-2 text-label font-bold text-ink">
        <span class="size-2 shrink-0 rounded-full" :class="dotColor" aria-hidden="true" />
        {{ props.title }}
      </h3>
      <ChevronRight :size="18" class="mt-0.5 shrink-0 text-muted" aria-hidden="true" />
    </div>
    <div class="mt-2 flex items-center gap-2">
      <span class="rounded-full px-2 py-0.5 text-caption font-semibold" :class="badge">
        {{ badgeText }}
      </span>
      <span v-if="props.statusText !== badgeText" class="text-caption text-muted">
        {{ props.statusText }}
      </span>
    </div>
    <p class="mt-2 text-body-sm leading-snug text-body">{{ props.desc }}</p>
    <ProgressMeter
      v-if="props.progress != null"
      class="mt-2.5"
      :height="6"
      :value="props.progress"
      :color="barColor"
      :aria-label="`진척 ${props.progress}퍼센트`"
    />
    <p v-if="props.action" class="mt-2 text-body-sm font-semibold text-primary-dark">
      → {{ props.action }}
    </p>
  </RouterLink>
</template>
