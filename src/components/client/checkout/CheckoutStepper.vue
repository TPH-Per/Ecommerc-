<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { gsap } from 'gsap'
import { useOrderStore } from '@/stores/order.store'
import { useI18n } from '@/composables/useI18n'

const orderStore = useOrderStore()
const { t } = useI18n()

const steps = computed(() => [
  { id: 1, name: t('checkout.stepShipping') },
  { id: 2, name: t('checkout.stepPayment') },
  { id: 3, name: t('checkout.stepReview') }
])

const progressLineRef = ref<HTMLElement | null>(null)

watch(() => orderStore.checkoutStep, (step) => {
  if (progressLineRef.value) {
    const percentage = ((step - 1) / (steps.value.length - 1)) * 100
    gsap.to(progressLineRef.value, { 
      width: `${percentage}%`, 
      duration: 0.5, 
      ease: 'power2.inOut' 
    })
  }
})

onMounted(() => {
  if (progressLineRef.value) {
    const percentage = ((orderStore.checkoutStep - 1) / (steps.value.length - 1)) * 100
    gsap.set(progressLineRef.value, { width: `${percentage}%` })
  }
})
</script>

<template>
  <div class="relative max-w-lg mx-auto w-full px-4">
    <!-- Background Line -->
    <div class="absolute top-4 left-6 right-6 h-[2px] bg-[var(--color-bg-raised)] -z-10"></div>
    
    <!-- Animated Progress Line -->
    <div 
      ref="progressLineRef"
      class="absolute top-4 left-6 h-[2px] bg-[var(--color-accent-primary)] -z-10 w-0 shadow-[var(--shadow-glow-accent)]"
    ></div>
    
    <div class="flex justify-between">
      <div 
        v-for="step in steps" 
        :key="step.id"
        class="flex flex-col items-center gap-2"
      >
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm font-bold border-2 transition-all duration-300"
          :class="[
            orderStore.checkoutStep === step.id 
              ? 'bg-[var(--color-accent-primary)] text-black border-[var(--color-accent-primary)] shadow-[var(--shadow-glow-accent)] scale-110' 
              : orderStore.checkoutStep > step.id
                ? 'bg-[var(--color-accent-primary)] text-black border-[var(--color-accent-primary)]'
                : 'bg-[var(--color-bg-base)] text-[var(--color-text-secondary)] border-[var(--color-bg-raised)]'
          ]"
        >
          <svg v-if="orderStore.checkoutStep > step.id" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path fill="currentColor" d="M229.66 77.66l-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69L218.34 66.34a8 8 0 0 1 11.32 11.32Z"/></svg>
          <span v-else>{{ step.id }}</span>
        </div>
        <span 
          class="text-xs font-bold tracking-widest uppercase transition-colors duration-300"
          :class="orderStore.checkoutStep >= step.id ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'"
        >
          {{ step.name }}
        </span>
      </div>
    </div>
  </div>
</template>
