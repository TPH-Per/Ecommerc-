<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from '@/composables/useI18n'
import type { Locale } from '@/stores/i18n.store'

const { locale, setLocale } = useI18n()

const locales: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'vi', label: 'VN' },
  { code: 'ja', label: 'JP' }
]

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectLocale = (code: Locale) => {
  setLocale(code)
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const currentLabel = computed(() => locales.find(l => l.code === locale.value)?.label || 'EN')
</script>

<template>
  <div class="relative inline-block" ref="dropdownRef">
    <button 
      @click="toggleDropdown"
      class="flex items-center gap-1 text-sm font-bold font-mono text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)] transition-colors px-2 py-1"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
    >
      {{ currentLabel }}
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256" :class="{ 'rotate-180': isOpen }" class="transition-transform duration-200"><path fill="currentColor" d="M213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80A8 8 0 0 1 53.66 90.34L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32Z"/></svg>
    </button>
    
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div 
        v-if="isOpen"
        class="absolute right-0 mt-2 w-24 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-[var(--radius-sm)] shadow-[var(--shadow-card)] overflow-hidden z-50 origin-top-right"
        role="listbox"
      >
        <button
          v-for="l in locales"
          :key="l.code"
          @click="selectLocale(l.code)"
          class="w-full text-left px-4 py-2 text-sm font-mono transition-colors hover:bg-[var(--color-bg-raised)]"
          :class="locale === l.code ? 'text-[var(--color-accent-primary)] font-bold' : 'text-[var(--color-text-secondary)]'"
          role="option"
          :aria-selected="locale === l.code"
        >
          {{ l.label }}
        </button>
      </div>
    </transition>
  </div>
</template>
