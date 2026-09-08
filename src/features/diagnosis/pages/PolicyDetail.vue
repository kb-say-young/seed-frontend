<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Check } from 'lucide-vue-next'
import AppHeader from '@/shared/components/AppHeader.vue'
import UiButton from '@/shared/ui/UiButton.vue'
import { roadmapApi } from '@/shared/api'
import { useResource } from '@/shared/lib/useResource'

// Reading this as: 정책 상세 정보 페이지 for 취약계층 청소년, trust-first, DENSITY 3.
// 라우트 /roadmap/:id/policy — :id 는 마일스톤 id. 그 마일스톤에 연결된 정책 상세를 조회한다.

const route = useRoute()

const { data: policy, loading, error, reload } = useResource(
  () => roadmapApi.getMilestonePolicy(String(route.params.id)),
  { requireAuth: true },
)
watch(() => route.params.id, reload)

const badge = computed(() => {
  const map = {
    eligible: { cls: 'bg-primary-tint text-primary-dark', text: '지원 가능' },
    review: { cls: 'bg-amber-tint text-amber', text: '추가 확인 필요' },
    ineligible: { cls: 'bg-danger-tint text-danger', text: '조건 미달' },
  }
  return policy.value ? map[policy.value.status] : null
})
</script>

<template>
  <div class="min-h-svh bg-transparent">
    <AppHeader title="정책 상세" />
    <main id="main" class="space-y-5 px-5 pb-28 pt-2">
      <p v-if="loading" class="py-16 text-center text-body-sm text-muted">불러오는 중…</p>

      <div v-else-if="error || !policy" class="py-16 text-center">
        <p class="text-body-sm text-muted">{{ error ?? '정책 정보를 찾을 수 없어요.' }}</p>
        <UiButton variant="secondary" class="mt-3" @click="reload">다시 시도</UiButton>
      </div>

      <template v-else>
        <div>
          <span
            v-if="badge"
            class="inline-block rounded-full px-2.5 py-0.5 text-caption font-semibold"
            :class="badge.cls"
            >{{ badge.text }}</span
          >
          <h1 class="mt-2 text-h2 text-ink">{{ policy.title }}</h1>
          <p class="mt-1 text-body-sm text-muted">{{ policy.provider }}</p>
        </div>

        <section class="glass rounded-2xl p-4" aria-label="지원 요약">
          <dl class="divide-y divide-border">
            <div class="flex items-start justify-between gap-4 py-2.5">
              <dt class="shrink-0 text-body-sm text-muted">지원 금액</dt>
              <dd class="text-right text-body-sm font-bold text-ink">{{ policy.amount }}</dd>
            </div>
            <div class="flex items-start justify-between gap-4 py-2.5">
              <dt class="shrink-0 text-body-sm text-muted">지원 기간</dt>
              <dd class="text-right text-body-sm font-bold text-ink">{{ policy.period }}</dd>
            </div>
            <div class="flex items-start justify-between gap-4 py-2.5">
              <dt class="shrink-0 text-body-sm text-muted">신청 기간</dt>
              <dd class="text-right text-body-sm font-bold text-ink">{{ policy.applyPeriod }}</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="elig-h">
          <h2 id="elig-h" class="text-label text-ink">신청 자격</h2>
          <ul class="mt-2 space-y-2">
            <li
              v-for="(e, i) in policy.eligibility"
              :key="i"
              class="flex items-start gap-2 text-body-sm text-body"
            >
              <Check
                :size="18"
                :stroke-width="2.5"
                class="mt-0.5 shrink-0 text-primary-bright"
                aria-hidden="true"
              />
              <span>{{ e }}</span>
            </li>
          </ul>
        </section>

        <section aria-labelledby="doc-h">
          <h2 id="doc-h" class="text-label text-ink">필요 서류</h2>
          <ol class="mt-2 space-y-2">
            <li
              v-for="(d, i) in policy.documents"
              :key="i"
              class="flex items-center gap-3 text-body-sm text-body"
            >
              <span
                class="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-tint text-caption font-bold text-primary-dark"
                aria-hidden="true"
                >{{ i + 1 }}</span
              >
              {{ d }}
            </li>
          </ol>
        </section>

        <p class="text-caption leading-relaxed text-muted">
          신청 조건·기간은 기관 사정에 따라 바뀔 수 있어요. 신청 전 담당 기관에서 다시 확인해 주세요.
        </p>
      </template>
    </main>

    <div
      v-if="policy"
      class="fixed inset-x-0 bottom-0 z-20 px-5"
      style="padding-bottom: max(1rem, env(safe-area-inset-bottom)); padding-top: 0.75rem"
    >
      <a v-if="policy.applyUrl" :href="policy.applyUrl" target="_blank" rel="noopener" class="block">
        <UiButton block>신청하러 가기</UiButton>
      </a>
      <UiButton v-else block>신청하러 가기</UiButton>
    </div>
  </div>
</template>
