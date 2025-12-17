# Time Management Module

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
│       ├── 08-time-management.md ← YOU ARE HERE
│       └── ... (5 more modules)
├── app/
│   ├── pages/
│   │   └── time-management/
│   │       ├── index.vue (TODO)
│   │       ├── personal.vue (TODO) ← User's requests
│   │       ├── leave.vue (TODO) ← Leave management
│   │       ├── overtime.vue (TODO) ← Overtime tracking
│   │       ├── time-edits.vue (TODO) ← Edit requests
│   │       └── team.vue (TODO) ← Team management (managers)
│   ├── components/
│   │   └── time-management/
│   │       ├── LeaveRequestForm.vue (TODO)
│   │       ├── OvertimeForm.vue (TODO)
│   │       ├── TimeEditForm.vue (TODO)
│   │       ├── LeaveBalance.vue (TODO)
│   │       └── RequestApprovalList.vue (TODO)
│   ├── composables/
│   │   └── time-management/
│   │       ├── useLeaveRequests.ts ← Leave management
│   │       ├── useOvertimeRequests.ts ← Overtime management
│   │       ├── useTimeEditRequests.ts ← Time edits
│   │       └── useLeaveBalance.ts ← Balance tracking
│   ├── types/
│   │   ├── leave-request.ts
│   │   ├── overtime-request.ts
│   │   └── time-edit-request.ts
│   └── assets/css/
│       └── main.css
├── backend/
│   ├── migrations/
│   │   └── 009_create_time_management_tables.sql
│   ├── routes/
│   │   └── time-management/
│   │       ├── leave-requests.ts
│   │       ├── overtime-requests.ts
│   │       ├── time-edit-requests.ts
│   │       └── leave-balance.ts
│   ├── services/
│   │   └── LeaveBalanceCalculator.ts ← Balance calculation
│   └── models/
│       ├── LeaveRequest.ts
│       ├── OvertimeRequest.ts
│       ├── TimeEditRequest.ts
│       ├── LeaveType.ts
│       └── LeaveBalance.ts
└── package.json
```

**Key Files for This Module:**
- **Frontend Pages**: `app/pages/time-management/` for leave, overtime, time edits, and team management
- **Components**: `app/components/time-management/` for request forms and approval lists
- **State Management**: `app/composables/time-management/` for all request types and balance management
- **Type Definitions**: `app/types/leave-request.ts`, `app/types/overtime-request.ts`, `app/types/time-edit-request.ts`
- **Backend**: `backend/routes/time-management/` for all time management APIs
- **Services**: Balance calculation and request processing

---

## 1. Purpose
Manage time-related requests and analytics: edit time log requests, leave/time-off requests, overtime requests. All requests go through approval workflow before being accepted. Separate from global time tracking (which logs actual time), this module handles exceptions and requests.

## 2. Routes / Pages
- `/time-management` - Time management hub
- `/time-management/personal` - User's own time logs (view, manual entry, edit)
- `/time-management/workforce` - Manager view of team time logs
- `/time-management/requests` - View/manage approval requests
- `/time-management/leave` - Leave/time-off management
- `/time-management/overtime` - Overtime management & approval

## 3. Actors & Roles
- **Regular User** - Can submit edit/leave/overtime requests
- **Manager** - Can view team requests, approve/reject
- **HR** - Can manage leave policies, approve/reject requests
- **Owner** - Full override permissions
- **System** - Auto-calculates time summaries, sends notifications

## 4. Database Tables

### `time_requests` (Generic Request Container)
```
id (PK)
company_id (FK)
user_id (FK)
request_type (time_edit | leave_request | overtime)
status (pending | approved | rejected | cancelled)
requested_at
reason (string)
comment (string)
created_at
updated_at
```

### `time_edit_requests`
```
id (PK)
time_request_id (FK)
time_log_id (FK)
old_start_time (time)
new_start_time (time)
old_end_time (time)
new_end_time (time)
old_duration_hours (decimal)
new_duration_hours (decimal)
old_description (string)
new_description (string)
created_at
```

### `leave_requests`
```
id (PK)
time_request_id (FK)
leave_type_id (FK)
start_date (date)
end_date (date)
duration_days (decimal)
description (string)
is_half_day (boolean)
half_day_period (AM | PM) nullable
attachments (JSON) - URLs or file references
created_at
```

### `leave_types`
```
id (PK)
company_id (FK)
name (UNIQUE per company)
slug
description
days_per_year (decimal)
carryover_allowed (boolean)
max_carryover_days (decimal)
requires_attachment (boolean) - e.g., sick leave needs doctor's note
status (active | inactive)
created_at
```

### `leave_balances`
```
id (PK)
company_id (FK)
user_id (FK)
leave_type_id (FK)
balance_year (integer)
total_allotted (decimal)
used (decimal)
pending_approval (decimal)
carryover_from_previous (decimal)
updated_at
UNIQUE(company_id, user_id, leave_type_id, balance_year)
```

### `overtime_requests`
```
id (PK)
time_request_id (FK)
date (date)
start_time (time)
end_time (time)
duration_hours (decimal)
reason (string)
approved_hours (decimal) nullable
created_at
```

### `approval_requests`
```
id (PK)
time_request_id (FK)
company_id (FK)
approver_user_id (FK)
approval_step (integer)
status (pending | approved | rejected)
approved_at (timestamp) nullable
rejected_at (timestamp) nullable
rejection_reason (string) nullable
notes (string)
created_at
updated_at
```

### `time_management_audit_log`
```
id (PK)
company_id (FK)
actor_user_id (FK)
action (string: request_created, request_approved, request_rejected, balance_updated)
request_id (FK)
data (JSON)
created_at
```

## 5. Relationships
- `time_requests.company_id` → `companies.id`
- `time_requests.user_id` → `users.id`
- `time_edit_requests.time_request_id` → `time_requests.id`
- `time_edit_requests.time_log_id` → `time_logs.id`
- `leave_requests.time_request_id` → `time_requests.id`
- `leave_requests.leave_type_id` → `leave_types.id`
- `leave_types.company_id` → `companies.id`
- `leave_balances.company_id` → `companies.id`
- `leave_balances.user_id` → `users.id`
- `leave_balances.leave_type_id` → `leave_types.id`
- `overtime_requests.time_request_id` → `time_requests.id`
- `approval_requests.time_request_id` → `time_requests.id`
- `approval_requests.approver_user_id` → `users.id`

## 6. API Endpoints

### Time Edit Requests (Covered in Time Tracking Module - Reference)
```
PUT /api/time-logs/:id
POST /api/time-logs/:id/approve
POST /api/time-logs/:id/reject
```

### Leave Requests

#### List Leave Types
```
GET /api/leave-types
Headers: Authorization: Bearer {token}
Response: {
  leave_types: [
    {
      id, name, slug, description, days_per_year,
      carryover_allowed, max_carryover_days,
      requires_attachment
    }
  ]
}
```

#### Get Leave Balances
```
GET /api/leave-balances?balance_year=2024
Headers: Authorization: Bearer {token}
Response: {
  balances: [
    {
      leave_type: { id, name },
      total_allotted,
      used,
      pending_approval,
      carryover,
      available_balance
    }
  ]
}
```

#### Get Leave Balance for Type
```
GET /api/leave-balances/:leave_type_id?balance_year=2024
Headers: Authorization: Bearer {token}
Response: {
  leave_type: { id, name },
  total_allotted,
  used,
  pending_approval,
  carryover,
  available_balance
}
```

#### Create Leave Request
```
POST /api/time-requests/leave
Headers: Authorization: Bearer {token}
Body: {
  leave_type_id,
  start_date,
  end_date,
  is_half_day,
  half_day_period (AM | PM if half_day),
  reason,
  attachments: []
}
Response: {
  id,
  request_type: "leave_request",
  status: "pending",
  leave_type: { id, name },
  start_date,
  end_date,
  duration_days,
  created_at
}
```

#### Cancel Leave Request
```
DELETE /api/time-requests/:id
Headers: Authorization: Bearer {token}
Response: {
  message: "Request cancelled"
}
```

#### Get Leave Request History (User's own)
```
GET /api/time-requests/leave/history?year=2024&status=&page=1&limit=20
Headers: Authorization: Bearer {token}
Response: {
  requests: [
    {
      id, leave_type: { id, name }, start_date, end_date,
      duration_days, status, reason, created_at
    }
  ]
}
```

### Overtime Requests

#### Create Overtime Request
```
POST /api/time-requests/overtime
Headers: Authorization: Bearer {token}
Body: {
  date,
  start_time,
  end_time,
  reason,
  description
}
Response: {
  id,
  request_type: "overtime",
  status: "pending",
  date,
  duration_hours,
  reason
}
```

#### List Overtime Requests
```
GET /api/time-requests/overtime?date_from=&date_to=&status=&page=1&limit=20
Headers: Authorization: Bearer {token}
Response: {
  requests: [
    { id, date, duration_hours, reason, status, created_at }
  ]
}
```

### General Time Requests

#### List All Requests (User's own)
```
GET /api/time-requests?type=&status=&page=1&limit=20
Headers: Authorization: Bearer {token}
Response: {
  requests: [
    {
      id, request_type, status, reason, created_at,
      details: { ... }
    }
  ]
}
```

#### List Pending Approvals (Manager/Owner)
```
GET /api/approvals/pending?company_id=&request_type=&page=1&limit=20
Headers: Authorization: Bearer {token}
Response: {
  approvals: [
    {
      id, request_type, request_id, user: { id, name },
      status, reason, created_at, action_required_by
    }
  ]
}
```

#### Approve Request
```
POST /api/time-requests/:id/approve
Headers: Authorization: Bearer {token}
Body: {
  notes: string (optional),
  approved_hours: number (for overtime, to set approved amount)
}
Response: {
  id, status: "approved", approved_at
}
```

#### Reject Request
```
POST /api/time-requests/:id/reject
Headers: Authorization: Bearer {token}
Body: {
  reason: string (required)
}
Response: {
  id, status: "rejected", rejection_reason
}
```

### Leave Type & Balance Management (Owner/HR Only)

#### Create Leave Type
```
POST /api/leave-types
Headers: Authorization: Bearer {token}
Body: {
  name,
  slug,
  description,
  days_per_year,
  carryover_allowed,
  max_carryover_days,
  requires_attachment
}
Response: { id, name, ... }
```

#### Update Leave Balance (Admin Only)
```
PUT /api/leave-balances/:id
Headers: Authorization: Bearer {token}
Body: {
  total_allotted,
  used,
  carryover_from_previous
}
Response: { id, ... }
```

#### Generate Annual Leave Allotment
```
POST /api/leave-balances/generate
Headers: Authorization: Bearer {token}
Body: {
  balance_year: 2024
}
Response: {
  message: "Leave balances generated for 2024",
  count: 45
}
```

## 7. Page Flow (Step-by-Step)

### Leave Request Flow
1. User navigates to `/time-management/leave`
2. Frontend displays:
   - **Leave Balance Summary**: Table of leave types, available balance, used, pending
   - **Request History**: Table of past leave requests
   - **Create Leave Request Button**
3. User clicks "Request Leave"
4. Modal/form opens:
   - Leave Type (required, dropdown)
   - Start Date (required, date picker)
   - End Date (required, date picker)
   - Is Half Day? (checkbox)
   - Half Day Period: AM/PM (if half_day checked)
   - Reason (required, text)
   - Attachments (if leave type requires_attachment)
5. User fills form
6. User sees calculated duration: "X days" updated as dates change
7. User clicks "Submit Request"
8. Frontend validates:
   - Dates valid: start <= end
   - Duration not > available balance
   - Reason not empty
   - Attachments present if required
9. Frontend sends `POST /api/time-requests/leave`
10. Backend validates same as frontend + checks:
    - Leave type active
    - User has available balance (total_allotted - used - pending >= duration)
    - Dates don't overlap with existing approved leave
11. Backend creates time_requests row (type=leave_request, status=pending)
12. Backend creates leave_requests row
13. Backend updates leave_balances.pending_approval += duration
14. Backend logs request creation
15. Backend sends notification to manager: "{User} requested {duration} days leave starting {date}"
16. Frontend shows success: "Leave request submitted for approval"
17. User sees request in pending section: Status "Awaiting Approval"

### Manager Reviews Leave Request
1. Manager receives notification: "Leave approval required from John"
2. Manager navigates to `/time-management/requests`
3. Sees pending requests for team members:
   - User: John Smith
   - Request: 5 days annual leave
   - Dates: Jan 15-19
   - Status: Pending
   - Action Required: Approve/Reject
4. Manager clicks on request to view details:
   - Full reason
   - Any attachments
   - Leave type info
   - Project impact (if available)
5. Manager can:
   - Approve: Click "Approve"
   - Reject: Click "Reject" + enter reason
6. Manager clicks "Approve"
7. Sends `POST /api/time-requests/:id/approve`
8. Backend validates:
   - Manager has approval permission
   - Request status still = pending
   - No conflicts with other approvals
9. Backend updates:
   - time_requests.status = approved
   - leave_balances.pending_approval -= duration
   - leave_balances.used += duration
   - approval_requests.status = approved
10. Backend logs approval with manager_user_id
11. Backend sends notification to user: "Your leave request was approved"
12. Frontend updates request status: "Approved"

### Overtime Request Flow
1. User works late/overtime
2. User navigates to `/time-management/overtime`
3. Sees "Create Overtime Request" form:
   - Date (required, date picker)
   - Start Time (required, time picker)
   - End Time (required, time picker)
   - Reason (required, dropdown: emergency | project_deadline | client_request | other)
   - Description (optional)
4. User fills form
5. Form calculates: "Duration: 3 hours 30 minutes"
6. User clicks "Submit"
7. Frontend validates: times valid, reason selected, duration > 0
8. Frontend sends `POST /api/time-requests/overtime`
9. Backend creates time_requests + overtime_requests rows
10. Backend routes to approval workflow (manager approval)
11. Backend sends notification to manager: "{User} requested overtime approval for {date}"
12. Frontend shows: "Overtime request submitted"
13. User sees request with status "Pending"

### Overtime Approval & Recording
1. Manager receives notification
2. Manager navigates to approvals dashboard
3. Reviews overtime request: User, Date, Hours, Reason
4. Manager approves: `POST /api/time-requests/:id/approve`
5. Backend can optionally set approved_hours < requested_hours (manager can approve partial)
6. Backend logs approval
7. Backend can auto-create time log (or wait for user to log via timer)
8. Notification sent to user: "Overtime approved: 3 hours"

### Role Change Request (if implemented)
1. HR requests role change for user (handled via user management)
2. If approval required, routes through approval engine
3. Same flow as other requests

### Request Timeline View
1. User navigates to `/time-management/requests`
2. Sees all their requests: leave, overtime, edits
3. Displays:
   - Request type (icon)
   - Date/duration
   - Status (pending/approved/rejected)
   - Submission date
   - Approval date (if approved)
4. Can filter by type/status
5. Can search by reason
6. Can cancel pending requests (if not yet approved)

## 8. Business Rules

### Hard Constraints
- **Leave Balance Check**: Cannot request leave if duration > available balance
- **Date Validation**: start_date <= end_date
- **No Overlap**: Cannot have overlapping leave for same user (check approved + pending)
- **Approval Required**: All time requests must be approved before counting
- **Immutable After Approval**: Cannot edit approved requests
- **Annual Reset**: Leave balances reset on company's fiscal year start
- **Carryover Limit**: Carryover days cannot exceed max_carryover_days per leave type
- **Half Day Rules**: Half day = 0.5 days, must specify AM or PM
- **Overtime Limit**: Overtime should not exceed reasonable limits (e.g., max 10 hours/day)

### Soft Constraints
- Leave requests should be submitted 5+ days in advance (policy-dependent)
- Overtime should be exceptional, not regular
- Manager should approve/reject within 24-48 hours
- Balances should be reviewed quarterly
- Year-end carryover should be processed before new year starts

## 9. Edge Cases

### Invalid Scenarios
- Request leave > available balance → Reject: "Insufficient balance (available X days)"
- Request overlapping leave dates → Reject: "Already approved leave for these dates"
- Request leave for past dates → Reject: "Cannot request leave for past dates"
- Manager rejects with no reason → Reject: "Reason required for rejection"
- Request half day without specifying AM/PM → Reject: "Half day period required"
- No attachment when required → Reject: "Attachment required for this leave type"
- Attempt to cancel approved leave → Show: "Cannot cancel approved leave, contact HR"
- Leave balance goes negative after approval → Backend prevents via validation

### Recovery Paths
- Request rejected → User can resubmit with different dates
- Accidentally submitted duplicate → User can cancel one, keep other
- Manager unavailable → Escalate to next approver in chain (defined in approval workflow)
- Leave balance incorrect → HR can adjust manually
- Carryover not processed → HR can manually add to next year's balance

## 10. Security Notes

### Access Control
- User can only view/request own time off
- User can cancel only own pending requests
- Manager can approve/reject for their team only
- Owner/HR can override/manage all requests
- Backend validates company_id + user permissions on every request

### Validation
- Dates validated: format ISO 8601, not future (for leave_end_date > today)
- Duration calculated server-side (don't trust client calculation)
- Leave type verified against company's leave types
- Balance verified: available = allotted - used - pending
- Reason sanitized (no SQL/XSS)
- Attachments scanned for safety/virus (if implemented)

### Audit Logging
- Every leave request created/approved/rejected logged
- Every balance update logged with reason
- Every overtime request logged
- Include user_id, approver_user_id, timestamp, action

### Data Privacy
- Leave balance visible only to user, manager, owner, HR
- Specific leave reasons visible only to authorized approvers
- Attachments encrypted/scanned for security
- Historical requests kept for compliance (1-3 years)

### Compliance
- Follow labor laws: minimum leave entitlements per country
- Track carryover per regulations
- Maintain audit trail for audits
- Generate reports for payroll integration (leave balance vs accruals)
