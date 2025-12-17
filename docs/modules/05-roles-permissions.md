# Roles & Permissions Module

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
│       ├── 05-roles-permissions.md ← YOU ARE HERE
│       └── ... (8 more modules)
├── app/
│   ├── pages/
│   │   └── settings/
│   │       ├── roles-permissions.vue (TODO)
│   │       └── role-details.vue (TODO)
│   ├── components/
│   │   └── rbac/
│   │       ├── PermissionMatrix.vue (TODO)
│   │       ├── RoleForm.vue (TODO)
│   │       ├── PermissionTree.vue (TODO)
│   │       └── RoleSelector.vue (TODO)
│   ├── composables/
│   │   └── rbac/
│   │       ├── useRoles.ts        ← Role management
│   │       ├── usePermissions.ts  ← Permission management
│   │       └── useRBAC.ts         ← RBAC logic
│   ├── types/
│   │   ├── role.ts
│   │   ├── permission.ts
│   │   └── rbac.ts
│   ├── utils/
│   │   └── rbac/
│   │       ├── permissionChecker.ts
│   │       └── roleHierarchy.ts
│   └── assets/css/
│       └── main.css
├── backend/
│   ├── migrations/
│   │   └── 006_create_rbac_tables.sql
│   ├── routes/
│   │   └── rbac/
│   │       ├── roles/
│   │       └── permissions/
│   ├── middleware/
│   │   ├── requireRole.ts
│   │   └── requirePermission.ts
│   └── models/
│       ├── Role.ts
│       ├── Permission.ts
│       ├── RolePermission.ts
│       └── PermissionDependency.ts
└── package.json
```

**Key Files for This Module:**
- **Frontend Pages**: `app/pages/settings/roles-permissions.vue` (TODO)
- **Components**: `app/components/rbac/` for permission matrices, role forms
- **State Management**: `app/composables/rbac/` for RBAC operations
- **Type Definitions**: `app/types/role.ts`, `app/types/permission.ts`
- **Utils**: `app/utils/rbac/` for permission checking helpers
- **Backend**: `backend/routes/rbac/` for RBAC APIs
- **Middleware**: `backend/middleware/` for role and permission verification

---

## 1. Purpose
Define role-based access control (RBAC) with granular permissions per role. Roles determine what users can see and do. Permissions are organized by category (users, tasks, time, reports, payroll, settings). Owner always has all permissions (hardcoded bypass).

## 2. Routes / Pages
- `/settings/roles-permissions` - Role & permission management hub
- `/settings/roles-permissions/roles` - List, create, edit, delete roles
- `/settings/roles-permissions/permissions` - Permission browser (view-only for most)
- No dedicated user-facing pages (RBAC enforced at API layer)

## 3. Actors & Roles
- **Company Owner** - Full RBAC management (create, edit, delete roles)
- **Admin** (if role exists) - Full RBAC management (with permission)
- **Regular User** - Can view own role/permissions (read-only)
- **System Admin** - Backend-only: can define permissions across company

## 4. Database Tables

### `roles`
```
id (PK)
company_id (FK)
name (UNIQUE per company)
slug (UNIQUE per company)
description
is_system_role (boolean) - true for Owner, Admin, User
color_code (for UI badges)
priority (integer, lower = higher privilege)
created_at
updated_at
```

### `permissions`
```
id (PK)
company_id (FK)
key (UNIQUE per company) - format: "module:action" e.g., "tasks:create"
name
description
category (users | tasks | time | reports | payroll | settings | auth)
subcategory (optional, for grouping)
requires_department_manager (boolean) - true if action needs dept manager role
requires_owner (boolean) - true if action needs owner
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

### `permission_dependencies`
```
id (PK)
permission_id (FK)
depends_on_permission_id (FK)
created_at
UNIQUE(permission_id, depends_on_permission_id)
```

### `role_assignment_history`
```
id (PK)
company_id (FK)
user_id (FK)
old_role_id (FK)
new_role_id (FK)
changed_by_user_id (FK)
reason (string)
created_at
```

## 5. Relationships
- `roles.company_id` → `companies.id`
- `permissions.company_id` → `companies.id`
- `role_permissions.role_id` → `roles.id`
- `role_permissions.permission_id` → `permissions.id`
- `permission_dependencies.permission_id` → `permissions.id`
- `permission_dependencies.depends_on_permission_id` → `permissions.id`
- `company_users.role_id` → `roles.id`
- `role_assignment_history.company_id` → `companies.id`
- `role_assignment_history.user_id` → `users.id`
- `role_assignment_history.old_role_id` → `roles.id`
- `role_assignment_history.new_role_id` → `roles.id`

## 6. API Endpoints

### Get All Roles
```
GET /api/roles
Headers: Authorization: Bearer {token}
Response: {
  roles: [
    {
      id, name, slug, description, permission_count,
      is_system_role, priority, created_at
    }
  ]
}
```

### Get Role with All Permissions
```
GET /api/roles/:id
Headers: Authorization: Bearer {token}
Response: {
  id, name, slug, description,
  permissions: [
    { id, key, name, category, subcategory }
  ]
}
```

### Create Role
```
POST /api/roles
Headers: Authorization: Bearer {token}
Body: {
  name,
  slug,
  description,
  permission_ids: [1, 2, 3, ...]
}
Response: {
  id, name, slug, description, permissions: [...]
}
```

### Update Role
```
PUT /api/roles/:id
Headers: Authorization: Bearer {token}
Body: {
  name,
  slug,
  description,
  permission_ids: [1, 2, 3, ...]
}
Response: {
  id, name, slug, description, permissions: [...]
}
```

### Delete Role
```
DELETE /api/roles/:id
Headers: Authorization: Bearer {token}
Response: {
  message: "Role deleted successfully"
}
```

### Get All Permissions
```
GET /api/permissions
Headers: Authorization: Bearer {token}
Response: {
  permissions: [
    {
      id, key, name, description, category, subcategory,
      requires_owner, requires_department_manager,
      depends_on: [permission_id, ...]
    }
  ]
}
```

### Get Permissions by Category
```
GET /api/permissions?category=tasks
Headers: Authorization: Bearer {token}
Response: {
  permissions: [ ... ]
}
```

### Get Permission Dependencies
```
GET /api/permissions/:id/dependencies
Headers: Authorization: Bearer {token}
Response: {
  permission_id,
  dependencies: [
    { id, key, name }
  ]
}
```

### Get Current User Permissions
```
GET /api/users/me/permissions
Headers: Authorization: Bearer {token}
Response: {
  role: { id, name },
  permissions: [
    { key, name, category }
  ],
  is_owner: boolean
}
```

### Check Permission (Single)
```
GET /api/permissions/check?permission_key=tasks:create
Headers: Authorization: Bearer {token}
Response: {
  permission: "tasks:create",
  allowed: boolean,
  reason: string (if denied)
}
```

### Check Permissions (Multiple)
```
POST /api/permissions/check
Headers: Authorization: Bearer {token}
Body: {
  permissions: ["tasks:create", "tasks:approve", "reports:view"]
}
Response: {
  results: [
    { permission: "tasks:create", allowed: true },
    { permission: "tasks:approve", allowed: false, reason: "Not assigned" },
    { permission: "reports:view", allowed: true }
  ]
}
```

### Get Role Assignment History
```
GET /api/users/:id/role-history?page=1&limit=50
Headers: Authorization: Bearer {token}
Response: {
  history: [
    { id, old_role, new_role, changed_by, reason, created_at }
  ]
}
```

## 7. Page Flow (Step-by-Step)

### Roles & Permissions Dashboard
1. Owner/Admin navigates to `/settings/roles-permissions`
2. Frontend fetches `GET /api/roles` + `GET /api/permissions`
3. Displays two-panel layout:

   **Left Panel - Roles**:
   - List of roles (Owner, Admin, User, custom roles)
   - Each role shows: name, permission count, color badge
   - Buttons: Edit, Delete (except system roles), Create Role

   **Right Panel - Permissions**:
   - List of all permissions
   - Grouped by category: users, tasks, time, reports, payroll, settings
   - Each permission shows: name, description, required_for (roles)

4. Owner clicks on role to select it
5. Right panel updates to show: "Role: {role_name} - {permission_count} permissions"
6. Grid/list of permissions with checkboxes (checked = assigned to role)

### Create Role Flow
1. Owner clicks "Create Role" button
2. Modal/page opens with form:
   - Role Name (required, unique per company)
   - Slug (auto-generated or manual, must be unique)
   - Description (optional)
   - Permission Selection:
     - Organized by category tabs: Users, Tasks, Time, Reports, Payroll, Settings
     - Each permission shown with checkbox + description
     - Check boxes for permissions to assign
     - Permission dependencies auto-checked if parent permission checked
3. Owner fills form, selects permissions
4. Owner clicks "Create"
5. Frontend validates:
   - Role name not empty, not duplicate
   - Slug not duplicate, valid format
   - At least one permission selected
6. Frontend sends `POST /api/roles` with permission_ids
7. Backend validates:
   - Name unique per company
   - All permission_ids valid
   - All permission dependencies satisfied
8. Backend creates roles row
9. Backend creates role_permissions entries for each permission
10. Backend logs role creation
11. Frontend shows success toast
12. New role appears in list
13. Owner can now assign role to users

### Edit Role Flow
1. Owner clicks on role in list
2. Details panel opens showing:
   - Role Name, Slug, Description (editable)
   - Current permissions (checkboxes)
   - "Edit" button
3. Owner clicks "Edit"
4. Form becomes editable
5. Owner can:
   - Change name/description
   - Add/remove permissions via checkboxes
   - Dependencies automatically handled
6. Owner clicks "Save"
7. Frontend sends `PUT /api/roles/:id` with updated data
8. Backend validates same as create
9. Backend updates role + role_permissions
10. Backend logs all changes
11. All users with this role immediately see new permissions

### Delete Role Flow
1. Owner clicks role in list
2. Clicks "Delete" button (grayed out if system role)
3. Confirmation modal: "Delete {role_name}? All {X} users must be reassigned first."
4. If role has assigned users:
   - Show: "This role is assigned to X users. Reassign them first."
   - Show list of users with this role
   - Owner can click each user to edit their role
5. Once no users assigned:
   - Owner sees "Ready to delete" state
   - Owner confirms deletion
6. Frontend sends `DELETE /api/roles/:id`
7. Backend validates:
   - Role not system role
   - No users assigned to role
8. Backend deletes role + role_permissions entries
9. Backend logs deletion
10. Frontend removes role from list

### View Permission Dependencies
1. Owner clicks on permission in list
2. Tooltip/panel shows:
   - Permission name, description
   - Category, subcategory
   - Required by roles: [list]
   - Depends on permissions: [list]
3. Owner can click "View Dependent Role" to navigate

### Assign Role to User (From User Management)
1. Already covered in User Management module
2. Role assignment creates role_assignment_history entry
3. Backend logs: old_role → new_role, actor, timestamp

## 8. Business Rules

### Hard Constraints
- **System Roles Immutable**: Owner, Admin, User roles cannot be edited or deleted
- **Owner Always Has All Permissions**: Even if Owner's role modified, retains all permissions
- **Permission Name Unique**: Two permissions in same company cannot have same key
- **Role Name Unique**: Two roles in same company cannot have same name
- **Dependency Graph Valid**: No circular dependencies allowed
- **At Least Owner Role**: Company must have Owner role defined
- **One Role Per User Per Company**: User has exactly one role_id in company_users

### Soft Constraints
- System admin should define default permissions set (user-managed)
- All custom roles should have description (best practice)
- Permissions should be reviewed quarterly for relevance
- Unused roles should be archived/deleted

## 9. Edge Cases

### Invalid Scenarios
- Attempt to edit/delete Owner role → Reject: "System role cannot be modified"
- Attempt to create role with reserved name (Owner, Admin, User) → Reject: "Reserved name"
- Attempt to create role with duplicate name → Reject: "Role already exists"
- Attempt to delete role with assigned users → Reject: "Reassign users first"
- Attempt to assign circular dependency → Reject: "Invalid dependency"
- Attempt to create permission with invalid key format → Reject: "Key must be module:action"
- Attempt to remove permission required by other permission → Warn: "This permission is required by X other permissions"

### Recovery Paths
- Role accidentally modified → Owner can restore from audit log or reset to default
- User assigned wrong role → Owner can change via user edit: `PUT /api/users/:id/assignment`
- Conflicting permissions → Backend prevents via validation + dependency check
- Permission dependency broken → System auto-fix or notify admin

## 10. Security Notes

### Authorization Model
- **Owner Bypass**: Owner has implicit access to ALL operations (no permission check)
- **RBAC Enforcement**: Every API endpoint checks user's permissions
- **Permission Validation**: At API layer, NOT frontend only
- **Fail-Safe Default**: If permission check fails, deny access (deny by default)

### Permission Checking Algorithm
```
if (user is company owner) {
  allow all operations
} else if (user has requested permission) {
  allow operation
} else {
  deny operation with 403 Forbidden
}
```

### Audit Logging
- Every role creation/update/deletion logged
- Every role assignment/change logged with reason
- Every permission check logged (for security analysis)
- Include actor_user_id, timestamp, IP, user_agent

### Validation
- Role name: alphanumeric + spaces, no SQL special chars
- Permission key: must match regex `^[a-z_]+:[a-z_]+$` (module:action)
- Slug: alphanumeric + hyphens, must start with letter
- Sanitize all user input before storage

### Data Isolation
- Roles/permissions isolated by company_id
- User cannot view/edit roles/permissions from other companies
- Query: WHERE company_id = context.company_id

### Best Practices
- Create custom roles based on business needs (e.g., Manager, Supervisor)
- Use fine-grained permissions for flexible access control
- Document permission purposes in descriptions
- Review permissions quarterly for relevance
- Archive unused roles instead of deleting them
