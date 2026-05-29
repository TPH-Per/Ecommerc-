<script setup lang="ts">
import { ref } from 'vue'
import { useOrderStore } from '@/stores/order.store'
import type { PaymentMethod } from '@/stores/order.store'
import BaseButton from '@/components/base/BaseButton.vue'
import { useI18n } from '@/composables/useI18n'

const orderStore = useOrderStore()
const { t } = useI18n()
const method = ref<PaymentMethod>(orderStore.paymentMethod || 'cod')

const nextStep = () => {
  orderStore.setPaymentMethod(method.value)
  orderStore.setStep(3)
}

const prevStep = () => {
  orderStore.setStep(1)
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <h2 class="font-display text-2xl tracking-wide uppercase">{{ t('checkout.paymentMethodTitle') }}</h2>
    
    <div class="flex flex-col gap-4">
      <label 
        class="relative flex items-center gap-4 p-4 border rounded-[var(--radius-md)] cursor-pointer transition-all duration-300"
        :class="method === 'cod' ? 'border-[var(--color-accent-primary)] bg-[rgba(200,255,0,0.05)]' : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)] bg-[var(--color-bg-raised)]'"
      >
        <div>
          <input type="radio" value="cod" v-model="method" class="accent-[var(--color-accent-primary)] w-4 h-4">
        </div>
        <div class="flex flex-col gap-1">
          <span class="font-bold text-[var(--color-text-primary)]">{{ t('checkout.cod') }}</span>
          <span class="text-sm text-[var(--color-text-secondary)]">{{ t('checkout.codDesc') }}</span>
        </div>
      </label>
      
      <label 
        class="relative flex flex-col gap-4 p-4 border rounded-[var(--radius-md)] cursor-pointer transition-all duration-300"
        :class="method === 'bank_transfer' ? 'border-[var(--color-accent-primary)] bg-[rgba(200,255,0,0.05)]' : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)] bg-[var(--color-bg-raised)]'"
      >
        <div class="flex items-center gap-4">
          <div>
            <input type="radio" value="bank_transfer" v-model="method" class="accent-[var(--color-accent-primary)] w-4 h-4">
          </div>
          <div class="flex flex-col gap-1">
            <span class="font-bold text-[var(--color-text-primary)]">{{ t('checkout.bankTransfer') }}</span>
            <span class="text-sm text-[var(--color-text-secondary)]">{{ t('checkout.bankTransferDesc') }}</span>
          </div>
        </div>
        
        <div v-show="method === 'bank_transfer'" class="pl-8 pt-2 animate-fade-in">
          <div class="p-4 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-[var(--radius-sm)] flex gap-6">
            <div class="w-32 h-32 bg-white flex flex-col items-center justify-center p-2 rounded shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 256 256"><path fill="black" d="M104 40v32a8 8 0 0 1-8 8H64a8 8 0 0 1-8-8V40a8 8 0 0 1 8-8h32a8 8 0 0 1 8 8ZM80 48H72v16h8Zm24 104v32a8 8 0 0 1-8 8H64a8 8 0 0 1-8-8v-32a8 8 0 0 1 8-8h32a8 8 0 0 1 8 8Zm-24 8H72v16h8Zm96-120v32a8 8 0 0 1-8 8h-32a8 8 0 0 1-8-8V40a8 8 0 0 1 8-8h32a8 8 0 0 1 8 8Zm-24 8h-8v16h8Zm40 96v56a8 8 0 0 1-8 8h-8v-16h-16v16h-16v-16h-16v16h-8a8 8 0 0 1-8-8v-56a8 8 0 0 1 8-8h56a8 8 0 0 1 8 8Zm-16 8h-40v40h40Zm-16 16h-8v8h8Zm0-64h16a8 8 0 0 1 0 16h-16a8 8 0 0 1 0-16Zm-24 0h-32a8 8 0 0 1 0-16h32a8 8 0 0 1 0 16Zm-64 80a8 8 0 0 1-8 8H32a8 8 0 0 1 0-16h24a8 8 0 0 1 8 8Z"/></svg>
            </div>
            <div class="flex flex-col gap-2 justify-center">
              <p class="text-sm"><span class="text-[var(--color-text-secondary)]">{{ t('checkout.bank') }}:</span> <strong>Techcombank</strong></p>
              <p class="text-sm"><span class="text-[var(--color-text-secondary)]">{{ t('checkout.accountName') }}:</span> <strong>LUMINARY MARKET</strong></p>
              <p class="text-sm"><span class="text-[var(--color-text-secondary)]">{{ t('checkout.accountNo') }}:</span> <strong class="font-mono text-[var(--color-accent-primary)]">1903 0000 1111 22</strong></p>
              <p class="text-xs text-[var(--color-warning)] mt-2">{{ t('checkout.orderConfirmedAfterPayment') }}</p>
            </div>
          </div>
        </div>
      </label>
    </div>

    <div class="flex justify-between pt-4 border-t border-[var(--color-border)]">
      <BaseButton variant="ghost" @click="prevStep">{{ t('checkout.backToAddress') }}</BaseButton>
      <BaseButton @click="nextStep">{{ t('checkout.reviewOrderBtn') }}</BaseButton>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
