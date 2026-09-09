<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Check } from 'lucide-vue-next'
import AppHeader from '@/shared/components/AppHeader.vue'
import UiButton from '@/shared/ui/UiButton.vue'
import { ProgressMeter } from '@/shared/ui/charts'
import { diagnosisApi, roadmapApi, ApiError } from '@/shared/api'
import type { ChecklistItem } from '@/shared/api/diagnosis'
import { useResource } from '@/shared/lib/useResource'
import { won } from '@/shared/lib/money'

// Figma C1 체크 리스트. 백엔드 계약: GET /api/diagnoses/recommendations/{recommendationId}
// (기존 GET /api/users/me/roadmap/milestones/{id} 는 백엔드에 없음 — 실존 엔드포인트로 전환)
// 라우트의 :id 는 recommendationId 다.
const route = useRoute()
const recommendationId = computed(() => Number(route.params.id))

const { data: m, loading, error, reload } = useResource(
  () => diagnosisApi.getRecommendationDetail(recommendationId.value),
  { requireAuth: true },
)
watch(() => route.params.id, reload)

// 백엔드 status 는 하위 체크리스트에서 파생된다 (done | review | progress).
const STATUS_LABEL: Record<string, string> = {
  done: '완료',
  progress: '진행 중',
  review: '확인 필요',
}

// 체크리스트 완료 — 목록에서 바로 처리한다. 별도 화면으로 나가지 않는다.
// useResource 의 data 는 shallowRef 라 항목 필드를 직접 바꿔도 갱신되지 않는다.
// 방금 완료한 id 를 따로 들고 화면에 겹쳐 보여준다.
const justDone = ref<Set<number>>(new Set())
const pendingId = ref<number | null>(null)
const completeError = ref('')

const isDone = (c: ChecklistItem) => c.status === 'done' || justDone.value.has(c.id)

const items = computed(() => m.value?.checklistItems ?? [])
const doneCount = computed(() => items.value.filter(isDone).length)
const donePct = computed(() =>
  items.value.length ? Math.round((doneCount.value / items.value.length) * 100) : 0,
)

async function complete(c: ChecklistItem) {
  if (isDone(c) || pendingId.value !== null) return
  pendingId.value = c.id
  completeError.value = ''
  try {
    await roadmapApi.completeChecklistItem(c.id)
    justDone.value = new Set(justDone.value).add(c.id)
  } catch (e) {
    completeError.value =
      e instanceof ApiError ? e.message : '완료 처리에 실패했어요. 잠시 후 다시 시도해 주세요.'
    console.warn('[checklist-complete]', e)
  } finally {
    pendingId.value = null
  }
}

const amount = (v: number | null) => (v && v > 0 ? won(v) : '0원 (비용 없음)')
</script>

<template>
  <div class="min-h-svh bg-transparent">
    <AppHeader title="체크 리스트" to="/roadmap" />
    <main id="main" class="space-y-4 px-5 pb-10 pt-2">
      <p v-if="loading" class="py-16 text-center text-body-sm text-muted">불러오는 중…</p>

      <div v-else-if="error || !m" class="py-16 text-center">
        <p class="text-body-sm text-muted">{{ error ?? '목표를 찾을 수 없어요.' }}</p>
        <UiButton variant="secondary" class="mt-3" @click="reload">다시 시도</UiButton>
      </div>

      <template v-else>
        <div>
          <div class="flex items-center gap-2">
            <span class="rounded-full bg-primary-tint px-2.5 py-0.5 text-caption font-semibold text-primary-dark">
              {{ m.category }}
            </span>
            <span
              class="rounded-full px-2.5 py-0.5 text-caption font-semibold"
              :class="m.status === 'review' ? 'bg-amber-tint text-amber' : 'bg-primary-tint text-primary-dark'"
              >{{ STATUS_LABEL[m.status] ?? m.status }}</span
            >
          </div>
          <h1 class="mt-2 text-h3 text-ink">{{ m.title }}</h1>
        </div>

        <section v-if="m.content" class="glass-tint rounded-2xl p-4">
          <h2 class="text-label text-primary-dark">왜 먼저 해야 하나요?</h2>
          <p class="mt-1.5 text-body-sm leading-relaxed text-body">{{ m.content }}</p>
        </section>

        <section v-if="items.length" class="glass rounded-2xl p-4">
          <div class="flex items-end justify-between">
            <span class="text-body-sm text-muted">진행률</span>
            <span class="tabular text-h3 font-bold text-ink">{{ doneCount }} / {{ items.length }}</span>
          </div>
          <ProgressMeter
            class="mt-2.5"
            :value="donePct"
            :aria-label="`할 일 ${items.length}개 중 ${doneCount}개 완료`"
          />
          <p v-if="m.targetAmount" class="mt-2 text-caption text-muted">
            목표 금액 {{ won(m.targetAmount) }}
            <template v-if="m.durationValue && m.durationUnit">
              · {{ m.durationValue }}{{ m.durationUnit === 'month' ? '개월' : '주' }} 계획
            </template>
          </p>
        </section>

        <section v-if="items.length">
          <div class="flex items-baseline justify-between">
            <h2 class="text-label text-ink">할 일</h2>
            <span class="text-caption text-muted">{{ doneCount }} / {{ items.length }} 완료</span>
          </div>

          <ul class="mt-2 space-y-2.5">
            <li v-for="c in items" :key="c.id">
              <!-- 미완료: 누르면 그 자리에서 완료 처리한다. -->
              <button
                v-if="!isDone(c)"
                type="button"
                class="glass tap-target block w-full rounded-2xl p-3.5 text-left disabled:opacity-50"
                :disabled="pendingId !== null"
                :aria-label="`${c.contents} 완료 처리하기`"
                @click="complete(c)"
              >
                <span class="flex items-center gap-2.5">
                  <span
                    class="size-[18px] shrink-0 rounded-[5px] border-[1.5px] border-border-strong"
                    aria-hidden="true"
                  />
                  <span class="min-w-0 flex-1 text-body-sm text-ink">{{ c.contents }}</span>
                  <span v-if="pendingId === c.id" class="text-caption text-muted">처리 중…</span>
                </span>
                <span class="mt-1 block text-caption text-muted">
                  예상 금액: {{ amount(c.estimatedAmount) }}
                </span>
              </button>

              <!-- 완료: 되돌리는 API 가 없어 다시 누를 수 없다. -->
              <div v-else class="glass rounded-2xl p-3.5">
                <p class="flex items-center gap-2.5">
                  <span
                    class="flex size-[18px] shrink-0 items-center justify-center rounded-[5px] bg-primary text-on-primary"
                    aria-hidden="true"
                  >
                    <Check :size="13" :stroke-width="3" />
                  </span>
                  <span class="min-w-0 flex-1 text-body-sm text-muted">{{ c.contents }}</span>
                  <span class="sr-only">완료됨</span>
                </p>
                <p class="mt-1 text-caption text-muted">
                  예상 금액: {{ amount(c.estimatedAmount) }}
                </p>
              </div>
            </li>
          </ul>

          <p v-if="completeError" role="alert" class="mt-2 text-body-sm text-danger">
            {{ completeError }}
          </p>
        </section>

        <section v-if="m.nextAction" class="glass-tint rounded-2xl p-4">
          <h2 class="text-label text-primary-dark">다음 행동</h2>
          <p class="mt-1.5 text-body-sm leading-relaxed text-body">{{ m.nextAction }}</p>
        </section>

        <p v-if="m.citation" class="text-caption text-muted">출처 · {{ m.citation }}</p>
      </template>
    </main>
  </div>
</template>
