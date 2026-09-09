<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'

// 재사용 바텀시트 (Figma S3). 딤 배경 + 아래에서 슬라이드업 패널.
// 접근성: role=dialog / aria-modal, Esc·배경 클릭으로 닫기, 열릴 때 첫 요소로 포커스,
// Tab 포커스 트랩, 배경 스크롤 잠금. reduced-motion 이면 슬라이드 정지.
const props = defineProps<{ open: boolean; title: string }>()
const emit = defineEmits<{ close: [] }>()

const panel = ref<HTMLElement | null>(null)
let lastFocused: HTMLElement | null = null

function close() {
  emit('close')
}

// 손잡이(핸들)·제목 영역을 아래로 끌면 닫힌다. 폼 입력이 있는 본문(slot)은 드래그
// 영역에서 빼서, 슬라이더 등을 만지다 시트가 딸려 내려가지 않게 한다.
const DISMISS_PX = 90 // 이 이상 끌어내리면 닫힘, 아니면 제자리로
const dragOffset = ref(0)
const dragging = ref(false)
let dragStartY = 0
const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const panelStyle = computed(() =>
  dragOffset.value > 0
    ? {
        transform: `translateY(${dragOffset.value}px)`,
        transition: dragging.value || reduceMotion ? 'none' : 'transform 0.2s var(--ease-out-soft)',
      }
    : undefined,
)

function onDragStart(e: PointerEvent) {
  dragging.value = true
  dragStartY = e.clientY
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
}
function onDragMove(e: PointerEvent) {
  if (!dragging.value) return
  dragOffset.value = Math.max(0, e.clientY - dragStartY)
}
function onDragEnd() {
  if (!dragging.value) return
  dragging.value = false
  if (dragOffset.value > DISMISS_PX) {
    close()
  }
  dragOffset.value = 0
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close()
    return
  }
  if (e.key !== 'Tab' || !panel.value) return
  const focusables = panel.value.querySelectorAll<HTMLElement>(
    'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])',
  )
  if (focusables.length === 0) return
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    dragOffset.value = 0
    dragging.value = false
    if (isOpen) {
      lastFocused = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', onKeydown)
      await nextTick()
      panel.value
        ?.querySelector<HTMLElement>(
          'button:not([disabled]),a[href],input:not([disabled]),select,textarea',
        )
        ?.focus()
    } else {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeydown)
      lastFocused?.focus()
    }
  },
)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet" :duration="{ enter: 240, leave: 0 }">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-end justify-center"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <div
          class="absolute inset-0 bg-[rgb(15_23_20/0.45)]"
          aria-hidden="true"
          @click="close"
        />
        <div
          ref="panel"
          class="sheet-panel relative w-full max-w-[var(--container-app)] rounded-t-[1.25rem] bg-surface px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_40px_rgb(0_0_0/0.18)]"
          :style="panelStyle"
        >
          <!-- 손잡이 + 제목만 드래그 영역. 본문(slot)의 입력·버튼은 그대로 각자 반응하게 뺐다. -->
          <div
            class="cursor-grab touch-none select-none active:cursor-grabbing"
            @pointerdown="onDragStart"
            @pointermove="onDragMove"
            @pointerup="onDragEnd"
            @pointercancel="onDragEnd"
          >
            <span
              class="mx-auto mb-4 block h-1 w-9 rounded-full bg-border-strong"
              aria-hidden="true"
            />
            <h2 class="mb-4 text-center text-body-lg font-bold text-ink">{{ title }}</h2>
          </div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* enter 만 트랜지션. leave 는 즉시 제거(숨은 탭에서 transitionend 미발화로 스턱되는 것 방지) —
   CSS 에 .sheet-leave-active 매치가 없어 Vue 가 duration 을 못 정할 수 있으므로,
   위 <Transition> 의 :duration="{ leave: 0 }" 로 명시해 확실히 즉시 제거되게 한다. */
.sheet-enter-active {
  transition: opacity 0.2s var(--ease-out-soft);
}
.sheet-enter-active .sheet-panel {
  transition: transform 0.24s var(--ease-out-soft);
}
.sheet-enter-from {
  opacity: 0;
}
.sheet-enter-from .sheet-panel {
  transform: translateY(100%);
}
@media (prefers-reduced-motion: reduce) {
  .sheet-enter-active,
  .sheet-enter-active .sheet-panel {
    transition: none;
  }
  .sheet-enter-from .sheet-panel {
    transform: none;
  }
}
</style>
