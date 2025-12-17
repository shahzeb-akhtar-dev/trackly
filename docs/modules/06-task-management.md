# Task Management Module

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
│       ├── 06-task-management.md  ← YOU ARE HERE
│       └── ... (7 more modules)
├── app/
│   ├── pages/
│   │   ├── task-management/
│   │   │   ├── index.vue (TODO) ← Task list
│   │   │   ├── projects.vue (TODO) ← Project list
│   │   │   ├── kanban-board.vue (TODO) ← Kanban view
│   │   │   ├── tasks/
│   │   │   │   └── [id].vue (TODO) ← Task detail
│   │   │   └── projects/
│   │   │       └── [id].vue (TODO) ← Project detail
│   │   └── index.vue
│   ├── components/
│   │   └── tasks/
│   │       ├── TaskCard.vue (TODO)
│   │       ├── TaskForm.vue (TODO)
│   │       ├── KanbanBoard.vue (TODO)
│   │       ├── ProjectList.vue (TODO)
│   │       └── TaskCommentThread.vue (TODO)
│   ├── composables/
│   │   └── tasks/
│   │       ├── useTasks.ts        ← Task CRUD
│   │       ├── useProjects.ts     ← Project management
│   │       ├── useTaskFilter.ts   ← Filtering & sorting
│   │       └── useTaskComments.ts ← Comments
│   ├── types/
│   │   ├── task.ts
│   │   └── project.ts
│   └── assets/css/
│       └── main.css
├── backend/
│   ├── migrations/
│   │   └── 007_create_task_tables.sql
│   ├── routes/
│   │   └── tasks/
│   │       ├── list.ts
│   │       ├── create.ts
│   │       ├── update.ts
│   │       ├── delete.ts
│   │       ├── transition.ts
│   │       └── comments.ts
│   └── models/
│       ├── Project.ts
│       ├── Task.ts
│       ├── TaskStage.ts
│       ├── TaskTransition.ts
│       └── TaskComment.ts
└── package.json
```

**Key Files for This Module:**
- **Frontend Pages**: `app/pages/task-management/` for task list, projects, and Kanban board
- **Components**: `app/components/tasks/` for task cards, forms, Kanban, project list
- **State Management**: `app/composables/tasks/` for task CRUD, filtering, and comments
- **Type Definitions**: `app/types/task.ts`, `app/types/project.ts`
- **Backend**: `backend/routes/tasks/` for task management APIs

---

## 1. Purpose
Create, assign, track, and manage tasks/projects. Tasks are the core unit of work, linked to projects, assigned to users, tracked through multiple stages, with reviews and approvals. Projects group related tasks and provide high-level tracking.

## 2. Routes / Pages
- `/task-management` - Task management hub
- `/task-management/projects` - Projects list, create, view, edit
- `/task-management/projects/:id` - Project detail, manage tasks
- `/task-management/tasks` - Tasks list, filter, search, bulk actions
- `/task-management/tasks/:id` - Task detail, edit, add comments
- `/task-management/kanban-board` - Kanban board view by stage

## 3. Actors & Roles
- **Company Owner** - Full task management (create, delete, assign)
- **Manager** (if role exists) - Can create/assign tasks, review, approve
- **HR** - Can create/assign tasks (if role permits)
- **Assignee** - Can view assigned tasks, log time, add comments
- **Reviewer** - Can review task, request changes, approve completion
- **Regular User** - Can view tasks assigned to them only

## 4. Database Tables

### `projects`
```
id (PK)
company_id (FK)
created_by_user_id (FK)
name (UNIQUE per company)
slug (UNIQUE per company)
description
status (active | on_hold | completed | archived)
priority (1-5, 1=highest)
start_date
end_date
budget_amount
budget_currency
category
owner_user_id (FK) → users.id
metadata (JSON)
created_at
updated_at
```

### `tasks`
```
id (PK)
company_id (FK)
project_id (FK)
created_by_user_id (FK)
assigned_to_user_id (FK)
title (not UNIQUE)
description
status (pending | in_progress | review | completed | cancelled)
priority (1-5)
stage (backlog | todo | in_progress | review | done)
estimated_hours (decimal)
actual_hours (decimal) - sum of time logs
progress_percentage (0-100)
start_date
due_date
completed_date
reviewer_user_id (FK) → users.id - nullable
requires_review (boolean)
created_at
updated_at
```

### `task_stages`
```
id (PK)
company_id (FK)
name (UNIQUE per company)
slug
description
order (sequential)
auto_complete (boolean) - auto-move to next stage
next_stage_id (FK) → task_stages.id - nullable
status (active | inactive)
created_at
```

### `task_transitions`
```
id (PK)
task_id (FK)
from_stage_id (FK)
to_stage_id (FK)
moved_by_user_id (FK)
reason (string)
created_at
```

### `task_assignments`
```
id (PK)
task_id (FK)
assigned_to_user_id (FK)
assigned_by_user_id (FK)
created_at
updated_at
```

### `task_comments`
```
id (PK)
task_id (FK)
user_id (FK)
comment_text
attachment_urls (JSON) - Array of URLs
created_at
updated_at
```

### `task_time_logs`
```
id (PK)
task_id (FK)
user_id (FK)
date_logged (date)
hours (decimal)
description
status (logged | pending_approval | approved)
created_at
updated_at
```

### `task_audit_log`
```
id (PK)
task_id (FK)
company_id (FK)
actor_user_id (FK)
action (string: create, assign, update_status, update_stage, complete, cancel)
old_values (JSON)
new_values (JSON)
created_at
```

## 5. Relationships
- `projects.company_id` → `companies.id`
- `projects.created_by_user_id` → `users.id`
- `projects.owner_user_id` → `users.id`
- `tasks.company_id` → `companies.id`
- `tasks.project_id` → `projects.id`
- `tasks.created_by_user_id` → `users.id`
- `tasks.assigned_to_user_id` → `users.id`
- `tasks.reviewer_user_id` → `users.id` (nullable)
- `task_stages.company_id` → `companies.id`
- `task_stages.next_stage_id` → `task_stages.id` (nullable, for workflow)
- `task_transitions.task_id` → `tasks.id`
- `task_assignments.task_id` → `tasks.id`
- `task_assignments.assigned_to_user_id` → `users.id`
- `task_comments.task_id` → `tasks.id`
- `task_comments.user_id` → `users.id`
- `task_time_logs.task_id` → `tasks.id`
- `task_time_logs.user_id` → `users.id`

## 6. API Endpoints

### Projects

#### List Projects
```
GET /api/projects?status=active&sort=-created_at&page=1&limit=20
Headers: Authorization: Bearer {token}
Response: {
  projects: [
    { id, name, slug, status, priority, start_date, end_date, owner, task_count }
  ],
  total, page, limit
}
```

#### Get Project Detail
```
GET /api/projects/:id
Headers: Authorization: Bearer {token}
Response: {
  id, name, slug, description, status, priority, budget,
  owner: { id, name }, tasks_count, created_at
}
```

#### Create Project
```
POST /api/projects
Headers: Authorization: Bearer {token}
Body: {
  name,
  description,
  priority,
  start_date,
  end_date,
  budget_amount,
  owner_user_id
}
Response: { id, name, slug, status, ... }
```

#### Update Project
```
PUT /api/projects/:id
Headers: Authorization: Bearer {token}
Body: { name, description, priority, status, end_date, budget_amount }
Response: { id, name, ... }
```

#### Delete Project
```
DELETE /api/projects/:id
Headers: Authorization: Bearer {token}
Response: { message: "Project deleted" }
```

### Tasks

#### List Tasks
```
GET /api/tasks?project_id=&assigned_to=&status=&priority=&stage=&search=&page=1&limit=20
Headers: Authorization: Bearer {token}
Response: {
  tasks: [
    {
      id, title, status, priority, stage, assigned_to: { id, name },
      project: { id, name }, due_date, progress_percentage
    }
  ],
  total, page, limit
}
```

#### Get Task Detail
```
GET /api/tasks/:id
Headers: Authorization: Bearer {token}
Response: {
  id, title, description, status, priority, stage,
  project: { id, name }, assigned_to: { id, name },
  created_by: { id, name }, reviewer: { id, name },
  estimated_hours, actual_hours, progress_percentage,
  start_date, due_date, completed_date,
  comments: [ ... ],
  time_logs: [ ... ],
  history: [ ... ]
}
```

#### Create Task
```
POST /api/tasks
Headers: Authorization: Bearer {token}
Body: {
  project_id,
  title,
  description,
  assigned_to_user_id,
  priority,
  estimated_hours,
  due_date,
  requires_review,
  reviewer_user_id
}
Response: { id, title, status: "pending", ... }
```

#### Update Task
```
PUT /api/tasks/:id
Headers: Authorization: Bearer {token}
Body: {
  title,
  description,
  priority,
  assigned_to_user_id,
  estimated_hours,
  due_date,
  reviewer_user_id,
  requires_review,
  progress_percentage
}
Response: { id, title, ... }
```

#### Update Task Stage
```
PATCH /api/tasks/:id/stage
Headers: Authorization: Bearer {token}
Body: {
  stage_id,
  reason: string
}
Response: { id, stage, status }
```

#### Update Task Status
```
PATCH /api/tasks/:id/status
Headers: Authorization: Bearer {token}
Body: {
  status (pending | in_progress | review | completed | cancelled),
  reason: string
}
Response: { id, status }
```

#### Complete Task (with review)
```
POST /api/tasks/:id/complete
Headers: Authorization: Bearer {token}
Body: {
  completion_notes: string
}
Response: { id, status: "completed", completed_date }
```

#### Cancel Task
```
POST /api/tasks/:id/cancel
Headers: Authorization: Bearer {token}
Body: {
  reason: string
}
Response: { id, status: "cancelled" }
```

#### Add Comment
```
POST /api/tasks/:id/comments
Headers: Authorization: Bearer {token}
Body: {
  comment_text,
  attachment_urls: []
}
Response: { id, user, comment_text, created_at }
```

#### Get Task Audit Log
```
GET /api/tasks/:id/audit-log
Headers: Authorization: Bearer {token}
Response: {
  logs: [
    { id, action, actor, old_values, new_values, created_at }
  ]
}
```

### Task Stages

#### List Task Stages
```
GET /api/task-stages
Headers: Authorization: Bearer {token}
Response: {
  stages: [
    { id, name, order, auto_complete, task_count }
  ]
}
```

#### Create Task Stage
```
POST /api/task-stages
Headers: Authorization: Bearer {token}
Body: {
  name,
  description,
  order,
  auto_complete,
  next_stage_id
}
Response: { id, name, ... }
```

#### Update Task Stage
```
PUT /api/task-stages/:id
Headers: Authorization: Bearer {token}
Body: { name, order, auto_complete, next_stage_id }
Response: { id, name, ... }
```

### Kanban Board

#### Get Kanban Board
```
GET /api/kanban-board?project_id=&assigned_to=&filter=
Headers: Authorization: Bearer {token}
Response: {
  stages: [
    {
      id, name, order,
      tasks: [
        { id, title, priority, assigned_to, due_date }
      ]
    }
  ]
}
```

#### Move Task on Kanban Board
```
PATCH /api/kanban-board/tasks/:id/move
Headers: Authorization: Bearer {token}
Body: {
  stage_id,
  position (order within stage)
}
Response: { id, stage_id, position }
```

## 7. Page Flow (Step-by-Step)

### Task List View
1. User navigates to `/task-management/tasks`
2. Frontend fetches `GET /api/tasks?page=1&limit=20` (only assigned to user)
3. Displays table:
   - Columns: Title, Project, Stage, Priority, Assigned To, Due Date, Progress
   - Rows: Tasks filtered by company + user's permissions
4. Features:
   - Filter by status/stage/priority: `GET /api/tasks?status=pending&stage=todo`
   - Search by title: `GET /api/tasks?search=database`
   - Assign to project: `GET /api/tasks?project_id=5`
   - Sort by due_date/priority/created_at
5. User clicks task title → Go to task detail

### Create Task Flow
1. Manager navigates to `/task-management/tasks`
2. Clicks "Create Task" button
3. Modal/form opens with fields:
   - Project (required, dropdown)
   - Title (required)
   - Description (optional, markdown)
   - Assigned To (required, dropdown of active users)
   - Priority (1-5)
   - Estimated Hours (optional)
   - Due Date (optional)
   - Requires Review? (checkbox)
   - Reviewer (if requires_review, dropdown)
4. Manager fills form
5. Manager clicks "Create"
6. Frontend validates: title not empty, assignee active, project exists
7. Frontend sends `POST /api/tasks`
8. Backend validates:
   - All required fields present
   - Project exists in company
   - Assigned user is active in company
   - Reviewer (if set) is active in company
9. Backend creates task with:
   - status = pending
   - stage = backlog (default)
   - created_by_user_id = authenticated user
10. Backend logs task creation
11. Backend sends notification to assigned user: "You have a new task: {title}"
12. Frontend redirects to task detail page
13. Frontend shows: "Task created"

### Task Detail View
1. User clicks task title in list
2. Navigates to `/task-management/tasks/:id`
3. Frontend fetches `GET /api/tasks/:id`
4. Displays task info in panels:

   **Task Overview Panel**:
   - Title, Description (markdown)
   - Status, Stage, Priority badges
   - Project link
   - Assigned to: [User Name]
   - Created by: [User Name]
   - Created/Updated timestamps

   **Task Details Panel**:
   - Estimated Hours
   - Actual Hours (sum of time logs)
   - Progress Percentage (visual bar)
   - Start Date, Due Date, Completed Date
   - Requires Review: [Yes/No]
   - Reviewer: [User Name]

   **Comments Section**:
   - List of comments from users
   - Reply functionality
   - Attachment preview
   - Comment form for adding new comments

   **Time Logs Section** (if user has permission):
   - Table of time entries for this task
   - Edit/Delete buttons (with approval if needed)
   - Add time entry button

   **Activity/History Section**:
   - Timeline of all changes: status updates, stage changes, assignments, etc.

5. User can perform actions based on permissions:
   - Edit task: Click "Edit" → Form becomes editable → Save
   - Change stage: Kanban drag-drop OR status dropdown
   - Complete task: "Mark Complete" button (goes to review if requires_review)
   - Cancel task: "Cancel" button with reason
   - Log time: "Add Time Log" button (if time-tracking enabled)
   - Add comment: Comment form at bottom

### Kanban Board View
1. User navigates to `/task-management/kanban-board`
2. Frontend fetches `GET /api/kanban-board?project_id=&filter=`
3. Displays columns for each stage:
   - Column 1: Backlog
   - Column 2: To Do
   - Column 3: In Progress
   - Column 4: Review
   - Column 5: Done
4. Each column shows tasks as cards
5. User can:
   - Drag task card to another column (changes stage)
   - Click task card to open detail
   - Filter by project: show selector
   - Filter by assigned to: show dropdown
6. On drag-drop:
   - Frontend sends `PATCH /api/kanban-board/tasks/:id/move`
   - Backend updates task stage_id
   - Backend logs transition
   - Frontend updates board view immediately

### Task Review Flow (if requires_review = true)
1. Assignee completes task work
2. Assignee clicks "Mark Complete"
3. Modal appears: "Add completion notes (optional)"
4. Assignee enters notes + clicks "Submit for Review"
5. Frontend sends `POST /api/tasks/:id/complete`
6. Backend updates task:
   - status = review
   - stage = review_stage
   - progress_percentage = 100%
   - completed_date = now()
7. Backend sends notification to reviewer: "Task {title} requires your review"
8. Reviewer navigates to task detail
9. Reviewer sees task status "Review Pending"
10. Reviewer can:
    - Approve: Clicks "Approve" → Task status = completed
    - Request Changes: Clicks "Request Changes" + adds comment → Task status = in_progress
    - Review Comment: Adds comment visible to assignee
11. If approved:
    - Task status → completed
    - Notification sent to assignee
    - Task can be closed
12. If changes requested:
    - Assignee notified with review comments
    - Task status → in_progress
    - Assignee can re-work and re-submit

### Project Management
1. Manager navigates to `/task-management/projects`
2. Fetches `GET /api/projects`
3. Displays project cards with:
   - Project name, status, priority
   - Owner name, task count
   - Start/End dates
   - Budget (if applicable)
4. Manager clicks project card → `/task-management/projects/:id`
5. Project detail shows:
   - Project overview
   - Tasks list (only for this project)
   - Kanban board filtered to project
   - Budget tracker (if budget set)
6. Manager can:
   - Create task for project
   - View all tasks in project
   - Edit project: Click "Edit" → Form → Save
   - Archive project: "Archive" button
7. Frontend sends `PUT /api/projects/:id` on update

## 8. Business Rules

### Hard Constraints
- **Task Requires Assignee**: Every task must have assigned_to_user_id set
- **Assignee Must Be Active**: Cannot assign task to inactive user
- **Reviewer Must Be Different**: reviewer_user_id ≠ assigned_to_user_id (if review required)
- **Stage Progression Valid**: Task stage follows defined workflow (no backward moves unless permitted)
- **Project Ownership**: Only project owner or admin can delete project
- **Estimated Hours Positive**: estimated_hours > 0 (if set)
- **Actual Hours Read-Only**: Calculated from time logs, cannot set directly
- **Completed Tasks Immutable**: Cannot edit completed task title/description
- **Cancellation Final**: Cancelled tasks cannot be re-opened

### Soft Constraints
- All tasks should have due date (best practice)
- All tasks should have estimated hours (for planning)
- Reviewer should be manager or senior (best practice)
- Comments should be documented for complex tasks
- Progress percentage should be updated regularly

## 9. Edge Cases

### Invalid Scenarios
- Attempt to assign task to inactive user → Reject: "Assignee must be active"
- Attempt to set reviewer = assignee → Reject: "Reviewer cannot be assignee"
- Attempt to move task backward in stage (not allowed) → Reject: "Cannot move to previous stage"
- Attempt to edit completed task → Reject: "Cannot edit completed task"
- Attempt to re-open cancelled task → Reject: "Cannot reopen cancelled task"
- Attempt to delete project with active tasks → Reject: "Complete/cancel tasks first" OR allow with cascade
- Attempt to create task without project → Reject: "Project required"

### Recovery Paths
- Task assigned to wrong user → Edit task, change assignee
- Task stuck in review → Owner can force complete or move to next stage
- Task estimated hours way off → Edit estimated_hours for future reference
- Project archived → Owner can un-archive if needed
- Reviewer unavailable → Owner can change reviewer, request re-review

## 10. Security Notes

### Access Control
- User can only view tasks assigned to them (unless manager/owner)
- Manager can view/edit all tasks in their department
- Owner can view/edit all tasks
- Backend filters tasks by company_id + user permissions

### Audit Logging
- All task creation/updates logged with actor
- All stage/status changes logged with reason
- All assignments/reassignments logged
- All review actions logged
- Include timestamp, IP, user_agent

### Validation
- Task title sanitized (no XSS)
- Description validated (markdown, no scripts)
- Estimated hours validated as positive number
- Due date validated (not past unless editing)
- Attachment URLs validated for security

### Data Isolation
- Task visible only to: company users, assigned user, reviewer, manager
- Kanban board filtered by company + user permissions
- No cross-company task leakage
