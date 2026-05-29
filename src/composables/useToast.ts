import { useUiStore } from '@/stores/ui.store'

export function useToast() {
  const store = useUiStore()

  return {
    success: (message: string, duration?: number) => store.showToast({ type: 'success', message, duration }),
    error: (message: string, duration?: number) => store.showToast({ type: 'error', message, duration }),
    warning: (message: string, duration?: number) => store.showToast({ type: 'warning', message, duration }),
    info: (message: string, duration?: number) => store.showToast({ type: 'info', message, duration }),
    dismiss: store.dismissToast
  }
}
