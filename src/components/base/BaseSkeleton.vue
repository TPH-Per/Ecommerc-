<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'text' | 'circle' | 'rect' | 'card'
  width?: string
  height?: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'rect',
  width: '100%',
  height: 'auto',
  count: 1
})

const classes = computed(() => {
  return {
    'rounded-[var(--radius-sm)]': props.variant === 'text' || props.variant === 'rect',
    'rounded-full': props.variant === 'circle',
    'rounded-[var(--radius-lg)]': props.variant === 'card',
    'w-full h-4': props.variant === 'text' && props.height === 'auto',
    'w-full h-32': props.variant === 'card' && props.height === 'auto',
  }
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      v-for="i in count"
      :key="i"
      class="animate-shimmer"
      :class="classes"
      :style="{ width, height: height !== 'auto' ? height : undefined }"
    ></div>
  </div>
</template>
