<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroSection from '@/components/client/home/HeroSection.vue'
import ProductCard from '@/components/client/product/ProductCard.vue'
import { useI18nStore } from '@/stores/i18n.store'

gsap.registerPlugin(ScrollTrigger)

const i18nStore = useI18nStore()
const { t } = i18nStore

// Mock Data
const trendingProducts = ref([
  {
    id: '1',
    slug: 'obsidian-jacket',
    name: 'Obsidian Tech Jacket',
    price: 250,
    image: 'https://images.unsplash.com/photo-1551028719-01c1eb562141?auto=format&fit=crop&q=80&w=600',
    isNew: true
  },
  {
    id: '2',
    slug: 'lime-sneakers',
    name: 'Acid Lime Sneakers',
    price: 180,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=600',
    isDiscounted: true,
    originalPrice: 220
  },
  {
    id: '3',
    slug: 'ember-hoodie',
    name: 'Ember Oversized Hoodie',
    price: 120,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '4',
    slug: 'cyber-backpack',
    name: 'Cyber Backpack',
    price: 150,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
    isNew: true
  },
  {
    id: '5',
    slug: 'neon-shades',
    name: 'Neon Shades',
    price: 85,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '6',
    slug: 'stealth-pants',
    name: 'Stealth Cargo Pants',
    price: 140,
    image: 'https://images.unsplash.com/photo-1517438476312-10d91c4a17ab?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '7',
    slug: 'quantum-watch',
    name: 'Quantum Watch',
    price: 320,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    isDiscounted: true,
    originalPrice: 400
  },
  {
    id: '8',
    slug: 'pulse-tee',
    name: 'Pulse Graphic Tee',
    price: 65,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600'
  }
])

const trendingGridRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (trendingGridRef.value) {
    const cards = trendingGridRef.value.querySelectorAll('.product-card-wrapper')
    gsap.from(cards, {
      scrollTrigger: {
        trigger: trendingGridRef.value,
        start: 'top 80%',
      },
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out'
    })
  }
})
</script>

<template>
  <div class="home-page">
    <HeroSection />
    
    <!-- Trending Section -->
    <section class="py-24 px-6 max-w-7xl mx-auto">
      <div class="flex items-end justify-between mb-12">
        <div>
          <h2 class="font-display text-4xl md:text-5xl text-[var(--color-text-primary)] tracking-wide uppercase">{{ t('home.trendingTitle') }}</h2>
          <p class="text-[var(--color-text-secondary)] mt-2">{{ t('home.trendingSub') }}</p>
        </div>
        <router-link to="/shop" class="hidden md:flex items-center gap-2 text-[var(--color-accent-primary)] font-bold hover:underline underline-offset-4">
          {{ t('home.viewAll') }}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path fill="currentColor" d="M221.66 133.66l-72 72a8 8 0 0 1-11.32-11.32L196.69 136H40a8 8 0 0 1 0-16h156.69l-58.35-58.34a8 8 0 0 1 11.32-11.32l72 72a8 8 0 0 1 0 11.32Z"/></svg>
        </router-link>
      </div>
      
      <!-- Masonry Grid Fallback using columns -->
      <div ref="trendingGridRef" class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        <div v-for="product in trendingProducts" :key="product.id" class="product-card-wrapper break-inside-avoid">
          <ProductCard :product="product" />
        </div>
      </div>
      
      <div class="mt-8 flex justify-center md:hidden">
        <router-link to="/shop" class="px-6 py-3 border border-[var(--color-border)] rounded-[var(--radius-sm)] hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] transition-colors font-bold tracking-widest text-sm">
          {{ t('home.viewAll') }}
        </router-link>
      </div>
    </section>
  </div>
</template>
