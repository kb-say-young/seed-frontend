<script setup lang="ts">
import { useRouter } from 'vue-router'
import { TriangleAlert } from 'lucide-vue-next'
import AppHeader from '../components/AppHeader.vue'
import UiButton from '../components/UiButton.vue'

const router = useRouter()
const rows = [
  ['보호종료(예정)일', '2024. 02. 28'],
  ['거주 지역', '서울 · 경기'],
  ['현재 월 평균 소득', '1,100,000원'],
  ['고용 상태', '구직 중'],
  ['소득·수급 상태', '기초생활수급'],
  ['목표 · 우선순위', '3개 (소득·취업 1순위)'],
  ['현재 보유 자립 자금', '8,000,000원'],
]
</script>

<template>
  <div class="flex min-h-svh flex-col bg-surface">
    <AppHeader title="조건 수정" to="/me" />
    <main id="main" class="flex-1 space-y-2.5 px-5 pt-2">
      <p class="text-body-sm text-muted">바뀐 조건을 수정하고 로드맵을 다시 만들 수 있어요.</p>

      <button
        v-for="[label, value] in rows"
        :key="label"
        type="button"
        class="tap-target flex w-full items-center justify-between gap-3 rounded-2xl border border-border px-4 py-3.5 text-left"
      >
        <span>
          <span class="block text-caption text-muted">{{ label }}</span>
          <span class="block text-body-sm text-ink">{{ value }}</span>
        </span>
        <span class="shrink-0 text-body-sm font-bold text-primary-dark">수정 ›</span>
      </button>

      <div class="flex items-start gap-2 rounded-2xl bg-amber-tint p-4">
        <TriangleAlert :size="16" class="mt-0.5 shrink-0 text-amber" aria-hidden="true" />
        <p class="text-caption leading-snug text-amber">
          조건을 바꾸면 로드맵이 새로 생성돼요. 이미 완료한 체크리스트와 기록한 지출은 그대로 유지되고,
          미완료 절차와 정책 매칭만 최신 조건으로 다시 짜여요.
        </p>
      </div>
    </main>

    <div
      class="sticky bottom-0 bg-surface px-5 pb-7 pt-3"
      style="padding-bottom: max(1.75rem, env(safe-area-inset-bottom))"
    >
      <UiButton size="lg" block @click="router.push('/diagnosing')">로드맵 다시 만들기</UiButton>
    </div>
  </div>
</template>
