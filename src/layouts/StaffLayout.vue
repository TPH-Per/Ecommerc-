<script setup lang="ts">
// Staff Layout wrapper
</script>

<template>
  <div class="staff-layout min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
    <!-- Staff Header / Sidebar -->
    <main class="p-6 max-w-5xl mx-auto">
      <slot />
    </main>
  </div>
</template>
