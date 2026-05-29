<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { useAuthStore } from '@/stores/auth.store'
import { useCartStore } from '@/stores/cart.store'
import BaseLanguageSwitcher from '@/components/base/BaseLanguageSwitcher.vue'

const { t } = useI18n()
const authStore = useAuthStore()
const cartStore = useCartStore()

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header 
    class="fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-6 py-4 flex items-center justify-between"
    :class="[isScrolled ? 'bg-[var(--color-bg-overlay)] backdrop-blur-md border-b border-[var(--color-border)] py-3' : 'bg-transparent']"
  >
    <div class="flex items-center gap-8">
      <router-link to="/" class="font-display text-3xl tracking-wider text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)] transition-colors">
        LUMINARY
      </router-link>
      <nav class="hidden md:flex items-center gap-6 text-sm font-medium">
        <router-link to="/shop" class="hover:text-[var(--color-accent-primary)] transition-colors uppercase tracking-widest">{{ t('nav.shop') }}</router-link>
        <!-- Additional links -->
      </nav>
    </div>
    
    <div class="flex items-center gap-6">
      <BaseLanguageSwitcher />
      
      <button class="hover:text-[var(--color-accent-primary)] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="M229.66 218.34l-50.07-50.06a88.11 88.11 0 1 0-11.31 11.31l50.06 50.07a8 8 0 0 0 11.32-11.32ZM40 112a72 72 0 1 1 72 72a72.08 72.08 0 0 1-72-72Z"/></svg>
      </button>
      <router-link :to="authStore.isAuthenticated ? '/account' : '/auth/login'" class="hover:text-[var(--color-accent-primary)] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8ZM72 96a56 56 0 1 1 56 56a56.06 56.06 0 0 1-56-56Z"/></svg>
      </router-link>
      <button @click="cartStore.openDrawer()" class="relative hover:text-[var(--color-accent-primary)] transition-colors" id="header-cart-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="M222.14 58.87A8 8 0 0 0 216 56H54.68L49.79 29.14A16 16 0 0 0 34.05 16H16a8 8 0 0 0 0 16h18.05l28.05 154.26A24 24 0 1 0 96 204h64a24 24 0 1 0 27.45-18.44l11.45-63.53l.4-1.74l13.43-46.7A8 8 0 0 0 222.14 58.87ZM80 216a8 8 0 1 1 8-8a8 8 0 0 1-8 8Zm96 0a8 8 0 1 1 8-8a8 8 0 0 1-8 8Zm19.82-104l-10.22 56.78A8 8 0 0 1 177.72 176H81.82l-18.18-100Z"/></svg>
        <span class="absolute -top-1.5 -right-1.5 bg-[var(--color-accent-primary)] text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{{ cartStore.itemCount }}</span>
      </button>
    </div>
  </header>
</template>
