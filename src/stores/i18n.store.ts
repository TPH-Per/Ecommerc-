import { defineStore } from 'pinia'
import vi from '@/locales/vi'
import en from '@/locales/en'
import ja from '@/locales/ja'
import { ref, computed } from 'vue'

export type Locale = 'vi' | 'en' | 'ja'

const catalogs: Record<Locale, any> = { vi, en, ja }

export const useI18nStore = defineStore('i18n', () => {
  const locale = ref<Locale>((localStorage.getItem('locale') as Locale) ?? 'vi')

  function setLocale(l: Locale) {
    locale.value = l
    localStorage.setItem('locale', l)
    document.documentElement.setAttribute('lang', l)
  }

  // Deep get by dot-path: t('product.addToCart')
  function t(key: string, vars?: Record<string, string | number>): string {
    const keys = key.split('.')
    let val: any = catalogs[locale.value]
    for (const k of keys) { 
      val = val?.[k] 
    }
    if (!val) return key
    if (vars) {
      return Object.entries(vars).reduce((s, [k, v]) => s.replace(`{${k}}`, String(v)), val)
    }
    return val
  }

  const currency = computed(() =>
    locale.value === 'ja' ? 'JPY' : locale.value === 'en' ? 'USD' : 'VND'
  )

  return { locale, setLocale, t, currency }
}, { persist: false }) // persist handled manually via localStorage
