<script setup lang="ts">
import { TriangleAlert } from 'lucide-vue-next'

// Figma "지원이 끝나는 시점이 위험해요" 경고 카드
withDefaults(defineProps<{ title: string; tone?: 'danger' | 'amber' }>(), {
  tone: 'danger',
})
</script>

<template>
  <section
    class="rounded-2xl p-4"
    :class="tone === 'danger' ? 'bg-danger-tint' : 'bg-amber-tint'"
  >
    <p
      class="flex items-center gap-2 text-label font-bold"
      :class="tone === 'danger' ? 'text-danger' : 'text-amber'"
    >
      <TriangleAlert :size="18" aria-hidden="true" />
      {{ title }}
    </p>
    <p class="mt-2 text-body-sm leading-relaxed text-body">
      <slot />
    </p>
  </section>
</template>
