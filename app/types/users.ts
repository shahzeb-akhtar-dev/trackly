/**
 * User Management Types
 */

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role: string
  department: string
  jobTitle: string
  status: 'active' | 'inactive' | 'pending'
  hireDate: string
  createdAt: string
  updatedAt: string
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  pendingInvites: number
  totalUsersChange: number
  activeUsersChange: number
  pendingInvitesChange: number
}

export interface UserFilter {
  search: string
  role: string
  department: string
  status: string
}

export interface UsersResponse {
  data: User[]
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}
