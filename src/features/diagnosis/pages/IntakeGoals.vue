<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown } from 'lucide-vue-next'
import WizardChrome from '@/shared/components/WizardChrome.vue'
import UiChip from '@/shared/ui/UiChip.vue'
import GoalAnswerForm from '@/features/diagnosis/components/GoalAnswerForm.vue'
import { state, GOAL_CATALOG, CATEGORY_LABEL, type GoalCategory, type SubCategoryCode } from '@/features/diagnosis/model/store'

const router = useRouter()
const open = ref<GoalCategory | null>('housing')

const DOT: Record<GoalCategory, string> = {
  housing: 'bg-cat-housing',
  living: 'bg-cat-living',
  work: 'bg-cat-work',
  finance: 'bg-cat-finance',
}

function pickedSub(c: GoalCategory): SubCategoryCode | null {
  return state.goals.find((g) => g.category === c)?.sub ?? null
}
function pickedAnswers(c: GoalCategory): Record<string, unknown> | null {
  return state.goals.find((g) => g.category === c)?.answers ?? null
}
// 카테고리당 세부 목표 1개만 선택 가능(단일 선택). 같은 sub 재클릭 시 해제, 다른 sub 클릭 시 교체.
function selectSub(c: GoalCategory, sub: SubCategoryCode) {
  const i = state.goals.findIndex((g) => g.category === c)
  if (i >= 0 && state.goals[i].sub === sub) {
    state.goals.splice(i, 1)
    return
  }
  if (i >= 0) state.goals.splice(i, 1)
  state.goals.push({ category: c, sub, answers: {} })
}

const canNext = computed(() => state.goals.length > 0)
</script>

<template>
  <WizardChrome
    title="정보 입력"
    :step="3"
    :total="3"
    step-label="목표"
    back-to="/intake/income"
    :can-next="canNext"
    @next="router.push('/diagnosing')"
  >
    <div>
      <h2 class="text-h3 text-ink">어떤 목표를 이루고 싶나요?</h2>
      <p class="mt-1 text-body-sm text-muted">큰 분류 안에서 세부 목표를 골라요 (세부 목표는 카테고리당 1개만 선택돼요)</p>
    </div>

    <div class="flex flex-col gap-2">
      <div
        v-for="c in GOAL_CATALOG"
        :key="c.category"
        class="glass overflow-hidden rounded-2xl"
        :class="open === c.category ? 'ring-1 ring-primary/40' : ''"
      >
        <button
          type="button"
          class="tap-target flex w-full items-center gap-2.5 px-4 py-3.5 text-left"
          :aria-expanded="open === c.category"
          @click="open = open === c.category ? null : c.category"
        >
          <span class="size-2.5 rounded-full" :class="DOT[c.category]" aria-hidden="true" />
          <span class="flex-1">
            <span class="block text-label text-ink">{{ CATEGORY_LABEL[c.category] }}</span>
            <span
              v-if="open !== c.category"
              class="mt-0.5 block text-caption text-muted"
              >{{ c.hint }}</span
            >
          </span>
          <ChevronDown
            :size="18"
            class="shrink-0 text-muted transition-transform"
            :class="open === c.category ? 'rotate-180' : ''"
            aria-hidden="true"
          />
        </button>

        <div v-if="open === c.category" class="border-t border-border p-4">
          <div class="flex flex-wrap gap-2" role="radiogroup" :aria-label="`${CATEGORY_LABEL[c.category]} 세부 목표`">
            <UiChip
              v-for="s in c.subs"
              :key="s.code"
              :label="s.label"
              :selected="pickedSub(c.category) === s.code"
              @toggle="selectSub(c.category, s.code)"
            />
          </div>
          <div v-if="pickedSub(c.category) && pickedAnswers(c.category)" class="mt-4">
            <GoalAnswerForm :sub="pickedSub(c.category)!" :answers="pickedAnswers(c.category)!" />
          </div>
        </div>
      </div>
    </div>
  </WizardChrome>
</template>
