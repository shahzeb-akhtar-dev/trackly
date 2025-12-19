/**
 * Timer Types - Real-time active timer sessions
 */

export interface Task {
  id: number
  title: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  description?: string
  priority?: 'low' | 'medium' | 'high'
  estimatedHours?: number
  assignedToYou?: boolean
}

export interface Project {
  id: number
  name: string
  tasks?: Task[]
}

export interface Timer {
  id: number
  user_id: number
  company_id: number
  task_id: number
  project_id: number
  task: Task
  project: Project
  started_at: string // ISO timestamp
  paused_at: string | null
  paused_duration_seconds: number
  is_running: boolean
  is_paused: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface TimeLog {
  id: number
  company_id: number
  task_id: number
  project_id: number
  user_id: number
  task: Task
  project: Project
  date_logged: string
  start_time: string
  end_time: string
  duration_seconds: number
  duration_hours: number
  description: string | null
  status: 'logged' | 'pending_approval' | 'approved' | 'rejected'
  logged_by_user_id: number
  approved_by_user_id: number | null
  approved_at: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
}

export interface TimerResponse {
  timer: Timer | null
  error?: string
}

export interface TimeLogResponse {
  time_log: TimeLog
  message: string
  error?: string
}
