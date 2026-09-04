<script setup lang="ts">
// 같은 데이터를 다른 관점으로 보는 화면 전환용 세그먼트 토글.
// Figma 자금계획·기록의 두 뷰를 "버튼으로 전환"하는 부분.
defineProps<{ options: { label: string; to: string }[]; active: string }>()
</script>

<template>
  <div class="glass-field flex gap-1 rounded-full p-1">
    <RouterLink
      v-for="o in options"
      :key="o.to"
      :to="o.to"
      class="flex-1 rounded-full px-3 py-2 text-center text-body-sm font-semibold no-underline transition-colors"
      :class="o.label === active ? 'bg-primary-tint text-primary-dark' : 'text-muted'"
      :aria-current="o.label === active ? 'page' : undefined"
    >
      {{ o.label }}
    </RouterLink>
  </div>
</template>
