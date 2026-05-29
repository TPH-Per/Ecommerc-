<script setup lang="ts">
import { useCartStore } from '@/stores/cart.store'
import { useOrderStore } from '@/stores/order.store'
import BaseButton from '@/components/base/BaseButton.vue'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'

import { useI18nStore } from '@/stores/i18n.store'
import { storeToRefs } from 'pinia'

const cartStore = useCartStore()
const orderStore = useOrderStore()
const i18nStore = useI18nStore()
const { t } = i18nStore
const { currency } = storeToRefs(i18nStore)
const toast = useToast()
const router = useRouter()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.value as unknown as string }).format(price)
}

const prevStep = () => {
  orderStore.setStep(2)
}

const placeOrder = async () => {
  const result = await orderStore.placeOrder()
  if (result.success) {
    // Success Animation
    const overlay = document.createElement('div')
    overlay.className = 'fixed inset-0 z-[9999] bg-[var(--color-bg-base)] flex items-center justify-center flex-col'
    overlay.innerHTML = `
      <div id="success-particles" class="absolute inset-0"></div>
      <h1 id="success-text" class="font-display text-5xl md:text-7xl text-[var(--color-accent-primary)] opacity-0 scale-50">${t('checkout.orderPlaced')}</h1>
      <p id="success-sub" class="text-[var(--color-text-secondary)] mt-4 opacity-0">${t('checkout.thankYou')}</p>
    `
    document.body.appendChild(overlay)
    
    const tl = gsap.timeline({
      onComplete: () => {
        cartStore.clearCart()
        orderStore.resetCheckout()
        document.body.removeChild(overlay)
        router.push(`/account/orders/${result.orderId}`)
      }
    })
    
    tl.to('#success-text', { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' })
      .to('#success-sub', { opacity: 1, y: -10, duration: 0.4 }, "-=0.3")
      .to(overlay, { opacity: 0, duration: 0.5, delay: 1.5 })
      
  } else {
    toast.error('Failed to place order. Please try again.')
  }
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <h2 class="font-display text-2xl tracking-wide uppercase">{{ t('checkout.reviewPlaceOrder') }}</h2>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="flex flex-col gap-6">
        <!-- Order Items -->
        <div class="bg-[var(--color-bg-raised)] p-6 rounded-[var(--radius-md)] border border-[var(--color-border)]">
          <h3 class="font-bold text-[var(--color-text-primary)] mb-4">{{ t('checkout.items') }}</h3>
          <div class="flex flex-col gap-4">
            <div v-for="item in cartStore.items" :key="item.id" class="flex items-center gap-4">
              <div class="w-16 h-20 bg-[var(--color-bg-surface)] rounded-[var(--radius-sm)] overflow-hidden shrink-0">
                <img :src="item.image" :alt="item.name" class="w-full h-full object-cover">
              </div>
              <div class="flex-1">
                <h4 class="font-body text-sm font-medium text-[var(--color-text-primary)]">{{ item.name }}</h4>
                <p v-if="item.variant" class="text-xs text-[var(--color-text-secondary)]">
                  {{ item.variant.color }} / {{ item.variant.size }}
                </p>
                <div class="flex justify-between items-center mt-2">
                  <span class="text-sm text-[var(--color-text-secondary)]">{{ t('checkout.qty') }}: {{ item.quantity }}</span>
                  <span class="font-mono text-sm font-bold text-[var(--color-text-primary)]">{{ formatPrice(item.price * item.quantity) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Details -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="bg-[var(--color-bg-raised)] p-4 rounded-[var(--radius-md)] border border-[var(--color-border)]">
            <h3 class="font-bold text-sm text-[var(--color-text-secondary)] mb-2 uppercase">{{ t('checkout.shippingAddressTitle') }}</h3>
            <!-- Placeholder display for address -->
            <p class="text-sm">John Doe</p>
            <p class="text-sm text-[var(--color-text-secondary)]">123 Tech Street, District 1, HCMC</p>
            <p class="text-sm text-[var(--color-text-secondary)]">+84 123 456 789</p>
          </div>
          <div class="bg-[var(--color-bg-raised)] p-4 rounded-[var(--radius-md)] border border-[var(--color-border)]">
            <h3 class="font-bold text-sm text-[var(--color-text-secondary)] mb-2 uppercase">{{ t('checkout.paymentMethodTitle') }}</h3>
            <p class="text-sm font-bold text-[var(--color-accent-primary)]">
              {{ orderStore.paymentMethod === 'cod' ? t('checkout.cod') : t('checkout.bankTransfer') }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Summary -->
      <div>
        <div class="bg-[var(--color-bg-raised)] p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] sticky top-32">
          <h3 class="font-bold text-[var(--color-text-primary)] mb-6">{{ t('checkout.orderSummary') }}</h3>
          
          <div class="flex flex-col gap-3 text-sm">
            <div class="flex items-center justify-between text-[var(--color-text-secondary)]">
              <span>{{ t('cart.subtotal') }}</span>
              <span class="font-mono">{{ formatPrice(cartStore.subtotal) }}</span>
            </div>
            <div v-if="cartStore.discountAmount > 0" class="flex items-center justify-between text-[var(--color-accent-secondary)]">
              <span>{{ t('cart.discount') }} <span v-if="cartStore.appliedCoupon">({{ cartStore.appliedCoupon.code }})</span></span>
              <span class="font-mono">-{{ formatPrice(cartStore.discountAmount) }}</span>
            </div>
            <div class="flex items-center justify-between text-[var(--color-text-secondary)]">
              <span>{{ t('cart.shipping') }}</span>
              <span class="font-mono text-[var(--color-success)] font-bold">{{ t('cart.free') }}</span>
            </div>
            
            <div class="h-px bg-[var(--color-border)] my-3"></div>
            
            <div class="flex items-center justify-between font-bold text-xl">
              <span>{{ t('cart.total') }}</span>
              <span class="font-mono text-[var(--color-accent-primary)]">{{ formatPrice(cartStore.total) }}</span>
            </div>
          </div>
          
          <div class="mt-8">
            <BaseButton 
              size="lg" 
              fullWidth 
              :loading="orderStore.placingOrder"
              @click="placeOrder"
            >
              {{ t('checkout.placeOrder') }}
            </BaseButton>
            <p class="text-center text-xs text-[var(--color-text-muted)] mt-4">
              {{ t('checkout.tosAgreement') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between pt-4 border-t border-[var(--color-border)]">
      <BaseButton variant="ghost" @click="prevStep" :disabled="orderStore.placingOrder">{{ t('checkout.backToPayment') }}</BaseButton>
    </div>
  </div>
</template>
