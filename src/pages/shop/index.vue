<script setup lang="ts">
import { ref } from 'vue'
import ProductCard from '@/components/client/product/ProductCard.vue'
import { useI18nStore } from '@/stores/i18n.store'

const i18nStore = useI18nStore()
const { t } = i18nStore

// Mock Data
const products = ref([
  {
    id: '1', slug: 'obsidian-jacket', name: 'Obsidian Tech Jacket', price: 250,
    image: 'https://images.unsplash.com/photo-1551028719-01c1eb562141?auto=format&fit=crop&q=80&w=600', isNew: true
  },
  {
    id: '2', slug: 'lime-sneakers', name: 'Acid Lime Sneakers', price: 180,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=600', isDiscounted: true, originalPrice: 220
  },
  {
    id: '3', slug: 'ember-hoodie', name: 'Ember Oversized Hoodie', price: 120,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '4', slug: 'cyber-backpack', name: 'Cyber Backpack', price: 150,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600', isNew: true
  },
  {
    id: '5', slug: 'neon-shades', name: 'Neon Shades', price: 85,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '6', slug: 'stealth-pants', name: 'Stealth Cargo Pants', price: 140,
    image: 'https://images.unsplash.com/photo-1517438476312-10d91c4a17ab?auto=format&fit=crop&q=80&w=600'
  }
])

const isMobileFilterOpen = ref(false)
</script>

<template>
  <div class="shop-page pt-32 pb-24 px-6 max-w-7xl mx-auto">
    <div class="mb-12">
      <h1 class="font-display text-5xl md:text-7xl tracking-wide uppercase text-[var(--color-text-primary)]">{{ t('shop.title') }}</h1>
      <p class="text-[var(--color-text-secondary)] mt-4">{{ t('shop.subtitle') }}</p>
    </div>

    <div class="flex flex-col lg:flex-row gap-12">
      <!-- Filter Sidebar -->
      <aside class="w-full lg:w-64 shrink-0 hidden lg:block">
        <div class="sticky top-32 flex flex-col gap-8">
          <div>
            <h3 class="font-bold text-[var(--color-text-primary)] mb-4">{{ t('shop.categories') }}</h3>
            <ul class="flex flex-col gap-3 text-sm text-[var(--color-text-secondary)]">
              <li><label class="flex items-center gap-3 cursor-pointer hover:text-[var(--color-text-primary)]"><input type="checkbox" class="accent-[var(--color-accent-primary)]"> {{ t('shop.outerwear') }}</label></li>
              <li><label class="flex items-center gap-3 cursor-pointer hover:text-[var(--color-text-primary)]"><input type="checkbox" class="accent-[var(--color-accent-primary)]"> {{ t('shop.footwear') }}</label></li>
              <li><label class="flex items-center gap-3 cursor-pointer hover:text-[var(--color-text-primary)]"><input type="checkbox" class="accent-[var(--color-accent-primary)]"> {{ t('shop.accessories') }}</label></li>
              <li><label class="flex items-center gap-3 cursor-pointer hover:text-[var(--color-text-primary)]"><input type="checkbox" class="accent-[var(--color-accent-primary)]"> {{ t('shop.tops') }}</label></li>
              <li><label class="flex items-center gap-3 cursor-pointer hover:text-[var(--color-text-primary)]"><input type="checkbox" class="accent-[var(--color-accent-primary)]"> {{ t('shop.bottoms') }}</label></li>
            </ul>
          </div>
          <div>
            <h3 class="font-bold text-[var(--color-text-primary)] mb-4">{{ t('shop.price') }}</h3>
            <div class="flex items-center gap-4">
              <input type="number" :placeholder="t('shop.min')" class="w-full bg-[var(--color-bg-raised)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-primary)]">
              <span class="text-[var(--color-text-secondary)]">-</span>
              <input type="number" :placeholder="t('shop.max')" class="w-full bg-[var(--color-bg-raised)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-primary)]">
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1">
        <div class="flex items-center justify-between mb-8">
          <button @click="isMobileFilterOpen = true" class="lg:hidden flex items-center gap-2 text-sm font-bold bg-[var(--color-bg-raised)] px-4 py-2 rounded-[var(--radius-sm)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path fill="currentColor" d="M200 128a8 8 0 0 1-8 8H64a8 8 0 0 1 0-16h128a8 8 0 0 1 8 8Zm32-56a8 8 0 0 0-8-8H32a8 8 0 0 0 0 16h192a8 8 0 0 0 8-8Zm-80 112H104a8 8 0 0 0 0 16h48a8 8 0 0 0 0-16Z"/></svg>
            {{ t('shop.filters') }}
          </button>
          
          <div class="ml-auto">
            <select class="bg-[var(--color-bg-raised)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-4 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-primary)] cursor-pointer">
              <option value="newest">{{ t('shop.sortNewest') }}</option>
              <option value="price-asc">{{ t('shop.sortPriceAsc') }}</option>
              <option value="price-desc">{{ t('shop.sortPriceDesc') }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>
      </main>
    </div>
  </div>
</template>
