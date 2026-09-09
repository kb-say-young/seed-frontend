<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown } from 'lucide-vue-next'
import WizardChrome from '@/shared/components/WizardChrome.vue'
import UiChip from '@/shared/ui/UiChip.vue'
import UiField from '@/shared/ui/UiField.vue'
import RegionSelect from '@/shared/components/RegionSelect.vue'
import {
  state,
  GOAL_CATALOG,
  CATEGORY_DOT,
  goalFieldsFor,
  isGoalComplete,
  type GoalFieldDef,
} from '@/features/diagnosis/model/store'

const router = useRouter()
const open = ref<string | null>('1')

function pickedGoal(parentId: string) {
  return state.goals.find((g) => g.parentId === parentId)
}
function pickedSubId(parentId: string) {
  return pickedGoal(parentId)?.categoryId ?? null
}
// 한 대분류 = 세부 목표 1개 (Single Select). 같은 걸 다시 누르면 해제.
function pick(parentId: string, categoryId: string) {
  const i = state.goals.findIndex((g) => g.parentId === parentId)
  if (i >= 0 && state.goals[i].categoryId === categoryId) state.goals.splice(i, 1)
  else if (i >= 0) state.goals[i] = { parentId, categoryId, answers: {} }
  else state.goals.push({ parentId, categoryId, answers: {} })
}

// 지금 답으로 보여야 하는(=조건부 필드까지 반영한) 세부 목표별 추가 질문 목록.
function visibleFields(parentId: string): GoalFieldDef[] {
  const g = pickedGoal(parentId)
  if (!g) return []
  return goalFieldsFor(g.categoryId).filter((f) => !f.showIf || g.answers[f.showIf.key] === f.showIf.equals)
}

function answer(parentId: string, key: string) {
  return pickedGoal(parentId)?.answers[key]
}
function stringAnswer(parentId: string, key: string): string {
  const v = answer(parentId, key)
  return typeof v === 'string' ? v : ''
}
function numberAnswer(parentId: string, key: string): string {
  const v = answer(parentId, key)
  return typeof v === 'number' ? String(v) : ''
}
function setAnswer(parentId: string, key: string, value: string | number | boolean) {
  const g = pickedGoal(parentId)
  if (!g) return
  g.answers[key] = value
  // 이 답에 기대어 조건부로 보이던 필드가 다시 숨겨지면, 남아 있던 이전 값도 같이 지운다
  // (숨겨진 값이 그대로 제출되지 않게).
  for (const f of goalFieldsFor(g.categoryId)) {
    if (f.showIf?.key === key && g.answers[f.showIf.key] !== f.showIf.equals) {
      delete g.answers[f.key]
    }
  }
}
function setNumberAnswer(parentId: string, key: string, raw: string) {
  const digits = raw.replace(/\D/g, '').replace(/^0+(?=\d)/, '') // 숫자만 · 앞자리 0 제거
  const g = pickedGoal(parentId)
  if (!g) return
  if (!digits) delete g.answers[key]
  else setAnswer(parentId, key, Number(digits))
}

// 접힌 카드 머리글에 표시할 요약 — 세부 목표 이름(추가 질문이 남아 있으면 안내 문구).
const pickedSummary = (parentId: string) => {
  const subId = pickedSubId(parentId)
  if (!subId) return null
  const label = GOAL_CATALOG.find((c) => c.parentId === parentId)?.subs.find((s) => s.id === subId)?.label
  const g = pickedGoal(parentId)
  return g && !isGoalComplete(g) ? `${label} · 추가 정보 필요` : label
}

const canNext = computed(() => state.goals.length > 0 && state.goals.every(isGoalComplete))
</script>

<template>
  <WizardChrome
    title="정보 입력"
    :step="3"
    :total="3"
    step-label="목표"
    back-to="/intake/income"
    next-label="진단 결과 보기"
    :can-next="canNext"
    @next="router.push('/diagnosing')"
  >
    <div>
      <h2 class="text-h3 text-ink">어떤 목표를 이루고 싶나요?</h2>
      <p class="mt-1 text-body-sm text-muted">큰 분류마다 세부 목표를 하나씩 골라요</p>
    </div>

    <div class="flex flex-col gap-2">
      <div
        v-for="c in GOAL_CATALOG"
        :key="c.parentId"
        class="glass overflow-hidden rounded-2xl"
        :class="open === c.parentId ? 'ring-1 ring-primary/40' : ''"
      >
        <button
          type="button"
          class="tap-target flex w-full items-center gap-2.5 px-4 py-3.5 text-left"
          :aria-expanded="open === c.parentId"
          @click="open = open === c.parentId ? null : c.parentId"
        >
          <span class="size-2.5 rounded-full" :class="CATEGORY_DOT[c.parentId]" aria-hidden="true" />
          <span class="flex-1">
            <span class="block text-label text-ink">{{ c.label }}</span>
            <span
              class="mt-0.5 block text-caption"
              :class="pickedSubId(c.parentId) ? 'font-semibold text-primary-dark' : 'text-muted'"
            >
              {{ pickedSubId(c.parentId) ? pickedSummary(c.parentId) : c.hint }}
            </span>
          </span>
          <ChevronDown
            :size="18"
            class="shrink-0 text-muted transition-transform"
            :class="open === c.parentId ? 'rotate-180' : ''"
            aria-hidden="true"
          />
        </button>

        <div v-if="open === c.parentId" class="border-t border-border p-4">
          <div class="flex flex-wrap gap-2" role="radiogroup" :aria-label="`${c.label} 세부 목표`">
            <UiChip
              v-for="s in c.subs"
              :key="s.id"
              :label="s.label"
              :selected="pickedSubId(c.parentId) === s.id"
              @toggle="pick(c.parentId, s.id)"
            />
          </div>

          <div v-if="pickedSubId(c.parentId)" class="mt-4 flex flex-col gap-4">
            <template v-for="f in visibleFields(c.parentId)" :key="f.key">
              <RegionSelect
                v-if="f.type === 'region'"
                :model-value="stringAnswer(c.parentId, f.key)"
                :label="f.label"
                required
                @update:model-value="setAnswer(c.parentId, f.key, $event)"
              />

              <UiField
                v-else-if="f.type === 'number'"
                :model-value="numberAnswer(c.parentId, f.key)"
                :label="f.label"
                required
                placeholder="0"
                inputmode="numeric"
                numeric-only
                :suffix="f.suffix"
                @update:model-value="setNumberAnswer(c.parentId, f.key, $event)"
              />

              <UiField
                v-else-if="f.type === 'text'"
                :model-value="stringAnswer(c.parentId, f.key)"
                :label="f.label"
                required
                @update:model-value="setAnswer(c.parentId, f.key, $event)"
              />

              <fieldset v-else-if="f.type === 'boolean'">
                <legend class="mb-1.5 text-label text-ink">
                  {{ f.label }}<span class="text-danger" aria-hidden="true"> *</span>
                </legend>
                <div class="flex gap-2" role="radiogroup" :aria-label="f.label">
                  <UiChip
                    label="예"
                    :selected="answer(c.parentId, f.key) === true"
                    @toggle="setAnswer(c.parentId, f.key, true)"
                  />
                  <UiChip
                    label="아니오"
                    :selected="answer(c.parentId, f.key) === false"
                    @toggle="setAnswer(c.parentId, f.key, false)"
                  />
                </div>
              </fieldset>

              <fieldset v-else>
                <legend class="mb-1.5 text-label text-ink">
                  {{ f.label }}<span class="text-danger" aria-hidden="true"> *</span>
                </legend>
                <div class="flex flex-wrap gap-2" role="radiogroup" :aria-label="f.label">
                  <UiChip
                    v-for="opt in f.options"
                    :key="opt"
                    :label="opt"
                    :selected="answer(c.parentId, f.key) === opt"
                    @toggle="setAnswer(c.parentId, f.key, opt)"
                  />
                </div>
              </fieldset>
            </template>
          </div>
        </div>
      </div>
    </div>
  </WizardChrome>
</template>
