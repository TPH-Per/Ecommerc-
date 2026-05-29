import { useUiStore } from '@/stores/ui.store'
import type { ConfirmConfig } from '@/stores/ui.store'

export function useConfirm() {
  const store = useUiStore()

  return {
    open: (config: Omit<ConfirmConfig, 'resolve'>) => store.openConfirm(config)
  }
}
