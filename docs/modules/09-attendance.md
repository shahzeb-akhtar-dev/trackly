# Attendance & Analytics Module

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
│       ├── 07-time-tracking-global.md
│       ├── 08-time-management.md
│       ├── 09-attendance.md      ← YOU ARE HERE
│       └── ... (4 more modules)
├── app/
│   ├── pages/
│   │   ├── analytics/
│   │   │   ├── attendance.vue (TODO)
│   │   │   ├── productivity.vue (TODO)
│   │   │   └── workforce.vue (TODO)
│   │   └── time-management/
│   │       └── team.vue (TODO) ← Includes attendance view
│   ├── components/
│   │   └── analytics/
│   │       ├── AttendanceChart.vue (TODO)
│   │       ├── ProductivityDashboard.vue (TODO)
│   │       ├── AttendanceTable.vue (TODO)
│   │       ├── TeamsMetricsCard.vue (TODO)
│   │       └── AttendanceTrend.vue (TODO)
│   ├── composables/
│   │   └── analytics/
│   │       ├── useAttendance.ts ← Attendance tracking
│   │       ├── useProductivity.ts ← Productivity metrics
│   │       ├── useAnalytics.ts ← General analytics
│   │       └── useMetrics.ts ← Metric calculations
│   ├── types/
│   │   ├── attendance.ts
│   │   ├── productivity.ts
│   │   └── analytics.ts
│   └── assets/css/
│       └── main.css
├── backend/
│   ├── migrations/
│   │   └── 010_create_attendance_tables.sql
│   ├── routes/
│   │   └── analytics/
│   │       ├── attendance.ts
│   │       ├── productivity.ts
│   │       ├── metrics.ts
│   │       └── reports.ts
│   ├── jobs/
│   │   ├── generateAttendanceSummary.ts
│   │   ├── calculateProductivityMetrics.ts
│   │   └── generateAnalyticsSnapshot.ts
│   └── models/
│       ├── AttendanceRecord.ts
│       ├── ProductivityMetric.ts
│       ├── TeamMetric.ts
│       └── DailyAnalyticsSnapshot.ts
└── package.json
```

**Key Files for This Module:**
- **Frontend Pages**: `app/pages/analytics/` for attendance, productivity, and workforce analytics
- **Components**: `app/components/analytics/` for charts, dashboards, and tables
- **State Management**: `app/composables/analytics/` for attendance, productivity, and metrics
- **Type Definitions**: `app/types/attendance.ts`, `app/types/productivity.ts`, `app/types/analytics.ts`
- **Backend**: `backend/routes/analytics/` for all analytics APIs
- **Jobs**: Background jobs for generating attendance summaries and metrics

---

## 1. Purpose
Track user attendance, generate attendance reports, calculate productivity metrics, and provide analytics on tasks, time logs, and workforce utilization. Provides dashboards for managers, HR, and owner with insights into team performance.

## 2. Routes / Pages
- `/attendance` - Attendance tracking dashboard
- `/analytics` - Analytics hub with multiple report types
- `/analytics/tasks` - Task progress analytics
- `/analytics/productivity` - User productivity metrics
- `/analytics/attendance` - Attendance reports
- `/analytics/time` - Time tracking analytics
- `/analytics/team` - Team/department performance

## 3. Actors & Roles
- **Regular User** - Can view own attendance/analytics
- **Manager** - Can view team attendance/analytics
- **HR** - Can view company attendance reports
- **Owner** - Full access to all analytics
- **System** - Auto-calculates metrics daily/hourly

## 4. Database Tables

### `attendance_records`
```
id (PK)
company_id (FK)
user_id (FK)
date (date)
status (present | absent | leave | half_day | late | early_leave)
check_in_time (time) nullable
check_out_time (time) nullable
work_hours (decimal)
is_manual_entry (boolean)
manual_entry_by_user_id (FK) → users.id nullable
notes (string) nullable
created_at
updated_at
UNIQUE(company_id, user_id, date)
```

### `attendance_summary`
```
id (PK)
company_id (FK)
user_id (FK)
period_start (date)
period_end (date)
period_type (daily | weekly | monthly | quarterly | annual)
total_days (integer)
present_days (decimal)
absent_days (decimal)
leave_days (decimal)
half_day_count (decimal)
late_count (integer)
early_leave_count (integer)
total_work_hours (decimal)
average_daily_hours (decimal)
attendance_percentage (decimal)
created_at
updated_at
UNIQUE(company_id, user_id, period_start, period_end, period_type)
```

### `productivity_metrics`
```
id (PK)
company_id (FK)
user_id (FK)
date (date)
period_type (daily | weekly | monthly)
tasks_created (integer)
tasks_completed (integer)
tasks_in_progress (integer)
tasks_pending (integer)
time_hours_logged (decimal)
time_hours_approved (decimal)
avg_task_completion_hours (decimal)
projects_contributed (integer)
created_at
UNIQUE(company_id, user_id, date, period_type)
```

### `team_metrics`
```
id (PK)
company_id (FK)
department_id (FK) nullable
period_start (date)
period_end (date)
period_type (daily | weekly | monthly)
team_size (integer)
avg_attendance_percentage (decimal)
total_time_logged (decimal)
total_tasks_completed (integer)
avg_productivity_score (decimal)
created_at
UNIQUE(company_id, department_id, period_start, period_end, period_type)
```

### `daily_analytics_snapshot`
```
id (PK)
company_id (FK)
date (date)
total_users (integer)
active_users (integer)
users_present (integer)
users_absent (integer)
avg_work_hours (decimal)
total_time_logged_hours (decimal)
total_tasks_completed (integer)
avg_productivity_score (decimal)
created_at
UNIQUE(company_id, date)
```

### `analytics_queries` (Saved Reports)
```
id (PK)
company_id (FK)
created_by_user_id (FK)
name (UNIQUE per company)
description
query_type (attendance | productivity | tasks | time | custom)
filters (JSON)
grouping (date | user | department | project)
created_at
updated_at
```

## 5. Relationships
- `attendance_records.company_id` → `companies.id`
- `attendance_records.user_id` → `users.id`
- `attendance_records.manual_entry_by_user_id` → `users.id` (nullable)
- `attendance_summary.company_id` → `companies.id`
- `attendance_summary.user_id` → `users.id`
- `productivity_metrics.company_id` → `companies.id`
- `productivity_metrics.user_id` → `users.id`
- `team_metrics.company_id` → `companies.id`
- `team_metrics.department_id` → `departments.id` (nullable)
- `daily_analytics_snapshot.company_id` → `companies.id`
- `analytics_queries.company_id` → `companies.id`
- `analytics_queries.created_by_user_id` → `users.id`

## 6. API Endpoints

### Attendance Records

#### Get Attendance Record
```
GET /api/attendance/:date
Headers: Authorization: Bearer {token}
Response: {
  status,
  check_in_time,
  check_out_time,
  work_hours,
  notes
}
```

#### Get Attendance Range
```
GET /api/attendance?date_from=2024-01-01&date_to=2024-01-31&user_id=
Headers: Authorization: Bearer {token}
Response: {
  records: [
    { date, status, check_in_time, check_out_time, work_hours }
  ]
}
```

#### Create/Update Attendance (Manual Entry - Admin Only)
```
POST /api/attendance
Headers: Authorization: Bearer {token}
Body: {
  user_id,
  date,
  status,
  check_in_time,
  check_out_time,
  notes
}
Response: { date, status, work_hours, ... }
```

### Attendance Summary

#### Get Attendance Summary (User's own)
```
GET /api/attendance/summary?period_start=2024-01-01&period_end=2024-01-31&period_type=monthly
Headers: Authorization: Bearer {token}
Response: {
  period_start,
  period_end,
  total_days,
  present_days,
  absent_days,
  leave_days,
  half_day_count,
  late_count,
  early_leave_count,
  total_work_hours,
  average_daily_hours,
  attendance_percentage
}
```

#### Get Team Attendance Summary (Manager Only)
```
GET /api/attendance/summary/team?date_from=&date_to=&department_id=&page=1&limit=20
Headers: Authorization: Bearer {token}
Response: {
  summaries: [
    {
      user: { id, name },
      attendance_percentage,
      present_days,
      absent_days,
      total_work_hours
    }
  ]
}
```

#### Get Attendance Trend
```
GET /api/attendance/trend?user_id=&date_from=&date_to=&period_type=weekly
Headers: Authorization: Bearer {token}
Response: {
  trends: [
    { period: "Week 1", attendance_percentage, work_hours }
  ]
}
```

### Productivity Metrics

#### Get User Productivity
```
GET /api/analytics/productivity/user/:id?date_from=&date_to=&period_type=weekly
Headers: Authorization: Bearer {token}
Response: {
  user: { id, name },
  metrics: [
    {
      period: "Week 1",
      tasks_created,
      tasks_completed,
      time_hours_logged,
      time_hours_approved,
      avg_task_completion_hours,
      productivity_score
    }
  ]
}
```

#### Get Team Productivity
```
GET /api/analytics/productivity/team?department_id=&date_from=&date_to=
Headers: Authorization: Bearer {token}
Response: {
  department: { id, name },
  team_size,
  avg_productivity_score,
  total_tasks_completed,
  total_time_logged,
  user_breakdown: [
    { user: { id, name }, productivity_score }
  ]
}
```

### Task Analytics

#### Get Task Progress
```
GET /api/analytics/tasks/progress?project_id=&date_from=&date_to=
Headers: Authorization: Bearer {token}
Response: {
  total_tasks,
  completed_tasks,
  in_progress_tasks,
  pending_tasks,
  completion_rate,
  avg_completion_time_hours,
  breakdown_by_priority: [ ... ]
}
```

#### Get Task Time Tracking
```
GET /api/analytics/tasks/time?project_id=&date_from=&date_to=
Headers: Authorization: Bearer {token}
Response: {
  tasks: [
    {
      id, title, estimated_hours, actual_hours,
      variance_hours, variance_percentage
    }
  ],
  total_estimated,
  total_actual,
  overall_variance
}
```

### Time Tracking Analytics

#### Get Time Summary
```
GET /api/analytics/time/summary?date_from=&date_to=&user_id=&department_id=
Headers: Authorization: Bearer {token}
Response: {
  total_hours_logged,
  total_hours_approved,
  total_hours_pending,
  approval_rate,
  top_tasks_by_hours: [
    { task: { id, title }, hours }
  ],
  overtime_hours,
  time_by_project: [
    { project: { id, name }, hours }
  ]
}
```

#### Get Time Logs Audit
```
GET /api/analytics/time/audit?date_from=&date_to=&user_id=&status=
Headers: Authorization: Bearer {token}
Response: {
  logs: [
    {
      user, date, hours, task, status,
      approved_by, approved_date
    }
  ]
}
```

### Dashboard Analytics

#### Get Daily Snapshot
```
GET /api/analytics/snapshot?date=2024-01-15
Headers: Authorization: Bearer {token}
Response: {
  total_users,
  active_users,
  users_present,
  users_absent,
  avg_work_hours,
  total_time_logged_hours,
  total_tasks_completed,
  avg_productivity_score
}
```

#### Get Dashboard Metrics
```
GET /api/analytics/dashboard?period=monthly
Headers: Authorization: Bearer {token}
Response: {
  kpis: {
    attendance_rate: 95%,
    productivity_score: 8.2,
    task_completion_rate: 87%,
    time_tracking_compliance: 92%,
    overtime_hours: 15.5
  },
  charts: {
    attendance_trend: [ ... ],
    productivity_trend: [ ... ],
    task_completion_trend: [ ... ]
  }
}
```

### Saved Reports

#### List Saved Reports
```
GET /api/analytics/reports
Headers: Authorization: Bearer {token}
Response: {
  reports: [
    { id, name, query_type, last_generated, created_at }
  ]
}
```

#### Get Report
```
GET /api/analytics/reports/:id
Headers: Authorization: Bearer {token}
Response: {
  id, name, description, query_type, filters,
  data: { ... },
  generated_at
}
```

#### Create Report
```
POST /api/analytics/reports
Headers: Authorization: Bearer {token}
Body: {
  name,
  description,
  query_type,
  filters: { date_from, date_to, user_id, department_id },
  grouping
}
Response: { id, name, ... }
```

#### Export Report (CSV/PDF)
```
GET /api/analytics/reports/:id/export?format=csv
Headers: Authorization: Bearer {token}
Response: File download
```

## 7. Page Flow (Step-by-Step)

### Attendance Dashboard (User View)
1. User navigates to `/attendance`
2. Frontend fetches `GET /api/attendance?date_from=today-30days&date_to=today`
3. Displays personal attendance:
   - Calendar view: Color-coded days (green=present, red=absent, yellow=leave)
   - Summary cards: Attendance %, Present Days, Absent Days, Leave Balance
   - Current month: Detailed table with dates, status, check-in/out times
4. User can click on date to view/edit (if manual entry allowed)
5. Shows trends: Last 30 days attendance trend chart

### Attendance Manager View (Team Monitoring)
1. Manager navigates to `/analytics/attendance`
2. Frontend fetches `GET /api/attendance/summary/team?department_id=5`
3. Displays team attendance table:
   - Columns: Employee, Attendance %, Present Days, Absent Days, Late Count
   - Rows: All team members
   - Sort/filter options
4. Manager can:
   - Click employee → View their detailed attendance
   - Export report: "Export to CSV"
5. Shows summary card: "Team Avg Attendance: 94%"
6. Manager can add manual attendance for team member:
   - Click "Add Attendance"
   - Select employee, date, status
   - Fill check-in/out times
   - Save

### Productivity Dashboard
1. User navigates to `/analytics/productivity`
2. Frontend fetches `GET /api/analytics/productivity/user/:id`
3. Displays personal productivity:
   - Weekly/Monthly view selector
   - Cards: Tasks Completed, Time Logged, Avg Task Hours, Productivity Score
   - Trend chart: Tasks completed over time
   - Time breakdown: By project/task
4. If manager:
   - Can view team productivity
   - Fetches `GET /api/analytics/productivity/team`
   - Displays team members with scores
   - Can drill-down to individual

### Task Analytics
1. User navigates to `/analytics/tasks`
2. Frontend fetches task progress metrics
3. Displays:
   - Progress cards: Total, Completed, In Progress, Pending
   - Completion rate chart
   - Time vs Estimated: Bar chart comparing planned vs actual
   - Project breakdown: Tasks/completion by project
4. Can filter by project, date range
5. Can download report

### Time Tracking Analytics
1. User navigates to `/time-management` → `View Analytics`
2. Fetches `GET /api/analytics/time/summary`
3. Displays:
   - Total hours logged this month
   - Approved vs Pending breakdown
   - Top tasks by time spent
   - Overtime hours (if any)
   - Time by project/task
4. Manager view shows team summary + individual breakdown

### Main Analytics Dashboard
1. User navigates to `/analytics`
2. Frontend fetches `GET /api/analytics/dashboard?period=monthly`
3. Displays comprehensive dashboard:

   **KPI Cards** (top row):
   - Attendance Rate: 95%
   - Productivity Score: 8.2/10
   - Task Completion: 87%
   - Time Tracking Compliance: 92%
   - Overtime Hours: 15.5

   **Charts** (grid):
   - Attendance Trend (line chart, last 30 days)
   - Productivity Trend (bar chart, by week)
   - Task Completion Rate (pie chart, by priority)
   - Time Tracking by Project (stacked bar)
   - Top Performers (leaderboard)

   **Filters** (top):
   - Date Range (from/to)
   - Department (dropdown)
   - User (if manager)
   - Period (daily/weekly/monthly)

4. User can interact:
   - Hover chart for details
   - Click legend items to filter
   - Click "Drill Down" to see details
5. User can save dashboard: Click "Save Report"
   - Name: "Monthly Performance Report"
   - Saves filters + layout

### Report Generation
1. User navigates to `/analytics/reports` or creates new
2. Clicks "Create Report"
3. Report builder opens:
   - Query Type: Attendance | Productivity | Tasks | Time | Custom
   - Filters: Date range, users, departments, projects
   - Grouping: By date | By user | By department
   - Metrics: Select which columns to include
4. User configures report
5. Clicks "Generate"
6. Frontend sends `POST /api/analytics/reports` with config
7. Backend calculates metrics
8. Report displays in table + chart views
9. User can:
   - Export to CSV/PDF: `GET /api/analytics/reports/:id/export?format=csv`
   - Save report: `POST /api/analytics/reports` → saves for future use
   - Schedule report (email weekly)
10. Saved report appears in "My Reports" list

## 8. Business Rules

### Hard Constraints
- **Unique Attendance Per Date**: Only one attendance record per user per day
- **Status Valid**: Must be one of: present | absent | leave | half_day | late | early_leave
- **Work Hours Positive**: work_hours >= 0
- **Metrics Read-Only**: Productivity/attendance metrics auto-calculated, not manually set
- **No Future Dates**: Cannot create attendance for future dates (except manual entry by HR)
- **Period Consistency**: Summary periods must be consistent (no overlapping summaries)

### Soft Constraints
- Attendance should be recorded daily (best practice)
- Managers should review team attendance weekly
- Metrics should be reviewed monthly
- Reports should be generated regularly (weekly/monthly)
- Outliers/anomalies should be investigated

## 9. Edge Cases

### Invalid Scenarios
- Check-out time before check-in time → Reject: "Invalid time range"
- Attendance record for future date (non-admin) → Reject: "Cannot record future attendance"
- Multiple attendance records same date → Reject: "Already recorded for this date"
- Metrics calculation delayed → Show cached metrics with "last updated" timestamp
- User absent entire month → Highlight in reports as anomaly
- No time logs for period → Metrics still calculated, show 0 values

### Recovery Paths
- Attendance recorded wrong → HR can update via manual entry
- Missing attendance records → HR can bulk import from external system
- Incorrect metrics → Recalculate on demand
- Report generation slow → Show loading indicator, use pagination for large datasets

## 10. Security Notes

### Access Control
- User can view own attendance/analytics only
- Manager can view team (department) analytics only
- Owner/HR can view all company analytics
- Backend filters by company_id + user permissions

### Validation
- Dates validated: not future, valid format
- Work hours: validated as decimal, >= 0
- Status validated against enum
- Time calculations done server-side

### Audit Logging
- Manual attendance entries logged with admin user_id
- Report generation logged with user, date, parameters
- Analytics queries logged for audit trail
- Retention: Keep for 1+ years

### Data Privacy
- Attendance visible only to authorized users
- Personal productivity metrics private (only to self + manager + owner)
- Team metrics aggregated (no individual detail leakage)
- Salary/sensitive data not in analytics by default

### Performance
- Pre-calculate daily/weekly/monthly summaries (batch job at off-hours)
- Cache analytics results (refresh every 6 hours)
- Use pagination for large datasets
- Optimize queries with proper indexing on date, user_id
