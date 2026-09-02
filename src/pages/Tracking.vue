<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import UiButton from '../components/UiButton.vue'
import FloatingNav from '../components/FloatingNav.vue'
import ViewToggle from '../components/ViewToggle.vue'

const router = useRouter()
const recent = [
  { date: '08.26', title: '마트 장보기', cat: '생활비', amount: -42_000 },
  { date: '08.24', title: '강의 결제', cat: '교육', amount: -19_900 },
  { date: '08.20', title: '월세', cat: '주거', amount: -350_000 },
]
</script>

<template>
  <div class="min-h-svh bg-surface-subtle">
    <AppHeader title="기록" to="/roadmap" />
    <main id="main" class="space-y-3 px-5 pb-32 pt-2">
      <ViewToggle
        :options="[
          { label: '기록', to: '/tracking' },
          { label: '예산 대비', to: '/tracking/budget' },
        ]"
        active="기록"
      />

      <p class="text-body-sm leading-snug text-muted">
        매일 적지 않아도 돼요. 큰 지출만 이따금 기록하면 로드맵이 스스로 맞춰져요.
      </p>

      <section class="rounded-2xl border border-border bg-surface p-4">
        <div class="flex items-end justify-between">
          <span class="text-body-sm text-muted">이번 달 지출</span>
          <span class="tabular text-h3 font-bold text-ink">1,240,000원</span>
        </div>
        <div class="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-surface-subtle" aria-hidden="true">
          <div class="h-full rounded-full bg-primary" style="width: 95%" />
        </div>
        <p class="mt-2 text-caption font-medium text-primary-dark">계획 1,300,000원 · 아직 여유 있어요</p>
      </section>

      <section class="rounded-2xl border border-border bg-surface p-4">
        <div class="flex items-center justify-between">
          <span class="text-label text-ink">로드맵 진척</span>
          <span class="text-caption font-semibold text-muted">2 / 9 완료</span>
        </div>
        <div class="mt-2.5 flex gap-1" aria-hidden="true">
          <span
            v-for="i in 9"
            :key="i"
            class="h-2 flex-1 rounded-full"
            :class="i <= 2 ? 'bg-primary' : 'bg-surface-subtle'"
          />
        </div>
        <p class="mt-2 flex items-center gap-1.5 text-body-sm text-body">
          <span class="size-2 rounded-full bg-amber" aria-hidden="true" />다음: 비상금 3개월치 모으기 (33%)
        </p>
      </section>

      <div class="grid grid-cols-2 gap-3">
        <UiButton @click="router.push('/tracking/add')">지출 추가</UiButton>
        <UiButton variant="secondary" @click="router.push('/tracking/add')">수입 추가</UiButton>
      </div>

      <section class="rounded-2xl border border-border bg-surface p-4">
        <h2 class="text-label text-ink">최근 기록</h2>
        <ul class="mt-1 divide-y divide-border">
          <li v-for="r in recent" :key="r.title" class="flex items-center gap-3 py-3">
            <span class="text-caption text-muted">{{ r.date }}</span>
            <span class="min-w-0 flex-1">
              <span class="block text-body-sm text-ink">{{ r.title }}</span>
              <span class="block text-caption text-muted">{{ r.cat }}</span>
            </span>
            <span class="tabular text-body-sm font-semibold text-ink">{{ r.amount.toLocaleString('ko-KR') }}</span>
          </li>
        </ul>
      </section>
    </main>
    <FloatingNav />
  </div>
</template>
