<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown } from 'lucide-vue-next'
import WizardChrome from '@/shared/components/WizardChrome.vue'
import UiChip from '@/shared/ui/UiChip.vue'
import UiField from '@/shared/ui/UiField.vue'
import RegionSelect from '@/shared/components/RegionSelect.vue'
import { state, GOAL_CATALOG, CATEGORY_DOT } from '@/features/diagnosis/model/store'

const router = useRouter()
const open = ref<string | null>('1')

function pickedSubId(parentId: string) {
  return state.goals.find((g) => g.parentId === parentId)?.categoryId ?? null
}
// 한 대분류 = 세부 목표 1개 (Single Select). 같은 걸 다시 누르면 해제.
function pick(parentId: string, categoryId: string) {
  const i = state.goals.findIndex((g) => g.parentId === parentId)
  if (i >= 0 && state.goals[i].categoryId === categoryId) state.goals.splice(i, 1)
  else if (i >= 0) state.goals[i] = { parentId, categoryId }
  else state.goals.push({ parentId, categoryId })
}

const amountStr = (parentId: string) => {
  const g = state.goals.find((x) => x.parentId === parentId)
  return g?.targetAmount == null ? '' : String(Math.round(g.targetAmount / 10000))
}
const setAmount = (parentId: string, v: string) => {
  const g = state.goals.find((x) => x.parentId === parentId)
  if (g) g.targetAmount = (Number(v.replace(/\D/g, '')) || 0) * 10000
}
const regionCode = (parentId: string) => state.goals.find((x) => x.parentId === parentId)?.regionCode ?? ''
const setRegionCode = (parentId: string, code: string) => {
  const g = state.goals.find((x) => x.parentId === parentId)
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
              {{
                pickedSubId(c.parentId)
                  ? c.subs.find((s) => s.id === pickedSubId(c.parentId))?.label
                  : c.hint
              }}
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
            <UiField
              :model-value="amountStr(c.parentId)"
              label="희망 금액 (만원)"
              placeholder="0"
              inputmode="numeric"
              @update:model-value="setAmount(c.parentId, $event)"
            />
            <RegionSelect
              v-if="c.parentId === '1'"
              :model-value="regionCode(c.parentId)"
              label="희망 거주 지역"
              @update:model-value="setRegionCode(c.parentId, $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </WizardChrome>
</template>
