<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, Plus } from 'lucide-vue-next'
import FloatingNav from '@/shared/components/FloatingNav.vue'
import UiButton from '@/shared/ui/UiButton.vue'
import CategoryProgressCard from '@/features/savings/components/CategoryProgressCard.vue'
import SavingsRecordSheet from '@/features/savings/components/SavingsRecordSheet.vue'
import { won } from '@/shared/lib/money'
import { SAVINGS, SAVINGS_TOTAL } from '@/features/savings/model/savings'

// Reading this as: 적립 추적 대시보드 for 취약계층 청소년, trust-first, DENSITY 3.
const router = useRouter()
const sheetOpen = ref(false)
const lastAdded = ref('')

function onSubmit(v: { category: string; item: string; amount: number }) {
  // 백엔드 적립 API 전까지는 안내만 (목데이터는 갱신하지 않음)
  lastAdded.value = `${v.item} ${won(v.amount)} 기록됨`
}
</script>

<template>
  <div class="flex min-h-svh flex-col bg-transparent">
    <header class="flex items-center gap-2 px-6 pt-14">
      <button
        type="button"
        class="tap-target -ml-2 flex items-center justify-center rounded-full text-ink"
        aria-label="이전 화면"
        @click="router.push('/fund')"
      >
        <ChevronLeft :size="24" aria-hidden="true" />
      </button>
      <h1 class="text-h2 text-ink">모은 돈</h1>
    </header>

    <main id="main" class="mt-8 flex-1 space-y-4 px-6 pb-32">
      <section class="glass-tint rounded-2xl p-4" aria-labelledby="total-label">
        <p id="total-label" class="text-caption font-bold text-muted">누적 금액</p>
        <p class="tabular mt-1 text-h1 text-ink">{{ won(SAVINGS_TOTAL) }}</p>
        <p class="mt-1 flex items-center gap-1 text-body-sm text-amber">
          <span aria-hidden="true">⚠</span> 계획보다 조금 느려요
        </p>
      </section>

      <section aria-labelledby="status-h">
        <h2 id="status-h" class="text-label text-ink">현황</h2>
        <div class="mt-2 space-y-2.5">
          <CategoryProgressCard v-for="c in SAVINGS" :key="c.key" :cat="c" />
        </div>
      </section>

      <p v-if="lastAdded" class="text-caption text-primary-dark" role="status">✓ {{ lastAdded }}</p>

      <UiButton size="lg" block class="mt-1" @click="sheetOpen = true">
        <Plus :size="18" aria-hidden="true" /> 적립 내역 작성
      </UiButton>
    </main>

    <SavingsRecordSheet :open="sheetOpen" @close="sheetOpen = false" @submit="onSubmit" />
    <FloatingNav />
  </div>
</template>
