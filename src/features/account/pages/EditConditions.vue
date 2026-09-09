<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'
import BottomSheet from '@/shared/components/BottomSheet.vue'
import DateWheelField from '@/shared/components/DateWheelField.vue'
import RegionSelect from '@/shared/components/RegionSelect.vue'
import UiButton from '@/shared/ui/UiButton.vue'
import UiChip from '@/shared/ui/UiChip.vue'
import UiField from '@/shared/ui/UiField.vue'
import { won } from '@/shared/lib/money'
import { me, loadMe, ymdDotted } from '@/shared/lib/me'
import { userApi, ApiError } from '@/shared/api'
import { useResource } from '@/shared/lib/useResource'
// 항목별 수정은 온보딩 입력 상태를 그대로 빌려 쓴다 — 화면은 새로 안 만들고,
// 지금 값으로 채운 뒤 그 항목 하나만 바꿔 같은 계약(POST /api/users/me/intake)으로 저장한다.
import { state as intakeState } from '@/features/diagnosis/model/store'
import { buildIntakePayload, IntakeIncompleteError } from '@/features/diagnosis/model/intake'

const router = useRouter()

onMounted(() => {
  void loadMe()
})

// 목표는 별도 조회 (GET /api/users/me/goals)
const { data: goals } = useResource(userApi.getGoals, { requireAuth: true })

const BLANK = '미입력'

const goalSummary = computed(() => {
  const g = goals.value
  if (!g || !g.length) return BLANK
  const top = [...g].sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))[0]
  return `${g.length}개 (${top.categoryName} 1순위)`
})

// 행마다 어떤 입력 컨트롤을 열지 구분하는 키. 'goals' 만 예외적으로 시트 대신
// /intake/goals 로 보낸다 — 대분류·세부 목표·희망 금액을 고르는 UI 가 따로 필요해서다.
type FieldKey =
  | 'protectionEndDate'
  | 'regionCode'
  | 'income'
  | 'isBasicRecipient'
  | 'householdSize'
  | 'isYouthSupport'
  | 'fixedBudget'
  | 'goals'

// GET /api/users/me 의 profile 파생값. 값이 없으면 "미입력".
const rows = computed<{ label: string; value: string; field: FieldKey }[]>(() => {
  const p = me.data?.profile
  return [
    { label: '보호종료(예정)일', value: ymdDotted(p?.protectionEndDate) ?? BLANK, field: 'protectionEndDate' },
    { label: '거주 지역', value: p?.regionDisplay ?? p?.regionCode ?? BLANK, field: 'regionCode' },
    { label: '현재 월 평균 소득', value: p?.income != null ? won(p.income) : BLANK, field: 'income' },
    {
      label: '소득·수급 상태',
      value: p?.isBasicRecipient == null ? BLANK : p.isBasicRecipient ? '기초생활수급' : '해당 없음',
      field: 'isBasicRecipient',
    },
    { label: '가구원 수', value: p?.householdSize != null ? `${p.householdSize}명` : BLANK, field: 'householdSize' },
    {
      label: '자립준비청년 신청',
      value: p?.isYouthSupport == null ? BLANK : p.isYouthSupport ? '신청함' : '아직 안 함',
      field: 'isYouthSupport',
    },
    { label: '목표 · 우선순위', value: goalSummary.value, field: 'goals' },
    { label: '현재 보유 자립 자금', value: p?.fixedBudget != null ? won(p.fixedBudget) : BLANK, field: 'fixedBudget' },
  ]
})

// 진단 전(프로필 없음)이거나 조회 실패 시 안내 문구
const hint = computed(() => {
  if (me.loading) return ''
  if (me.error) return '내 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
  if (!me.data?.profile) return '아직 진단 정보를 입력하지 않았어요. 진단을 완료하면 여기에 조건이 채워져요.'
  return ''
})

// "YYYY-MM-DD"(백엔드) → "YYYY.MM.DD"(온보딩 입력 상태가 쓰는 형식, 점 사이 공백 없음)
function toWizardDate(iso: string | null | undefined): string {
  if (!iso) return ''
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  return m ? `${m[1]}.${m[2]}.${m[3]}` : ''
}

// 지금 값으로 온보딩 입력 상태를 채운다 — 그중 한 항목만 시트에서 바꾸고, 나머지는
// 그대로 다시 제출한다(백엔드가 항목별 부분 수정을 지원하지 않아 매번 전체를 다시 보낸다).
function fillIntakeState() {
  const p = me.data?.profile
  intakeState.protectionEndDate = toWizardDate(p?.protectionEndDate)
  intakeState.isYouthSupportApplied = p?.isYouthSupport ?? null
  intakeState.isBasicRecipient = p?.isBasicRecipient ?? null
  intakeState.regionCode = p?.regionCode ?? ''
  intakeState.educationLevel = p?.education ?? ''
  intakeState.householdSize = p?.householdSize ?? null
  intakeState.monthlyIncome = p?.income ?? null
  intakeState.cdaBalance = p?.fixedBudget ?? null
  intakeState.goals = (goals.value ?? []).map((g) => ({
    parentId: g.parentCategoryId,
    categoryId: g.categoryId,
  }))
}

// 지금 시트에 열려 있는 항목. null 이면 닫힘.
const sheetField = ref<Exclude<FieldKey, 'goals'> | null>(null)
const sheetTitle = computed(() => rows.value.find((r) => r.field === sheetField.value)?.label ?? '')
const saving = ref(false)
const saveError = ref('')

function editRow(field: FieldKey) {
  fillIntakeState()
  if (field === 'goals') {
    router.push('/intake/goals')
    return
  }
  saveError.value = ''
  sheetField.value = field
}

function closeSheet() {
  sheetField.value = null
}

async function saveField() {
  if (saving.value) return
  saving.value = true
  saveError.value = ''
  try {
    const payload = buildIntakePayload()
    await userApi.submitIntake(payload)
    await loadMe(true)
    sheetField.value = null
  } catch (e) {
    saveError.value =
      e instanceof ApiError || e instanceof IntakeIncompleteError
        ? e.message
        : '저장에 실패했어요. 잠시 후 다시 시도해 주세요.'
  } finally {
    saving.value = false
  }
}

// 소득 · 보유 자금 금액 입력 — 0 도 유효값이라 moneyModel(0→null) 대신 직접 computed.
// (IntakeIncome.vue 의 amountModel 과 동일한 규칙)
function amountModel(get: () => number | null, set: (n: number | null) => void) {
  return computed({
    get: () => {
      const n = get()
      return n == null ? '' : n.toLocaleString('ko-KR')
    },
    set: (v: string) => {
      const digits = v.replace(/[^\d]/g, '')
      set(digits === '' ? null : Number(digits))
    },
  })
}
const incomeModel = amountModel(
  () => intakeState.monthlyIncome,
  (n) => (intakeState.monthlyIncome = n),
)
const cdaModel = amountModel(
  () => intakeState.cdaBalance,
  (n) => (intakeState.cdaBalance = n),
)

// 가구원 수 — IntakeBasic.vue 의 household 와 동일한 규칙(1~10명).
const householdModel = computed({
  get: () => (intakeState.householdSize == null ? '' : String(intakeState.householdSize)),
  set: (v: string) => {
    let n = parseInt(v.replace(/\D/g, '').slice(0, 2), 10)
    if (!Number.isFinite(n) || n <= 0) {
      intakeState.householdSize = null
      return
    }
    if (n > 10) n = 10
    intakeState.householdSize = n
  },
})

const thisYear = new Date().getFullYear()
</script>

<template>
  <div class="flex min-h-svh flex-col bg-transparent">
    <header class="flex items-center gap-2 px-6 pt-14">
      <button
        type="button"
        class="tap-target -ml-2 flex items-center justify-center rounded-full text-ink"
        aria-label="이전 화면"
        @click="router.push('/me')"
      >
        <ChevronLeft :size="24" aria-hidden="true" />
      </button>
      <h1 class="text-h2 text-ink">조건 수정</h1>
    </header>
    <main id="main" class="mt-8 flex-1 space-y-2.5 px-6 pb-10">
      <p class="text-body-sm text-muted">바뀐 조건만 골라 바로 수정할 수 있어요.</p>

      <p v-if="me.loading" class="py-6 text-center text-body-sm text-muted">불러오는 중…</p>

      <template v-else>
        <p v-if="hint" class="text-caption text-muted">{{ hint }}</p>

        <button
          v-for="r in rows"
          :key="r.label"
          type="button"
          class="tap-target glass flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-left"
          @click="editRow(r.field)"
        >
          <span>
            <span class="block text-caption text-muted">{{ r.label }}</span>
            <span
              class="block text-body-sm"
              :class="r.value === '미입력' ? 'text-muted' : 'text-ink'"
              >{{ r.value }}</span
            >
          </span>
          <span class="shrink-0 text-body-sm font-bold text-primary-dark">수정 ›</span>
        </button>
      </template>
    </main>

    <BottomSheet :open="sheetField !== null" :title="sheetTitle" @close="closeSheet">
      <form class="space-y-4" @submit.prevent="saveField">
        <DateWheelField
          v-if="sheetField === 'protectionEndDate'"
          v-model="intakeState.protectionEndDate"
          label="보호종료(예정)일"
          required
          :min-year="thisYear - 20"
          :max-year="thisYear + 5"
        />

        <RegionSelect v-else-if="sheetField === 'regionCode'" v-model="intakeState.regionCode" label="현재 거주지" required />

        <UiField
          v-else-if="sheetField === 'income'"
          v-model="incomeModel"
          label="월 평균 소득"
          required
          placeholder="0"
          inputmode="numeric"
          suffix="원"
        />

        <UiField
          v-else-if="sheetField === 'fixedBudget'"
          v-model="cdaModel"
          label="디딤씨앗통장 잔액"
          required
          placeholder="0"
          inputmode="numeric"
          suffix="원"
        />

        <UiField
          v-else-if="sheetField === 'householdSize'"
          v-model="householdModel"
          label="현재 가구원 수"
          required
          placeholder="예: 1"
          inputmode="numeric"
          suffix="명"
        />

        <fieldset v-else-if="sheetField === 'isBasicRecipient'">
          <legend class="mb-1.5 text-label text-ink">기초생활수급자 여부</legend>
          <div class="flex gap-2" role="radiogroup" aria-label="기초생활수급자 여부">
            <UiChip label="예" :selected="intakeState.isBasicRecipient === true" @toggle="intakeState.isBasicRecipient = true" />
            <UiChip label="아니오" :selected="intakeState.isBasicRecipient === false" @toggle="intakeState.isBasicRecipient = false" />
          </div>
        </fieldset>

        <fieldset v-else-if="sheetField === 'isYouthSupport'">
          <legend class="mb-1.5 text-label text-ink">자립준비청년 신청 여부</legend>
          <div class="flex gap-2" role="radiogroup" aria-label="자립준비청년 신청 여부">
            <UiChip label="신청함" :selected="intakeState.isYouthSupportApplied === true" @toggle="intakeState.isYouthSupportApplied = true" />
            <UiChip label="아직 안 함" :selected="intakeState.isYouthSupportApplied === false" @toggle="intakeState.isYouthSupportApplied = false" />
          </div>
        </fieldset>

        <p v-if="saveError" role="alert" class="text-body-sm text-danger">{{ saveError }}</p>

        <UiButton type="submit" size="lg" block :disabled="saving">
          {{ saving ? '저장 중…' : '저장' }}
        </UiButton>
      </form>
    </BottomSheet>
  </div>
</template>
