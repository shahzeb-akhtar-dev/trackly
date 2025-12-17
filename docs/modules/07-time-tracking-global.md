# Global Time Tracking Module

## 📁 Project Structure Overview

This module relates to the following project structure:

```
trackly/
├── docs/
│   └── modules/
│       ├── 00-authentication.md
│       ├── 01-tenant.md
│       ├── 02-company.md
│       ├── 03-settings.md
│       ├── 04-users.md
│       ├── 05-roles-permissions.md
│       ├── 06-task-management.md
│       ├── 07-time-tracking-global.md ← YOU ARE HERE
│       └── ... (6 more modules)
├── app/
│   ├── pages/
│   │   ├── index.vue              ← Timer visible in Header
│   │   └── time-tracking/
│   │       ├── index.vue (TODO) ← Time log history
│   │       └── [id].vue (TODO) ← Time log detail
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.vue         ← Timer widget
│   │   └── time-tracking/
│   │       ├── TimerWidget.vue (TODO)
│   │       ├── TimeLogTable.vue (TODO)
│   │       └── TaskSelector.vue (TODO)
│   ├── composables/
│   │   └── time-tracking/
│   │       ├── useTimer.ts        ← Active timer logic
│   │       ├── useTimeLogs.ts     ← Time log management
│   │       └── useTimeTracking.ts ← General tracking
│   ├── types/
│   │   ├── timer.ts
│   │   └── time-log.ts
│   └── assets/css/
│       └── main.css
├── backend/
│   ├── migrations/
│   │   └── 008_create_time_tracking_tables.sql
│   ├── routes/
│   │   └── time-tracking/
│   │       ├── start-timer.ts
│   │       ├── stop-timer.ts
│   │       ├── get-active-timer.ts
│   │       ├── time-logs.ts
│   │       └── pause-timer.ts
│   ├── jobs/
│   │   └── autoSaveTimerJob.ts    ← Periodic time log saves
│   └── models/
│       ├── Timer.ts
│       ├── TimeLog.ts
│       └── TaskTimeLog.ts
└── package.json
```

**Key Files for This Module:**
- **Frontend Pages**: `app/pages/time-tracking/` for time log history and details
- **Components**: Timer widget in `app/components/layout/Header.vue`, time tracking components
- **State Management**: `app/composables/time-tracking/` for timer logic and time log management
- **Type Definitions**: `app/types/timer.ts`, `app/types/time-log.ts`
- **Backend**: `backend/routes/time-tracking/` for timer and time log APIs
- **Jobs**: Background jobs for auto-saving timer data

---

## 1. Purpose
System-level timer for tracking work on tasks in real-time. Always visible in header/navbar. One active timer per user at any time. Core module that generates time logs linked to tasks, projects, and users. Immutable time logs with approval-required edits.

## 2. Routes / Pages
- **No dedicated page** - Timer UI in global header/navbar
- Visible on every page: `/`, `/task-management/*`, `/time-management/*`, etc.
- Time logs list accessible via: `/time-management/personal` (user's own logs)

## 3. Actors & Roles
- **All Active Users** - Can start/stop timer on assigned tasks
- **Manager/HR** - Can view employee time logs, approve edits
- **Owner** - Full access to all time tracking, approvals
- **System** - Auto-generates time logs, triggers notifications

## 4. Database Tables

### `timers` (Real-time Active Sessions)
```
id (PK)
user_id (FK)
company_id (FK)
task_id (FK)
project_id (FK)
started_at (timestamp)
paused_at (timestamp nullable)
paused_duration_seconds (accumulated pause time)
is_running (boolean)
notes (string)
created_at
updated_at
```

### `time_logs`
```
id (PK)
company_id (FK)
task_id (FK)
project_id (FK)
user_id (FK)
date_logged (date)
start_time (time)
end_time (time)
duration_seconds
duration_hours (decimal)
description
status (logged | pending_approval | approved | rejected)
logged_by_user_id (FK) → users.id
approved_by_user_id (FK) → users.id nullable
approved_at (timestamp) nullable
rejection_reason (string) nullable
created_at
updated_at
```

### `time_tracking_settings`
```
id (PK)
company_id (FK)
key (string)
value (JSON)
created_at
updated_at
UNIQUE(company_id, key)
```

### `time_tracking_audit_log`
```
id (PK)
company_id (FK)
timer_id (FK) nullable
time_log_id (FK) nullable
user_id (FK)
action (string: timer_start, timer_stop, timer_pause, timer_resume, time_log_created, time_log_approved, time_log_rejected)
data (JSON)
created_at
```

## 5. Relationships
- `timers.user_id` → `users.id`
- `timers.company_id` → `companies.id`
- `timers.task_id` → `tasks.id`
- `timers.project_id` → `projects.id`
- `time_logs.company_id` → `companies.id`
- `time_logs.task_id` → `tasks.id`
- `time_logs.project_id` → `projects.id`
- `time_logs.user_id` → `users.id`
- `time_logs.logged_by_user_id` → `users.id`
- `time_logs.approved_by_user_id` → `users.id` (nullable)
- `time_tracking_settings.company_id` → `companies.id`

## 6. API Endpoints

### Timer Management

#### Get Active Timer
```
GET /api/timers/active
Headers: Authorization: Bearer {token}
Response: {
  timer: {
    id,
    task: { id, title },
    project: { id, name },
    started_at,
    elapsed_seconds,
    is_running,
    is_paused,
    paused_duration_seconds
  }
  OR
  null (no active timer)
}
```

#### Start Timer
```
POST /api/timers/start
Headers: Authorization: Bearer {token}
Body: {
  task_id,
  notes: string (optional)
}
Response: {
  timer: {
    id,
    task: { id, title },
    project: { id, name },
    started_at,
    is_running: true
  },
  message: "Timer started"
}
```

#### Pause Timer
```
PATCH /api/timers/active/pause
Headers: Authorization: Bearer {token}
Response: {
  timer: {
    id,
    is_running: false,
    is_paused: true,
    paused_duration_seconds
  }
}
```

#### Resume Timer
```
PATCH /api/timers/active/resume
Headers: Authorization: Bearer {token}
Response: {
  timer: {
    id,
    is_running: true,
    is_paused: false
  }
}
```

#### Stop Timer (Save as Time Log)
```
POST /api/timers/active/stop
Headers: Authorization: Bearer {token}
Body: {
  description: string (optional),
  task_id: number (confirm/override)
}
Response: {
  time_log: {
    id,
    task: { id, title },
    duration_hours,
    date_logged,
    status,
    created_at
  },
  message: "Time logged successfully"
}
```

#### Discard Timer (Cancel without saving)
```
DELETE /api/timers/active
Headers: Authorization: Bearer {token}
Response: {
  message: "Timer discarded"
}
```

#### Get Timer History (User's own)
```
GET /api/timers/history?date=2024-01-15&page=1&limit=20
Headers: Authorization: Bearer {token}
Response: {
  timers: [
    { id, task, duration_seconds, date, started_at, stopped_at }
  ]
}
```

### Time Logs

#### Get User's Time Logs
```
GET /api/time-logs/me?date_from=&date_to=&status=&page=1&limit=50
Headers: Authorization: Bearer {token}
Response: {
  logs: [
    {
      id, task: { id, title }, project: { id, name },
      date_logged, start_time, end_time, duration_hours,
      description, status
    }
  ],
  total_hours_logged,
  approved_hours,
  pending_approval_hours
}
```

#### Get Employee Time Logs (Manager/Owner)
```
GET /api/time-logs/user/:id?date_from=&date_to=&status=&page=1&limit=50
Headers: Authorization: Bearer {token}
Response: {
  logs: [
    { id, task, project, date_logged, duration_hours, status, logged_by }
  ],
  user: { id, name },
  total_hours_logged,
  summary: { approved_hours, pending_hours, rejected_hours }
}
```

#### Get Company Time Logs (Owner/HR)
```
GET /api/time-logs/company?date_from=&date_to=&user_id=&status=&page=1&limit=50
Headers: Authorization: Bearer {token}
Response: {
  logs: [
    { id, user: { id, name }, task, date_logged, duration_hours, status }
  ],
  total_logs,
  summary: { total_hours, approved_hours, pending_hours, rejected_hours }
}
```

#### Create Manual Time Log
```
POST /api/time-logs
Headers: Authorization: Bearer {token}
Body: {
  task_id,
  date_logged,
  start_time,
  end_time (OR duration_hours),
  description
}
Response: {
  id, task, duration_hours, status, created_at
}
```

#### Edit Time Log (Creates Approval Request)
```
PUT /api/time-logs/:id
Headers: Authorization: Bearer {token}
Body: {
  start_time,
  end_time,
  duration_hours,
  description,
  reason_for_edit: string
}
Response: {
  message: "Edit submitted for approval",
  approval_request: { id, status }
}
```

#### Delete Time Log (Soft Delete)
```
DELETE /api/time-logs/:id
Headers: Authorization: Bearer {token}
Response: {
  message: "Time log deleted"
}
```

#### Approve Time Log Edit
```
POST /api/time-logs/:id/approve
Headers: Authorization: Bearer {token}
Body: {
  notes: string (optional)
}
Response: {
  id, status: "approved", approved_at, approved_by
}
```

#### Reject Time Log Edit
```
POST /api/time-logs/:id/reject
Headers: Authorization: Bearer {token}
Body: {
  reason: string
}
Response: {
  id, status: "rejected", rejection_reason
}
```

### Time Tracking Settings

#### Get Time Tracking Settings
```
GET /api/time-tracking/settings
Headers: Authorization: Bearer {token}
Response: {
  settings: {
    task_selection_required: boolean,
    timer_auto_stop_inactive_minutes: number,
    minimum_log_duration_minutes: number,
    auto_round_time: boolean,
    round_to_nearest_minutes: number,
    allow_negative_time: boolean,
    require_time_approval: boolean,
    work_day_start_time: "HH:MM",
    work_day_end_time: "HH:MM"
  }
}
```

#### Update Time Tracking Settings (Owner Only)
```
PUT /api/time-tracking/settings
Headers: Authorization: Bearer {token}
Body: {
  task_selection_required: boolean,
  timer_auto_stop_inactive_minutes: number,
  minimum_log_duration_minutes: number,
  auto_round_time: boolean,
  require_time_approval: boolean,
  work_day_start_time: "HH:MM"
}
Response: { settings: { ... } }
```

#### Get Time Tracking Stats (Dashboard)
```
GET /api/time-tracking/stats?date_from=&date_to=&user_id=
Headers: Authorization: Bearer {token}
Response: {
  total_hours_logged,
  total_hours_approved,
  total_hours_pending,
  average_daily_hours,
  task_hours_breakdown: [
    { task_id, task_title, hours }
  ],
  employee_summary: [
    { user_id, user_name, total_hours, approved_hours, pending_hours }
  ]
}
```

## 7. Page Flow (Step-by-Step)

### Start Timer Flow (Header/Navbar)
1. User is anywhere in the app (header always visible)
2. User sees timer widget: "Start Timer" button
3. User clicks "Start Timer"
4. Modal opens:
   - Dropdown of pending assigned tasks (only)
   - "Select a task to begin tracking"
5. User selects task from dropdown
6. Modal shows: "Ready to start tracking: {task_title}"
7. User clicks "Start" button
8. Frontend sends `POST /api/timers/start` with task_id
9. Backend validates:
   - User has no active timer (only one per user)
   - Task assigned to user with status = pending or in_progress
10. Backend creates timers row with started_at = now()
11. Backend logs: timer_start action
12. Frontend updates header timer widget to show:
    - Red stop button
    - Timer display: "00:05:23" (elapsed time)
    - Pause button
    - Task title: "{task_title}"
    - Auto-refresh every second

### Active Timer Display (Header)
1. User has active timer running
2. Header shows live timer widget:
   - Task icon + title: "[TASK] Project Name > Task Title"
   - Timer display with running seconds: "00:15:42"
   - Buttons: Pause (||), Stop (■), Discard (X)
3. Timer updates every second (client-side calculated from started_at)
4. User can:
   - Click Pause → Timer pauses
   - Click Stop → Save time log
   - Click Discard → Cancel timer

### Pause/Resume Timer
1. User clicks Pause button in header
2. Frontend sends `PATCH /api/timers/active/pause`
3. Backend updates: is_running = false, is_paused = true
4. Frontend shows: Pause icon changes to Resume icon (>)
5. User can click Resume to continue
6. Frontend sends `PATCH /api/timers/active/resume`
7. Backend updates: is_running = true, is_paused = false
8. Timer continues counting

### Stop Timer & Create Time Log
1. User clicks Stop button in header
2. Modal appears: "Stop Timer?"
3. Pre-fills:
   - Task: {selected task}
   - Duration: "00:15:42"
   - Date: Today
   - Description: (optional, user-entered)
4. User can:
   - Edit description
   - Confirm stop
5. User clicks "Save" button
6. Frontend validates: duration > 0, task_id set
7. Frontend sends `POST /api/timers/active/stop` with description
8. Backend validates:
   - Timer exists and is running
   - Task exists and is assigned to user
   - Duration > minimum_log_duration_minutes
9. Backend creates time_logs row:
   - duration_seconds = (now - started_at - paused_duration)
   - duration_hours = duration_seconds / 3600
   - date_logged = today
   - status = logged (or pending_approval if require_time_approval = true)
10. Backend deletes timers row (or marks as completed)
11. Backend logs: time_log_created action
12. Frontend shows success: "Time logged: 15 hours 42 minutes"
13. Frontend resets header timer to "Start Timer" state

### Manual Time Log Entry
1. User navigates to `/time-management/personal`
2. Clicks "Add Manual Time Log" button
3. Form opens:
   - Task (required, dropdown of assigned tasks)
   - Date (required, date picker)
   - Start Time (required, time picker)
   - End Time (required, time picker) OR Duration (hours)
   - Description (optional)
4. User fills form
5. User clicks "Save"
6. Frontend validates: task selected, date valid, times valid
7. Frontend calculates duration = end_time - start_time
8. Frontend sends `POST /api/time-logs` with all data
9. Backend validates same as timer
10. Backend creates time_logs row
11. Frontend adds to list
12. Shows: "Manual time log added"

### Edit Time Log (Approval Flow)
1. User views time log in `/time-management/personal`
2. Clicks "Edit" icon on time log
3. Edit form opens (pre-filled with current data)
4. User changes: start_time, end_time, duration, description
5. User adds reason: "Logged incorrect time earlier, correcting now"
6. User clicks "Submit for Review"
7. Frontend sends `PUT /api/time-logs/:id` with updated data + reason
8. Backend validates same as create
9. Backend creates approval request (via approval engine)
10. Backend logs: time_log_edit_requested action
11. Backend sends notification to manager: "Time edit request from {user}: {task_title}"
12. Frontend shows: "Edit submitted for approval, awaiting review"
13. User sees time log marked as "Pending Approval"

### Manager Reviews Time Log Edit
1. Manager receives notification: "Time edit request from John for Task X"
2. Manager navigates to time log (via email link or approval dashboard)
3. Sees side-by-side comparison:
   - Original: Start 9:00, End 12:00, Duration 3 hours
   - Requested: Start 9:30, End 12:15, Duration 2.75 hours
   - Reason: "Logged incorrect time earlier, correcting now"
4. Manager can:
   - Approve: Click "Approve" → time log updated, user notified
   - Reject: Click "Reject" + reason → time log reverted, user notified
5. Frontend sends `POST /api/time-logs/:id/approve` OR `POST /api/time-logs/:id/reject`
6. Backend updates time_logs.status = approved/rejected
7. Backend logs approval action with approver_user_id
8. User receives notification: "Your time edit was approved" OR "Your time edit was rejected: {reason}"

### View Personal Time Logs
1. User navigates to `/time-management/personal`
2. Frontend fetches `GET /api/time-logs/me?date_from=today-30days&date_to=today`
3. Displays table:
   - Columns: Date, Task, Start Time, End Time, Duration (hours), Status, Actions
   - Rows: All user's time logs for selected date range
4. Features:
   - Filter by date range: date picker inputs
   - Filter by status: Approved, Pending, Rejected
   - Sort by date/duration/status
   - Show summary at bottom: Total Hours = X, Approved = Y, Pending = Z
5. Actions per row: View, Edit (if not approved), Delete (if not approved)

### Manager Reviews Employee Time Logs
1. Manager navigates to `/time-management/workforce` or employee detail
2. Clicks on employee name
3. Frontend fetches `GET /api/time-logs/user/:id?date_from=&date_to=`
4. Displays employee's time logs (same as user view, but manager-only)
5. Manager can:
   - View audit trail of edits
   - Approve/reject pending edits
   - See total hours summary
   - Export report

## 8. Business Rules

### Hard Constraints
- **One Active Timer Per User**: User cannot have 2+ timers running simultaneously
- **Task Selection Mandatory**: Timer requires assigned task, no "general" tracking
- **Only Pending Tasks Trackable**: Cannot log time on completed/cancelled tasks
- **Time Logs Immutable**: Once created, time_logs cannot be directly edited (must go through approval)
- **Minimum Duration**: Time log duration must be > minimum_log_duration_minutes (e.g., > 5 minutes)
- **Date Lockdown**: Cannot log time for dates older than 30 days (configurable)
- **Approval Required**: If require_time_approval = true, all time logs need approval before counting
- **Status Consistency**: timer.is_running and is_paused cannot both be true

### Soft Constraints
- Users should log time daily (best practice for accuracy)
- Managers should approve/reject pending edits within 48 hours
- Descriptions help with auditing and understanding work context
- Pause should not exceed 30 minutes without explicit reason
- Time should be logged same day (not backdated multiple days later)

## 9. Edge Cases

### Invalid Scenarios
- Attempt to start timer with no assigned tasks → Show: "No pending tasks assigned"
- Attempt to start timer while one active → Reject: "Stop active timer first"
- Attempt to log time < minimum duration → Reject: "Duration too short (minimum 5 minutes)"
- Attempt to log time for completed task → Reject: "Cannot log time on completed task"
- Attempt to log time > 24 hours → Reject: "Duration exceeds 24 hours" OR allow with warning
- Attempt to log time for date > 30 days old → Reject: "Cannot log time for dates older than 30 days"
- Attempt to edit approved time log → Reject: "Cannot edit approved time log"
- Timer running for > 8 hours → Auto-pause? OR warn user?
- Browser closes while timer active → Timer persists in backend, user can resume

### Recovery Paths
- User forgets to stop timer → Timer auto-stops if inactivity > configurable minutes
- User loses time entry → Logs retained in database, can manually recreate
- Manager rejects edit → User can resubmit with corrected info
- Incorrect duration logged → User can edit and resubmit for approval
- Time not saved before logout → Timer persists in backend, user can login and resume/stop

## 10. Security Notes

### Access Control
- User can only view/edit own time logs (unless manager/owner)
- Manager can view/approve/reject reports for their department
- Owner can view all time logs company-wide
- Backend filters time_logs by company_id + user permissions

### Validation
- Duration_seconds calculated server-side (don't trust client)
- Start/end times validated: start_time <= end_time
- Duration >= minimum configured minutes
- Task_id validated: belongs to user + is in pending/in_progress status
- Date_logged: not future date, not older than 30+ days

### Audit Logging
- Every timer start/stop/pause/resume logged with timestamp
- Every time log creation/approval/rejection logged
- Every edit submitted for approval logged
- Include user_id, IP, user_agent, elapsed_time

### Data Privacy
- Time logs not visible to other users (company isolation)
- Manager can see reports but not detailed descriptions if sensitive
- Owner can access all for auditing/payroll purposes

### Integrity
- Timer duration calculated from started_at/paused_duration (server-side)
- Time logs immutable after creation (only editable via approval flow)
- Approved time logs have approved_by_user_id + approved_at (audit trail)
- Rejected edits preserved in history for analysis
