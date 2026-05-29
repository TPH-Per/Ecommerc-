import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from '@/composables/useToast'

export const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const toast = useToast()
    const authStore = useAuthStore()
    
    if (!error.response) {
      toast.error('Network error. Please check your connection.')
      return Promise.reject(error)
    }

    const { status, data } = error.response
    
    switch (status) {
      case 401:
        authStore.logout()
        toast.error('Session expired. Please log in again.')
        window.location.href = '/auth/login'
        break
      case 403:
        toast.error('Access denied.')
        break
      case 422:
        // Handled by specific forms via VeeValidate usually
        break
      case 500:
        toast.error('Server error. Please try again later.')
        break
      default:
        if (data && data.message) {
          toast.error(data.message)
        } else {
          toast.error('An unexpected error occurred.')
        }
    }
    return Promise.reject(error)
  }
)
