<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  fullWidth: false,
  type: 'button'
})

const classes = computed(() => {
  const base = 'relative inline-flex items-center justify-center font-bold transition-all duration-fast ease-out-expo active:scale-97 disabled:opacity-50 disabled:pointer-events-none'
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-[var(--radius-sm)]',
    md: 'px-5 py-2.5 text-base rounded-[var(--radius-md)]',
    lg: 'px-8 py-4 text-lg rounded-[var(--radius-lg)]'
  }
  const variants = {
    primary: 'bg-[var(--color-accent-primary)] text-black hover:brightness-110 shadow-[var(--shadow-glow-accent)]',
    secondary: 'bg-[var(--color-bg-raised)] text-[var(--color-text-primary)] hover:bg-[var(--color-border-hover)]',
    ghost: 'bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)]',
    danger: 'bg-[var(--color-error)] text-white hover:brightness-110'
  }
  
  return [
    base,
    sizes[props.size],
    variants[props.variant],
    props.fullWidth ? 'w-full' : ''
  ].join(' ')
})
</script>

<template>
  <button :type="type" :class="classes" :disabled="disabled || loading">
    <span :class="{'opacity-0': loading}" class="flex items-center justify-center gap-2">
      <slot />
    </span>
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  </button>
</template>
