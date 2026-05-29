<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ClientLayout from '@/layouts/ClientLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import StaffLayout from '@/layouts/StaffLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import BaseToastContainer from '@/components/base/BaseToastContainer.vue'
import BaseConfirmContainer from '@/components/base/BaseConfirmContainer.vue'

const route = useRoute()
const layoutMap = {
  client: ClientLayout,
  admin: AdminLayout,
  staff: StaffLayout,
  auth: AuthLayout
}

const currentLayout = computed(() => {
  const layoutName = route.meta.layout || 'client'
  return layoutMap[layoutName as keyof typeof layoutMap] || ClientLayout
})
</script>

<template>
  <component :is="currentLayout">
    <router-view v-slot="{ Component, route }">
      <transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </component>
  
  <BaseToastContainer />
  <BaseConfirmContainer />
</template>
