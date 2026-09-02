<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: 'md' | 'lg'
    block?: boolean
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  { variant: 'primary', size: 'md', block: false, type: 'button', disabled: false },
)

// DESIGN.md §4 Button — pill(radius full), min-h 48 (lg 56), weight 600, size 17.
// Focus ring comes from the global :focus-visible rule in style.css.
const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold text-body ' +
  'transition-colors duration-150 disabled:cursor-not-allowed'

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-on-primary hover:bg-primary-dark active:bg-primary-dark ' +
    'disabled:bg-surface-subtle disabled:text-muted',
  secondary:
    'bg-surface text-primary-dark border-[1.5px] border-primary hover:bg-primary-tint ' +
    'disabled:border-border disabled:text-muted disabled:bg-surface',
  ghost:
    'bg-transparent text-primary-dark hover:bg-primary-tint disabled:text-muted',
  destructive:
    'bg-danger text-white hover:brightness-95 disabled:bg-surface-subtle disabled:text-muted',
}

const cls = computed(() => [
  base,
  variants[props.variant],
  props.size === 'lg' ? 'min-h-14 px-7 text-body-lg' : 'min-h-12 px-6',
  props.block ? 'w-full' : '',
])
</script>

<template>
  <button :type="type" :disabled="disabled" :class="cls">
    <slot />
  </button>
</template>
