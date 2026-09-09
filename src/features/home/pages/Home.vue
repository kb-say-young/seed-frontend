<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { Bell, Check } from 'lucide-vue-next'
import SustainMeter from '@/shared/components/SustainMeter.vue'
import MilestoneCard from '@/shared/components/MilestoneCard.vue'
import StatCard from '@/shared/ui/StatCard.vue'
import UiButton from '@/shared/ui/UiButton.vue'
import FloatingNav from '@/shared/components/FloatingNav.vue'
import { homeApi } from '@/shared/api'
import { me, loadMe } from '@/shared/lib/me'
import { useResource } from '@/shared/lib/useResource'
import { won } from '@/shared/lib/money'

onMounted(() => {
  void loadMe()
})
const { data: home, loading, error, reload } = useResource(homeApi.getHome, { requireAuth: true })

// 인사말은 앱 전역 me 를 우선 사용(즉시 표시), 없으면 홈 응답으로 보완
const greetingName = computed(
  () => me.data?.name?.trim() || home.value?.userName?.trim() || '회원',
)
</script>

<template>
  <div class="min-h-svh bg-transparent px-6 pb-32 pt-14">
    <header class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-h2 text-ink">안녕하세요, {{ greetingName }}님</h1>
        <p v-if="home" class="mt-2 text-body-sm text-muted">{{ home.headline }}</p>
      </div>
      <button type="button" class="tap-target -mr-2 flex items-center justify-center rounded-full text-muted" aria-label="알림">
        <Bell :size="22" aria-hidden="true" />
      </button>
    </header>

    <main id="main" class="mt-8 space-y-4">
      <p v-if="loading" class="py-16 text-center text-body-sm text-muted">불러오는 중…</p>

      <div v-else-if="error" class="py-16 text-center">
        <p class="text-body-sm text-muted">{{ error }}</p>
        <UiButton variant="secondary" class="mt-3" @click="reload">다시 시도</UiButton>
      </div>

      <template v-else-if="home">
        <SustainMeter :months="home.sustainMonths" :target-months="home.targetMonths" />

        <section v-if="home.monthlyTasks.length" class="glass rounded-2xl p-4">
          <div class="flex items-center justify-between">
            <h2 class="text-label text-ink">이번 달 할 일</h2>
            <span class="text-caption font-semibold text-muted"
              >{{ home.taskProgress.done }} / {{ home.taskProgress.total }}</span
            >
          </div>
          <ul class="mt-2.5 space-y-2.5">
            <li v-for="t in home.monthlyTasks" :key="t.id" class="flex items-center gap-2.5">
              <span
                class="flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border"
                :class="t.done ? 'border-primary bg-primary text-on-primary' : 'border-border-strong'"
                aria-hidden="true"
              >
                <Check v-if="t.done" :size="13" :stroke-width="3" />
              </span>
              <span class="min-w-0 flex-1 text-body-sm" :class="t.done ? 'text-muted' : 'text-ink'">{{ t.title }}</span>
              <span
                class="shrink-0 text-caption font-semibold"
                :class="t.done ? 'text-muted' : 'text-primary-dark'"
                >{{ t.tag }}</span
              >
            </li>
          </ul>
        </section>

        <section v-if="home.nextMilestone">
          <h2 class="text-label text-ink">다음 마일스톤</h2>
          <MilestoneCard
            class="mt-2"
            :to="`/roadmap/${home.nextMilestone.id}`"
            :title="home.nextMilestone.title"
            :status="home.nextMilestone.status"
            :status-text="home.nextMilestone.statusText"
            :desc="home.nextMilestone.desc"
            :progress="home.nextMilestone.progress ?? undefined"
            :action="home.nextMilestone.action ?? undefined"
            :category="home.nextMilestone.category"
          />
        </section>

        <div v-if="home.expectedSupport || home.nextDeadline" class="grid grid-cols-2 gap-3">
          <StatCard
            v-if="home.expectedSupport"
            label="이번 달 받을 지원"
            :value="won(home.expectedSupport.amount)"
            :sub="home.expectedSupport.label"
          />
          <StatCard
            v-if="home.nextDeadline"
            label="다음 신청 마감"
            :value="`D-${home.nextDeadline.dday}`"
            :sub="home.nextDeadline.title"
          />
        </div>

        <section v-if="home.newMatch" class="glass-tint rounded-2xl p-4">
          <p class="text-label font-bold text-primary-dark">새로 매칭된 지원이 있어요</p>
          <p class="mt-1 text-body-sm text-body">{{ home.newMatch.title }} · {{ home.newMatch.note }}</p>
          <UiButton block class="mt-3">로드맵에 추가하기</UiButton>
        </section>
      </template>
    </main>
    <FloatingNav />
  </div>
</template>
