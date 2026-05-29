<script setup lang="ts">
import { ref } from 'vue'
import { useOrderStore } from '@/stores/order.store'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import { useI18n } from '@/composables/useI18n'

const orderStore = useOrderStore()
const { t } = useI18n()

const savedAddresses = ref([
  { id: 'addr_1', name: 'John Doe', phone: '+84 123 456 789', fullAddress: '123 Tech Street, District 1, Ho Chi Minh City', isDefault: true }
])

const useNewAddress = ref(false)
const selectedId = ref(savedAddresses.value[0].id)

const newAddress = ref({
  fullName: '',
  phone: '',
  province: '',
  district: '',
  ward: '',
  streetAddress: ''
})

const nextStep = () => {
  if (useNewAddress.value) {
    orderStore.setAddress(null, newAddress.value)
  } else {
    orderStore.setAddress(selectedId.value)
  }
  orderStore.setStep(2)
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <h2 class="font-display text-2xl tracking-wide uppercase">{{ t('checkout.shippingAddressTitle') }}</h2>
    
    <div class="flex flex-col gap-4">
      <label 
        v-for="addr in savedAddresses" 
        :key="addr.id"
        class="relative flex items-start gap-4 p-4 border rounded-[var(--radius-md)] cursor-pointer transition-all duration-300"
        :class="selectedId === addr.id && !useNewAddress ? 'border-[var(--color-accent-primary)] bg-[rgba(200,255,0,0.05)]' : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)] bg-[var(--color-bg-raised)]'"
      >
        <div class="pt-1">
          <input type="radio" :value="addr.id" v-model="selectedId" @change="useNewAddress = false" class="accent-[var(--color-accent-primary)] w-4 h-4">
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="font-bold text-[var(--color-text-primary)]">{{ addr.name }}</span>
            <span class="text-[var(--color-text-secondary)]">{{ addr.phone }}</span>
            <span v-if="addr.isDefault" class="px-2 py-0.5 bg-[var(--color-accent-primary)] text-black text-[10px] font-bold font-mono tracking-wider rounded-[var(--radius-sm)] ml-auto">
              {{ t('badge.default') }}
            </span>
          </div>
          <p class="text-sm text-[var(--color-text-secondary)]">{{ addr.fullAddress }}</p>
        </div>
      </label>
      
      <label 
        class="relative flex items-center gap-4 p-4 border rounded-[var(--radius-md)] cursor-pointer transition-all duration-300"
        :class="useNewAddress ? 'border-[var(--color-accent-primary)] bg-[rgba(200,255,0,0.05)]' : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)] bg-[var(--color-bg-raised)]'"
      >
        <div>
          <input type="radio" :value="true" v-model="useNewAddress" class="accent-[var(--color-accent-primary)] w-4 h-4">
        </div>
        <span class="font-bold text-[var(--color-text-primary)]">{{ t('checkout.useDifferentAddress') }}</span>
      </label>
    </div>
    
    <div v-show="useNewAddress" class="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in origin-top">
      <BaseInput :label="t('checkout.fullName')" v-model="newAddress.fullName" />
      <BaseInput :label="t('checkout.phone')" v-model="newAddress.phone" />
      <BaseInput :label="t('checkout.province')" v-model="newAddress.province" />
      <BaseInput :label="t('checkout.district')" v-model="newAddress.district" />
      <BaseInput :label="t('checkout.ward')" v-model="newAddress.ward" />
      <BaseInput :label="t('checkout.streetAddress')" v-model="newAddress.streetAddress" />
    </div>

    <div class="flex justify-end pt-4 border-t border-[var(--color-border)]">
      <BaseButton @click="nextStep">{{ t('checkout.continueToPayment') }}</BaseButton>
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
