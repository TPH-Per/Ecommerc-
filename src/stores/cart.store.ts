import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  variant?: {
    color?: string
    size?: string
  }
}

export interface Coupon {
  code: string
  discountAmount?: number
  discountPercent?: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const appliedCoupon = ref<Coupon | null>(null)
  const isDrawerOpen = ref(false)

  const itemCount = computed(() => items.value.reduce((total, item) => total + item.quantity, 0))
  const subtotal = computed(() => items.value.reduce((total, item) => total + (item.price * item.quantity), 0))
  
  const discountAmount = computed(() => {
    if (!appliedCoupon.value) return 0
    if (appliedCoupon.value.discountAmount) return appliedCoupon.value.discountAmount
    if (appliedCoupon.value.discountPercent) return subtotal.value * (appliedCoupon.value.discountPercent / 100)
    return 0
  })
  
  const total = computed(() => Math.max(0, subtotal.value - discountAmount.value))
  const isEmpty = computed(() => items.value.length === 0)

  function addItem(item: Omit<CartItem, 'id'>) {
    const existing = items.value.find(i => 
      i.productId === item.productId && 
      i.variant?.color === item.variant?.color && 
      i.variant?.size === item.variant?.size
    )
    
    if (existing) {
      existing.quantity += item.quantity
    } else {
      items.value.push({ ...item, id: Math.random().toString(36).substring(2, 9) })
    }
    isDrawerOpen.value = true
  }

  function removeItem(id: string) {
    const index = items.value.findIndex(i => i.id === id)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  function updateQuantity(id: string, quantity: number) {
    const item = items.value.find(i => i.id === id)
    if (item) {
      item.quantity = Math.max(1, Math.min(99, quantity))
    }
  }

  function applyCoupon(coupon: Coupon) {
    appliedCoupon.value = coupon
  }

  function removeCoupon() {
    appliedCoupon.value = null
  }

  function clearCart() {
    items.value = []
    appliedCoupon.value = null
  }

  function openDrawer() {
    isDrawerOpen.value = true
  }

  function closeDrawer() {
    isDrawerOpen.value = false
  }

  return {
    items,
    appliedCoupon,
    isDrawerOpen,
    itemCount,
    subtotal,
    discountAmount,
    total,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clearCart,
    openDrawer,
    closeDrawer
  }
}, {
  persist: {
    key: 'luminary-cart',
    storage: localStorage,
    // @ts-ignore
    paths: ['items', 'appliedCoupon']
  }
})
