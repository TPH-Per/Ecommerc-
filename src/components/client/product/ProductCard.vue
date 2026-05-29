<script setup lang="ts">
import { ref } from 'vue'
import { gsap } from 'gsap'
import { useI18nStore } from '@/stores/i18n.store'
import { storeToRefs } from 'pinia'
import { useCart } from '@/composables/useCart'

interface Product {
  id: string
  slug: string
  name: string
  price: number
  image: string
  hoverImage?: string
  isNew?: boolean
  isDiscounted?: boolean
  originalPrice?: number
}

const props = defineProps<{
  product: Product
}>()

const i18nStore = useI18nStore()
const { t } = i18nStore
const { currency } = storeToRefs(i18nStore)
const { store: cartStore, animateToCart } = useCart()

const cardRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const isHovered = ref(false)

const handleMouseEnter = () => {
  isHovered.value = true
  if (cardRef.value) {
    const target = (cardRef.value as any).$el || cardRef.value
    gsap.to(target, { y: -8, duration: 0.3, ease: 'power2.out', boxShadow: '0 10px 40px rgba(200,255,0,0.1)' })
  }
  if (imageRef.value) {
    gsap.to(imageRef.value, { scale: 1.05, duration: 0.4, ease: 'power2.out' })
  }
}

const handleMouseLeave = () => {
  isHovered.value = false
  if (cardRef.value) {
    const target = (cardRef.value as any).$el || cardRef.value
    gsap.to(target, { y: 0, duration: 0.3, ease: 'power2.out', boxShadow: 'none' })
  }
  if (imageRef.value) {
    gsap.to(imageRef.value, { scale: 1, duration: 0.4, ease: 'power2.out' })
  }
}

const addToCart = (e: Event) => {
  e.preventDefault()
  
  if (imageRef.value) {
    animateToCart(imageRef.value, () => {
      cartStore.addItem({
        productId: props.product.id,
        name: props.product.name,
        price: props.product.price,
        quantity: 1,
        image: props.product.image
      })
    })
  } else {
    cartStore.addItem({
      productId: props.product.id,
      name: props.product.name,
      price: props.product.price,
      quantity: 1,
      image: props.product.image
    })
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.value as unknown as string }).format(price)
}
</script>

<template>
  <div 
    ref="cardRef"
    class="block group relative bg-[var(--color-bg-surface)] rounded-[var(--radius-md)] overflow-hidden transition-colors border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <router-link :to="`/shop/${product.slug}`" class="block w-full h-full">
      <!-- Image Container -->
      <div class="relative aspect-video sm:aspect-[4/5] overflow-hidden bg-[var(--color-bg-raised)]">
        <img 
          ref="imageRef"
          :src="isHovered && product.hoverImage ? product.hoverImage : product.image" 
          :alt="product.name"
          loading="lazy"
          class="w-full h-full object-cover"
        />
        
        <!-- Badges -->
        <div class="absolute top-2 left-2 flex flex-col gap-2">
          <span v-if="product.isNew" class="px-2 py-1 bg-[var(--color-accent-primary)] text-black text-xs font-bold font-mono tracking-wider rounded-[var(--radius-sm)]">
            {{ t('badge.new') }}
          </span>
          <span v-if="product.isDiscounted" class="px-2 py-1 bg-[var(--color-accent-secondary)] text-white text-xs font-bold font-mono tracking-wider rounded-[var(--radius-sm)]">
            {{ t('badge.sale') }}
          </span>
        </div>
        
        <!-- Quick Add Button -->
        <button 
          @click.stop.prevent="addToCart"
          class="absolute bottom-2 right-2 w-10 h-10 bg-[var(--color-bg-overlay)] backdrop-blur-md text-[var(--color-accent-primary)] rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[var(--color-accent-primary)] hover:text-black"
          :aria-label="t('product.addToCart')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M224 128a8 8 0 0 1-8 8h-80v80a8 8 0 0 1-16 0v-80H40a8 8 0 0 1 0-16h80V40a8 8 0 0 1 16 0v80h80a8 8 0 0 1 8 8Z"/></svg>
        </button>
      </div>
      
      <!-- Info -->
      <div class="p-4 flex flex-col gap-1">
        <h3 class="font-body text-sm font-medium text-[var(--color-text-primary)] truncate">{{ product.name }}</h3>
        <div class="flex items-center gap-2 font-mono text-sm">
          <span class="text-[var(--color-accent-primary)] font-bold">{{ formatPrice(product.price) }}</span>
          <span v-if="product.isDiscounted && product.originalPrice" class="text-[var(--color-text-muted)] line-through text-xs">
            {{ formatPrice(product.originalPrice) }}
          </span>
        </div>
      </div>
    </router-link>
  </div>
</template>
