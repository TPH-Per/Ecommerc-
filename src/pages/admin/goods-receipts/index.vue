<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import GoodsReceiptForm from '@/components/admin/GoodsReceiptForm.vue'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
const showForm = ref(false)

const vouchers = ref([
  { id: 'GR-1001', date: '2026-05-27', supplier: 'CyberTech Supply', totalItems: 120, totalCost: 15400.00, status: 'Confirmed' },
  { id: 'GR-1002', date: '2026-05-28', supplier: 'Neo Tokyo Threads', totalItems: 45, totalCost: 3200.50, status: 'Draft' }
])
</script>

<template>
  <div>
    <div v-if="!showForm">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-display uppercase tracking-wide">{{ t('admin.goodsReceipts') }}</h1>
        <BaseButton @click="showForm = true">{{ t('admin.createVoucher') }}</BaseButton>
      </div>
      
      <div class="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-[var(--color-border)] text-sm text-[var(--color-text-secondary)]">
              <th class="p-4 font-medium">{{ t('admin.voucherId') }}</th>
              <th class="p-4 font-medium">{{ t('admin.date') }}</th>
              <th class="p-4 font-medium">{{ t('admin.supplier') }}</th>
              <th class="p-4 font-medium text-right">{{ t('admin.items') }}</th>
              <th class="p-4 font-medium text-right">{{ t('admin.totalCost') }}</th>
              <th class="p-4 font-medium text-center">{{ t('admin.status') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in vouchers" :key="v.id" class="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-raised)] transition-colors text-sm">
              <td class="p-4 font-mono font-bold">{{ v.id }}</td>
              <td class="p-4">{{ v.date }}</td>
              <td class="p-4">{{ v.supplier }}</td>
              <td class="p-4 text-right">{{ v.totalItems }}</td>
              <td class="p-4 text-right font-mono">${{ v.totalCost.toFixed(2) }}</td>
              <td class="p-4 text-center">
                <span class="px-2 py-1 rounded-[var(--radius-sm)] text-[10px] font-bold font-mono tracking-wider uppercase" :class="v.status === 'Confirmed' ? 'bg-[var(--color-success)] text-white' : 'bg-[var(--color-bg-raised)] text-[var(--color-text-secondary)]'">
                  {{ v.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div v-else>
      <div class="mb-8 flex items-center gap-4">
        <button @click="showForm = false" class="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="M224 128a8 8 0 0 1-8 8H59.31l58.35 58.34a8 8 0 0 1-11.32 11.32l-72-72a8 8 0 0 1 0-11.32l72-72a8 8 0 0 1 11.32 11.32L59.31 120H216a8 8 0 0 1 8 8Z"/></svg>
        </button>
        <h1 class="text-3xl font-display uppercase tracking-wide m-0">{{ t('admin.createImportVoucher') }}</h1>
      </div>
      
      <GoodsReceiptForm @close="showForm = false" />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  role: admin
</route>
