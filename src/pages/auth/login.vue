<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useI18n } from '@/composables/useI18n'

const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()
const { t } = useI18n()
const loading = ref(false)

const login = async () => {
  loading.value = true
  // Mock login
  setTimeout(() => {
    authStore.login(
      { id: '1', email: email.value || 'demo@luminary.com', name: 'Demo User', role: 'admin' }, 
      'mock-access-token',
      'mock-refresh-token'
    )
    toast.success('Logged in successfully')
    const redirect = route.query.redirect as string || '/'
    router.push(redirect)
    loading.value = false
  }, 800)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="text-center">
      <h2 class="text-2xl font-bold">{{ t('auth.welcomeBack') }}</h2>
      <p class="text-[var(--color-text-secondary)] text-sm mt-2">{{ t('auth.signInDesc') }}</p>
    </div>
    <form @submit.prevent="login" class="flex flex-col gap-4">
      <BaseInput :label="t('auth.email')" type="email" v-model="email" placeholder="admin@luminary.com" required />
      <BaseInput :label="t('auth.password')" type="password" v-model="password" placeholder="••••••••" required />
      <BaseButton type="submit" fullWidth :loading="loading">{{ t('auth.signIn') }}</BaseButton>
    </form>
  </div>
</template>

<route lang="yaml">
meta:
  layout: auth
</route>
