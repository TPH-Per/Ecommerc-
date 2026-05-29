import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import type { UserRole } from '@/types/auth.types'

const ROLE_BASE_ROUTES: Record<UserRole, string> = {
  customer: '/',
  staff: '/staff',
  admin: '/admin',
}

export function setupGuards(router: Router) {
  router.beforeEach(async (to) => {
    const auth = useAuthStore()
    const requiredRole = to.meta.role as UserRole | undefined

    // Public routes: no guard
    if (!requiredRole && !to.meta.requiresAuth) return true

    // Not logged in -> redirect to login
    if (!auth.isAuthenticated) {
      return { path: '/auth/login', query: { redirect: to.fullPath } }
    }

    // Wrong role -> redirect to role home
    if (requiredRole && auth.user?.role !== requiredRole) {
      return { path: ROLE_BASE_ROUTES[auth.user!.role] }
    }

    return true
  })
  
  router.afterEach((to) => {
    const layout = to.meta.layout || 'client'
    document.documentElement.setAttribute('data-portal', layout as string)
  })
}
