<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{ title?: string; to?: string; sticky?: boolean }>(),
  { sticky: true },
)
const router = useRouter()
function back() {
  if (props.to) router.push(props.to)
  else router.back()
}
</script>

<template>
  <header
    class="glass-strong z-10 flex items-center gap-1 border-x-0 border-t-0 px-3 pb-2 pt-3"
    :class="sticky ? 'sticky top-0' : ''"
    style="padding-top: max(0.75rem, env(safe-area-inset-top))"
  >
    <button
      type="button"
      class="tap-target -ml-1 flex items-center justify-center rounded-full text-ink"
      aria-label="이전 화면"
      @click="back"
    >
      <ChevronLeft :size="24" aria-hidden="true" />
    </button>
    <h1 v-if="title" class="text-[1.125rem] font-bold leading-relaxed text-ink">{{ title }}</h1>
    <slot name="right" />
  </header>
</template>
