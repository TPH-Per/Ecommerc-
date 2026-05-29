import { useI18nStore } from '@/stores/i18n.store'
import { storeToRefs } from 'pinia'

export function useI18n() {
  const store = useI18nStore()
  const { locale, currency } = storeToRefs(store)
  
  if (!store.t) {
    console.error('i18n store.t is missing!')
  }

  const t = (key: string, vars?: Record<string, string | number>) => {
    return store.t(key, vars)
  }

  return { 
    t, 
    locale, 
    setLocale: store.setLocale,
    currency
  }
}
