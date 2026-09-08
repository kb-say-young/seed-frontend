<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ChevronUp, ChevronDown } from 'lucide-vue-next'
import BottomSheet from '@/shared/components/BottomSheet.vue'
import UiButton from '@/shared/ui/UiButton.vue'

// 생년월일 / 보호종료(예정)일 입력. 연·월·일 버튼을 누르면 다이얼(휠 피커) 시트가 열린다.
// 직접 타이핑 없음. v-model 값은 "YYYY.MM.DD" 문자열.
const props = withDefaults(
  defineProps<{
    modelValue: string
    label: string
    required?: boolean
    hint?: string
    minYear?: number
    maxYear?: number
    // 값이 없을 때 시트를 열면 오늘 날짜로 시작한다 (예: 보호종료 예정일)
    defaultToday?: boolean
  }>(),
  { minYear: 1990, maxYear: new Date().getFullYear() + 5, defaultToday: false },
)
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const YEARS = Array.from({ length: props.maxYear - props.minYear + 1 }, (_, i) => props.minYear + i)
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)
function daysIn(y: number, m: number) {
  return new Date(y, m, 0).getDate()
}

// 현재 확정값
const parts = computed(() => {
  const mt = /^(\d{4})\D?(\d{2})\D?(\d{2})$/.exec((props.modelValue || '').trim())
  return mt ? { y: +mt[1], m: +mt[2], d: +mt[3] } : null
})
const disp = (n: number) => String(n).padStart(2, '0')

// 시트 임시값
const open = ref(false)
const focusCol = ref<'y' | 'm' | 'd'>('y')
const draft = ref({ y: YEARS[Math.floor(YEARS.length / 2)], m: 1, d: 1 })
const days = computed(() => Array.from({ length: daysIn(draft.value.y, draft.value.m) }, (_, i) => i + 1))

watch(
  () => draft.value.m,
  () => {
    const max = daysIn(draft.value.y, draft.value.m)
    if (draft.value.d > max) draft.value.d = max
  },
)

function openSheet(col: 'y' | 'm' | 'd') {
  const p = parts.value
  const now = new Date()
  const clampYear = (v: number) => Math.min(props.maxYear, Math.max(props.minYear, v))
  const fallback = props.defaultToday
    ? { y: clampYear(now.getFullYear()), m: now.getMonth() + 1, d: now.getDate() }
    : { y: clampYear(now.getFullYear() - 20), m: 1, d: 1 }
  draft.value = {
    y: p?.y ?? fallback.y,
    m: p?.m ?? fallback.m,
    d: p?.d ?? fallback.d,
  }
  focusCol.value = col
  open.value = true
  nextTick(() => scrollToSelected())
}
function confirm() {
  const { y, m, d } = draft.value
  emit('update:modelValue', `${y}.${disp(m)}.${disp(d)}`)
  open.value = false
}

// --- 휠 스크롤 ---
const ITEM_H = 40
const cols = ref<Record<'y' | 'm' | 'd', HTMLElement | null>>({ y: null, m: null, d: null })

function scrollToSelected() {
  for (const key of ['y', 'm', 'd'] as const) {
    const el = cols.value[key]
    if (!el) continue
    const list = key === 'y' ? YEARS : key === 'm' ? MONTHS : days.value
    const idx = list.indexOf(draft.value[key])
    if (idx >= 0) el.scrollTop = idx * ITEM_H
  }
}
function onScroll(key: 'y' | 'm' | 'd') {
  const el = cols.value[key]
  if (!el) return
  const idx = Math.round(el.scrollTop / ITEM_H)
  const list = key === 'y' ? YEARS : key === 'm' ? MONTHS : days.value
  const val = list[Math.max(0, Math.min(list.length - 1, idx))]
  if (val != null) draft.value[key] = val
}
function step(key: 'y' | 'm' | 'd', delta: number) {
  const list = key === 'y' ? YEARS : key === 'm' ? MONTHS : days.value
  const i = list.indexOf(draft.value[key])
  const ni = Math.max(0, Math.min(list.length - 1, i + delta))
  draft.value[key] = list[ni]
  nextTick(() => {
    const el = cols.value[key]
    if (el) el.scrollTop = ni * ITEM_H
  })
}

const WHEEL_LABEL = { y: '연도', m: '월', d: '일' } as const
</script>

<template>
  <div>
    <span class="mb-1.5 block text-label text-ink">
      {{ label }}<span v-if="required" class="text-danger" aria-hidden="true"> *</span>
      <span v-if="required" class="sr-only"> (필수)</span>
    </span>
    <div class="grid grid-cols-3 gap-2">
      <button
        v-for="col in (['y', 'm', 'd'] as const)"
        :key="col"
        type="button"
        class="glass-field min-h-12 rounded-md border-[1.5px] px-3 text-body text-ink"
        :aria-label="`${label} ${WHEEL_LABEL[col]} 선택`"
        @click="openSheet(col)"
      >
        <template v-if="parts">
          {{ col === 'y' ? parts.y : col === 'm' ? disp(parts.m) : disp(parts.d)
          }}{{ col === 'y' ? '년' : col === 'm' ? '월' : '일' }}
        </template>
        <span v-else class="text-muted">{{ WHEEL_LABEL[col] }}</span>
      </button>
    </div>
    <p v-if="hint" class="mt-1.5 text-body-sm text-muted">{{ hint }}</p>

    <BottomSheet :open="open" :title="`${label} 선택`" @close="open = false">
      <div class="flex gap-2" role="group" :aria-label="`${label} 다이얼`">
        <div v-for="col in (['y', 'm', 'd'] as const)" :key="col" class="flex flex-1 flex-col items-center">
          <p class="mb-1 text-center text-caption font-semibold text-muted">{{ WHEEL_LABEL[col] }}</p>
          <button
            type="button"
            class="flex h-8 w-full items-center justify-center rounded-md text-muted hover:bg-surface-subtle"
            :aria-label="`${WHEEL_LABEL[col]} 이전`"
            @click="step(col, -1)"
          >
            <ChevronUp :size="18" aria-hidden="true" />
          </button>
          <div class="relative w-full">
            <!-- 중앙 선택 밴드 (휠 중앙에 정렬) -->
            <div
              class="pointer-events-none absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 rounded-lg bg-primary-tint"
              aria-hidden="true"
            />
            <div
              :ref="(el) => (cols[col] = el as HTMLElement)"
              class="wheel h-[160px] overflow-y-auto"
              tabindex="0"
              role="spinbutton"
              :aria-label="WHEEL_LABEL[col]"
              :aria-valuenow="draft[col]"
              :aria-valuetext="`${draft[col]}${col === 'y' ? '년' : col === 'm' ? '월' : '일'}`"
              @scroll.passive="onScroll(col)"
              @keydown.up.prevent="step(col, -1)"
              @keydown.down.prevent="step(col, 1)"
            >
              <div style="height: 60px" aria-hidden="true" />
              <div
                v-for="v in (col === 'y' ? YEARS : col === 'm' ? MONTHS : days)"
                :key="v"
                class="flex h-10 items-center justify-center text-body tabular"
                :class="draft[col] === v ? 'font-bold text-primary-dark' : 'text-muted'"
              >
                {{ col === 'y' ? v : disp(v) }}
              </div>
              <div style="height: 60px" aria-hidden="true" />
            </div>
          </div>
          <button
            type="button"
            class="flex h-8 w-full items-center justify-center rounded-md text-muted hover:bg-surface-subtle"
            :aria-label="`${WHEEL_LABEL[col]} 다음`"
            @click="step(col, 1)"
          >
            <ChevronDown :size="18" aria-hidden="true" />
          </button>
        </div>
      </div>

      <p class="mt-2 text-center text-body-sm text-muted" aria-live="polite">
        {{ draft.y }}년 {{ disp(draft.m) }}월 {{ disp(draft.d) }}일
      </p>
      <UiButton size="lg" block class="mt-3" @click="confirm">선택 완료</UiButton>
    </BottomSheet>
  </div>
</template>

<style scoped>
.wheel {
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent,
    #000 30%,
    #000 70%,
    transparent
  );
  mask-image: linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent);
}
.wheel::-webkit-scrollbar {
  display: none;
}
.wheel > div {
  scroll-snap-align: center;
}
@media (prefers-reduced-motion: reduce) {
  .wheel {
    scroll-behavior: auto;
  }
}
</style>
