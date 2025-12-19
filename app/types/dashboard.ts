/**
 * Dashboard Types
 */

export interface DashboardStats {
  completed: number
  delayed: number
  pending: number
  totalTasks: number
}

export interface AttendanceData {
  date: string
  status: 'present' | 'absent'
}

export interface RecentActivity {
  id: number
  title: string
  type: 'meeting' | 'task' | 'log'
  duration: string
  time: string
  project?: string
}

export interface DashboardRequest {
  id: number
  type: 'sick_leave' | 'equipment' | 'vacation' | 'expense'
  title: string
  status: 'pending' | 'approved' | 'rejected'
  date: string
}

export interface DashboardData {
  stats: DashboardStats
  attendance: AttendanceData[]
  recentActivity: RecentActivity[]
  requests: DashboardRequest[]
}
