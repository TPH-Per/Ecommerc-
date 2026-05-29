<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string | number
  label?: string
  type?: string
  placeholder?: string
  error?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', String(val))
})
</script>

<template>
  <div class="flex flex-col gap-1 w-full text-left">
    <label v-if="label" class="text-sm font-medium text-[var(--color-text-secondary)]">
      {{ label }}
    </label>
    <div class="relative flex items-center">
      <input
        v-model="value"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full bg-[var(--color-bg-raised)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-4 py-2.5 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-primary)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition-all disabled:opacity-50"
        :class="{'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]': error}"
      />
    </div>
    <span v-if="error" class="text-xs text-[var(--color-error)]">{{ error }}</span>
  </div>
</template>
