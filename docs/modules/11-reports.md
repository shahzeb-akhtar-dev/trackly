# Reports Module

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
│       ├── 09-attendance.md
│       ├── 10-payroll.md
│       ├── 11-reports.md          ← YOU ARE HERE
│       └── ... (2 more modules)
├── app/
│   ├── pages/
│   │   └── reports/
│   │       ├── index.vue (TODO) ← Reports hub
│   │       ├── attendance.vue (TODO)
│   │       ├── tasks.vue (TODO)
│   │       ├── payroll.vue (TODO)
│   │       ├── time.vue (TODO)
│   │       ├── custom.vue (TODO)
│   │       └── [id].vue (TODO) ← Report details
│   ├── components/
│   │   └── reports/
│   │       ├── ReportBuilder.vue (TODO)
│   │       ├── ReportTable.vue (TODO)
│   │       ├── ReportChart.vue (TODO)
│   │       ├── ReportFilter.vue (TODO)
│   │       └── ReportExport.vue (TODO)
│   ├── composables/
│   │   └── reports/
│   │       ├── useReports.ts ← Report management
│   │       ├── useReportBuilder.ts ← Custom reports
│   │       ├── useReportExport.ts ← Export functionality
│   │       └── useReportScheduling.ts ← Scheduled reports
│   ├── types/
│   │   ├── report.ts
│   │   ├── report-config.ts
│   │   └── report-filter.ts
│   └── assets/css/
│       └── main.css
├── backend/
│   ├── migrations/
│   │   └── 012_create_report_tables.sql
│   ├── routes/
│   │   └── reports/
│   │       ├── list.ts
│   │       ├── get.ts
│   │       ├── create.ts
│   │       ├── delete.ts
│   │       ├── export.ts
│   │       └── schedule.ts
│   ├── services/
│   │   ├── ReportGenerator.ts ← Report generation
│   │   ├── ReportExporter.ts ← PDF/Excel export
│   │   └── ReportScheduler.ts ← Scheduled reports
│   ├── jobs/
│   │   └── generateScheduledReports.ts
│   └── models/
│       ├── Report.ts
│       ├── ReportConfig.ts
│       ├── ReportRun.ts
│       ├── ReportExport.ts
│       └── ReportSchedule.ts
└── package.json
```

**Key Files for This Module:**
- **Frontend Pages**: `app/pages/reports/` for reports hub, pre-built reports, and custom builder
- **Components**: `app/components/reports/` for report builder, tables, charts, filters, and export
- **State Management**: `app/composables/reports/` for report generation, building, and scheduling
- **Type Definitions**: `app/types/report.ts`, `app/types/report-config.ts`, `app/types/report-filter.ts`
- **Backend**: `backend/routes/reports/` for all report APIs
- **Services**: Report generation, export, and scheduling
- **Jobs**: Background job for generating scheduled reports

---

## 1. Purpose
Generate comprehensive reports for different stakeholder groups: attendance, tasks, payroll, time tracking, and custom reports. All reports role-based visibility. Reports enable data-driven decision making and compliance requirements.

## 2. Routes / Pages
- `/reports` - Reports hub/dashboard
- `/reports/attendance` - Attendance reports
- `/reports/tasks` - Task/project reports
- `/reports/payroll` - Payroll reports
- `/reports/time` - Time tracking reports
- `/reports/custom` - Custom report builder
- `/reports/scheduled` - Scheduled/automated reports

## 3. Actors & Roles
- **Regular User** - Can view own reports only
- **Manager** - Can view team reports (attendance, tasks, time)
- **HR** - Can view attendance, leave, payroll reports
- **Finance** - Can view payroll, time tracking reports
- **Owner** - Full access to all reports
- **System** - Auto-generates scheduled reports

## 4. Database Tables

### `reports` (Saved/Scheduled Reports)
```
id (PK)
company_id (FK)
created_by_user_id (FK)
name (UNIQUE per company)
description
report_type (attendance | tasks | payroll | time | custom | export)
filters (JSON)
grouping (date | user | department | project)
sort_by (string)
visibility (private | department | all)
schedule (null | daily | weekly | monthly)
scheduled_time (time)
last_run_at (timestamp) nullable
next_run_at (timestamp) nullable
recipient_emails (JSON) - Array of email addresses
status (active | inactive)
created_at
updated_at
```

### `report_runs`
```
id (PK)
report_id (FK)
company_id (FK)
generated_at
data_snapshot (JSON) - Cached report data
row_count (integer)
file_url (string) nullable - if exported
recipient_emails (JSON)
sent_at (timestamp) nullable
created_at
```

### `report_exports`
```
id (PK)
company_id (FK)
created_by_user_id (FK)
report_type (string)
export_format (csv | excel | pdf)
filters (JSON)
file_url (string)
file_size (integer)
generated_at
expires_at
created_at
```

## 5. Relationships
- `reports.company_id` → `companies.id`
- `reports.created_by_user_id` → `users.id`
- `report_runs.report_id` → `reports.id`
- `report_runs.company_id` → `companies.id`
- `report_exports.company_id` → `companies.id`
- `report_exports.created_by_user_id` → `users.id`

## 6. API Endpoints

### Attendance Reports

#### Get Attendance Report
```
GET /api/reports/attendance?date_from=&date_to=&user_id=&department_id=&format=json
Headers: Authorization: Bearer {token}
Response: {
  period: "Jan 1-31, 2024",
  employees: [
    {
      user: { id, name, department },
      attendance_percentage,
      present_days,
      absent_days,
      leave_days,
      late_count,
      avg_work_hours,
      trends: { ... }
    }
  ],
  summary: { avg_attendance, total_absences, total_leaves }
}
```

#### Export Attendance Report
```
GET /api/reports/attendance/export?date_from=&date_to=&format=csv
Headers: Authorization: Bearer {token}
Response: File download (CSV/Excel)
```

### Task Reports

#### Get Task Progress Report
```
GET /api/reports/tasks/progress?project_id=&date_from=&date_to=&grouping=date
Headers: Authorization: Bearer {token}
Response: {
  period: "Jan 1-31, 2024",
  total_tasks,
  completed_tasks,
  in_progress_tasks,
  pending_tasks,
  completion_rate,
  by_priority: [ ... ],
  by_project: [ ... ],
  by_assignee: [ ... ],
  by_date: [ ... ]
}
```

#### Get Task Performance Report
```
GET /api/reports/tasks/performance?date_from=&date_to=&user_id=
Headers: Authorization: Bearer {token}
Response: {
  user: { id, name },
  tasks_created,
  tasks_completed,
  avg_completion_time_hours,
  on_time_completion_rate,
  overdue_count,
  performance_score
}
```

#### Get Task Details Report
```
GET /api/reports/tasks/details?project_id=&status=&priority=&date_from=
Headers: Authorization: Bearer {token}
Response: {
  tasks: [
    {
      id, title, project, assigned_to, status, priority,
      estimated_hours, actual_hours, due_date, completion_date,
      priority, reviewer, review_status
    }
  ]
}
```

### Payroll Reports

#### Get Payroll Summary Report
```
GET /api/reports/payroll/summary?date_from=&date_to=
Headers: Authorization: Bearer {token}
Response: {
  period: "Jan 1-31, 2024",
  total_employees_paid,
  total_gross_payroll,
  total_net_payroll,
  total_taxes,
  total_deductions,
  avg_salary,
  by_department: [ ... ]
}
```

#### Get Detailed Payroll Report
```
GET /api/reports/payroll/detailed?date_from=&date_to=&user_id=
Headers: Authorization: Bearer {token}
Response: {
  records: [
    {
      employee: { id, name, emp_id },
      gross_salary,
      earnings_breakdown: [ ... ],
      deductions_breakdown: [ ... ],
      taxes,
      net_salary,
      ytd_gross,
      ytd_taxes
    }
  ]
}
```

#### Get Tax Report
```
GET /api/reports/payroll/taxes?date_from=&date_to=
Headers: Authorization: Bearer {token}
Response: {
  period,
  total_tax_withheld,
  by_type: [
    { name, amount }
  ],
  ytd_taxes,
  tax_filing_ready: boolean,
  filing_deadline: date
}
```

### Time Tracking Reports

#### Get Time Summary Report
```
GET /api/reports/time/summary?date_from=&date_to=&user_id=&department_id=
Headers: Authorization: Bearer {token}
Response: {
  total_hours_logged,
  total_hours_approved,
  total_hours_pending,
  approval_rate,
  overtime_hours,
  by_task: [
    { task: { id, title }, hours, project }
  ],
  by_project: [
    { project: { id, name }, hours }
  ],
  by_user: [
    { user: { id, name }, hours }
  ]
}
```

#### Get Time Audit Report
```
GET /api/reports/time/audit?date_from=&date_to=&status=&user_id=
Headers: Authorization: Bearer {token}
Response: {
  entries: [
    {
      date, user, task, project, hours, status,
      logged_by, approved_by, created_at
    }
  ]
}
```

### Custom Reports

#### List Saved Reports
```
GET /api/reports?page=1&limit=20
Headers: Authorization: Bearer {token}
Response: {
  reports: [
    {
      id, name, report_type, schedule,
      last_run_at, next_run_at (if scheduled), created_at
    }
  ]
}
```

#### Get Report
```
GET /api/reports/:id
Headers: Authorization: Bearer {token}
Response: {
  id, name, description, report_type, filters,
  grouping, sort_by, schedule, recipient_emails,
  last_run_data: { ... }
}
```

#### Create Report
```
POST /api/reports
Headers: Authorization: Bearer {token}
Body: {
  name,
  description,
  report_type,
  filters: { date_from, date_to, user_id, department_id, project_id, status },
  grouping,
  sort_by,
  visibility (private | department | all),
  schedule (null | daily | weekly | monthly),
  recipient_emails: []
}
Response: { id, name, ... }
```

#### Update Report
```
PUT /api/reports/:id
Headers: Authorization: Bearer {token}
Body: { filters, grouping, schedule, recipient_emails, ... }
Response: { id, name, ... }
```

#### Generate Report (On-Demand)
```
POST /api/reports/:id/generate
Headers: Authorization: Bearer {token}
Response: {
  report_run_id,
  status: "generating",
  estimated_completion_time: 30 (seconds)
}
```

#### Export Report
```
GET /api/reports/:id/export?format=csv
Headers: Authorization: Bearer {token}
Response: File download
```

#### Schedule Report
```
POST /api/reports/:id/schedule
Headers: Authorization: Bearer {token}
Body: {
  frequency: (daily | weekly | monthly),
  time: "09:00",
  recipient_emails: ["manager@company.com", "hr@company.com"],
  enabled: true
}
Response: { id, schedule: "weekly", next_run_at }
```

#### Delete Report
```
DELETE /api/reports/:id
Headers: Authorization: Bearer {token}
Response: { message: "Report deleted" }
```

## 7. Page Flow (Step-by-Step)

### Reports Dashboard
1. User navigates to `/reports`
2. Frontend fetches `GET /api/reports` (shows user's saved reports)
3. Displays:
   - Quick Access Cards:
     - Attendance Report (for this month)
     - Task Progress (for this month)
     - My Payslips (for last 3 months)
     - Time Tracking (for this month)
   - Recent Reports (last 5 generated)
   - My Saved Reports (list of user's custom reports)
   - Create New Report button
   - Quick Filters: Period (this month, this quarter, custom)

### Pre-built Reports (Attendance)
1. User clicks "Attendance Report" card
2. Navigates to `/reports/attendance`
3. Frontend shows:
   - Date Range Selector (default: this month)
   - User/Department Selector (if manager/owner)
   - Generate Report button
4. User can adjust filters
5. User clicks "Generate" (or auto-generates on load)
6. Frontend fetches `GET /api/reports/attendance?date_from=&date_to=`
7. Displays report:

   **Header**: Attendance Report, Period: Jan 1-31, 2024

   **Summary Card**: 
   - Average Attendance: 95%
   - Total Present: 180 days
   - Total Absent: 10 days
   - Total Leave: 5 days

   **Detailed Table**:
   - Columns: Employee, Attendance %, Present, Absent, Leave, Late, Avg Hours
   - Rows: All employees (if owner/HR), or team only (if manager)
   - Sort options, export button

8. User can:
   - Export to CSV: `GET /api/reports/attendance/export?format=csv`
   - Export to Excel: `GET /api/reports/attendance/export?format=excel`
   - Download PDF: `GET /api/reports/attendance/export?format=pdf`
   - Print
   - Save as custom report: "Save This Report" → Name + Schedule options

### Task Progress Report
1. User clicks "Task Report"
2. Navigates to `/reports/tasks`
3. Shows:
   - Date Range Selector
   - Project Selector (optional, filter)
   - Status Filter (all, completed, in_progress, pending)
   - Priority Filter
4. Displays report:

   **Summary Cards**:
   - Total Tasks: 50
   - Completed: 35 (70%)
   - In Progress: 10
   - Pending: 5

   **Charts**:
   - Completion Rate Pie Chart (Completed vs Remaining)
   - Tasks by Priority (stacked bar: critical, high, medium, low)
   - Tasks by Project (horizontal bar chart)
   - Completion Trend (line chart over time)

   **Detailed Table**:
   - Task Title, Project, Priority, Status, Assigned To, Due Date, Completion %

5. User can drill-down: Click project → See only that project's tasks
6. Export options available

### Payroll Report (HR/Finance)
1. HR navigates to `/reports` → Clicks "Payroll"
2. Navigates to `/reports/payroll`
3. Shows:
   - Date Range (default: last month)
   - Department Selector (optional)
4. Displays report:

   **Summary**:
   - Payroll Period: Jan 1-31, 2024
   - Employees Paid: 45
   - Total Gross: 450,000
   - Total Net: 380,000
   - Total Taxes: 70,000

   **Department Breakdown**:
   - Engineering: Gross 150,000 | Net 127,000 | Count 15
   - Sales: Gross 120,000 | Net 102,000 | Count 12
   - HR: Gross 80,000 | Net 68,000 | Count 8

   **By Status**:
   - Processed: 45
   - Pending: 0

5. HR can:
   - Export to Excel for accounting
   - View detailed payslip data
   - Tax report (separate)

### Create Custom Report
1. User clicks "Create New Report"
2. Report builder opens (wizard or form):

   **Step 1: Report Type**
   - Choose: Attendance | Tasks | Payroll | Time | Custom
   - Click Next

   **Step 2: Filters**
   - Date Range (from/to)
   - User/Department (if applicable)
   - Status/Priority/Project (if applicable)
   - Click Next

   **Step 3: Display Options**
   - Grouping: By Date | By User | By Department | By Project
   - Sort By: (dropdown)
   - Columns to include (checkboxes)
   - Chart type (if available)
   - Click Next

   **Step 4: Save & Schedule**
   - Report Name
   - Description (optional)
   - Visibility: Private | Department | All
   - Schedule: None | Daily | Weekly | Monthly
   - If scheduled, add recipient emails
   - Click "Create Report"

3. Frontend sends `POST /api/reports` with all configuration
4. Backend creates reports row
5. Backend auto-generates initial report data
6. Frontend shows: "Report created successfully"
7. Displays generated report data
8. User can:
   - Generate again (on-demand)
   - Export
   - Modify filters and re-generate
   - Save as template
   - Schedule for auto-delivery

### Scheduled Report Delivery
1. Report scheduled: "Weekly, Monday 9:00 AM, send to manager@company.com"
2. System runs at scheduled time:
   - Backend job queries all scheduled reports
   - For each report, calls `POST /api/reports/:id/generate`
   - Generates report data
   - Creates report_runs row
   - Exports to PDF/CSV
   - Sends email to recipient_emails with attachment
3. Email contains:
   - Report name, period, summary highlights
   - Link to view full report: `yourdomain.com/reports/:id`
   - Attachment (PDF or CSV)
4. Recipient clicks link to view in portal or downloads attachment

### Drill-Down & Analysis
1. User viewing report sees data in tables/charts
2. User clicks on row/bar in chart
3. Detail panel opens with:
   - Filtered view of that entity
   - Related data (if applicable)
   - Export option for drill-down data
4. Example: Click on "Engineering" in payroll report
   - Shows all 15 engineers in department
   - Their gross, net, taxes individually
   - Can export just engineering payroll

## 8. Business Rules

### Hard Constraints
- **Report Requires Valid Filters**: Date range must be specified, valid format
- **Visibility Enforced**: Private reports visible only to creator
- **Department Reports**: Managers can only see their own department
- **Role-Based**: Users cannot see reports they don't have permission for
- **Scheduled Reports**: Must have valid recipient email addresses
- **Report Data Immutable**: Once generated, historical report data not changed (snapshot)
- **Schedule Frequency Valid**: Must be one of: null, daily, weekly, monthly

### Soft Constraints
- Reports should be generated within 60 seconds
- Scheduled reports should be sent before business hours (configurable)
- Reports older than 1 year should be archived
- Frequently accessed reports should be cached

## 9. Edge Cases

### Invalid Scenarios
- No data for report period → Show: "No data available for this period"
- User lacking permissions → Reject with 403 Forbidden
- Invalid date range (from > to) → Reject: "Invalid date range"
- No recipients for scheduled report → Reject: "At least one recipient required"
- Report generation timeout (> 120 seconds) → Show: "Report generation taking longer, will email when ready"
- File export too large (> 50MB) → Show: "Export too large, try narrower date range"

### Recovery Paths
- Failed scheduled delivery → System retries next day, logs error
- Report error → Show error message, suggest adjusting filters
- User deleted but report scheduled for them → System removes from recipients
- Report data stale → Regenerate on-demand

## 10. Security Notes

### Access Control
- User can only view own reports (unless shared)
- Manager can view department reports only
- Owner/Finance can view all reports
- Backend validates company_id + user permissions
- `visibility` field enforced: private (only creator), department (creator + dept), all (everyone in company)

### Validation
- Date range validated: from <= to, not future
- User/department IDs validated
- Email addresses validated before sending
- Report data sanitized before export
- File size limits enforced

### Audit Logging
- Report generation logged with user, filters, timestamp
- Report exports logged
- Scheduled report delivery logged
- Large/unusual reports flagged

### Data Privacy
- Sensitive fields (salary, employee details) only visible to authorized users
- Reports exported must respect role-based visibility
- Manager cannot export detailed payroll (only summary)
- Regular user cannot access team analytics

### Performance
- Large reports paginated (limit 1000 rows per page)
- Charts cached/pre-calculated
- Scheduled reports generated during off-hours (batch job)
- Old report data archived (> 2 years)
