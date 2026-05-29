<script setup lang="ts">
import { useUiStore } from '@/stores/ui.store'
import { TransitionGroup } from 'vue'

const uiStore = useUiStore()

const icons = {
  success: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm45.66 85.66l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 11.32Z"/></svg>`,
  error: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm37.66 130.34a8 8 0 0 1-11.32 11.32L128 139.31l-26.34 26.35a8 8 0 0 1-11.32-11.32L116.69 128l-26.35-26.34a8 8 0 0 1 11.32-11.32L128 116.69l26.34-26.35a8 8 0 0 1 11.32 11.32L139.31 128Z"/></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm-8 56a8 8 0 0 1 16 0v56a8 8 0 0 1-16 0Zm8 104a12 12 0 1 1 12-12a12 12 0 0 1-12 12Z"/></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm8 120a8 8 0 0 1-16 0v-40a8 8 0 0 1 16 0Zm-8-76a12 12 0 1 1-12 12a12 12 0 0 1 12-12Z"/></svg>`
}

const colors = {
  success: 'text-[var(--color-success)]',
  error: 'text-[var(--color-error)]',
  warning: 'text-[var(--color-warning)]',
  info: 'text-[var(--color-info)]'
}
</script>

<template>
  <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none w-[320px]">
    <TransitionGroup 
      enter-active-class="transition-all duration-300 ease-out-expo"
      enter-from-class="opacity-0 translate-x-full"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-full"
      move-class="transition-all duration-300"
    >
      <div 
        v-for="toast in uiStore.toasts" 
        :key="toast.id"
        class="bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-[var(--shadow-card)] rounded-[var(--radius-md)] p-4 flex items-start gap-3 pointer-events-auto"
      >
        <div :class="colors[toast.type]" class="shrink-0 mt-0.5" v-html="icons[toast.type]"></div>
        <div class="flex-1 text-sm font-medium text-[var(--color-text-primary)]">
          {{ toast.message }}
        </div>
        <button 
          @click="uiStore.dismissToast(toast.id)"
          class="shrink-0 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path fill="currentColor" d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"/></svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
