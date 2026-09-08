<script setup lang="ts">
import { useRouter } from 'vue-router'
import UiButton from '@/shared/ui/UiButton.vue'

// Figma "인트로 랜딩" — 비로그인 진입 화면. 히어로 + 단일 CTA + 3단계 안내.
// 자체 텍스트 하단 탭을 가지므로 FloatingNav 를 쓰지 않는다.
const router = useRouter()

const steps = [
  { n: 1, t: '진단', d: '받을 지원 확인' },
  { n: 2, t: '계획', d: '목돈 사용 계획' },
  { n: 3, t: '실행', d: '지출관리로 끝까지' },
]
const tabs = [
  { label: '홈', to: '/landing', active: true },
  { label: '진단', to: '/intake', active: false },
  { label: '계획', to: '/fund', active: false },
  { label: '로그인', to: '/login', active: false },
]
</script>

<template>
  <div class="flex min-h-svh flex-col bg-transparent px-6 pb-7 pt-5">
    <p class="text-center text-[1.375rem] font-extrabold tracking-tight text-primary">씨앗</p>

    <div class="mt-6 flex flex-col items-center text-center">
      <div class="grid size-20 place-items-center rounded-full bg-primary-tint">
        <img src="/sprout.png" alt="씨앗 로고" width="444" height="434" class="size-12 object-contain" />
      </div>
      <h1 id="main" class="mt-5 text-h1 text-ink">나도 모르게 놓친 돈,<br />지금 확인하세요</h1>
      <p class="mt-2 text-body-sm text-muted">
        디딤씨앗통장 · 자립정착금 · 자립수당까지, 1분이면 알 수 있어요
      </p>
    </div>

    <div class="mt-6">
      <UiButton size="lg" block @click="router.push('/intake')">무료로 진단 시작하기</UiButton>
      <p class="mt-2 text-center text-caption text-muted">회원가입 없이 바로 확인할 수 있어요</p>
    </div>

    <hr class="mt-6 border-0 border-t border-border" />

    <ul class="mt-5 grid grid-cols-3 gap-2 text-center">
      <li v-for="s in steps" :key="s.n" class="flex flex-col items-center">
        <span class="grid size-7 place-items-center rounded-full bg-primary-tint text-caption font-bold text-primary">
          {{ s.n }}
        </span>
        <span class="mt-1.5 text-body-sm font-bold text-ink">{{ s.t }}</span>
        <span class="mt-0.5 text-caption text-muted">{{ s.d }}</span>
      </li>
    </ul>

    <section class="glass mt-5 rounded-2xl p-4">
      <p class="text-label font-bold text-ink">몰라서 놓치는 지원이 많아요</p>
      <p class="mt-1 text-body-sm leading-snug text-body">
        보호연장을 하지 않은 이유 2위는 “몰라서”였어요. 씨앗이 내가 받을 수 있는 지원을 먼저 찾아드려요.
      </p>
    </section>

    <div class="flex-1" />

    <nav aria-label="주요 메뉴" class="mt-6">
      <ul class="flex items-center justify-around">
        <li v-for="t in tabs" :key="t.label">
          <RouterLink
            :to="t.to"
            class="inline-block border-b-2 px-2 py-1 text-body-sm no-underline"
            :class="t.active ? 'border-primary font-bold text-primary' : 'border-transparent text-muted'"
            :aria-current="t.active ? 'page' : undefined"
          >
            {{ t.label }}
          </RouterLink>
        </li>
      </ul>
    </nav>
    <p class="mt-3 text-center text-caption text-text-muted">개인정보처리방침</p>
  </div>
</template>
