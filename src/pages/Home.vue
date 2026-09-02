<script setup lang="ts">
import { Bell, Check } from 'lucide-vue-next'
import SustainMeter from '../components/SustainMeter.vue'
import MilestoneCard from '../components/MilestoneCard.vue'
import StatCard from '../components/StatCard.vue'
import UiButton from '../components/UiButton.vue'
import FloatingNav from '../components/FloatingNav.vue'
import { MILESTONES } from '../lib/roadmap'

const next = MILESTONES.find((m) => m.id === 'emergency-fund')!
const tasks = [
  { t: '주민센터 수급 상담 예약', tag: 'D-3', done: false },
  { t: '자동이체 30만원 설정', tag: '이번 주', done: false },
  { t: '임시 주거 입주 완료', tag: '완료', done: true },
]
</script>

<template>
  <div class="min-h-svh bg-surface-subtle">
    <header
      class="flex items-start justify-between bg-surface px-5 pb-3 pt-3"
      style="padding-top: max(0.75rem, env(safe-area-inset-top))"
    >
      <div>
        <h1 class="text-h2 text-ink">안녕하세요, 지현님</h1>
        <p class="mt-0.5 text-body-sm text-muted">자립수당 종료까지 51개월 · 한 걸음씩 가요</p>
      </div>
      <button type="button" class="tap-target -mr-2 flex items-center justify-center rounded-full text-muted" aria-label="알림">
        <Bell :size="22" aria-hidden="true" />
      </button>
    </header>

    <main id="main" class="space-y-4 px-5 pb-32 pt-2">
      <SustainMeter :months="34" />

      <section class="rounded-2xl border border-border bg-surface p-4">
        <div class="flex items-center justify-between">
          <h2 class="text-label text-ink">이번 달 할 일</h2>
          <span class="text-caption font-semibold text-muted">1 / 3</span>
        </div>
        <ul class="mt-2.5 space-y-2.5">
          <li v-for="t in tasks" :key="t.t" class="flex items-center gap-2.5">
            <span
              class="flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border"
              :class="t.done ? 'border-primary bg-primary text-on-primary' : 'border-border-strong'"
              aria-hidden="true"
            >
              <Check v-if="t.done" :size="13" :stroke-width="3" />
            </span>
            <span class="min-w-0 flex-1 text-body-sm" :class="t.done ? 'text-muted' : 'text-ink'">{{ t.t }}</span>
            <span
              class="shrink-0 text-caption font-semibold"
              :class="t.done ? 'text-muted' : 'text-primary-dark'"
              >{{ t.tag }}</span
            >
          </li>
        </ul>
      </section>

      <section>
        <h2 class="text-label text-ink">다음 마일스톤</h2>
        <MilestoneCard
          class="mt-2"
          :to="`/roadmap/${next.id}`"
          :title="next.title"
          :status="next.status"
          :status-text="next.statusText"
          :desc="next.desc"
          :progress="next.progress"
          :action="next.action"
          :category="next.category"
        />
      </section>

      <div class="grid grid-cols-2 gap-3">
        <StatCard label="이번 달 받을 지원" value="532,000원" sub="자립수당 + 주거급여" />
        <StatCard label="다음 신청 마감" value="D-9" sub="청년 월세 특별지원" />
      </div>

      <section class="rounded-2xl bg-primary-tint p-4">
        <p class="text-label font-bold text-primary-dark">새로 매칭된 지원이 있어요</p>
        <p class="mt-1 text-body-sm text-body">청년 문화예술패스 · 내 조건에서 신청 가능</p>
        <UiButton block class="mt-3">로드맵에 추가하기</UiButton>
      </section>
    </main>
    <FloatingNav />
  </div>
</template>
