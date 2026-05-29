<script setup lang="ts">
// Auth Layout wrapper
</script>

<template>
  <div class="auth-layout min-h-screen flex items-center justify-center bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
    <div class="w-full max-w-md p-8 bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)]">
      <div class="mb-8 text-center">
        <h1 class="font-display text-4xl text-[var(--color-accent-primary)]">LUMINARY</h1>
      </div>
      <slot />
    </div>
  </div>
</template>
