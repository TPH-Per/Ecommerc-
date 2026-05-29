import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

export interface ModalConfig {
  id: string
  props?: Record<string, any>
}

export interface ConfirmConfig {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'danger'
  resolve: (value: boolean) => void
}

export const useUiStore = defineStore('ui', () => {
  const toasts = ref<Toast[]>([])
  const activeModal = ref<ModalConfig | null>(null)
  const confirmDialog = ref<ConfirmConfig | null>(null)
  const isMobileMenuOpen = ref(false)
  const cursorVariant = ref<'default' | 'hover' | 'click' | 'hidden'>('default')

  function showToast(toast: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).substring(2, 9)
    toasts.value.push({ ...toast, id })
    if (toasts.value.length > 4) {
      toasts.value.shift()
    }
    
    if (toast.duration !== 0) {
      setTimeout(() => dismissToast(id), toast.duration || 4000)
    }
  }

  function dismissToast(id: string) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  function openModal(config: ModalConfig) {
    activeModal.value = config
  }

  function closeModal() {
    activeModal.value = null
  }

  function openConfirm(config: Omit<ConfirmConfig, 'resolve'>): Promise<boolean> {
    return new Promise((resolve) => {
      confirmDialog.value = { ...config, resolve }
    })
  }

  function resolveConfirm(value: boolean) {
    if (confirmDialog.value) {
      confirmDialog.value.resolve(value)
      confirmDialog.value = null
    }
  }

  function setCursorVariant(variant: typeof cursorVariant.value) {
    cursorVariant.value = variant
  }

  return {
    toasts,
    activeModal,
    confirmDialog,
    isMobileMenuOpen,
    cursorVariant,
    showToast,
    dismissToast,
    openModal,
    closeModal,
    openConfirm,
    resolveConfirm,
    setCursorVariant
  }
})
