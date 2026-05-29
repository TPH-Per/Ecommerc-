export type UserRole = 'customer' | 'staff' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  phone?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
}
