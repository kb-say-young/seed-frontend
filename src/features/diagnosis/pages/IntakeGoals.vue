<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown } from 'lucide-vue-next'
import WizardChrome from '@/shared/components/WizardChrome.vue'
import UiChip from '@/shared/ui/UiChip.vue'
import UiField from '@/shared/ui/UiField.vue'
import RegionSelect from '@/shared/components/RegionSelect.vue'
import { state, GOAL_CATALOG, CATEGORY_LABEL, type GoalCategory } from '@/features/diagnosis/model/store'

const router = useRouter()
const open = ref<GoalCategory | null>('housing')

const DOT: Record<GoalCategory, string> = {
  housing: 'bg-cat-housing',
  living: 'bg-cat-living',
  work: 'bg-cat-work',
  finance: 'bg-cat-finance',
}

function pickedSub(c: GoalCategory) {
  return state.goals.find((g) => g.category === c)?.sub ?? null
}
// 한 카테고리 = 세부 목표 1개 (Single Select). 같은 걸 다시 누르면 해제.
function pick(c: GoalCategory, sub: string) {
  const i = state.goals.findIndex((g) => g.category === c)
  if (i >= 0 && state.goals[i].sub === sub) state.goals.splice(i, 1)
  else if (i >= 0) state.goals[i] = { category: c, sub }
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
const regionCode = (c: GoalCategory) => state.goals.find((x) => x.category === c)?.regionCode ?? ''
const setRegionCode = (c: GoalCategory, code: string) => {
  const g = state.goals.find((x) => x.category === c)
  if (g) g.regionCode = code
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
              class="mt-0.5 block text-caption"
              :class="pickedSub(c.category) ? 'font-semibold text-primary-dark' : 'text-muted'"
              >{{ pickedSub(c.category) ?? c.hint }}</span
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
              :key="s"
              :label="s"
              :selected="pickedSub(c.category) === s"
              @toggle="pick(c.category, s)"
            />
          </div>
          <div v-if="pickedSub(c.category)" class="mt-4 flex flex-col gap-4">
            <UiField
              :model-value="amountStr(c.category)"
              label="희망 금액 (만원)"
              placeholder="0"
              inputmode="numeric"
              @update:model-value="setAmount(c.category, $event)"
            />
            <RegionSelect
              v-if="c.category === 'housing'"
              :model-value="regionCode(c.category)"
              label="희망 거주 지역"
              @update:model-value="setRegionCode(c.category, $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </WizardChrome>
</template>
