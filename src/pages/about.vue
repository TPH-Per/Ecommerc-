<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
const { t } = useI18n()
</script>
<template>
  <div class="pt-32 pb-24 px-6 max-w-5xl mx-auto min-h-screen text-center">
    <h1 class="font-display text-5xl tracking-widest text-[var(--color-accent-primary)] mb-8 uppercase">{{ t('about.title') }}</h1>
    <p class="text-[var(--color-text-secondary)] leading-relaxed max-w-2xl mx-auto text-lg">
      {{ t('about.desc') }}
    </p>
  </div>
</template>
