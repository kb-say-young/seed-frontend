<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Check } from 'lucide-vue-next'
import AppHeader from '@/shared/components/AppHeader.vue'
import UiField from '@/shared/ui/UiField.vue'
import UiButton from '@/shared/ui/UiButton.vue'
import { moneyModel } from '@/shared/lib/money'

const route = useRoute()
const router = useRouter()
const back = `/roadmap/${route.params.id}`

const amountRaw = ref<number | null>(null)
const amount = moneyModel(() => amountRaw.value, (n) => (amountRaw.value = n))
const date = ref(new Date().toISOString().slice(0, 10).replace(/-/g, '.'))

function done() {
  // TODO: checklist_items UPDATE(DONE) + expenses INSERT(checklist_item_id 연결)
  router.push(back)
}
</script>

<template>
  <div class="flex min-h-svh flex-col bg-transparent">
    <AppHeader title="비용 기록" :to="back" />
    <main id="main" class="flex-1 space-y-5 px-5 pt-2">
      <div class="glass-tint rounded-2xl p-4">
        <p class="flex items-center gap-1.5 text-label font-bold text-primary-dark">
          <Check :size="16" aria-hidden="true" />‘비상금 통장 분리하기’ 완료
        </p>
        <p class="mt-1.5 text-body-sm leading-relaxed text-body">
          이 일을 하는 데 든 비용이 있다면 적어주세요. 예산 계획과 비교해서 알려드릴게요.
        </p>
      </div>

      <UiField v-model="amount" label="든 비용" placeholder="0" inputmode="numeric" suffix="원" />

      <div>
        <p class="mb-1.5 text-label text-ink">분류</p>
        <span class="glass-field inline-flex rounded-full px-3.5 py-2 text-body-sm text-muted">
          자금 · 비상금 (목표에서 자동 지정)
        </span>
      </div>

      <UiField v-model="date" label="날짜" placeholder="YYYY.MM.DD" inputmode="numeric" />
    </main>

    <div
      class="glass-strong sticky bottom-0 space-y-2.5 border-x-0 border-b-0 px-5 pb-7 pt-3"
      style="padding-bottom: max(1.75rem, env(safe-area-inset-bottom))"
    >
      <UiButton size="lg" block @click="done">완료 처리하기</UiButton>
      <UiButton size="lg" variant="secondary" block @click="done">비용 없이 완료</UiButton>
    </div>
  </div>
</template>
