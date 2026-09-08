<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { TriangleAlert } from 'lucide-vue-next'
import AppHeader from '@/shared/components/AppHeader.vue'
import UiButton from '@/shared/ui/UiButton.vue'
import { won } from '@/shared/lib/money'
import { me, loadMe, ymdDotted } from '@/shared/lib/me'

const router = useRouter()

onMounted(() => {
  void loadMe()
})

const BLANK = '미입력'

// GET /api/users/me 의 profile 파생값. 값이 없으면 "미입력".
const rows = computed<[string, string][]>(() => {
  const p = me.data?.profile
  return [
    ['보호종료(예정)일', ymdDotted(p?.protectionEndDate) ?? BLANK],
    ['거주 지역', p?.regionDisplay ?? p?.regionCode ?? BLANK],
    ['현재 월 평균 소득', p?.income != null ? won(p.income) : BLANK],
    [
      '소득·수급 상태',
      p?.isBasicRecipient == null ? BLANK : p.isBasicRecipient ? '기초생활수급' : '해당 없음',
    ],
    ['가구원 수', p?.householdSize != null ? `${p.householdSize}명` : BLANK],
    [
      '자립준비청년 신청',
      p?.isYouthSupport == null ? BLANK : p.isYouthSupport ? '신청함' : '아직 안 함',
    ],
    ['현재 보유 자립 자금', p?.fixedBudget != null ? won(p.fixedBudget) : BLANK],
  ]
})

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
    <AppHeader title="조건 수정" to="/me" />
    <main id="main" class="flex-1 space-y-2.5 px-5 pt-2">
      <p class="text-body-sm text-muted">바뀐 조건을 수정하고 로드맵을 다시 만들 수 있어요.</p>

      <p v-if="me.loading" class="py-6 text-center text-body-sm text-muted">불러오는 중…</p>

      <template v-else>
        <p v-if="hint" class="text-caption text-muted">{{ hint }}</p>

        <button
          v-for="[label, value] in rows"
          :key="label"
          type="button"
          class="tap-target flex w-full items-center justify-between gap-3 rounded-2xl border border-border px-4 py-3.5 text-left"
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

      <div class="flex items-start gap-2 rounded-2xl bg-amber-tint p-4">
        <TriangleAlert :size="16" class="mt-0.5 shrink-0 text-amber" aria-hidden="true" />
        <p class="text-caption leading-snug text-amber">
          조건을 바꾸면 로드맵이 새로 생성돼요. 이미 완료한 체크리스트와 기록한 지출은 그대로 유지되고,
          미완료 절차와 정책 매칭만 최신 조건으로 다시 짜여요.
        </p>
      </div>
    </main>

    <div
      class="glass-strong sticky bottom-0 border-x-0 border-b-0 px-5 pb-7 pt-3"
      style="padding-bottom: max(1.75rem, env(safe-area-inset-bottom))"
    >
      <UiButton size="lg" block @click="router.push('/diagnosing')">로드맵 다시 만들기</UiButton>
    </div>
  </div>
</template>
