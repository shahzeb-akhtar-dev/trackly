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
employment_type (full-time | part-time | contract | temporary)
reporting_manager_user_id (FK) → users.id - nullable
payroll_setting_id (FK) → payroll_settings.id - nullable
metadata (JSON)
created_at
updated_at
UNIQUE(company_id, user_id)
```

### `payroll_settings`
```
id (PK)
company_id (FK)
company_user_id (FK) → company_users.id
user_id (FK) → users.id
salary_amount (DECIMAL(15,2))
salary_currency (USD | EUR | GBP | etc.)
contract_type (permanent | fixed-term | probation)
contract_end_date (nullable, for fixed-term)
status (active | inactive | on-hold)
effective_date
last_modified_by (FK) → users.id
created_at
updated_at
UNIQUE(company_user_id)
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
- `company_users.payroll_setting_id` → `payroll_settings.id` (nullable)
- `payroll_settings.company_id` → `companies.id`
- `payroll_settings.company_user_id` → `company_users.id`
- `payroll_settings.user_id` → `users.id`
- `payroll_settings.last_modified_by` → `users.id`
- `user_invitations.tenant_id` → `tenants.id` (DEPRECATED - keeping for reference)
- `user_invitations.company_id` → `companies.id` (DEPRECATED)
- `user_invitations.invited_by_user_id` → `users.id` (DEPRECATED)
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
      department: { id, name }, status, hire_date, employee_id,
      payroll: { salary_amount, salary_currency, salary_frequency }
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
  role_id, reporting_manager_user_id, status, avatar_url,
  payroll: {
    salary_amount, salary_currency, contract_type,
    contract_end_date, status, effective_date
  }
}
```

### Create User (Direct Account Creation - NEW)
```
POST /api/users
Headers: Authorization: Bearer {token}
Body: {
  # Personal Information
  email (UNIQUE globally),
  password (min 12 chars, uppercase, lowercase, number, special char),
  first_name,
  last_name,
  phone,
  personal_email - optional,
  date_of_birth - optional,
  nationality - optional,
  address - optional,
  city - optional,
  state_code - optional,
  country_code - optional,
  postal_code - optional,
  emergency_contact_name - optional,
  emergency_contact_phone - optional,
  gender - optional (M | F | Other),
  marital_status - optional,
  avatar_url - optional,

  # Company Information (Required)
  role_id (must exist),
  department_id - optional,
  employee_id - optional,
  job_title,
  employment_type (full-time | part-time | contract | temporary),
  hire_date,
  reporting_manager_user_id - optional,

  # Payroll Settings (Optional but recommended)
  payroll: {
    salary_amount,
    salary_currency (USD | EUR | GBP | etc.),
    contract_type (permanent | fixed-term | probation),
    contract_end_date - optional (for fixed-term),
    status (active | inactive)
  }
}

Response (201 Created): {
  id,
  email,
  first_name,
  last_name,
  status: "active",
  company_user: {
    id,
    role_id,
    department_id,
    job_title,
    hire_date,
    status: "active"
  },
  payroll: {
    id,
    salary_amount,
    salary_currency,
    contract_type,
    status: "active"
  },
  message: "User created successfully and is ready to login"
}

Errors:
- 400: Email already exists
- 400: Invalid role_id
- 400: Invalid department_id
- 400: Password does not meet security requirements
- 409: Employee ID already exists in company
- 422: Missing required fields
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
  employment_type,
  reporting_manager_user_id
}
Response: { id, role_id, department_id, job_title, ... }
```

### Update Payroll Settings
```
PUT /api/users/:id/payroll
Headers: Authorization: Bearer {token}
Body: {
  salary_amount,
  salary_currency,
  contract_type,
  contract_end_date,
  effective_date
}
Response: {
  id,
  salary_amount,
  salary_currency,
  contract_type,
  contract_end_date,
  status: "active"
}

Errors:
- 403: User does not have payroll management permission
- 404: User not found
```

### Get Payroll Settings
```
GET /api/users/:id/payroll
Headers: Authorization: Bearer {token}
Response: {
  id,
  salary_amount,
  salary_currency,
  contract_type,
  contract_end_date,
  status,
  effective_date
}
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

### Delete User (Owner only)
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

## 7. Page Flow (Step-by-Step)

### User List View
1. Owner/Admin navigates to `/settings/users`
2. Frontend fetches `GET /api/users?page=1&limit=20`
3. Displays table:
   - Columns: Name, Email, Role, Department, Job Title, Salary, Status, Hire Date, Actions
   - Rows: All company users (excluding owner in separate section)
4. Features available:
   - Search by name/email: `GET /api/users?search=john`
   - Filter by role: `GET /api/users?role_id=5`
   - Filter by status: `GET /api/users?status=active`
   - Pagination: Show pages
5. Owner can click "Add New User" button → Go to Create User flow

### Create User Flow (Direct Account Creation)
1. Owner clicks "Add New User" button
2. Multi-step form opens with 3 sections (can be tabs or accordion):

   **STEP 1: Personal Information**
   - Email (required, UNIQUE globally) - focus on validation
   - First Name (required)
   - Last Name (required)
   - Password (required, min 12 chars, show strength meter)
   - Confirm Password (required)
   - Phone (required)
   - Personal Email (optional)
   - Date of Birth (optional, date picker)
   - Nationality (optional, country selector)
   - Address (optional)
   - City (optional)
   - State/Province (optional)
   - Country (optional, country dropdown)
   - Postal Code (optional)
   - Emergency Contact Name (optional)
   - Emergency Contact Phone (optional)
   - Gender (optional, dropdown)
   - Marital Status (optional, dropdown)
   - Avatar Upload (optional)

   **STEP 2: Company Information**
   - Role (required, dropdown) - loads from roles list
   - Department (optional, dropdown) - loads from departments list
   - Employee ID (optional, must be unique in company)
   - Job Title (required)
   - Employment Type (required, dropdown: full-time, part-time, contract, temporary)
   - Hire Date (required, date picker)
   - Reporting Manager (optional, dropdown - loads active users in company)

   **STEP 3: Payroll Settings**
   - Salary Amount (required)
   - Salary Currency (required, dropdown: USD, EUR, GBP, etc.)
   - Salary Frequency (required, dropdown: monthly, annual, hourly)
   - Pay Cycle (optional, dropdown: weekly, bi-weekly, monthly)
   - Pay Date Day (optional, 1-31 or day of week)
   - Bank Account Number (required, encrypted field)
   - Bank Code (required)
   - IBAN (optional)
   - SWIFT Code (optional)
   - Tax ID (required)
   - Tax Rate (required, percentage)
   - Pension Contribution (optional)
   - Pension Provider (optional)
   - Health Insurance Plan (optional)
   - Health Insurance Amount (optional)
   - Allowances (optional, array UI: add/remove rows)
   - Deductions (optional, array UI: add/remove rows)
   - Contract Type (required: permanent, fixed-term, probation)
   - Contract End Date (conditional, required if fixed-term)
   - CTC (Cost to Company) (required, auto-calculated or manual)
   - Gross Salary (auto-calculated from CTC)
   - Net Salary (auto-calculated)
   - Bonus Eligible (optional, checkbox)
   - Bonus Percentage (conditional, if eligible)
   - Payroll Status (dropdown: active, inactive)
   - Effective Date (date picker, default today)

3. Owner fills form (frontend validates each field)
4. Frontend shows validation errors in real-time:
   - Email format and uniqueness check (async)
   - Password strength indicator
   - Phone format per country
   - All required fields
5. Owner clicks "Create User"
6. Frontend validates all fields:
   - All required fields filled
   - Passwords match
   - Email doesn't exist globally
   - Employee ID unique in company
   - Role/Department valid
   - Payroll data complete and valid
7. Frontend sends `POST /api/users` with all data
8. Backend validates:
   - Email globally unique
   - Employee ID unique in company (if provided)
   - Role exists and is valid
   - Department exists (if provided)
   - Reporting manager is active user
   - Password meets security requirements
   - Payroll tax_id unique (if applicable)
   - Contract end date > hire date (if fixed-term)
9. Backend transaction (all or nothing):
   - Create user record with status=active
   - Hash password with bcrypt (cost 12+)
   - Create company_users record with role_id, status=active
   - Create payroll_settings record
   - Log user creation in user_audit_log
   - Calculate gross/net salary from inputs
10. Frontend shows success modal:
    - "User created successfully!"
    - Email: user@company.com
    - Role: Engineer
    - Hire Date: 2025-01-15
    - "User can now login with their credentials"
11. Options: "View User" or "Add Another User" or "Back to List"

### User Detail View & Edit
1. Owner/Admin clicks on user row in list
2. Navigates to `/settings/users/:id`
3. Frontend fetches `GET /api/users/:id` and `GET /api/users/:id/payroll`
4. Displays user info in 3 sections (tabs or accordion):

   **TAB 1: Personal Information**
   - All personal fields (editable by self or admin)
   - Avatar upload area
   - "Save Changes" button

   **TAB 2: Company Information**
   - Role (dropdown, editable by admin only)
   - Department (dropdown, editable by admin only)
   - Job Title (editable)
   - Employee ID (read-only after creation)
   - Employment Type (editable by admin)
   - Hire Date (read-only)
   - Reporting Manager (dropdown, editable by admin)
   - Status (active/inactive/suspended, editable by admin)
   - Status Change History (timeline view)
   - "Save Changes" button

   **TAB 3: Payroll Settings**
   - Salary Amount (editable by payroll admin)
   - Salary Currency (editable)
   - Contract Type (editable by admin: permanent, fixed-term, probation)
   - Contract End Date (editable by admin, required for fixed-term)
   - Status (editable by payroll admin: active, inactive)
   - Effective Date (editable for future payroll changes)
   - "Save Changes" button

5. Owner makes edits
6. Owner clicks "Save Changes"
7. Frontend validates updated fields
8. Frontend sends appropriate endpoint:
   - `PUT /api/users/:id` (personal)
   - `PUT /api/users/:id/assignment` (company)
   - `PUT /api/users/:id/payroll` (payroll)
9. Backend validates and updates
10. Backend logs changes in user_audit_log with old/new values
11. Frontend shows success toast: "Changes saved"

### User Status Management
1. Owner/Admin in user detail page clicks status action:
   - "Deactivate" → Confirmation modal
   - "Activate" → Immediate (no modal)
   - "Suspend" → Reason required modal
2. Owner confirms action
3. Frontend sends appropriate PATCH endpoint:
   - `PATCH /api/users/:id/deactivate`
   - `PATCH /api/users/:id/activate`
   - `PATCH /api/users/:id/suspend`
4. Backend validates:
   - User not company owner
   - Status change is valid (e.g., can't activate if suspended)
   - Actor has permission
5. Backend updates company_users.status
6. Backend invalidates user's refresh tokens (force logout)
7. Backend logs status change with timestamp and reason
8. Frontend refreshes and shows updated status

## 8. Business Rules

### Hard Constraints (Direct Account Creation Model)
- **Email Unique Globally**: One email = one user record, multiple companies via company_users
- **Password Required on Creation**: No invitation flow, user password set immediately at creation
- **Company Owner Cannot Be Deleted**: If users.id = companies.owner_user_id, reject delete
- **Company Owner Cannot Be Deactivated**: If users.id = companies.owner_user_id, reject deactivate
- **One Role Per User Per Company**: User can only have one role_id in company_users
- **Active Status Enforcement**: Only active users can login and access system
- **Email Must Be Valid**: Email format validation, normalized to lowercase
- **Employee ID Unique Per Company**: If provided, must be unique within company_users
- **Hire Date <= Today**: Cannot set future hire date
- **Password Requirements**: Minimum 12 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
- **User Cannot Edit Others' Password**: Only via separate password reset flow
- **Employment Type from Enum**: Must be full-time | part-time | contract | temporary
- **One Payroll Setting Per User**: User can only have one payroll_settings record per company
- **Contract End Date >= Hire Date**: For fixed-term contracts, end date must be after start date
- **Tax ID Must Be Valid**: Per country-specific format
- **Salary Amount Positive**: Must be > 0

### Soft Constraints (Best Practices)
- All users should have avatar (recommended, not required)
- Emergency contact should be filled (recommended before hire_date)
- Department assignment recommended for organizational structure
- Reporting manager creates hierarchy for org chart
- Health insurance plan should be assigned to all full-time employees
- Pension contributions recommended for permanent employees
- Bonus percentage recommended for bonus-eligible employees

### Payroll Generation Notes
```
Payroll is generated based on tracked time, not fixed salary frequency.
Salary amount in payroll_settings is used as the base/reference rate.
Actual payroll calculations are done in the payroll module based on:
- Time tracked entries
- Time off/leave taken
- Overtime hours
- Base salary amount

Payroll settings only stores the salary structure configuration.
```

### Status Transition Rules
```
User Status Transitions:
- active → inactive (via deactivate, employee leaves)
- active → suspended (temporary issue, disciplinary)
- inactive → active (rehire or reinstate)
- suspended → active (issue resolved)
- suspended → inactive (conversion to permanent inactive)
- No direct: active ↔ suspended (must go through inactive)

Company User Status Transitions:
- active → inactive (on termination)
- inactive → active (rehire)
- active → suspended (temporary suspension)
- suspended → active (unsuspend)

Payroll Status Independent:
- Can be inactive even if user is active (temporary payroll hold)
- Must be active for payroll processing
```

### Permission Rules
```
Users List / Create / Edit:
- company owner: full access
- admin role (if exists): full access
- hr role (if exists): can view, create, edit (except salary/tax fields)
- regular user: view self only

User Deletion:
- owner only (except self)
- cannot delete if owns company
- cannot delete if only admin

Payroll Access:
- company owner: full access
- payroll admin role: full access
- finance manager (if exists): read-only to salary/tax data
- regular user: cannot access

Audit Log Access:
- company owner: full access
- admin: full access
- user can view own entries (limited)
```

## 9. Edge Cases & Validation

### Invalid Scenarios - Creation
- Attempt to create user with existing email → Reject: "Email already exists"
- Attempt to create with invalid email format → Reject: "Invalid email format"
- Attempt to create with weak password → Reject: "Password must be 12+ chars with uppercase, lowercase, number, special char"
- Attempt to create with duplicate employee ID → Reject: "Employee ID already exists in company"
- Attempt to create with non-existent role → Reject: "Role does not exist"
- Attempt to create with non-existent department → Reject: "Department does not exist"
- Attempt to create with invalid phone format → Reject: "Invalid phone format for country"
- Attempt to create with future hire date → Reject: "Hire date cannot be in future"
- Attempt to create with invalid tax ID format → Reject: "Invalid tax ID format"
- Attempt to create with negative salary → Reject: "Salary must be positive"
- Attempt to create with manager as inactive user → Reject: "Manager must be active"
- Attempt to create with end_date < hire_date (fixed-term) → Reject: "Contract end date must be after hire date"

### Invalid Scenarios - Modification
- Attempt to edit company owner's role → Reject: "Cannot modify company owner"
- Attempt to delete company owner → Reject: "Cannot delete company owner"
- Attempt to deactivate company owner → Reject: "Cannot deactivate company owner"
- Attempt to change non-editable fields (employee_id, hire_date) → Reject after creation
- Attempt to set manager to inactive user → Reject: "Manager must be active"
- Attempt to set invalid department → Reject: "Department does not exist"
- Attempt to suspend and deactivate simultaneously → Reject: "Status conflict"

### Recovery Paths
- User created with wrong role → Admin can update via `PUT /api/users/:id/assignment`
- User with wrong salary → Payroll admin can update via `PUT /api/users/:id/payroll` (effective future date)
- User deactivated by mistake → Admin can reactivate via `PATCH /api/users/:id/activate`
- User suspended → Owner can investigate reason in audit log, then reactivate
- Payroll data entered wrong → Payroll admin can update, old salary history preserved
- Wrong department → Admin can reassign department
- User locked out → Deactivated user cannot login (no self-recovery, admin must activate)

### Data Integrity
- Email case-insensitive: "John@Company.com" = "john@company.com"
- Employee ID case-sensitive and unique per company
- Phone numbers stored with country code
- Salary calculations audited before each payroll run
- Payroll effective_date immutable after payroll processed
- Audit log immutable (INSERT only, no UPDATE/DELETE)

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

### Data Privacy
- Personal fields (date_of_birth, marital_status, etc.) encrypted at rest (if sensitive)
- Salary visible only to owner, admin, finance team (with permission)
- Tax ID encrypted at rest
- Bank details encrypted at rest
- Emergency contact visible only to HR (with permission)
- User cannot view other users' personal info (company_users only)

---

## 11. Production Readiness Checklist

### Backend Implementation
- [ ] User creation endpoint validates all fields (email, password, role, department, payroll)
- [ ] Email validation with MX record check (optional but recommended)
- [ ] Password hashed with bcrypt (cost 12+) before storage
- [ ] Payroll settings created atomically with user creation (transaction)
- [ ] Company owner cannot be deactivated or deleted (business rule enforced)
- [ ] All status transitions validated
- [ ] Audit logging implemented for every user action
- [ ] Soft delete support (is_deleted flag) for compliance
- [ ] Database constraints enforced:
  - [ ] Unique email at users table level
  - [ ] Unique employee_id per company
  - [ ] Unique payroll_setting per company_user
  - [ ] Foreign key constraints on all relationships
- [ ] API rate limiting on user creation (prevent spam)
- [ ] Input sanitization on all string fields (XSS prevention)
- [ ] SQL injection prevention (parameterized queries)
- [ ] JWT token invalidation on user deactivation (force logout)
- [ ] Password reset token expiry (24 hours)
- [ ] Payroll data PII encryption at rest
- [ ] Bank account number encrypted end-to-end
- [ ] Salary calculations audited with version history
- [ ] Performance: Index on email, employee_id, role_id, status

### Frontend Implementation
- [ ] User creation form with 3 sections (personal, company, payroll)
- [ ] Real-time email validation (async check for uniqueness)
- [ ] Password strength meter with requirements
- [ ] Form auto-save drafts (localStorage) to prevent data loss
- [ ] Field-level validation (email format, phone format, dates)
- [ ] Dropdown options load from API (roles, departments, countries)
- [ ] Conditional fields (e.g., contract_end_date only if fixed-term)
- [ ] Salary auto-calculation (gross, net, ctc)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading states and error handling
- [ ] Success/error toast notifications
- [ ] Confirmation modals for destructive actions
- [ ] User list with sorting and filtering
- [ ] Pagination with customizable page size
- [ ] Export users to CSV (with permission check)
- [ ] Bulk actions (deactivate, activate, reassign role)
- [ ] User audit log view with filters
- [ ] Accessibility (WCAG 2.1 Level AA compliance)

### Database Migrations
- [ ] Create users table
- [ ] Create company_users table
- [ ] Create payroll_settings table
- [ ] Create user_audit_log table (immutable)
- [ ] Create user_status_history table
- [ ] Create indexes on all foreign keys
- [ ] Create indexes on frequently queried fields (email, employee_id, status)
- [ ] Add check constraints for enums
- [ ] Add check constraints for positive amounts
- [ ] Add triggers for updated_at timestamps
- [ ] Document all migrations

### Security & Compliance
- [ ] GDPR compliance (user data export, deletion rights)
- [ ] Data encryption at rest for PII
- [ ] Data encryption in transit (HTTPS only)
- [ ] Role-based access control (RBAC) enforced on backend
- [ ] Audit trail for all user modifications
- [ ] Secure password policy enforced
- [ ] MFA support (optional enhancement)
- [ ] IP whitelisting support (for company admin)
- [ ] Session timeout after inactivity
- [ ] Login history tracking
- [ ] Failed login attempt tracking (prevent brute force)
- [ ] Password reset tokens one-time use only
- [ ] Sensitive endpoints require additional verification

### Testing
- [ ] Unit tests for user creation validation
- [ ] Unit tests for payroll calculations
- [ ] Integration tests for API endpoints
- [ ] Integration tests for permission checks
- [ ] E2E tests for user creation flow
- [ ] E2E tests for user edit flow
- [ ] E2E tests for user deactivation flow
- [ ] Load testing (create 10k users, verify performance)
- [ ] Security testing (SQL injection, XSS, CSRF)
- [ ] Test user creation with edge cases
- [ ] Test payroll calculations with various scenarios
- [ ] Test email validation (duplicate, invalid format)
- [ ] Test password strength requirements
- [ ] Test permission enforcement
- [ ] Test concurrent user creation (race conditions)

### Documentation
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Database schema documentation
- [ ] User creation guide for administrators
- [ ] Payroll settings guide
- [ ] Troubleshooting guide for common issues
- [ ] Audit log interpretation guide
- [ ] Data privacy & security policy
- [ ] Error codes documentation
- [ ] Migration guide from invitation model (if applicable)

### Monitoring & Logging
- [ ] Application logging (info, warning, error levels)
- [ ] API request/response logging
- [ ] Failed login attempt monitoring
- [ ] User creation success/failure tracking
- [ ] Payroll calculation audit logging
- [ ] Database query performance monitoring
- [ ] Alert on suspicious activities (bulk deactivations, etc.)
- [ ] Daily backup verification
- [ ] Log retention policy (e.g., 90 days min)
- [ ] CloudWatch/DataDog integration (if using cloud)

### Performance Optimization
- [ ] Database connection pooling
- [ ] Caching for frequently accessed data (roles, departments, countries)
- [ ] User list pagination (load 20 users at a time)
- [ ] Lazy loading for related data (payroll, audit log)
- [ ] API response compression (gzip)
- [ ] Database indexes on filter columns
- [ ] Query optimization (avoid N+1 queries)
- [ ] Async job for sending emails (not blocking user creation)
- [ ] Batch operations for bulk user actions
- [ ] CDN for static assets

### Deployment
- [ ] Environment variables for sensitive data
- [ ] Database migrations tested before deployment
- [ ] Feature flags for gradual rollout
- [ ] Rollback plan documented
- [ ] Load balancer configuration
- [ ] SSL/TLS certificates installed
- [ ] DDoS protection enabled
- [ ] WAF (Web Application Firewall) rules
- [ ] Zero-downtime deployment strategy
- [ ] Blue-green deployment or canary release

### Post-Launch
- [ ] Monitor error rates and API latency
- [ ] Gather user feedback on UX
- [ ] Review audit logs for unexpected patterns
- [ ] Performance baseline established
- [ ] On-call support team trained
- [ ] Runbook for common issues prepared
- [ ] Regular security audits scheduled

---

## 12. API Response Examples

### Create User Success Response
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "john.doe@company.com",
      "first_name": "John",
      "last_name": "Doe",
      "phone": "+1234567890",
      "status": "active",
      "avatar_url": "https://cdn.example.com/avatars/usr_abc123.jpg",
      "created_at": "2025-01-15T10:30:00Z"
    },
    "company_user": {
      "id": "cu_def456",
      "role": {
        "id": "role_1",
        "name": "Software Engineer"
      },
      "department": {
        "id": "dept_1",
        "name": "Engineering"
      },
      "job_title": "Senior Software Engineer",
      "employee_id": "EMP001",
      "hire_date": "2025-01-15",
      "employment_type": "full-time",
      "status": "active"
    },
    "payroll": {
      "id": "ps_ghi789",
      "salary_amount": 120000,
      "salary_currency": "USD",
      "contract_type": "permanent",
      "effective_date": "2025-01-15",
      "status": "active"
    }
  },
  "message": "User created successfully"
}
```

### Create User Error Response
```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email already exists"
      },
      {
        "field": "password",
        "message": "Password must contain uppercase, lowercase, number, and special character"
      },
      {
        "field": "salary_amount",
        "message": "Salary must be greater than 0"
      }
    ]
  }
}
```

### Get User Response
```json
{
  "status": "success",
  "data": {
    "id": "usr_abc123",
    "email": "john.doe@company.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "personal_email": "john@personal.com",
    "date_of_birth": "1990-05-20",
    "nationality": "USA",
    "address": "123 Main St",
    "city": "San Francisco",
    "country_code": "US",
    "postal_code": "94105",
    "emergency_contact_name": "Jane Doe",
    "emergency_contact_phone": "+1234567891",
    "status": "active",
    "avatar_url": "https://cdn.example.com/avatars/usr_abc123.jpg",
    "company_user": {
      "id": "cu_def456",
      "role_id": "role_1",
      "role_name": "Software Engineer",
      "department_id": "dept_1",
      "department_name": "Engineering",
      "job_title": "Senior Software Engineer",
      "employee_id": "EMP001",
      "hire_date": "2025-01-15",
      "employment_type": "full-time",
      "reporting_manager": {
        "id": "usr_xyz",
        "name": "Alice Manager"
      },
      "status": "active"
    },
    "payroll": {
      "id": "ps_ghi789",
      "salary_amount": 120000,
      "salary_currency": "USD",
      "contract_type": "permanent",
      "contract_end_date": null,
      "status": "active",
      "effective_date": "2025-01-15"
    }
  }
}
```

### User List Response
```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": "usr_abc123",
        "email": "john.doe@company.com",
        "first_name": "John",
        "last_name": "Doe",
        "role_name": "Software Engineer",
        "department_name": "Engineering",
        "job_title": "Senior Software Engineer",
        "status": "active",
        "hire_date": "2025-01-15",
        "salary_amount": 120000,
        "avatar_url": "https://cdn.example.com/avatars/usr_abc123.jpg"
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 20,
      "pages": 3
    }
  }
}
```

---

## 13. Implementation Notes

### Direct Account Creation Advantages
✅ Users ready to login immediately (no email verification step)
✅ Complete user profile at creation time
✅ All company/payroll details captured upfront
✅ Better for admin-driven user management
✅ Faster onboarding process
✅ Complete audit trail from creation

### Key Differences from Invitation Model
| Feature | Invitation Model | Direct Creation |
|---------|------------------|-----------------|
| Setup Time | 2-3 steps | 1 step |
| Data Collection | Phased | Upfront |
| Login Ready | After acceptance | Immediately |
| Email Verification | Required | Optional |
| Payroll Data | After hire | At creation |
| Admin Control | Medium | Full |
| User Autonomy | High | Low |

### Implementation Timeline
- **Week 1**: Database schema, migrations, backend API endpoints
- **Week 2**: Validation, error handling, audit logging
- **Week 3**: Frontend UI (form, table, modals)
- **Week 4**: Testing, performance optimization, documentation
- **Week 5**: Security review, compliance check, deployment prep

---

## 14. Troubleshooting Common Issues

### User Can't Login After Creation
- Check: `SELECT status FROM users WHERE id = ?`
- Verify status is "active"
- Check: `SELECT status FROM company_users WHERE user_id = ?`
- Verify company_users status is "active"
- Check audit log for deactivation events
- Verify password was hashed correctly (check bcrypt hash length)

### Salary Calculations Wrong
- Verify allowances and deductions are correct
- Check tax_rate is a percentage (0-100)
- Verify gross_salary = base + allowances - mandatory_deductions
- Check net_salary = gross - taxes - voluntary_deductions
- Review payroll history for previous salary changes

### Duplicate Email Error
- Email validation case-insensitive but storage case-preserved
- Check: `SELECT COUNT(*) FROM users WHERE LOWER(email) = LOWER(?)`
- Verify email not in user_invitations (deprecated table)
- Check if user exists in another tenant (if multi-tenant)

### Employee ID Conflicts
- Employee ID unique per company, not globally
- Verify: `SELECT COUNT(*) FROM company_users WHERE employee_id = ? AND company_id = ?`
- Check department or role filters not causing conflicts
- Review audit log for previous employee IDs

### Permission Denied on Update
- Verify actor has 'users:manage' permission
- Check: `SELECT has_permission('users:manage') FROM user_permissions WHERE user_id = ?`
- Company owner always has permission
- HR role may have limited permissions (view only, no salary edit)

---

## 15. Related Modules
- [00 - Authentication](00-authentication.md) - Login, password reset, MFA
- [01 - Tenant Management](01-tenant.md) - Multi-tenancy, data isolation
- [02 - Company Management](02-company.md) - Company structure, ownership
- [03 - Settings](03-settings.md) - System-wide configuration
- [05 - Roles & Permissions](05-roles-permissions.md) - RBAC system
- [10 - Payroll](10-payroll.md) - Salary processing, pay runs
- [09 - Attendance](09-attendance.md) - Time tracking, attendance records
