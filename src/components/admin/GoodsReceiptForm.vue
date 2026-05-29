<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useConfirm } from '@/composables/useConfirm'
import { useToast } from '@/composables/useToast'
import { useI18n } from '@/composables/useI18n'

const emit = defineEmits<{ (e: 'close'): void }>()

const confirm = useConfirm()
const toast = useToast()
const { t } = useI18n()

const suppliers = [
  { id: '1', name: 'CyberTech Supply', contact: 'John Matrix', phone: '555-0199', email: 'john@cybertech.inc' },
  { id: '2', name: 'Neo Tokyo Threads', contact: 'Akira K.', phone: '555-0288', email: 'akira@neotokyo.jp' }
]

const availableProducts = [
  { id: 'p1', supplierId: '1', sku: 'CYB-001', name: 'Neural Link Cable', cost: 12.50 },
  { id: 'p2', supplierId: '1', sku: 'CYB-002', name: 'Optic Sensor V4', cost: 45.00 },
  { id: 'p3', supplierId: '2', sku: 'NTT-001', name: 'Acid Wash Denim', cost: 35.00 },
  { id: 'p4', supplierId: '2', sku: 'NTT-002', name: 'Reflective Windbreaker', cost: 85.00 },
]

const selectedSupplierId = ref<string | null>(null)
const selectedSupplier = computed(() => suppliers.find(s => s.id === selectedSupplierId.value))

const items = ref<{ id: string, productId: string, name: string, sku: string, quantity: number, unitCost: number }[]>([])

const filteredProducts = computed(() => {
  if (!selectedSupplierId.value) return []
  return availableProducts.filter(p => p.supplierId === selectedSupplierId.value)
})

const grandTotal = computed(() => items.value.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0))

const changeSupplier = async () => {
  if (items.value.length > 0) {
    const ok = await confirm.open({
      title: 'Change Supplier?',
      message: 'Changing the supplier will clear all currently added products. Are you sure?',
      variant: 'danger',
      confirmLabel: 'Clear Products'
    })
    
    if (ok) {
      items.value = []
      selectedSupplierId.value = null
    }
  } else {
    selectedSupplierId.value = null
  }
}

const addProduct = (e: Event) => {
  const target = e.target as HTMLSelectElement
  const pId = target.value
  if (!pId) return
  
  const product = availableProducts.find(p => p.id === pId)
  if (product) {
    const existing = items.value.find(i => i.productId === pId)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({
        id: Math.random().toString(36).substring(2, 9),
        productId: product.id,
        name: product.name,
        sku: product.sku,
        quantity: 1,
        unitCost: product.cost
      })
    }
    
    // reset select
    target.value = ''
  }
}

const removeItem = (id: string) => {
  const idx = items.value.findIndex(i => i.id === id)
  if (idx > -1) {
    items.value.splice(idx, 1)
  }
}

const submit = async (status: 'Draft' | 'Confirmed') => {
  if (items.value.length === 0) {
    toast.error('Cannot save empty voucher')
    return
  }
  
  if (status === 'Confirmed') {
    const ok = await confirm.open({
      title: 'Confirm Receipt?',
      message: 'Confirming will update inventory stock levels and finalize the cost. This action cannot be undone.',
      confirmLabel: 'Confirm & Update Stock'
    })
    if (!ok) return
  }
  
  toast.success(`Voucher ${status === 'Confirmed' ? 'confirmed' : 'saved as draft'}`)
  emit('close')
}
</script>

<template>
  <div class="flex flex-col gap-8 max-w-4xl">
    
    <!-- Step 1: Supplier -->
    <div class="bg-[var(--color-bg-surface)] border border-[var(--color-border)] p-6 rounded-[var(--radius-md)] shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-bold text-lg flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-[var(--color-accent-primary)] text-white flex items-center justify-center text-xs">1</span>
          {{ t('admin.selectSupplier') }}
        </h2>
        <BaseButton v-if="selectedSupplierId" variant="ghost" size="sm" @click="changeSupplier">{{ t('admin.changeSupplier') }}</BaseButton>
      </div>
      
      <div v-if="!selectedSupplierId">
        <select v-model="selectedSupplierId" class="w-full bg-[var(--color-bg-raised)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-primary)]">
          <option :value="null" disabled>{{ t('admin.chooseSupplier') }}</option>
          <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>
      
      <div v-else class="bg-[var(--color-bg-raised)] p-4 rounded-[var(--radius-sm)] border border-[var(--color-border)] flex flex-col gap-1">
        <p class="font-bold text-lg text-[var(--color-text-primary)]">{{ selectedSupplier?.name }}</p>
        <p class="text-sm text-[var(--color-text-secondary)]">{{ t('admin.contact') }}: {{ selectedSupplier?.contact }}</p>
        <div class="flex gap-4 text-sm text-[var(--color-text-secondary)] mt-2">
          <span><strong class="text-[var(--color-text-primary)]">{{ t('admin.phone') }}:</strong> {{ selectedSupplier?.phone }}</span>
          <span><strong class="text-[var(--color-text-primary)]">{{ t('admin.email') }}:</strong> {{ selectedSupplier?.email }}</span>
        </div>
      </div>
    </div>

    <!-- Step 2: Products -->
    <div class="bg-[var(--color-bg-surface)] border border-[var(--color-border)] p-6 rounded-[var(--radius-md)] shadow-sm" :class="{ 'opacity-50 pointer-events-none': !selectedSupplierId }">
      <h2 class="font-bold text-lg flex items-center gap-2 mb-6">
        <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white transition-colors" :class="selectedSupplierId ? 'bg-[var(--color-accent-primary)]' : 'bg-[var(--color-text-muted)]'">2</span>
        {{ t('admin.addProducts') }}
      </h2>
      
      <div class="mb-6">
        <select @change="addProduct" class="w-full bg-[var(--color-bg-raised)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent-primary)]">
          <option value="" selected disabled>{{ t('admin.searchProducts') }}</option>
          <option v-for="p in filteredProducts" :key="p.id" :value="p.id">{{ p.sku }} - {{ p.name }} (${{ p.cost.toFixed(2) }})</option>
        </select>
      </div>
      
      <div v-if="items.length > 0" class="border border-[var(--color-border)] rounded-[var(--radius-sm)] overflow-hidden">
        <table class="w-full text-left border-collapse text-sm">
          <thead class="bg-[var(--color-bg-raised)] border-b border-[var(--color-border)]">
            <tr>
              <th class="p-3 font-medium">{{ t('admin.sku') }}</th>
              <th class="p-3 font-medium">{{ t('admin.productName') }}</th>
              <th class="p-3 font-medium w-32">{{ t('admin.unitCost') }}</th>
              <th class="p-3 font-medium w-24">{{ t('admin.qty') }}</th>
              <th class="p-3 font-medium w-32 text-right">{{ t('admin.lineTotal') }}</th>
              <th class="p-3 font-medium w-12 text-center"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id" class="border-b border-[var(--color-border)] last:border-0">
              <td class="p-3 font-mono text-xs">{{ item.sku }}</td>
              <td class="p-3 font-medium">{{ item.name }}</td>
              <td class="p-3">
                <input type="number" v-model.number="item.unitCost" min="0" step="0.01" class="w-full bg-transparent border border-[var(--color-border)] rounded px-2 py-1 outline-none focus:border-[var(--color-accent-primary)]">
              </td>
              <td class="p-3">
                <input type="number" v-model.number="item.quantity" min="1" class="w-full bg-transparent border border-[var(--color-border)] rounded px-2 py-1 outline-none focus:border-[var(--color-accent-primary)]">
              </td>
              <td class="p-3 text-right font-mono font-bold">
                ${{ (item.unitCost * item.quantity).toFixed(2) }}
              </td>
              <td class="p-3 text-center">
                <button @click="removeItem(item.id)" class="text-[var(--color-text-muted)] hover:text-[var(--color-error)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path fill="currentColor" d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16ZM96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Zm48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Z"/></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="py-8 text-center text-sm text-[var(--color-text-muted)] border border-dashed border-[var(--color-border)] rounded-[var(--radius-sm)]">
        {{ t('admin.noProducts') }}
      </div>
    </div>

    <!-- Step 3: Review & Submit -->
    <div class="bg-[var(--color-bg-surface)] border border-[var(--color-border)] p-6 rounded-[var(--radius-md)] shadow-sm" :class="{ 'opacity-50 pointer-events-none': items.length === 0 }">
      <div class="flex flex-col md:flex-row gap-6 md:items-end justify-between">
        <div class="flex-1 max-w-md">
          <label class="block text-sm font-medium mb-1">{{ t('admin.internalNotes') }}</label>
          <textarea rows="2" class="w-full bg-[var(--color-bg-raised)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent-primary)]"></textarea>
        </div>
        
        <div class="flex flex-col items-end gap-4 min-w-[200px]">
          <div class="text-right w-full flex justify-between items-center text-xl pb-4 border-b border-[var(--color-border)]">
            <span class="font-bold">{{ t('admin.total') }}:</span>
            <span class="font-mono font-bold text-[var(--color-accent-primary)]">${{ grandTotal.toFixed(2) }}</span>
          </div>
          <div class="flex items-center gap-3 w-full">
            <BaseButton variant="secondary" fullWidth @click="submit('Draft')">{{ t('admin.saveDraft') }}</BaseButton>
            <BaseButton fullWidth @click="submit('Confirmed')">{{ t('admin.confirm') }}</BaseButton>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>
