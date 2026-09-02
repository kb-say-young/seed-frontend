<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
let t: ReturnType<typeof setTimeout> | undefined
onMounted(() => {
  t = setTimeout(() => router.replace('/roadmap'), 2200)
})
onUnmounted(() => t && clearTimeout(t))

const steps = [
  { t: '받을 수 있는 지원 찾는 중', done: true },
  { t: '시점별 타임라인 배치 중', done: true },
  { t: '자금 배분 계산 중', done: false },
]
</script>

<template>
  <div class="flex min-h-svh flex-col items-center justify-center bg-surface px-8 text-center">
    <svg
      class="size-[68px] motion-safe:animate-[spin_2.4s_linear_infinite]"
      viewBox="0 0 72 72"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="36" cy="36" r="29" stroke="var(--color-primary)" stroke-width="3" />
      <path d="M36 36 L36 7 A29 29 0 0 1 61.1 50.5 Z" fill="var(--color-primary)" />
    </svg>

    <h1 id="main" class="mt-5 text-h3 text-ink">로드맵을 그리고 있어요</h1>
    <p class="mt-2 text-body-sm leading-relaxed text-muted">
      입력한 조건으로 보호종료 후 5년<br />주거·취업·자금 계획을 만드는 중이에요.
    </p>

    <ul class="mt-6 flex flex-col gap-2.5">
      <li v-for="s in steps" :key="s.t" class="flex items-center gap-2.5">
        <span
          class="size-4 rounded-full"
          :class="s.done ? 'bg-primary' : 'bg-border'"
          aria-hidden="true"
        />
        <span class="text-body-sm" :class="s.done ? 'text-ink' : 'text-text-muted'">{{ s.t }}</span>
      </li>
    </ul>
  </div>
</template>
