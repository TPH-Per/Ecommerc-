<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { useCart } from '@/composables/useCart'
import BaseButton from '@/components/base/BaseButton.vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useI18nStore } from '@/stores/i18n.store'
import { storeToRefs } from 'pinia'

const { store: cartStore } = useCart()
const i18nStore = useI18nStore()
const { t } = i18nStore
const { currency } = storeToRefs(i18nStore)
const router = useRouter()
const toast = useToast()

const drawerRef = ref<HTMLElement | null>(null)
const backdropRef = ref<HTMLElement | null>(null)
const itemsContainerRef = ref<HTMLElement | null>(null)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.value as unknown as string }).format(price)
}

const checkout = () => {
  cartStore.closeDrawer()
  router.push('/checkout')
}

watch(() => cartStore.isDrawerOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    setTimeout(() => {
      if (drawerRef.value && backdropRef.value) {
        gsap.fromTo(backdropRef.value, { opacity: 0 }, { opacity: 1, duration: 0.3 })
        gsap.fromTo(drawerRef.value, 
          { x: '100%' }, 
          { x: '0%', duration: 0.6, ease: 'back.out(1.1)', clearProps: 'transform' }
        )
        
        if (itemsContainerRef.value) {
          const items = itemsContainerRef.value.children
          gsap.fromTo(items, 
            { opacity: 0, x: 20 }, 
            { opacity: 1, x: 0, stagger: 0.06, duration: 0.4, ease: 'power2.out', delay: 0.2 }
          )
        }
      }
    }, 10)
  } else {
    document.body.style.overflow = ''
    if (drawerRef.value && backdropRef.value) {
      gsap.to(drawerRef.value, { x: '100%', duration: 0.4, ease: 'power2.in' })
      gsap.to(backdropRef.value, { opacity: 0, duration: 0.4 })
    }
  }
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})

const couponCode = ref('')
const applyCoupon = () => {
  if (!couponCode.value) return
  if (couponCode.value === 'LUMINARY10') {
    cartStore.applyCoupon({ code: couponCode.value, discountPercent: 10 })
    toast.success('Coupon applied successfully')
    couponCode.value = ''
  } else {
    toast.error('Invalid coupon code')
    // Shake animation
    const input = document.getElementById('coupon-input')
    if (input) {
      gsap.fromTo(input, { x: -6 }, { x: 0, duration: 0.4, ease: 'elastic.out(2.5, 0.5)' })
    }
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 pointer-events-none" :class="{ 'pointer-events-auto': cartStore.isDrawerOpen }">
      <!-- Backdrop -->
      <div 
        ref="backdropRef"
        class="absolute inset-0 bg-[var(--color-bg-overlay)] backdrop-blur-md opacity-0"
        :class="{ 'hidden': !cartStore.isDrawerOpen && !backdropRef }"
        @click="cartStore.closeDrawer()"
      ></div>
      
      <!-- Drawer -->
      <div 
        ref="drawerRef"
        class="absolute top-0 right-0 h-full w-full max-w-md bg-[var(--color-bg-surface)] shadow-[var(--shadow-card)] flex flex-col translate-x-full border-l border-[var(--color-border)]"
        :class="{ 'hidden': !cartStore.isDrawerOpen && !drawerRef }"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-[var(--color-border)] shrink-0">
          <h2 class="font-display text-2xl tracking-wide m-0">{{ t('cart.title') }} <span class="text-[var(--color-text-secondary)]">{{ t('cart.items', { count: cartStore.itemCount }) }}</span></h2>
          <button @click="cartStore.closeDrawer()" class="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"/></svg>
          </button>
        </div>
        
        <!-- Items -->
        <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-6" ref="itemsContainerRef">
          <div v-if="cartStore.isEmpty" class="flex flex-col items-center justify-center h-full text-center text-[var(--color-text-secondary)] gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 256 256" class="opacity-50"><path fill="currentColor" d="M222.14 58.87A8 8 0 0 0 216 56H54.68L49.79 29.14A16 16 0 0 0 34.05 16H16a8 8 0 0 0 0 16h18.05l28.05 154.26A24 24 0 1 0 96 204h64a24 24 0 1 0 27.45-18.44l11.45-63.53l.4-1.74l13.43-46.7A8 8 0 0 0 222.14 58.87ZM80 216a8 8 0 1 1 8-8a8 8 0 0 1-8 8Zm96 0a8 8 0 1 1 8-8a8 8 0 0 1-8 8Zm19.82-104l-10.22 56.78A8 8 0 0 1 177.72 176H81.82l-18.18-100Z"/></svg>
            <p>{{ t('cart.empty') }}</p>
            <BaseButton variant="ghost" size="sm" @click="cartStore.closeDrawer()">{{ t('cart.continueShopping') }}</BaseButton>
          </div>
          
          <div v-else v-for="item in cartStore.items" :key="item.id" class="flex gap-4">
            <div class="w-20 h-24 bg-[var(--color-bg-raised)] rounded-[var(--radius-sm)] overflow-hidden shrink-0">
              <img :src="item.image" :alt="item.name" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 flex flex-col">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h4 class="font-body text-sm font-medium text-[var(--color-text-primary)] leading-tight">{{ item.name }}</h4>
                  <p v-if="item.variant" class="text-xs text-[var(--color-text-secondary)] mt-1">
                    <span v-if="item.variant.color">{{ item.variant.color }}</span>
                    <span v-if="item.variant.color && item.variant.size"> / </span>
                    <span v-if="item.variant.size">{{ item.variant.size }}</span>
                  </p>
                </div>
                <button @click="cartStore.removeItem(item.id)" class="text-[var(--color-text-muted)] hover:text-[var(--color-error)] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path fill="currentColor" d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16ZM96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Zm48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Z"/></svg>
                </button>
              </div>
              <div class="mt-auto flex items-center justify-between">
                <div class="flex items-center border border-[var(--color-border)] rounded-[var(--radius-sm)]">
                  <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)" class="w-8 h-8 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">-</button>
                  <div class="w-8 h-8 flex items-center justify-center font-mono text-sm">{{ item.quantity }}</div>
                  <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)" class="w-8 h-8 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">+</button>
                </div>
                <div class="font-mono font-bold text-[var(--color-accent-primary)] text-sm">
                  {{ formatPrice(item.price * item.quantity) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div v-if="!cartStore.isEmpty" class="p-6 bg-[var(--color-bg-raised)] border-t border-[var(--color-border)] shrink-0 flex flex-col gap-4">
          <!-- Coupon Input -->
          <div v-if="!cartStore.appliedCoupon" class="flex items-center gap-2">
            <input 
              id="coupon-input"
              v-model="couponCode" 
              type="text" 
              :placeholder="t('cart.enterCoupon')" 
              class="flex-1 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-sm uppercase outline-none focus:border-[var(--color-accent-primary)] font-mono"
            >
            <BaseButton variant="secondary" size="sm" @click="applyCoupon">{{ t('cart.apply') }}</BaseButton>
          </div>
          <div v-else class="flex items-center justify-between bg-[rgba(200,255,0,0.05)] border border-[var(--color-accent-primary)] rounded-[var(--radius-sm)] px-3 py-2">
            <div class="flex items-center gap-2 text-[var(--color-accent-primary)] text-sm font-bold font-mono">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path fill="currentColor" d="M229.66 77.66l-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69L218.34 66.34a8 8 0 0 1 11.32 11.32Z"/></svg>
              {{ t('cart.couponApplied', { code: cartStore.appliedCoupon.code }) }}
            </div>
            <button @click="cartStore.removeCoupon()" class="text-[var(--color-text-secondary)] hover:text-[var(--color-error)] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path fill="currentColor" d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"/></svg>
            </button>
          </div>
          
          <div class="flex flex-col gap-2 text-sm">
            <div class="flex items-center justify-between text-[var(--color-text-secondary)]">
              <span>{{ t('cart.subtotal') }}</span>
              <span class="font-mono">{{ formatPrice(cartStore.subtotal) }}</span>
            </div>
            <div v-if="cartStore.discountAmount > 0" class="flex items-center justify-between text-[var(--color-accent-secondary)]">
              <span>{{ t('cart.discount') }}</span>
              <span class="font-mono">-{{ formatPrice(cartStore.discountAmount) }}</span>
            </div>
            <div class="flex items-center justify-between text-[var(--color-text-secondary)]">
              <span>{{ t('cart.shipping') }}</span>
              <span>{{ t('cart.calculatedAtCheckout') }}</span>
            </div>
            <div class="h-px bg-[var(--color-border)] my-2"></div>
            <div class="flex items-center justify-between font-bold text-lg">
              <span>{{ t('cart.total') }}</span>
              <span class="font-mono text-[var(--color-accent-primary)]">{{ formatPrice(cartStore.total) }}</span>
            </div>
          </div>
          
          <BaseButton size="lg" fullWidth @click="checkout">
            {{ t('cart.checkout') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
