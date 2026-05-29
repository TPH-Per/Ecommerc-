<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useI18n } from '@/composables/useI18n'

const { t, currency } = useI18n()

// Mock fetching product details
const product = ref({
  id: '1',
  name: 'Obsidian Tech Jacket',
  price: 250,
  sku: 'TECH-JKT-001',
  description: 'A masterpiece of technical outerwear. The Obsidian Tech Jacket features 3-layer waterproof breathable fabric, articulated sleeves for maximum mobility, and waterproof zippers.',
  images: [
    'https://images.unsplash.com/photo-1551028719-01c1eb562141?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1559551409-dadc959f76b8?auto=format&fit=crop&q=80&w=800'
  ],
  colors: ['#080B10', '#4A5568'],
  sizes: ['S', 'M', 'L', 'XL'],
  stock: 12
})

const activeImage = ref(product.value.images[0])
const selectedColor = ref(product.value.colors[0])
const selectedSize = ref(product.value.sizes[1])
const quantity = ref(1)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.value }).format(price)
}
</script>

<template>
  <div class="product-detail-page pt-32 pb-24 px-6 max-w-7xl mx-auto">
    <!-- Breadcrumb -->
    <div class="text-sm font-medium text-[var(--color-text-secondary)] mb-8 flex items-center gap-2">
      <router-link to="/" class="hover:text-[var(--color-accent-primary)]">{{ t('nav.home') }}</router-link>
      <span>/</span>
      <router-link to="/shop" class="hover:text-[var(--color-accent-primary)]">{{ t('nav.shop') }}</router-link>
      <span>/</span>
      <span class="text-[var(--color-text-primary)]">{{ product.name }}</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
      <!-- Gallery -->
      <div class="flex flex-col gap-4">
        <div class="relative aspect-[4/5] overflow-hidden bg-[var(--color-bg-raised)] rounded-[var(--radius-lg)]">
          <img :src="activeImage" :alt="product.name" class="w-full h-full object-cover">
        </div>
        <div class="flex gap-4 overflow-x-auto pb-2">
          <button 
            v-for="(img, idx) in product.images" 
            :key="idx"
            @click="activeImage = img"
            class="w-20 h-24 shrink-0 rounded-[var(--radius-md)] overflow-hidden border-2 transition-colors"
            :class="activeImage === img ? 'border-[var(--color-accent-primary)]' : 'border-transparent hover:border-[var(--color-border-hover)]'"
          >
            <img :src="img" :alt="`${product.name} thumbnail ${idx + 1}`" class="w-full h-full object-cover">
          </button>
        </div>
      </div>

      <!-- Info -->
      <div class="flex flex-col">
        <h1 class="font-display text-5xl tracking-wide uppercase text-[var(--color-text-primary)] mb-4">
          {{ product.name }}
        </h1>
        
        <div class="font-mono text-3xl font-bold text-[var(--color-accent-primary)] mb-8">
          {{ formatPrice(product.price) }}
        </div>
        
        <p class="text-[var(--color-text-secondary)] leading-relaxed mb-8">
          {{ product.description }}
        </p>

        <div class="h-px w-full bg-[var(--color-border)] mb-8"></div>

        <!-- Selectors -->
        <div class="flex flex-col gap-8 mb-12">
          <!-- Color -->
          <div>
            <h3 class="text-sm font-bold text-[var(--color-text-primary)] mb-3">{{ t('shop.color') }}</h3>
            <div class="flex items-center gap-3">
              <button 
                v-for="color in product.colors" 
                :key="color"
                @click="selectedColor = color"
                class="w-10 h-10 rounded-full border-2 transition-transform"
                :class="selectedColor === color ? 'border-[var(--color-accent-primary)] scale-110' : 'border-transparent hover:scale-105'"
                :style="{ backgroundColor: color }"
                :aria-label="`Select color ${color}`"
              ></button>
            </div>
          </div>

          <!-- Size -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-bold text-[var(--color-text-primary)]">{{ t('shop.size') }}</h3>
              <button class="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] underline underline-offset-4">{{ t('shop.sizeGuide') }}</button>
            </div>
            <div class="flex items-center gap-3 flex-wrap">
              <button 
                v-for="size in product.sizes" 
                :key="size"
                @click="selectedSize = size"
                class="w-14 h-12 flex items-center justify-center border rounded-[var(--radius-sm)] font-mono font-bold transition-colors"
                :class="selectedSize === size ? 'border-[var(--color-accent-primary)] text-[var(--color-accent-primary)] bg-[rgba(200,255,0,0.05)]' : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)]'"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Quantity -->
          <div>
            <h3 class="text-sm font-bold text-[var(--color-text-primary)] mb-3">{{ t('shop.quantity') }}</h3>
            <div class="flex items-center border border-[var(--color-border)] rounded-[var(--radius-sm)] w-fit overflow-hidden">
              <button @click="quantity > 1 && quantity--" class="w-12 h-12 flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-raised)] hover:text-[var(--color-text-primary)] transition-colors">-</button>
              <div class="w-12 h-12 flex items-center justify-center font-mono font-bold">{{ quantity }}</div>
              <button @click="quantity < product.stock && quantity++" class="w-12 h-12 flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-raised)] hover:text-[var(--color-text-primary)] transition-colors">+</button>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-4">
          <BaseButton size="lg" fullWidth>
            {{ t('product.addToCart') }}
          </BaseButton>
          <BaseButton variant="ghost" size="lg" fullWidth>
            {{ t('product.buyNow') }}
          </BaseButton>
        </div>
        
        <div class="mt-8 flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <span class="inline-block w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse"></span>
          {{ t('shop.inStock', { count: product.stock }) }}
        </div>
        
        <div class="mt-4 text-xs font-mono text-[var(--color-text-muted)]">
          {{ t('shop.sku') }}: {{ product.sku }}
        </div>
      </div>
    </div>
  </div>
</template>
