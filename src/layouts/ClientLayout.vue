<script setup lang="ts">
import ClientHeader from '@/components/client/layout/ClientHeader.vue'
import CartDrawer from '@/components/client/cart/CartDrawer.vue'
</script>

<template>
  <div class="client-layout min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
    <ClientHeader />
    <main>
      <slot />
    </main>
    <CartDrawer />
  </div>
</template>
