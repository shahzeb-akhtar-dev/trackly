# Company Module

## 📁 Project Structure Overview

This module relates to the following project structure:

```
trackly/
├── docs/
│   └── modules/
│       ├── 00-authentication.md
│       ├── 01-tenant.md
│       ├── 02-company.md         ← YOU ARE HERE
│       └── ... (11 more modules)
├── app/
│   ├── pages/
│   │   └── settings/
│   │       ├── company-profile.vue (TODO)
│   │       ├── departments.vue (TODO)
│   │       └── company-settings.vue (TODO)
│   ├── components/
│   │   └── company/
│   │       ├── CompanyProfileCard.vue (TODO)
│   │       └── DepartmentList.vue (TODO)
│   ├── composables/
│   │   └── company/
│   │       └── useCompany.ts      ← Company state & logic
│   ├── types/
│   │   └── company.ts             ← TypeScript interfaces
│   └── assets/css/
│       └── main.css               ← Global styles
├── backend/
│   ├── migrations/
│   │   └── 003_create_company_tables.sql
│   ├── routes/
│   │   └── company/
│   │       ├── get-company.ts
│   │       ├── update-company.ts
│   │       └── list-departments.ts
│   └── models/
│       ├── Company.ts
│       ├── Department.ts
│       └── CompanySettings.ts
└── package.json
```

**Key Files for This Module:**
- **Frontend Pages**: `app/pages/settings/company-profile.vue` (TODO)
- **Components**: `app/components/company/` for company UI
- **State Management**: `app/composables/company/useCompany.ts`
- **Type Definitions**: `app/types/company.ts`
- **Backend**: `backend/routes/company/` for company APIs

---

## 1. Purpose
Companies are business entities within a tenant. Each company has exactly one owner. Companies own all business data: tasks, time logs, users, projects, departments, etc. Multi-company support allows one tenant to manage multiple business units, each with independent configurations.

## 2. Routes / Pages
- No dedicated company management page (implicit in all modules)
- Company selector (if user in multiple companies): `/`
- Company context used in settings, tasks, users, payroll, reports

## 3. Actors & Roles
- **Company Owner** - Sole owner, ultimate decision-maker, cannot be deleted/demoted
- **Admin/HR** - Can manage company settings, users, roles (if role permits)
- **Regular User** - Operates within company context
- **System Admin** - Backend-only: can override, create companies (if needed)

## 4. Database Tables

### `companies`
```
id (PK)
tenant_id (FK)
owner_user_id (FK) → users.id
name (UNIQUE per tenant)
slug (UNIQUE per tenant)
description
logo_url
industry
country_code
state_code
city
address
phone
email
website
timezone
currency (USD, EUR, GBP, etc.)
status (active | inactive | archived)
employee_count
founded_year
tax_id
metadata (JSON)
created_at
updated_at
```

### `company_users`
```
id (PK)
company_id (FK)
user_id (FK)
role_id (FK)
department_id (FK) - nullable
status (active | inactive | suspended)
hire_date
employee_id (company-specific ID)
metadata (JSON)
created_at
updated_at
UNIQUE(company_id, user_id)
```

### `departments`
```
id (PK)
company_id (FK)
name (UNIQUE per company)
slug
description
manager_user_id (FK) → users.id - nullable
status (active | inactive)
metadata (JSON)
created_at
updated_at
```

### `company_settings`
```
id (PK)
company_id (FK)
key (string)
value (JSON)
created_at
updated_at
UNIQUE(company_id, key)
```

### `company_audit_log`
```
id (PK)
company_id (FK)
actor_user_id (FK)
action (string)
resource_type (string)
resource_id
changes (JSON)
ip_address
user_agent
created_at
```

## 5. Relationships
- `companies.tenant_id` → `tenants.id`
- `companies.owner_user_id` → `users.id` (one-to-one to owner)
- `company_users.company_id` → `companies.id`
- `company_users.user_id` → `users.id`
- `company_users.role_id` → `roles.id`
- `company_users.department_id` → `departments.id` (nullable)
- `departments.company_id` → `companies.id`
- `departments.manager_user_id` → `users.id` (nullable)
- `company_settings.company_id` → `companies.id`
- `company_audit_log.company_id` → `companies.id`

## 6. API Endpoints

### Get Current Company
```
GET /api/companies/current
Headers: Authorization: Bearer {token}
Response: {
  id,
  tenant_id,
  owner_user_id,
  name,
  slug,
  logo_url,
  timezone,
  currency,
  status,
  employee_count
}
```

### Get Company by ID
```
GET /api/companies/:id
Headers: Authorization: Bearer {token}
Response: {
  id,
  tenant_id,
  owner_user_id,
  name,
  slug,
  description,
  logo_url,
  industry,
  address,
  phone,
  email,
  website,
  timezone,
  currency,
  status
}
```

### Update Company Profile (Owner Only)
```
PUT /api/companies/:id
Headers: Authorization: Bearer {token}
Body: {
  name,
  description,
  logo_url,
  industry,
  address,
  phone,
  email,
  website,
  timezone,
  currency,
  employee_count,
  founded_year
}
Response: { id, name, ... }
```

### Get Company Users
```
GET /api/companies/:id/users
Headers: Authorization: Bearer {token}
Response: {
  users: [
    { id, email, first_name, last_name, role_id, department_id, status, hire_date }
  ]
}
```

### Get Company Settings
```
GET /api/companies/:id/settings
Headers: Authorization: Bearer {token}
Response: {
  settings: [
    { key, value }
  ]
}
```

### Update Company Settings (Owner/Admin)
```
PUT /api/companies/:id/settings
Headers: Authorization: Bearer {token}
Body: {
  key: string,
  value: {}
}
Response: { key, value }
```

### Get Departments
```
GET /api/companies/:id/departments
Headers: Authorization: Bearer {token}
Response: {
  departments: [
    { id, name, manager_user_id, status }
  ]
}
```

### Create Department
```
POST /api/companies/:id/departments
Headers: Authorization: Bearer {token}
Body: {
  name,
  description,
  manager_user_id
}
Response: { id, name, manager_user_id, status }
```

### Update Department
```
PUT /api/companies/:id/departments/:deptId
Headers: Authorization: Bearer {token}
Body: {
  name,
  description,
  manager_user_id
}
Response: { id, name, ... }
```

### Get Company Audit Log
```
GET /api/companies/:id/audit-log?page=1&limit=50
Headers: Authorization: Bearer {token}
Response: {
  logs: [
    { id, actor_user_id, action, resource_type, resource_id, changes, created_at }
  ]
}
```

## 7. Page Flow (Step-by-Step)

### Company Selection at Login (Multi-Company User)
1. User logs in successfully
2. Backend checks: How many companies does user belong to?
3. If 1 company → Set company_id in auth context, redirect to dashboard
4. If >1 company → Return list of companies in login response
5. Frontend shows: "You have access to X companies, choose one:"
6. User selects company
7. Frontend stores company_id in local state/context
8. Redirect to dashboard with company_id in context

### Company Profile View/Edit
1. Owner navigates to `/settings/company-profile`
2. Frontend fetches `GET /api/companies/current`
3. Frontend displays company info in read-only view
4. Owner clicks "Edit"
5. Form becomes editable
6. Owner updates fields: name, description, logo, timezone, currency, etc.
7. Owner clicks "Save"
8. Frontend validates locally
9. Frontend sends `PUT /api/companies/:id` with updated data
10. Backend validates:
    - User is company owner
    - Name not already used by another company in tenant
    - Timezone/currency valid
11. Backend updates `companies` table
12. Backend logs change in `company_audit_log`
13. Frontend shows success toast
14. Frontend refreshes company context

### Department Management
1. HR/Owner navigates to `/settings/departments`
2. Frontend fetches `GET /api/companies/:id/departments`
3. Displays list of departments
4. Owner clicks "Add Department"
5. Modal opens with form: name, description, manager (dropdown of users)
6. Owner fills form
7. Owner clicks "Create"
8. Frontend validates: name not empty, name not duplicate
9. Frontend sends `POST /api/companies/:id/departments`
10. Backend validates name uniqueness per company
11. Backend creates department
12. Backend logs creation
13. Frontend adds to list, shows success
14. Owner can also:
    - Edit department: `PUT /api/companies/:id/departments/:deptId`
    - Delete department: `DELETE /api/companies/:id/departments/:deptId` (soft-delete or reassign users)
    - Set manager: Update manager_user_id

## 8. Business Rules

### Hard Constraints
- **One Owner**: Every company has exactly one owner (companies.owner_user_id is NOT NULL and UNIQUE)
- **Owner Cannot Be Deleted**: If user_id = companies.owner_user_id, cannot be deleted from company_users
- **Owner Cannot Be Demoted**: If user is owner, cannot change their role_id
- **Unique Name Per Tenant**: Two companies in same tenant cannot have same name
- **Tenant Ownership**: Company.tenant_id cannot be changed after creation
- **Owner User Exists**: companies.owner_user_id must be a valid user in users table
- **Active Status Enforcement**: Only `active` companies allow normal operations
- **Department Name Unique Per Company**: Two departments in same company cannot have same name
- **Department Manager Optional**: manager_user_id can be NULL

### Soft Constraints
- Company should have at least 1 user (besides owner)
- Department should have at least 1 assigned user
- Company metadata should not exceed 10KB
- Timezone must be valid IANA timezone
- Currency must be valid ISO 4217 code

## 9. Edge Cases

### Invalid Scenarios
- Attempt to delete company owner → Reject: "Cannot delete company owner"
- Attempt to demote company owner → Reject: "Cannot change owner role"
- Attempt to change company tenant → Reject: "Tenant immutable"
- Attempt to rename company to existing name → Reject: "Name already in use"
- Attempt to set department manager to inactive user → Reject: "Manager must be active"
- Attempt to delete department with active users → Reject: "Reassign users first" OR soft-delete, reassign users automatically

### Recovery Paths
- Company archived → Owner can unarchive from settings OR contact support
- Owner inactive → Promote another admin temporarily, then resolve owner status
- Multiple companies, user in 2+ → Show selector, allow switching at any time
- Department dissolved → Reassign users to other departments, archive department

## 10. Security Notes

### Ownership Validation
- Every company operation checks: `user is company owner OR user has admin role`
- No `is_owner` flag in company_users (check dynamically: `companies.owner_user_id = user_id`)
- Owner bypasses RBAC checks (can do anything in company)

### Access Control
- User can only view/edit company if `company_users.company_id = context.company_id` exists
- User cannot switch to company they don't belong to (via company_users)
- Department visible only to users within same company

### Audit Logging
- All company profile changes logged with actor, old values, new values
- All department CRUD operations logged
- All user role/department assignment changes logged
- Include timestamp, IP, user agent

### Validation
- Sanitize company name, description (SQL injection, XSS prevention)
- Validate timezone against IANA list
- Validate currency against ISO 4217 enum
- Validate tax_id format per country
- Validate email format

### Data Isolation
- No query returns data from other companies
- Row-level security: WHERE company_id = context.company_id
