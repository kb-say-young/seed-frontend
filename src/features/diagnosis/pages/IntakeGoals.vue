<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown } from 'lucide-vue-next'
import WizardChrome from '@/shared/components/WizardChrome.vue'
import UiChip from '@/shared/ui/UiChip.vue'
import UiField from '@/shared/ui/UiField.vue'
import { state, GOAL_CATALOG, CATEGORY_LABEL, type GoalCategory } from '@/features/diagnosis/model/store'

const router = useRouter()
const open = ref<GoalCategory | null>('housing')

const DOT: Record<GoalCategory, string> = {
  housing: 'bg-cat-housing',
  living: 'bg-cat-living',
  work: 'bg-cat-work',
  finance: 'bg-cat-finance',
}

function isPicked(c: GoalCategory, sub: string) {
  return state.goals.some((g) => g.category === c && g.sub === sub)
}
function toggle(c: GoalCategory, sub: string) {
  const i = state.goals.findIndex((g) => g.category === c && g.sub === sub)
  if (i >= 0) state.goals.splice(i, 1)
  else state.goals.push({ category: c, sub })
}
const amountStr = (c: GoalCategory) => {
  const g = state.goals.find((x) => x.category === c)
  return g?.targetAmount == null ? '' : String(Math.round(g.targetAmount / 10000))
}
const setAmount = (c: GoalCategory, v: string) => {
  const g = state.goals.find((x) => x.category === c)
  if (g) g.targetAmount = (Number(v.replace(/\D/g, '')) || 0) * 10000
}
const regionStr = (c: GoalCategory) => state.goals.find((x) => x.category === c)?.region ?? ''
const setRegion = (c: GoalCategory, v: string) => {
  const g = state.goals.find((x) => x.category === c)
  if (g) g.region = v
}

const canNext = computed(() => state.goals.length > 0)
</script>

<template>
  <WizardChrome
    title="정보 입력"
    :step="3"
    :total="4"
    step-label="목표"
    back-to="/intake/income"
    :can-next="canNext"
    @next="router.push('/intake/priority')"
  >
    <div>
      <h2 class="text-h3 text-ink">어떤 목표를 이루고 싶나요?</h2>
      <p class="mt-1 text-body-sm text-muted">큰 분류 안에서 세부 목표를 골라요 (여러 개 가능)</p>
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
          <div class="flex flex-wrap gap-2">
            <UiChip
              v-for="s in c.subs"
              :key="s"
              :label="s"
              :selected="isPicked(c.category, s)"
              @toggle="toggle(c.category, s)"
            />
          </div>
          <div v-if="state.goals.some((g) => g.category === c.category)" class="mt-4 flex flex-col gap-4">
            <UiField
              :model-value="amountStr(c.category)"
              label="희망 금액 (만원)"
              placeholder="0"
              inputmode="numeric"
              @update:model-value="setAmount(c.category, $event)"
            />
            <UiField
              v-if="c.category === 'housing'"
              :model-value="regionStr(c.category)"
              label="희망 거주 지역"
              placeholder="예: 서울시 마포구"
              @update:model-value="setRegion(c.category, $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </WizardChrome>
</template>
