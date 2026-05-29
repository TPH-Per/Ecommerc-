<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'

interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closeOnBackdrop: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const modalRef = ref<HTMLElement | null>(null)
const backdropRef = ref<HTMLElement | null>(null)

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  fullscreen: 'max-w-full h-full m-0 rounded-none'
}

function close() {
  if (modalRef.value && backdropRef.value) {
    gsap.to(modalRef.value, { scale: 0.95, opacity: 0, y: 20, duration: 0.2 })
    gsap.to(backdropRef.value, { opacity: 0, duration: 0.2, onComplete: () => {
      emit('update:modelValue', false)
      emit('close')
    }})
  } else {
    emit('update:modelValue', false)
    emit('close')
  }
}

function handleBackdropClick() {
  if (props.closeOnBackdrop) {
    close()
  }
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
    setTimeout(() => {
      if (modalRef.value && backdropRef.value) {
        gsap.fromTo(backdropRef.value, { opacity: 0 }, { opacity: 1, duration: 0.3 })
        gsap.fromTo(modalRef.value, 
          { scale: 0.95, opacity: 0, y: 20 }, 
          { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: 'back.out(1.5)' }
        )
      }
    }, 10)
  } else {
    document.body.style.overflow = ''
  }
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        ref="backdropRef"
        class="absolute inset-0 bg-[var(--color-bg-overlay)] backdrop-blur-md"
        @click="handleBackdropClick"
      ></div>
      <div 
        ref="modalRef"
        class="relative bg-[var(--color-bg-surface)] w-full shadow-[var(--shadow-card)] flex flex-col"
        :class="[sizes[size], size !== 'fullscreen' ? 'rounded-[var(--radius-lg)] max-h-[90vh]' : '']"
      >
        <div class="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h3 v-if="title" class="font-display tracking-wide text-2xl m-0">{{ title }}</h3>
          <div v-else></div>
          <button @click="close" class="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"/></svg>
          </button>
        </div>
        <div class="p-4 overflow-y-auto flex-1">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
