# Tenant Module

## 📁 Project Structure Overview

This module relates to the following project structure:

```
trackly/
├── docs/
│   └── modules/
│       ├── 00-authentication.md
│       ├── 01-tenant.md           ← YOU ARE HERE
│       ├── 02-company.md
│       └── ... (10 more modules)
├── app/
│   ├── pages/
│   │   └── settings/
│   │       ├── tenants.vue (TODO)
│   │       └── tenant-settings.vue (TODO)
│   ├── composables/
│   │   └── tenant/
│   │       └── useTenant.ts        ← Tenant state & logic
│   ├── types/
│   │   └── tenant.ts              ← TypeScript interfaces
│   └── assets/css/
│       └── main.css               ← Global styles
├── backend/
│   ├── migrations/
│   │   └── 002_create_tenant_tables.sql  ← Database schema
│   ├── routes/
│   │   └── tenant/
│   │       ├── get-tenants.ts
│   │       ├── create-tenant.ts
│   │       └── tenant-settings.ts
│   ├── middleware/
│   │   └── tenantResolver.ts      ← Multi-tenancy middleware
│   └── models/
│       ├── Tenant.ts
│       ├── TenantSettings.ts
│       └── TenantAuditLog.ts
└── package.json
```

**Key Files for This Module:**
- **Frontend Pages**: `app/pages/settings/tenants.vue` (TODO)
- **State Management**: `app/composables/tenant/useTenant.ts`
- **Type Definitions**: `app/types/tenant.ts`
- **Backend**: `backend/routes/tenant/` for tenant APIs
- **Middleware**: `backend/middleware/tenantResolver.ts` for multi-tenancy context

---

## 1. Purpose
Tenants are top-level SaaS containers for multi-tenancy. Each tenant is isolated and independent. Tenants are seeded manually (no UI for creation). Tenants map to billing, pricing, and feature flags in external systems.

## 2. Routes / Pages
- No dedicated UI pages
- Tenant is resolved automatically during login
- Admin-only endpoint for tenant management (if needed): `/admin/tenants`

## 3. Actors & Roles
- **System Admin** - Only actor; can create/manage tenants (backend-only)
- **Company Owner** - Manages their company within tenant
- **Regular User** - Operates within tenant silently (never sees tenant UI)

## 4. Database Tables

### `tenants`
```
id (PK)
name (UNIQUE)
subdomain (UNIQUE) or code (UNIQUE)
logo_url
status (active | inactive | suspended)
plan (free | starter | pro | enterprise)
max_users
max_companies
max_projects
max_storage_gb
features (JSON) - Feature flags
metadata (JSON) - Custom fields
created_at
updated_at
```

### `tenant_users`
```
id (PK)
tenant_id (FK)
user_id (FK)
created_at
UNIQUE(tenant_id, user_id)
```

### `tenant_settings`
```
id (PK)
tenant_id (FK)
key (string)
value (JSON)
created_at
updated_at
UNIQUE(tenant_id, key)
```

### `tenant_audit_log`
```
id (PK)
tenant_id (FK)
actor_user_id (FK)
action (string)
resource_type (string)
resource_id (FK)
changes (JSON)
ip_address
user_agent
created_at
```

## 5. Relationships
- `tenant_users.tenant_id` → `tenants.id`
- `tenant_users.user_id` → `users.id`
- `tenant_settings.tenant_id` → `tenants.id`
- `tenant_audit_log.tenant_id` → `tenants.id`
- `tenant_audit_log.actor_user_id` → `users.id`
- `companies.tenant_id` → `tenants.id` (1-to-many)

## 6. API Endpoints

### Get Tenant by Identifier
```
GET /api/tenants/:identifier
Params: identifier (subdomain or code)
Response: {
  id,
  name,
  subdomain,
  code,
  plan,
  logo_url,
  max_users,
  max_companies,
  features: {}
}
```

### Get Tenant Settings
```
GET /api/tenants/:id/settings
Headers: Authorization: Bearer {token}
Response: {
  settings: [
    { key: "string", value: {} }
  ]
}
```

### Update Tenant Settings (Admin Only)
```
PUT /api/tenants/:id/settings
Headers: Authorization: Bearer {token}
Body: {
  key: string,
  value: {}
}
Response: {
  key,
  value
}
```

### List Users in Tenant (Admin Only)
```
GET /api/tenants/:id/users
Headers: Authorization: Bearer {token}
Response: {
  users: [
    { id, email, first_name, last_name, company_id, role }
  ]
}
```

### Get Tenant Audit Log (Admin Only)
```
GET /api/tenants/:id/audit-log?page=1&limit=50
Headers: Authorization: Bearer {token}
Response: {
  logs: [
    { id, actor_user_id, action, resource_type, resource_id, changes, created_at }
  ],
  total,
  page,
  limit
}
```

### Check Tenant Capacity (Admin/Owner)
```
GET /api/tenants/:id/capacity
Headers: Authorization: Bearer {token}
Response: {
  users: { used: 5, limit: 20 },
  companies: { used: 1, limit: 5 },
  projects: { used: 8, limit: 50 },
  storage_gb: { used: 2.5, limit: 100 }
}
```

## 7. Page Flow (Step-by-Step)

### Tenant Resolution During Login
1. User navigates to login page
2. User selects or enters tenant identifier (subdomain/code)
3. Frontend sends `POST /api/auth/login` with tenant_identifier
4. Backend queries: `SELECT * FROM tenants WHERE subdomain = ? OR code = ?`
5. If not found → Error: "Invalid tenant"
6. If found → Validate tenant status = `active`
7. If inactive/suspended → Error: "Tenant suspended, contact support"
8. Backend continues with user auth (email + password validation)
9. Backend validates user exists in `tenant_users`
10. Auth context created with tenant_id
11. User can now access all resources within tenant

### Backend Tenant Isolation
1. Every API request includes Authorization header with token
2. Token decoded to extract tenant_id
3. Every database query includes WHERE tenant_id = {decoded_tenant_id}
4. No query can fetch data from other tenants
5. Frontend reflects tenant name/logo in header

## 8. Business Rules

### Hard Constraints
- **Tenant Seeded Only**: No UI to create tenants (backend/database only)
- **Subdomain Unique**: One subdomain per tenant globally
- **Code Unique**: One code per tenant globally
- **Immutable Isolation**: User cannot access data outside their tenant
- **Status Required**: Only `active` tenants allow login
- **Plan Enforced**: User/company/project limits enforced per plan
- **One Tenant Per User**: User belongs to exactly one tenant (can have multiple companies within it)
- **Inactive Tenant Lock**: No operations allowed if tenant status != active

### Soft Constraints
- Tenant audit log kept for 1 year minimum
- Tenant settings audited on change
- Usage metrics tracked hourly
- Suspension notifies owner via email

## 9. Edge Cases

### Invalid Scenarios
- Tenant subdomain typo → Generic error: "Tenant not found"
- Tenant suspended → "This tenant has been suspended"
- User removed from tenant_users → Cannot login to that tenant
- Plan limit exceeded (e.g., max_users = 5, have 5, try to invite 6th) → "Plan limit reached"
- Duplicate subdomain attempted on update → Reject with conflict error

### Recovery Paths
- Tenant deactivated → Admin can reactivate
- Tenant suspended → Support team reviews, notifies owner
- Plan downgraded → Warn users of new limits, disable features if needed
- Capacity exceeded → Owner upgraded plan OR Owner removes inactive users

## 10. Security Notes

### Isolation
- **Row-Level Security**: Every query filtered by tenant_id
- **Logical Isolation**: No foreign keys cross tenants
- **API Isolation**: Token contains tenant_id, validated on every request
- **Cache Isolation**: Cache keys include tenant_id prefix

### Validation
- Tenant identifier case-insensitive
- Validate subdomain format (alphanumeric, hyphens only)
- Validate plan value against allowed enum
- Sanitize tenant metadata JSON input

### Audit
- All tenant setting changes logged
- All user additions/removals to tenant logged
- All capacity checks logged
- All suspension/activation logged with reason

### Data Residency (Future)
- Tenant can be assigned a region (EU, US, APAC)
- Data stored only in assigned region
- Comply with GDPR, CCPA, etc.
