<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import BaseLanguageSwitcher from '@/components/base/BaseLanguageSwitcher.vue'
import { useI18n } from '@/composables/useI18n'

const authStore = useAuthStore()
const router = useRouter()
const { t } = useI18n()

const logout = () => {
  authStore.logout()
  router.push('/auth/login')
}

const navLinks = computed(() => [
  { name: t('admin.dashboard'), path: '/admin' },
  { name: t('admin.products'), path: '/admin/products' },
  { name: t('admin.categories'), path: '/admin/products/categories' },
  { name: t('admin.suppliers'), path: '/admin/products/suppliers' },
  { name: t('admin.goodsReceipts'), path: '/admin/goods-receipts' },
  { name: t('admin.orders'), path: '/admin/orders' },
  { name: t('admin.coupons'), path: '/admin/coupons' },
  { name: t('admin.reports'), path: '/admin/reports/revenue' },
])
</script>

<template>
  <div class="admin-layout flex min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
    <!-- AdminSidebar -->
    <aside class="w-64 bg-[var(--color-bg-surface)] border-r border-[var(--color-border)] flex flex-col shrink-0">
      <div class="p-6 border-b border-[var(--color-border)] flex justify-between items-start">
        <div>
          <h1 class="font-display text-2xl tracking-widest text-[var(--color-accent-primary)] m-0">LUMINARY</h1>
          <span class="text-xs font-mono text-[var(--color-text-secondary)] tracking-widest uppercase">{{ t('admin.portal') }}</span>
        </div>
        <BaseLanguageSwitcher />
      </div>
      
      <nav class="flex-1 overflow-y-auto py-4">
        <ul class="flex flex-col gap-1 px-3">
          <li v-for="link in navLinks" :key="link.path">
            <router-link 
              :to="link.path"
              class="block px-4 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors"
              active-class="bg-[var(--color-accent-primary)] text-white"
              exact-active-class="bg-[var(--color-accent-primary)] text-white"
              :class="$route.path.startsWith(link.path) && link.path !== '/admin' ? 'bg-[var(--color-accent-primary)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-raised)] hover:text-[var(--color-text-primary)]'"
            >
              {{ link.name }}
            </router-link>
          </li>
        </ul>
      </nav>
      
      <div class="p-4 border-t border-[var(--color-border)]">
        <button @click="logout" class="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-error)] transition-colors w-full px-4 py-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path fill="currentColor" d="M112 216a8 8 0 0 1-8 8H48a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h56a8 8 0 0 1 0 16H48v160h56a8 8 0 0 1 8 8Zm117.66-93.66l-40-40a8 8 0 0 0-11.32 11.32L204.69 120H104a8 8 0 0 0 0 16h100.69l-26.35 26.34a8 8 0 0 0 11.32 11.32l40-40a8 8 0 0 0 0-11.32Z"/></svg>
          {{ t('admin.logout') }}
        </button>
      </div>
    </aside>
    
    <main class="flex-1 p-8 overflow-y-auto h-screen">
      <slot />
    </main>
  </div>
</template>
