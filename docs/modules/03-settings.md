# Settings / Admin Module

## 📁 Project Structure Overview

This module relates to the following project structure:

```
trackly/
├── docs/
│   └── modules/
│       ├── 00-authentication.md
│       ├── 01-tenant.md
│       ├── 02-company.md
│       ├── 03-settings.md        ← YOU ARE HERE
│       └── ... (10 more modules)
├── app/
│   ├── pages/
│   │   └── settings/
│   │       ├── index.vue          ← Settings hub
│   │       ├── roles-permissions.vue (TODO)
│   │       ├── approval-flow.vue (TODO)
│   │       ├── general.vue (TODO)
│   │       └── integrations.vue (TODO)
│   ├── components/
│   │   └── settings/
│   │       ├── RoleForm.vue (TODO)
│   │       ├── PermissionMatrix.vue (TODO)
│   │       ├── ApprovalFlowBuilder.vue (TODO)
│   │       └── SettingsNavigation.vue (TODO)
│   ├── composables/
│   │   └── settings/
│   │       ├── useRoles.ts        ← Role management
│   │       ├── usePermissions.ts  ← Permission management
│   │       └── useApprovalFlow.ts ← Approval workflow
│   ├── types/
│   │   ├── role.ts
│   │   ├── permission.ts
│   │   └── approval.ts
│   └── assets/css/
│       └── main.css
├── backend/
│   ├── migrations/
│   │   └── 004_create_settings_tables.sql
│   ├── routes/
│   │   └── settings/
│   │       ├── roles/
│   │       ├── permissions/
│   │       └── approval-workflows/
│   └── models/
│       ├── Role.ts
│       ├── Permission.ts
│       ├── ApprovalWorkflow.ts
│       └── ApprovalStep.ts
└── package.json
```

**Key Files for This Module:**
- **Frontend Pages**: `app/pages/settings/` (hub for all admin settings)
- **Components**: `app/components/settings/` for role forms, permission matrix, approval workflow builder
- **State Management**: `app/composables/settings/` for role, permission, and workflow management
- **Type Definitions**: `app/types/role.ts`, `app/types/permission.ts`, `app/types/approval.ts`
- **Backend**: `backend/routes/settings/` for all admin APIs

---

## 1. Purpose
Centralized admin/owner interface for managing company configuration, users, roles, permissions, departments, approval workflows, and security settings. Only accessible to Owner and Admin roles.

## 2. Routes / Pages
- `/settings` - Settings hub/overview
- `/settings/company-profile` - Company info, branding
- `/settings/departments` - Department management
- `/settings/roles-permissions` - Role & permission configuration
- `/settings/approval-flow` - Approval workflow setup
- `/settings/users` - User list, invite, activate/deactivate
- `/settings/users/:id` - User detail, edit role/department, deactivate
- `/settings/security` - Password policies, session management, API keys
- `/settings/integrations` - External integrations (if applicable)

## 3. Actors & Roles
- **Company Owner** - Full access to all settings
- **Admin** (if role exists) - Full access to most settings, limited override permissions
- **HR** (if role exists) - Can manage users, but not roles/permissions
- **Regular User** - No access; redirect to home
- **System Admin** - Backend-only access to all tenant settings

## 4. Database Tables

### `settings` (Company-level)
```
id (PK)
company_id (FK)
key (string)
value (JSON)
type (string | boolean | number | object)
description
created_at
updated_at
UNIQUE(company_id, key)
```

### `roles`
```
id (PK)
company_id (FK)
name (UNIQUE per company)
slug
description
is_system_role (boolean) - true for Owner, Admin, User (cannot delete)
permissions (JSON) - Array of permission keys
created_at
updated_at
```

### `permissions`
```
id (PK)
company_id (FK)
key (UNIQUE per company)
name
description
category (users | tasks | time | reports | payroll | settings)
created_at
```

### `role_permissions`
```
id (PK)
role_id (FK)
permission_id (FK)
created_at
UNIQUE(role_id, permission_id)
```

### `approval_workflows`
```
id (PK)
company_id (FK)
name
description
trigger_type (time_edit | leave_request | overtime | role_change)
status (active | inactive)
steps (JSON) - Array of approval step configs
created_at
updated_at
```

### `approval_steps`
```
id (PK)
workflow_id (FK)
step_order
approver_role_id (FK) or approver_user_id (FK)
approval_type (single | all)
auto_approve_after_days
can_override (boolean)
created_at
```

### `settings_audit_log`
```
id (PK)
company_id (FK)
actor_user_id (FK)
setting_key (string)
old_value (JSON)
new_value (JSON)
created_at
```

## 5. Relationships
- `settings.company_id` → `companies.id`
- `roles.company_id` → `companies.id`
- `permissions.company_id` → `companies.id`
- `role_permissions.role_id` → `roles.id`
- `role_permissions.permission_id` → `permissions.id`
- `approval_workflows.company_id` → `companies.id`
- `approval_steps.workflow_id` → `approval_workflows.id`
- `approval_steps.approver_role_id` → `roles.id` (nullable)
- `approval_steps.approver_user_id` → `users.id` (nullable)
- `company_users.role_id` → `roles.id`
- `settings_audit_log.company_id` → `companies.id`
- `settings_audit_log.actor_user_id` → `users.id`

## 6. API Endpoints

### Get Settings Overview
```
GET /api/settings
Headers: Authorization: Bearer {token}
Response: {
  company: { id, name, logo_url },
  role_count: 5,
  user_count: 12,
  departments: 3,
  last_updated: timestamp
}
```

### Get Company Profile (Already covered in Company module)
```
GET /api/settings/company-profile
PUT /api/settings/company-profile
```

### Get All Settings
```
GET /api/settings/all
Headers: Authorization: Bearer {token}
Response: {
  settings: [
    { key, value, type, description }
  ]
}
```

### Get Setting by Key
```
GET /api/settings/:key
Headers: Authorization: Bearer {token}
Response: {
  key,
  value,
  type,
  description
}
```

### Update Setting
```
PUT /api/settings/:key
Headers: Authorization: Bearer {token}
Body: {
  value: {}
}
Response: { key, value }
```

### Get All Roles
```
GET /api/settings/roles
Headers: Authorization: Bearer {token}
Response: {
  roles: [
    { id, name, slug, description, permission_count, is_system_role }
  ]
}
```

### Get Role with Permissions
```
GET /api/settings/roles/:id
Headers: Authorization: Bearer {token}
Response: {
  id,
  name,
  description,
  permissions: [
    { id, key, name, category }
  ]
}
```

### Create Role
```
POST /api/settings/roles
Headers: Authorization: Bearer {token}
Body: {
  name,
  description,
  permission_ids: [1, 2, 3]
}
Response: { id, name, ... }
```

### Update Role
```
PUT /api/settings/roles/:id
Headers: Authorization: Bearer {token}
Body: {
  name,
  description,
  permission_ids: [1, 2, 3]
}
Response: { id, name, ... }
```

### Delete Role
```
DELETE /api/settings/roles/:id
Headers: Authorization: Bearer {token}
Response: { message: "Role deleted" }
```

### Get Approval Workflows
```
GET /api/settings/approval-workflows
Headers: Authorization: Bearer {token}
Response: {
  workflows: [
    { id, name, trigger_type, status, step_count }
  ]
}
```

### Get Approval Workflow Detail
```
GET /api/settings/approval-workflows/:id
Headers: Authorization: Bearer {token}
Response: {
  id,
  name,
  trigger_type,
  steps: [
    { step_order, approver_role, approver_user, approval_type, auto_approve_after_days }
  ]
}
```

### Create Approval Workflow
```
POST /api/settings/approval-workflows
Headers: Authorization: Bearer {token}
Body: {
  name,
  trigger_type,
  steps: [
    { step_order, approver_role_id, approval_type, auto_approve_after_days }
  ]
}
Response: { id, name, ... }
```

### Update Approval Workflow
```
PUT /api/settings/approval-workflows/:id
Headers: Authorization: Bearer {token}
Body: { name, description, status, steps }
Response: { id, name, ... }
```

## 7. Page Flow (Step-by-Step)

### Settings Landing Page
1. User (Owner/Admin) navigates to `/settings`
2. Frontend checks user role: must be owner or admin
3. Frontend fetches `GET /api/settings`
4. Displays grid of settings modules:
   - Company Profile (1 user)
   - Departments (3 depts)
   - Users (12 users, 1 owner)
   - Roles & Permissions (5 roles)
   - Approval Workflows (2 workflows)
   - Security Settings
5. User clicks on any module to navigate deeper

### Roles & Permissions Management
1. User navigates to `/settings/roles-permissions`
2. Frontend fetches `GET /api/settings/roles`
3. Displays table of roles with: name, permissions count, actions (edit/delete)
4. User clicks "Create Role"
5. Modal opens with form: role name, description, permission checkboxes
6. User selects permissions (grouped by category: tasks, time, reports, payroll)
7. User clicks "Create"
8. Frontend validates name not empty, name not duplicate
9. Frontend sends `POST /api/settings/roles` with permission_ids
10. Backend validates:
    - Name unique per company
    - All permission_ids valid for company
11. Backend creates role + role_permissions entries
12. Backend logs creation
13. Frontend shows success, adds role to list
14. User can click on role to edit:
    - Change name/description
    - Add/remove permissions
    - Send `PUT /api/settings/roles/:id`

### Approval Workflow Setup
1. User navigates to `/settings/approval-flow`
2. Frontend fetches `GET /api/settings/approval-workflows`
3. Displays list of workflows: time_edit, leave_request, overtime, role_change
4. User clicks "Create" or "Edit existing workflow"
5. Workflow builder opens with:
   - Trigger type selector (dropdown)
   - Step builder (add multiple steps)
   - Per step: role selector, approval type (single/all), auto-approve days
6. User configures steps in order (e.g., Step 1: Manager approval, Step 2: HR approval)
7. User saves workflow
8. Frontend sends `POST /api/settings/approval-workflows`
9. Backend creates workflow + approval_steps
10. Backend validates:
    - All approver_role_ids valid
    - Step order sequential
11. Frontend shows success
12. Workflow used in approval engine for requests

### Security Settings
1. User navigates to `/settings/security`
2. Frontend fetches security configs
3. Displays options:
   - Password policy (min length, require special chars, etc.)
   - Session timeout (minutes of inactivity)
   - API key management
   - Login attempt limits
   - Two-factor authentication (if implemented)
4. User modifies settings
5. User clicks "Save"
6. Frontend sends updates to backend
7. Backend applies new policies
8. For password policy: applies to new passwords only
9. For session timeout: applies to new sessions

## 8. Business Rules

### Hard Constraints
- **Owner Cannot Be Removed**: Owner stays in system indefinitely
- **System Roles Immutable**: Cannot edit or delete Owner, Admin, User roles
- **Role Name Unique**: Two roles in same company cannot have same name
- **Permission Cannot Be Deleted**: If referenced by roles, cannot delete
- **Workflow Trigger Unique**: One active workflow per trigger_type per company
- **Approval Step Order Sequential**: Steps must have step_order 1, 2, 3, ... without gaps
- **Setting Key Format**: Must be snake_case, alphanumeric + underscore only
- **One Role Per User**: User in company_users has exactly one role_id

### Soft Constraints
- All roles should have at least one permission
- All workflows should have at least one approval step
- Settings audit log kept for 90 days minimum
- Role names should be descriptive (2-50 chars)

## 9. Edge Cases

### Invalid Scenarios
- Attempt to edit Owner role → Reject: "System role cannot be modified"
- Attempt to delete role with assigned users → Reject: "Reassign users to another role first"
- Attempt to create duplicate role name → Reject: "Role name already exists"
- Attempt to delete permission referenced by role → Reject: "Permission in use"
- Attempt to create workflow with no steps → Reject: "At least one approval step required"
- Attempt to set approval step with non-existent role → Reject: "Invalid approver role"

### Recovery Paths
- User created without role → Assign role immediately (required field)
- Workflow malfunction → Owner can disable workflow, re-configure, enable
- Too many roles created → Owner can archive/delete unused roles
- Approval bottleneck → Owner can adjust auto-approve-after-days

## 10. Security Notes

### Role-Based Access Control (RBAC)
- Settings module accessible only to users with permission `settings:view` and `settings:edit`
- Owner always has all permissions (hardcoded bypass)
- Permissions evaluated at API layer on every request
- No client-side permission hiding (frontend validates for UX, backend validates for security)

### Audit Logging
- Every role creation/update/deletion logged
- Every setting change logged with before/after values
- Every workflow change logged
- Include actor_user_id, timestamp, IP, user_agent

### Validation
- Role name: alphanumeric, spaces allowed, no SQL special chars
- Setting key: must match regex `^[a-z_]+$`
- Setting value: JSON validated per setting type
- Workflow step order: must be sequential integers starting at 1

### Data Isolation
- User can only manage roles/settings within their company
- Query: WHERE company_id = context.company_id
- No cross-company settings leakage

### Authorization
- ALL settings operations require: user is company owner OR user has `settings:manage` permission
- Backend must validate on every endpoint
