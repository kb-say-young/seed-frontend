<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'
import UiButton from '@/shared/ui/UiButton.vue'
import { won } from '@/shared/lib/money'
import { me, loadMe, ymdDotted } from '@/shared/lib/me'
import { userApi } from '@/shared/api'
import { useResource } from '@/shared/lib/useResource'
// 새 화면을 따로 만들지 않고 온보딩 입력 마법사(N1~N3)를 그대로 재사용한다.
// "수정 ›" 를 누르면 지금 값으로 채운 뒤 그 화면으로 보낸다.
import { state as intakeState } from '@/features/diagnosis/model/store'

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

type EditTarget = 'info' | 'goals'

// GET /api/users/me 의 profile 파생값. 값이 없으면 "미입력".
// target: 이 행을 눌렀을 때 보낼 온보딩 화면 — 목표만 따로, 나머지는 기본 정보 입력으로.
const rows = computed<[string, string, EditTarget][]>(() => {
  const p = me.data?.profile
  return [
    ['보호종료(예정)일', ymdDotted(p?.protectionEndDate) ?? BLANK, 'info'],
    ['거주 지역', p?.regionDisplay ?? p?.regionCode ?? BLANK, 'info'],
    ['현재 월 평균 소득', p?.income != null ? won(p.income) : BLANK, 'info'],
    [
      '소득·수급 상태',
      p?.isBasicRecipient == null ? BLANK : p.isBasicRecipient ? '기초생활수급' : '해당 없음',
      'info',
    ],
    ['가구원 수', p?.householdSize != null ? `${p.householdSize}명` : BLANK, 'info'],
    [
      '자립준비청년 신청',
      p?.isYouthSupport == null ? BLANK : p.isYouthSupport ? '신청함' : '아직 안 함',
      'info',
    ],
    ['목표 · 우선순위', goalSummary.value, 'goals'],
    ['현재 보유 자립 자금', p?.fixedBudget != null ? won(p.fixedBudget) : BLANK, 'info'],
  ]
})

// "YYYY-MM-DD"(백엔드) → "YYYY.MM.DD"(온보딩 입력 화면이 쓰는 형식, 점 사이 공백 없음)
function toWizardDate(iso: string | null | undefined): string {
  if (!iso) return ''
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  return m ? `${m[1]}.${m[2]}.${m[3]}` : ''
}

// 지금 값으로 온보딩 입력 상태를 채운다 — 비워진 채로 보내면 처음부터 다시 입력해야 한다.
// ⚠️ 학력(education)은 GET /api/users/me 응답에 없어 채울 수 없다. 그 화면에서 다시 골라야 한다.
function fillIntakeState() {
  const p = me.data?.profile
  intakeState.protectionEndDate = toWizardDate(p?.protectionEndDate)
  intakeState.isYouthSupportApplied = p?.isYouthSupport ?? null
  intakeState.isBasicRecipient = p?.isBasicRecipient ?? null
  intakeState.regionCode = p?.regionCode ?? ''
  intakeState.householdSize = p?.householdSize ?? null
  intakeState.monthlyIncome = p?.income ?? null
  intakeState.cdaBalance = p?.fixedBudget ?? null
  intakeState.goals = (goals.value ?? []).map((g) => ({
    parentId: g.parentCategoryId,
    categoryId: g.categoryId,
  }))
}

function editRow(target: EditTarget) {
  fillIntakeState()
  if (target === 'goals') {
    router.push('/intake/goals')
    return
  }
  // 기초생활수급 여부에 따라 소득 입력 화면이 갈린다 — 온보딩과 같은 분기.
  router.push('/intake')
}

// 진단 전(프로필 없음)이거나 조회 실패 시 안내 문구
const hint = computed(() => {
  if (me.loading) return ''
  if (me.error) return '내 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
  if (!me.data?.profile) return '아직 진단 정보를 입력하지 않았어요. 진단을 완료하면 여기에 조건이 채워져요.'
  return ''
})
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
    <main id="main" class="mt-8 flex-1 space-y-2.5 px-6">
      <p class="text-body-sm text-muted">바뀐 조건을 수정하고 로드맵을 다시 만들 수 있어요.</p>

      <p v-if="me.loading" class="py-6 text-center text-body-sm text-muted">불러오는 중…</p>

      <template v-else>
        <p v-if="hint" class="text-caption text-muted">{{ hint }}</p>

        <button
          v-for="[label, value, target] in rows"
          :key="label"
          type="button"
          class="tap-target glass flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-left"
          @click="editRow(target)"
        >
          <span>
            <span class="block text-caption text-muted">{{ label }}</span>
            <span
              class="block text-body-sm"
              :class="value === '미입력' ? 'text-muted' : 'text-ink'"
              >{{ value }}</span
            >
          </span>
          <span class="shrink-0 text-body-sm font-bold text-primary-dark">수정 ›</span>
        </button>
      </template>
    </main>

    <div
      class="glass-strong sticky bottom-0 border-x-0 border-b-0 px-6 pb-7 pt-3"
      style="padding-bottom: max(1.75rem, env(safe-area-inset-bottom))"
    >
      <UiButton size="lg" block @click="router.push('/roadmap')">로드맵 다시 만들기</UiButton>
    </div>
  </div>
</template>
