# Approval Engine Module

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
│       ├── 11-reports.md
│       ├── 12-chat.md
│       └── 13-approval-engine.md ← YOU ARE HERE
├── app/
│   ├── pages/
│   │   ├── approvals/
│   │   │   ├── index.vue (TODO) ← Approval dashboard
│   │   │   ├── pending.vue (TODO) ← Pending approvals
│   │   │   └── [id].vue (TODO) ← Approval detail
│   │   └── settings/
│   │       └── approval-workflows.vue (TODO) ← Config
│   ├── components/
│   │   └── approvals/
│   │       ├── ApprovalList.vue (TODO)
│   │       ├── ApprovalCard.vue (TODO)
│   │       ├── ApprovalDecisionForm.vue (TODO)
│   │       ├── WorkflowBuilder.vue (TODO)
│   │       └── EscalationConfig.vue (TODO)
│   ├── composables/
│   │   └── approvals/
│   │       ├── useApprovals.ts ← Approval management
│   │       ├── useApprovalWorkflow.ts ← Workflow config
│   │       ├── useApprovalDecision.ts ← Decision logic
│   │       └── useApprovalNotifications.ts ← Notifications
│   ├── types/
│   │   ├── approval-request.ts
│   │   ├── approval-workflow.ts
│   │   └── approval-decision.ts
│   └── assets/css/
│       └── main.css
├── backend/
│   ├── migrations/
│   │   └── 014_create_approval_tables.sql
│   ├── routes/
│   │   └── approvals/
│   │       ├── requests.ts
│   │       ├── workflows.ts
│   │       ├── decisions.ts
│   │       └── escalations.ts
│   ├── services/
│   │   ├── ApprovalEngine.ts ← Core approval logic
│   │   ├── ApprovalEscalator.ts ← Escalation logic
│   │   └── ApprovalNotifier.ts ← Notifications
│   ├── jobs/
│   │   ├── processApprovalEscalations.ts
│   │   └── autoResolveExpiredApprovals.ts
│   └── models/
│       ├── ApprovalWorkflow.ts
│       ├── ApprovalStep.ts
│       ├── ApprovalRequest.ts
│       ├── ApprovalDecision.ts
│       └── ApprovalEscalation.ts
└── package.json
```

**Key Files for This Module:**
- **Frontend Pages**: `app/pages/approvals/` for approval dashboard, pending list, and details
- **Pages**: `app/pages/settings/approval-workflows.vue` for workflow configuration
- **Components**: `app/components/approvals/` for lists, cards, decision forms, and workflow builder
- **State Management**: `app/composables/approvals/` for approval operations, workflows, and decisions
- **Type Definitions**: `app/types/approval-request.ts`, `app/types/approval-workflow.ts`, `app/types/approval-decision.ts`
- **Backend**: `backend/routes/approvals/` for all approval APIs
- **Services**: ApprovalEngine (core logic), ApprovalEscalator, ApprovalNotifier
- **Jobs**: Background jobs for escalations and expiration handling

---

## 1. Purpose
Centralized system for managing all approval workflows in the system. Used by time edit requests, leave requests, overtime, role changes, and other business processes requiring multi-level sign-off. Configurable by company with defined approval steps, roles, and escalation rules.

## 2. Routes / Pages
- `/approvals` - Approval dashboard (pending approvals)
- `/approvals/pending` - User's pending approvals to review
- `/approvals/history` - Past approvals, audit trail
- `/approvals/workflows` - Configured approval workflows (admin view)

## 3. Actors & Roles
- **All Users** - Can submit requests requiring approval
- **Manager** - Can approve/reject direct team requests
- **HR/Approver** - Can approve based on workflow definition
- **Owner** - Can override/approve any request
- **System** - Auto-escalates, sends notifications

## 4. Database Tables

### `approval_workflows` (Already in settings, repeated for clarity)
```
id (PK)
company_id (FK)
name (UNIQUE per company)
description
request_type (time_edit | leave_request | overtime | role_change | other)
status (active | inactive)
trigger_condition (JSON) - Optional conditions
auto_approve (boolean) - Auto-approve if conditions met
auto_approve_after_days (integer) - Auto-approve if pending after X days
created_at
updated_at
```

### `approval_steps`
```
id (PK)
workflow_id (FK)
step_order (integer)
approver_type (role | specific_user | manager_of_requester)
approver_role_id (FK) nullable - if role-based
approver_user_id (FK) nullable - if specific user
approval_type (single | all) - Single: any one approver can approve, All: all must approve
auto_escalate (boolean)
escalate_after_days (integer)
escalate_to_user_id (FK) nullable
escalate_to_role_id (FK) nullable
can_override (boolean) - Can step-down level for lower-level approval
allow_skip (boolean)
notes_required (boolean)
created_at
```

### `approval_requests`
```
id (PK)
company_id (FK)
request_id (UUID) - Foreign ID pointing to actual request (time_requests, etc.)
request_type (string)
requester_user_id (FK)
status (pending | approved | rejected | cancelled | escalated)
workflow_id (FK)
current_step (integer)
total_steps (integer)
submitted_at
completed_at (nullable)
completed_by_user_id (FK) nullable
created_at
updated_at
```

### `approval_decisions`
```
id (PK)
approval_request_id (FK)
step_order (integer)
approver_user_id (FK)
decision (approved | rejected | skip)
notes (string) nullable
decided_at (timestamp)
created_at
```

### `approval_escalations`
```
id (PK)
approval_request_id (FK)
escalated_from_step (integer)
escalated_to_step (integer)
escalated_by_user_id (FK)
reason (string)
escalated_at
created_at
```

### `approval_notifications`
```
id (PK)
approval_request_id (FK)
approver_user_id (FK)
notification_type (pending | reminder | escalated | decided)
sent_at (timestamp)
read_at (timestamp) nullable
created_at
```

## 5. Relationships
- `approval_workflows.company_id` → `companies.id`
- `approval_steps.workflow_id` → `approval_workflows.id`
- `approval_steps.approver_role_id` → `roles.id` (nullable)
- `approval_steps.approver_user_id` → `users.id` (nullable)
- `approval_steps.escalate_to_user_id` → `users.id` (nullable)
- `approval_steps.escalate_to_role_id` → `roles.id` (nullable)
- `approval_requests.company_id` → `companies.id`
- `approval_requests.requester_user_id` → `users.id`
- `approval_requests.workflow_id` → `approval_workflows.id`
- `approval_requests.completed_by_user_id` → `users.id` (nullable)
- `approval_decisions.approval_request_id` → `approval_requests.id`
- `approval_decisions.approver_user_id` → `users.id`
- `approval_escalations.approval_request_id` → `approval_requests.id`
- `approval_escalations.escalated_by_user_id` → `users.id` (nullable)

## 6. API Endpoints

### Approval Workflows (Admin - Settings)
```
GET /api/approvals/workflows
POST /api/approvals/workflows
PUT /api/approvals/workflows/:id
DELETE /api/approvals/workflows/:id
```
(Already documented in Settings module)

### Approval Requests

#### Get Pending Approvals (For Current User)
```
GET /api/approvals/pending?page=1&limit=20&request_type=
Headers: Authorization: Bearer {token}
Response: {
  pending_approvals: [
    {
      id, request_type, requester: { id, name },
      request_summary: { ... },
      submitted_at, current_step, total_steps,
      step_name, approvers: [ ... ]
    }
  ]
}
```

#### Get Approval Request Detail
```
GET /api/approvals/:id
Headers: Authorization: Bearer {token}
Response: {
  id, request_type, requester: { id, name },
  request_data: { ... }, // Full request details
  status, current_step, total_steps,
  decisions: [ // History of all step decisions
    {
      step_order, approver: { id, name },
      decision, notes, decided_at
    }
  ],
  submitted_at, completed_at
}
```

#### Approve Request
```
POST /api/approvals/:id/approve
Headers: Authorization: Bearer {token}
Body: {
  notes: string (optional),
  approved_hours: number (optional, for overtime)
}
Response: {
  id, status,
  next_step: { step_order, step_name } OR
  completed: { final_status, completed_at }
}
```

#### Reject Request
```
POST /api/approvals/:id/reject
Headers: Authorization: Bearer {token}
Body: {
  reason: string (required)
}
Response: {
  id, status: "rejected",
  final_reason: string,
  rejected_at
}
```

#### Skip Step (If Allowed)
```
POST /api/approvals/:id/skip
Headers: Authorization: Bearer {token}
Body: {
  reason: string (optional)
}
Response: {
  id, current_step (incremented),
  next_step: { ... }
}
```

#### Escalate Request
```
POST /api/approvals/:id/escalate
Headers: Authorization: Bearer {token}
Body: {
  reason: string
}
Response: {
  id, status: "escalated",
  escalated_to: { user: { id, name } OR role: { id, name } },
  escalated_at
}
```

#### Get Approval History
```
GET /api/approvals/history?request_type=&date_from=&date_to=&page=1&limit=50
Headers: Authorization: Bearer {token}
Response: {
  approvals: [
    {
      id, request_type, requester, status,
      submitted_at, completed_at, final_decision,
      duration_hours
    }
  ]
}
```

## 7. Page Flow (Step-by-Step)

### Submit Approval Request (From Any Module)
Example: User submits leave request

1. User navigates to `/time-management/leave`
2. Submits leave request (covered in Time Management module)
3. Backend creates time_requests row (type=leave_request, status=pending)
4. Backend queries: `SELECT * FROM approval_workflows WHERE request_type='leave_request' AND status='active'`
5. If workflow found:
   - Fetches approval_steps for workflow (sorted by step_order)
   - Creates approval_requests row:
     - request_type = leave_request
     - request_id = time_requests.id
     - requester_user_id = logged_in_user
     - workflow_id = workflow.id
     - current_step = 1
     - total_steps = workflow.step_count
     - status = pending
6. For current step (step 1):
   - Queries approver_type:
     - If role-based: Find all users with that role
     - If manager_of_requester: Find requester's manager (company_users.reporting_manager_user_id)
     - If specific_user: Direct approver_user_id
7. Creates approval_decisions rows for each approver (one per approver)
8. Sends notifications to all approvers: "Leave approval required from {requester}"
9. Frontend shows: "Request submitted for approval"

### Approval Dashboard (Manager/Approver)
1. Manager navigates to `/approvals` or clicks notification
2. Frontend fetches `GET /api/approvals/pending`
3. Displays dashboard:

   **Pending Approvals Card**:
   - "You have 5 approvals pending"
   - List:
     - 2 Leave requests
     - 1 Overtime request
     - 1 Time edit
     - 1 Role change

   **Pending Approvals Table**:
   - Columns: Requester, Type, Submitted, Status, Days Pending, Actions
   - Rows: All pending approvals needing this user's review
   - Sort by: Submitted date, Days pending
   - Filter by: Request type, Submitted date

4. Manager clicks on approval row
5. Navigates to approval detail page
6. Displays request information:

   **Request Summary** (type-specific details):
   - If Leave: Dates, Days, Type, Reason
   - If Overtime: Date, Hours, Reason
   - If Time Edit: Original vs New times, Reason
   - If Role Change: Old Role → New Role

   **Approval Workflow Progress**:
   - Step 1 (Current): "Manager Approval" - Awaiting your decision
   - Step 2 (Pending): "HR Approval" - Not yet reached
   - Step 3 (Pending): "Owner Override" - Not yet reached

   **Actions**:
   - Approve Button
   - Reject Button
   - Add Notes (text area)

7. Manager can:
   - Read full request details
   - Add notes: "Approved - approved employee's plan, coverage confirmed"
   - Approve: Click "Approve" button
   - Reject: Click "Reject" + enter reason

### Approve Request
1. Manager clicks "Approve"
2. Modal confirms: "Approve leave request for John (5 days, Jan 15-19)?"
3. Manager can add optional notes
4. Manager clicks "Confirm"
5. Frontend sends `POST /api/approvals/:id/approve` with optional notes
6. Backend:
   - Updates approval_decisions for this step: decision=approved, approver_user_id=manager, decided_at=now()
   - Checks: Are there more approval steps?
   - If yes (step 2 exists):
     - Creates approval_decisions for step 2
     - Sets approval_requests.current_step = 2
     - Finds approvers for step 2 (e.g., HR)
     - Sends notifications to HR: "Leave approval from manager received, now awaiting your review"
     - Frontend shows: "Approved! Request forwarded to next approver"
   - If no (this was final step):
     - Updates approval_requests.status = approved
     - Updates time_requests.status = approved (or creates time_log from leave_requests)
     - Updates leave_balances if applicable
     - Sends notification to requester: "Your leave request was approved"
7. Request moves to next approval step

### Reject Request
1. Manager decides to reject
2. Clicks "Reject" button
3. Modal appears: "Reject leave request?"
4. Manager enters reason: "Insufficient coverage during that period"
5. Manager clicks "Confirm"
6. Frontend sends `POST /api/approvals/:id/reject` with reason
7. Backend:
   - Updates approval_decisions: decision=rejected
   - Updates approval_requests.status = rejected
   - Updates time_requests.status = rejected
   - Rolls back any partial approvals (e.g., if step 1 of 3 rejects, steps 2-3 cancelled)
   - Sends notification to requester: "Your request was rejected: {reason}"
   - Optionally allows requester to resubmit with different details
8. Frontend shows: "Request rejected"
9. Approval removed from manager's pending list

### Multi-Step Approval Example
1. Overtime request submitted: 5 hours, Jan 20
2. Workflow: Step 1 (Manager) → Step 2 (HR) → Step 3 (Owner override optional)

3. Manager approves → Request forwarded to HR
4. Notification sent to HR: "Overtime approval from Manager received, awaiting your review"
5. HR views request (see approval detail flow above)
6. HR approves (sets approved_hours = 5)
7. Request forwarded to Owner (optional step)
8. Owner can either:
   - Approve (final approval)
   - Modify approved_hours (e.g., approve only 3 hours)
   - Override entire request
9. Once Owner approves (or step 3 skipped):
   - approval_requests.status = approved
   - overtime_requests.status = approved
   - Notification sent to requester: "Overtime approved: 5 hours"

### Escalation Flow
1. Leave request submitted on Jan 10, requires HR approval
2. HR is on vacation, doesn't approve for 7 days
3. System auto-escalates (if escalate_after_days = 7):
   - Creates approval_escalations row
   - Escalates to backup HR or Owner
   - Sends notification: "Request escalated to {approver}"
4. Backup approver sees escalated flag
5. Can approve/reject
6. Request completes

### Approval History
1. User navigates to `/approvals/history`
2. Filters available: Request Type, Date Range, Status
3. Frontend fetches `GET /api/approvals/history?status=approved`
4. Displays table:
   - Columns: Request Type, Submitted Date, Requester, Status, Completed Date, Duration
   - Example rows:
     - Leave Request | Jan 1 | John | Approved | Jan 2 | 1 day
     - Overtime | Jan 5 | Sarah | Rejected | Jan 5 | <1 day
     - Time Edit | Jan 10 | Mike | Approved | Jan 12 | 2 days
5. User can click row to see full decision history + all approver notes

## 8. Business Rules

### Hard Constraints
- **Active Workflow Required**: If no active workflow for request type, request goes directly to approved (or owner)
- **Valid Approver**: Approver must be active user in company
- **Owner Cannot Be Skipped**: If Owner is in workflow, cannot skip
- **Rejection Final**: Rejected requests cannot be auto-approved, require resubmission
- **Step Order Sequential**: Cannot skip to step 3 if step 2 not yet reviewed
- **Single Decision Per Step**: Each approver can decide only once (cannot decide twice)
- **Requester Cannot Approve Own**: User cannot approve their own requests
- **Status Valid**: Must be pending | approved | rejected | escalated | cancelled

### Soft Constraints
- Approval should be reviewed within 24-48 hours (configurable)
- Auto-escalation should notify manager + backup
- Notes should be provided for rejections
- Approval steps should not exceed 3-4 levels (avoid bottlenecks)

## 9. Edge Cases

### Invalid Scenarios
- Approver is inactive → Auto-escalate or skip to next approver
- Requester deleted → Request status = cancelled
- Workflow changed after request submitted → Continue with original workflow (immutable)
- All approvers for step are inactive → Auto-escalate to owner
- Request submitted but requester leaves company → Status = cancelled
- Approver tries to approve twice → Reject: "Already decided"
- Manager of requester not found → Escalate to owner

### Recovery Paths
- Request stuck (approver unavailable) → Owner can manually approve/reject
- Wrong decision made → Owner can override + revert
- Request in wrong workflow → Cancel, resubmit with correct type
- Approval delay → Escalate manually or wait for auto-escalation

## 10. Security Notes

### Access Control
- User can only approve if assigned in approval_steps
- User cannot approve own requests (hardcoded check)
- Only owner can override approvals
- Backend validates approver permission on every decision endpoint

### Validation
- Approver existence validated
- Request status validated before allowing decision
- Decision type validated against enum
- Escalation target must be active user
- Notes sanitized (prevent XSS)

### Audit Logging
- Every approval request submitted logged
- Every decision logged with approver, timestamp, notes
- Every escalation logged
- Every rejection logged with reason
- Complete audit trail for compliance

### Data Integrity
- Approval request immutable after creation (workflow cannot change)
- Decisions immutable (log only, no editing)
- Status transitions follow valid state machine
- No circular approval loops allowed

### Best Practices
- Keep workflows simple (2-3 steps max)
- Define clear escalation rules
- Document approval criteria per step
- Review workflows quarterly
- Archive old approvals after 1-2 years
