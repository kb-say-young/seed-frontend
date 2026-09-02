<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowUp, ArrowDown } from 'lucide-vue-next'
import WizardChrome from '../components/WizardChrome.vue'
import { state, goalKey, CATEGORY_LABEL } from '../lib/store'

const router = useRouter()

// 선택한 목표와 우선순위 목록 동기화
watch(
  () => state.goals.map(goalKey).join('|'),
  () => {
    const keys = state.goals.map(goalKey)
    state.priority = [
      ...state.priority.filter((k) => keys.includes(k)),
      ...keys.filter((k) => !state.priority.includes(k)),
    ]
  },
  { immediate: true },
)

const rows = computed(() =>
  state.priority.map((k) => {
    const [cat, sub] = k.split(':')
    return { key: k, text: `${CATEGORY_LABEL[cat as keyof typeof CATEGORY_LABEL] ?? cat} · ${sub}` }
  }),
)
function move(i: number, dir: -1 | 1) {
  const j = i + dir
  if (j < 0 || j >= state.priority.length) return
  const a = state.priority
  ;[a[i], a[j]] = [a[j], a[i]]
}
</script>

<template>
  <WizardChrome
    title="우선순위"
    :step="4"
    :total="4"
    step-label="우선순위"
    back-to="/intake/goals"
    next-label="진단 결과 보기"
    :can-next="rows.length > 0"
    @next="router.push('/diagnosing')"
  >
    <div>
      <h2 class="text-h3 text-ink">어떤 목표부터 이룰까요?</h2>
      <p class="mt-1 text-body-sm text-muted">위에 있을수록 먼저 계획하고 예산을 더 많이 배분해요</p>
    </div>

    <ol class="flex flex-col gap-2">
      <li
        v-for="(r, i) in rows"
        :key="r.key"
        class="flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5"
      >
        <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-tint text-caption font-bold text-primary-dark">
          {{ i + 1 }}
        </span>
        <span class="min-w-0 flex-1 text-body-sm text-ink">{{ r.text }}</span>
        <span class="flex shrink-0 gap-1">
          <button
            type="button"
            class="tap-target flex items-center justify-center rounded-lg border border-border text-ink disabled:opacity-30"
            :disabled="i === 0"
            :aria-label="`${r.text} 순위 올리기`"
            @click="move(i, -1)"
          >
            <ArrowUp :size="18" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="tap-target flex items-center justify-center rounded-lg border border-border text-ink disabled:opacity-30"
            :disabled="i === rows.length - 1"
            :aria-label="`${r.text} 순위 내리기`"
            @click="move(i, 1)"
          >
            <ArrowDown :size="18" aria-hidden="true" />
          </button>
        </span>
      </li>
    </ol>

    <p class="text-body-sm text-muted">
      1순위 목표부터 로드맵 앞쪽에 배치하고, 예산도 더 많이 배분해요.
    </p>
  </WizardChrome>
</template>
