<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRight } from 'lucide-vue-next'

// Figma PolicyItem — 제목 / 기관 / 요약 + 매칭 상태 배지 + (선택)사유
type Status = 'eligible' | 'review' | 'ineligible'
const props = defineProps<{
  title: string
  provider: string
  summary: string
  status?: Status
  reason?: string
}>()

const badge = computed(() => {
  if (!props.status) return null
  const m: Record<Status, { cls: string; text: string }> = {
    eligible: { cls: 'bg-primary-tint text-primary-dark', text: '지원 가능' },
    review: { cls: 'bg-amber-tint text-amber', text: '추가 확인 필요' },
    ineligible: { cls: 'bg-danger-tint text-danger', text: '조건 미달' },
  }
  return m[props.status]
})
</script>

<template>
  <article class="rounded-2xl border border-border bg-surface p-4">
    <div class="flex items-center gap-2">
      <span
        v-if="badge"
        class="rounded-full px-2 py-0.5 text-caption font-semibold"
        :class="badge.cls"
        >{{ badge.text }}</span
      >
      <ChevronRight :size="16" class="ml-auto shrink-0 text-muted" aria-hidden="true" />
    </div>
    <h3 class="mt-1.5 text-label font-bold text-ink">{{ props.title }}</h3>
    <p class="mt-0.5 text-caption text-muted">{{ props.provider }}</p>
    <p class="mt-1.5 text-body-sm leading-snug text-body">{{ props.summary }}</p>
    <p v-if="props.reason" class="mt-2 text-caption leading-snug text-muted">
      {{ props.reason }}
    </p>
  </article>
</template>
