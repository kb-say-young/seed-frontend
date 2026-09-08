<script setup lang="ts">
import { computed } from 'vue'

// Figma 진단결과 슬라이드(D1~D4) 카드 — 제목 + 상태배지 + 완료한 할 일 수.
// 로드맵 페이지 안에서만 쓰는 경량 변형. (풀 카드는 shared/components/MilestoneCard.vue)
type Status = 'done' | 'progress' | 'review' | 'planned' | 'risk'
const props = defineProps<{
  to: string
  title: string
  status: Status
  tasksDone: number
  tasksTotal: number
}>()

const badge = computed(() => {
  const m: Record<Status, { cls: string; text: string }> = {
    done: { cls: 'bg-primary-tint text-primary-dark', text: '완료' },
    progress: { cls: 'bg-primary-tint text-primary-dark', text: '진행 중' },
    review: { cls: 'bg-primary-tint text-primary-dark', text: '진행 중' },
    planned: { cls: 'bg-surface-subtle text-muted', text: '예정' },
    risk: { cls: 'bg-danger-tint text-danger', text: '위험' },
  }
  return m[props.status]
})

const taskLabel = computed(() =>
  props.tasksTotal > 0
    ? `${props.tasksDone} / ${props.tasksTotal}개 할 일 완료`
    : '세부 할 일 준비 중',
)
</script>

<template>
  <RouterLink :to="props.to" class="block glass rounded-2xl p-4 no-underline">
    <div class="flex items-start justify-between gap-3">
      <h3 class="min-w-0 text-label font-bold leading-snug text-ink">{{ props.title }}</h3>
      <span
        class="shrink-0 rounded-full px-2 py-0.5 text-caption font-semibold"
        :class="badge.cls"
        >{{ badge.text }}</span
      >
    </div>
    <p class="mt-1.5 text-caption text-muted">{{ taskLabel }}</p>
  </RouterLink>
</template>
