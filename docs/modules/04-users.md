# User Management Module

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
│       ├── 04-users.md           ← YOU ARE HERE
│       └── ... (9 more modules)
├── app/
│   ├── pages/
│   │   └── settings/
│   │       ├── users.vue          ← User list & management
│   │       └── users/
│   │           ├── [id].vue (TODO) ← User detail/edit
│   │           └── invite.vue (TODO) ← Invite users
│   ├── components/
│   │   └── users/
│   │       ├── UserTable.vue (TODO)
│   │       ├── UserForm.vue (TODO)
│   │       ├── UserInviteForm.vue (TODO)
│   │       └── RoleAssigner.vue (TODO)
│   ├── composables/
│   │   └── users/
│   │       ├── useUsers.ts        ← User CRUD operations
│   │       ├── useUserInvite.ts   ← Invite system
│   │       └── useUserProfile.ts  ← Profile management
│   ├── types/
│   │   └── user.ts               ← User interfaces
│   └── assets/css/
│       └── main.css
├── backend/
│   ├── migrations/
│   │   └── 005_create_user_tables.sql
│   ├── routes/
│   │   └── users/
│   │       ├── list.ts
│   │       ├── get.ts
│   │       ├── update.ts
│   │       ├── delete.ts
│   │       ├── invite.ts
│   │       └── profile.ts
│   └── models/
│       ├── User.ts
│       ├── CompanyUser.ts
│       ├── UserInvitation.ts
│       └── UserProfile.ts
└── package.json
```

**Key Files for This Module:**
- **Frontend Pages**: `app/pages/settings/users.vue` (user list), `users/[id].vue` (detail), `users/invite.vue` (invite form)
- **Components**: `app/components/users/` for user table, forms, role assigners
- **State Management**: `app/composables/users/` for user CRUD, invitations, and profile
- **Type Definitions**: `app/types/user.ts`
- **Backend**: `backend/routes/users/` for user management APIs

---

## 1. Purpose
Manage company users: invite, activate, deactivate, assign roles/departments, edit personal info, and handle employee lifecycle. Users are the core identity in the system, linked to company_users for company-specific context.

## 2. Routes / Pages
- `/settings/users` - User list with invite, filter, search
- `/settings/users/:id` - User detail, edit role/department, deactivate/activate

## 3. Actors & Roles
- **Company Owner** - Full user management (invite, edit, deactivate, delete)
- **Admin** (if role exists) - Full user management
- **HR** (if role exists) - Can view/edit users, cannot delete
- **Regular User** - Can view own profile only
- **Invited User** - Pending acceptance, can verify email but not in company_users yet

## 4. Database Tables

### `users`
```
id (PK)
email (UNIQUE globally, case-insensitive)
password_hash
first_name
last_name
avatar_url
phone
personal_email
date_of_birth
nationality
address
city
state_code
country_code
postal_code
emergency_contact_name
emergency_contact_phone
employment_type (full-time | part-time | contract | temporary)
marital_status
gender
status (active | inactive | pending)
email_verified_at
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
termination_date - nullable
employee_id (company-specific ID)
job_title
salary_amount - nullable
salary_currency
salary_frequency (monthly | annual | hourly)
reporting_manager_user_id (FK) → users.id - nullable
metadata (JSON)
created_at
updated_at
UNIQUE(company_id, user_id)
```

### `user_invitations`
```
id (PK)
tenant_id (FK)
company_id (FK)
email
invited_by_user_id (FK) → users.id
role_id (FK)
department_id (FK) - nullable
invitation_token (UNIQUE)
accepted_at
expires_at (24-72 hours from creation)
created_at
updated_at
```

### `user_audit_log`
```
id (PK)
company_id (FK)
actor_user_id (FK)
target_user_id (FK)
action (string: invite, activate, deactivate, role_change, department_change, delete)
old_values (JSON)
new_values (JSON)
reason (string) - optional
created_at
```

### `user_status_history`
```
id (PK)
user_id (FK)
company_id (FK)
status (active | inactive | suspended)
changed_by_user_id (FK)
reason (string)
created_at
```

## 5. Relationships
- `company_users.company_id` → `companies.id`
- `company_users.user_id` → `users.id`
- `company_users.role_id` → `roles.id`
- `company_users.department_id` → `departments.id` (nullable)
- `company_users.reporting_manager_user_id` → `users.id` (nullable)
- `user_invitations.tenant_id` → `tenants.id`
- `user_invitations.company_id` → `companies.id`
- `user_invitations.invited_by_user_id` → `users.id`
- `user_invitations.role_id` → `roles.id`
- `user_audit_log.company_id` → `companies.id`
- `user_audit_log.actor_user_id` → `users.id`
- `user_audit_log.target_user_id` → `users.id`

## 6. API Endpoints

### List Users in Company
```
GET /api/users?role_id=&department_id=&status=&search=&page=1&limit=20
Headers: Authorization: Bearer {token}
Response: {
  users: [
    {
      id, email, first_name, last_name, role: { id, name }, 
      department: { id, name }, status, hire_date, employee_id
    }
  ],
  total,
  page,
  limit
}
```

### Get User Detail
```
GET /api/users/:id
Headers: Authorization: Bearer {token}
Response: {
  id, email, first_name, last_name, phone, personal_email,
  date_of_birth, nationality, address, city, country_code,
  emergency_contact_name, emergency_contact_phone,
  employment_type, job_title, hire_date, department_id,
  role_id, reporting_manager_user_id, salary_amount, 
  status, avatar_url
}
```

### Invite User
```
POST /api/users/invite
Headers: Authorization: Bearer {token}
Body: {
  email,
  first_name,
  last_name,
  role_id,
  department_id - optional,
  job_title,
  employment_type,
  hire_date - optional
}
Response: {
  id, email, invitation_token, expires_at,
  invitation_link: "https://domain.com/auth/verify-email?token={token}"
}
```

### Accept Invitation
```
POST /api/auth/accept-invitation
Body: {
  token,
  password,
  confirm_password,
  phone - optional
}
Response: {
  message: "Invitation accepted, please login",
  email,
  tenant_identifier
}
```

### Update User Profile (Own or by Admin)
```
PUT /api/users/:id
Headers: Authorization: Bearer {token}
Body: {
  first_name,
  last_name,
  phone,
  personal_email,
  avatar_url,
  date_of_birth,
  nationality,
  address,
  city,
  country_code,
  emergency_contact_name,
  emergency_contact_phone
}
Response: { id, first_name, ... }
```

### Update User Role & Department (Owner/Admin only)
```
PUT /api/users/:id/assignment
Headers: Authorization: Bearer {token}
Body: {
  role_id,
  department_id,
  job_title,
  salary_amount,
  salary_frequency,
  employment_type,
  reporting_manager_user_id
}
Response: { id, role_id, department_id, job_title, ... }
```

### Activate User
```
PATCH /api/users/:id/activate
Headers: Authorization: Bearer {token}
Response: { id, status: "active" }
```

### Deactivate User
```
PATCH /api/users/:id/deactivate
Headers: Authorization: Bearer {token}
Body: {
  reason: string - optional
}
Response: { id, status: "inactive" }
```

### Suspend User
```
PATCH /api/users/:id/suspend
Headers: Authorization: Bearer {token}
Body: {
  reason: string
}
Response: { id, status: "suspended" }
```

### Delete User (Owner only, not company owner)
```
DELETE /api/users/:id
Headers: Authorization: Bearer {token}
Response: { message: "User removed from company" }
```

### Get User Audit Log
```
GET /api/users/:id/audit-log?page=1&limit=50
Headers: Authorization: Bearer {token}
Response: {
  logs: [
    { id, action, actor_user_id, old_values, new_values, created_at }
  ]
}
```

### Resend Invitation
```
POST /api/users/:id/resend-invitation
Headers: Authorization: Bearer {token}
Response: {
  message: "Invitation sent",
  expires_at
}
```

## 7. Page Flow (Step-by-Step)

### User List View
1. Owner/Admin navigates to `/settings/users`
2. Frontend fetches `GET /api/users?page=1&limit=20`
3. Displays table:
   - Columns: Name, Email, Role, Department, Status, Hire Date, Actions
   - Rows: All company users (excluding owner in separate section)
4. Features available:
   - Search by name/email: `GET /api/users?search=john`
   - Filter by role: `GET /api/users?role_id=5`
   - Filter by status: `GET /api/users?status=active`
   - Pagination: Show pages
5. Owner can click "Invite User" button → Go to Invite flow

### Invite User Flow
1. Owner clicks "Invite User" button
2. Modal/page opens with form:
   - Email (required, must not exist in company)
   - First Name (required)
   - Last Name (required)
   - Role (required, dropdown of roles)
   - Department (optional, dropdown)
   - Job Title (optional)
   - Employment Type (dropdown: full-time, part-time, contract)
   - Hire Date (optional, date picker)
3. Owner fills form
4. Owner clicks "Send Invitation"
5. Frontend validates: email format, not duplicate, all required fields
6. Frontend sends `POST /api/users/invite`
7. Backend validates:
   - Email not already in company_users
   - Email not pending invitation (active invite_token, not expired)
   - All required fields filled
   - Role exists and is valid
   - Department exists (if provided)
8. Backend creates `user_invitations` row
9. Backend generates secure invitation token (32+ char random string)
10. Backend sends email with link: `yourdomain.com/auth/verify-email?token={token}`
11. Email includes:
    - Company name
    - Invited by: Owner name
    - Role: Role name
    - Action button: "Accept Invitation"
    - Expires in 7 days
12. Frontend shows success: "Invitation sent to user@example.com, expires in 7 days"
13. User appears in list with status "Pending" (from invitation)

### Accept Invitation Flow
1. User receives email with invite link
2. User clicks "Accept Invitation"
3. Redirects to `/auth/verify-email?token={token}`
4. Frontend validates token exists (looks like: `POST /api/auth/validate-invitation-token`)
5. Frontend shows form:
   - First Name (pre-filled from invitation, editable)
   - Last Name (pre-filled from invitation, editable)
   - Password (required, strength indicator)
   - Confirm Password (required)
   - Phone (optional)
6. User fills form
7. User clicks "Accept"
8. Frontend validates: passwords match, password strong, phone format
9. Frontend sends `POST /api/auth/accept-invitation` with token + password + personal info
10. Backend validates:
    - Token exists in user_invitations
    - Token not expired
    - Token accepted_at is NULL (not already accepted)
11. Backend checks if user exists in users table:
    - If exists: Check email matches invitation.email
    - If not exists: Create new user record
12. Backend updates user: password_hash, status = active
13. Backend marks invitation: accepted_at = now()
14. Backend creates/updates company_users: role_id from invitation, status = active
15. Backend logs user creation/activation in user_audit_log
16. Frontend redirects to login page with message: "Account created! Please login."

### User Detail View & Edit
1. Owner/Admin clicks on user row in list
2. Navigates to `/settings/users/:id`
3. Frontend fetches `GET /api/users/:id`
4. Displays user info in two sections:

   **Personal Information** (editable by self or admin):
   - First Name, Last Name
   - Email (read-only, cannot change)
   - Phone, Personal Email
   - Date of Birth, Nationality
   - Address, City, Country
   - Emergency Contact Name & Phone
   - Avatar upload

   **Company Information** (editable by owner/admin only):
   - Role (dropdown)
   - Department (dropdown)
   - Job Title
   - Employee ID
   - Employment Type
   - Hire Date
   - Salary Amount & Currency & Frequency (if user has payroll permission)
   - Reporting Manager (dropdown of other users)
   - Status (active/inactive/suspended)

5. Owner clicks "Edit"
6. Form becomes editable
7. Owner updates fields
8. Owner clicks "Save"
9. Frontend sends `PUT /api/users/:id` (personal) or `PUT /api/users/:id/assignment` (company)
10. Backend validates:
    - User exists in company
    - User not company owner (if attempting destructive action)
    - Role/Department/Manager valid
    - Actor has permission to edit
11. Backend updates users + company_users tables
12. Backend logs changes in user_audit_log with old/new values
13. Frontend shows success: "User updated"

### Deactivate User Flow
1. Owner clicks user in list
2. In user detail, clicks "Deactivate" button
3. Confirmation modal appears: "Are you sure? This user will lose access immediately."
4. Owner clicks "Confirm"
5. Frontend sends `PATCH /api/users/:id/deactivate`
6. Backend validates:
   - User not company owner: `companies.owner_user_id != user_id`
   - User exists in company_users with active status
7. Backend updates company_users.status = inactive
8. Backend invalidates all user's refresh tokens (force logout all sessions)
9. Backend creates user_status_history entry with status=inactive
10. Backend logs deactivation in user_audit_log
11. Frontend refreshes user list
12. User now appears with status badge "Inactive"

## 8. Business Rules

### Hard Constraints
- **Email Unique Globally**: One email = one user record, multiple companies via company_users
- **Company Owner Cannot Be Deleted**: If users.id = companies.owner_user_id, reject delete
- **Company Owner Cannot Be Deactivated**: If users.id = companies.owner_user_id, reject deactivate
- **One Role Per User Per Company**: User can only have one role_id in company_users
- **Active Status Enforcement**: Only active users can login and access system
- **Invite Email Unique Per Company**: Cannot invite same email twice (active + accepted only)
- **Invitation Expiry Enforced**: Expired invitations cannot be accepted
- **Hire Date <= Today**: Cannot set future hire date (unless configurable)
- **User Cannot Edit Others' Password**: Only via reset-password flow
- **Employment Type from Enum**: Must be full-time | part-time | contract | temporary

### Soft Constraints
- All users should have avatar (but not required)
- Emergency contact should be filled before hire_date (best practice)
- Department assignment recommended (but optional)
- Reporting manager creates hierarchy (useful for org chart)
- Salary information sensitive (only visible to payroll/owner)

## 9. Edge Cases

### Invalid Scenarios
- Attempt to invite company owner → Reject: "Cannot invite owner"
- Attempt to invite email already in company → Reject: "User already in company"
- Attempt to invite expired invitation → Show: "Invite link expired, resend?"
- Attempt to delete company owner → Reject: "Cannot delete company owner"
- Attempt to deactivate company owner → Reject: "Cannot deactivate owner"
- Attempt to change owner's role → Reject: "Cannot modify owner role"
- Attempt to set manager to inactive user → Reject: "Manager must be active"
- Attempt to set invalid department → Reject: "Department does not exist"
- Attempt to invite email with SQL injection → Sanitize, reject if invalid format
- User has pending invitation, tries to accept again → Reject: "Already accepted"

### Recovery Paths
- Invitation expired → Owner can resend via `POST /api/users/:id/resend-invitation`
- User locked out after deactivation → Owner can reactivate: `PATCH /api/users/:id/activate`
- Wrong role assigned → Owner can update role via `PUT /api/users/:id/assignment`
- Suspended user → Owner can investigate reason, then reactivate
- User deleted by mistake → Restore from backup OR re-invite and restore data

## 10. Security Notes

### Access Control (RBAC)
- User list accessible to: owner, admin, HR (if role exists with permission)
- User edit accessible to: owner, admin, or self (personal info only)
- User delete accessible to: owner only
- User create (invite) accessible to: owner, admin
- Backend validates every operation: `if not (is_owner or has_permission('users:manage')) { reject }`

### Validation
- Email normalized to lowercase before validation/storage
- Phone validated per country (if possible)
- Names sanitized: no SQL special chars, XSS prevention
- Date of birth stored as date, age calculated on-the-fly
- Employment type validated against enum
- Salary stored as decimal, never float

### Audit Logging
- Every user creation logged with details
- Every role/department/salary change logged with before/after
- Every activation/deactivation/suspension logged with reason
- Every deletion logged with actor and timestamp
- Include IP, user_agent, timestamp

### Data Privacy
- Personal fields (date_of_birth, marital_status, etc.) encrypted at rest (if sensitive)
- Salary visible only to owner, admin, finance team (with permission)
- Emergency contact visible only to HR (with permission)
- User cannot view other users' personal info (company_users only)

### Password Security
- Passwords hashed with bcrypt (cost 12+)
- Password reset via secure token (24-hour expiry)
- Invitation tokens use cryptographically secure random (32+ chars)
- All password operations logged
- Password never shown, never echoed in responses
