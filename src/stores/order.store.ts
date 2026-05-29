import { defineStore } from 'pinia'
import { ref } from 'vue'

export type CheckoutStep = 1 | 2 | 3

export interface AddressForm {
  fullName: string
  phone: string
  province: string
  district: string
  ward: string
  streetAddress: string
}

export type PaymentMethod = 'cod' | 'bank_transfer'

export const useOrderStore = defineStore('order', () => {
  const checkoutStep = ref<CheckoutStep>(1)
  const selectedAddressId = ref<string | null>(null)
  const tempAddress = ref<AddressForm | null>(null)
  const paymentMethod = ref<PaymentMethod | null>(null)
  const placingOrder = ref(false)

  function setStep(step: CheckoutStep) {
    checkoutStep.value = step
  }

  function setAddress(id: string | null, temp: AddressForm | null = null) {
    selectedAddressId.value = id
    tempAddress.value = temp
  }

  function setPaymentMethod(method: PaymentMethod) {
    paymentMethod.value = method
  }

  async function placeOrder() {
    placingOrder.value = true
    try {
      // API Call goes here
      await new Promise(resolve => setTimeout(resolve, 1500))
      return { success: true, orderId: 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase() }
    } catch (error) {
      return { success: false, error }
    } finally {
      placingOrder.value = false
    }
  }

  function resetCheckout() {
    checkoutStep.value = 1
    selectedAddressId.value = null
    tempAddress.value = null
    paymentMethod.value = null
    placingOrder.value = false
  }

  return {
    checkoutStep,
    selectedAddressId,
    tempAddress,
    paymentMethod,
    placingOrder,
    setStep,
    setAddress,
    setPaymentMethod,
    placeOrder,
    resetCheckout
  }
})
