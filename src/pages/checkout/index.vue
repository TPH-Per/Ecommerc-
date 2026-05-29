<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { gsap } from 'gsap'
import { useOrderStore } from '@/stores/order.store'
import CheckoutStepper from '@/components/client/checkout/CheckoutStepper.vue'
import CheckoutAddressStep from '@/components/client/checkout/CheckoutAddressStep.vue'
import CheckoutPaymentStep from '@/components/client/checkout/CheckoutPaymentStep.vue'
import CheckoutReviewStep from '@/components/client/checkout/CheckoutReviewStep.vue'

const orderStore = useOrderStore()
const stepContainerRef = ref<HTMLElement | null>(null)

watch(() => orderStore.checkoutStep, (newStep, oldStep) => {
  if (stepContainerRef.value) {
    const direction = newStep > oldStep ? 20 : -20
    gsap.fromTo(stepContainerRef.value, 
      { opacity: 0, x: direction },
      { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', clearProps: 'transform' }
    )
  }
})

onMounted(() => {
  orderStore.resetCheckout()
})
</script>

<template>
  <div class="checkout-page pt-32 pb-24 px-6 max-w-4xl mx-auto min-h-screen flex flex-col">
    <div class="mb-12 text-center">
      <h1 class="font-display text-4xl tracking-wide uppercase text-[var(--color-text-primary)]">Checkout</h1>
    </div>
    
    <CheckoutStepper class="mb-12" />
    
    <div class="flex-1 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 md:p-12 shadow-[var(--shadow-card)]" ref="stepContainerRef">
      <CheckoutAddressStep v-if="orderStore.checkoutStep === 1" />
      <CheckoutPaymentStep v-else-if="orderStore.checkoutStep === 2" />
      <CheckoutReviewStep v-else-if="orderStore.checkoutStep === 3" />
    </div>
  </div>
</template>
