<script setup lang="ts">
import { useUiStore } from '@/stores/ui.store'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import { computed } from 'vue'

const uiStore = useUiStore()

const isOpen = computed({
  get: () => !!uiStore.confirmDialog,
  set: (val) => {
    if (!val && uiStore.confirmDialog) {
      uiStore.resolveConfirm(false)
    }
  }
})

const dialog = computed(() => uiStore.confirmDialog)

function confirm() {
  uiStore.resolveConfirm(true)
}

function cancel() {
  uiStore.resolveConfirm(false)
}
</script>

<template>
  <BaseModal v-model="isOpen" :title="dialog?.title" size="sm" :closeOnBackdrop="false">
    <div class="flex flex-col gap-6 pt-2">
      <p class="text-[var(--color-text-secondary)] text-sm">
        {{ dialog?.message }}
      </p>
      <div class="flex items-center justify-end gap-3 mt-4">
        <BaseButton variant="ghost" size="sm" @click="cancel">
          {{ dialog?.cancelLabel || 'Cancel' }}
        </BaseButton>
        <BaseButton 
          :variant="dialog?.variant === 'danger' ? 'danger' : 'primary'" 
          size="sm" 
          @click="confirm"
        >
          {{ dialog?.confirmLabel || 'Confirm' }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
