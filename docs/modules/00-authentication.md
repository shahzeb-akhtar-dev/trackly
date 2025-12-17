# Authentication Module

## 📁 Project Structure Overview

This module relates to the following project structure:

```
trackly/
├── docs/
│   ├── modules/
│   │   ├── 00-authentication.md  ← YOU ARE HERE
│   │   ├── 01-tenant.md
│   │   ├── 02-company.md
│   │   ├── 03-settings.md
│   │   ├── 04-users.md
│   │   ├── 05-roles-permissions.md
│   │   ├── 06-task-management.md
│   │   ├── 07-time-tracking-global.md
│   │   ├── 08-time-management.md
│   │   ├── 09-attendance.md
│   │   ├── 10-payroll.md
│   │   ├── 11-reports.md
│   │   ├── 12-chat.md
│   │   └── 13-approval-engine.md
├── app/
│   ├── pages/
│   │   └── auth/                  ← Frontend routes for this module
│   │       ├── login.vue
│   │       ├── forgot-password.vue (TODO)
│   │       ├── reset-password.vue (TODO)
│   │       └── verify-email.vue (TODO)
│   ├── composables/
│   │   └── auth/
│   │       ├── useAuthLogin.ts    ← Authentication logic
│   │       └── useAuthState.ts    ← Auth state management
│   ├── types/
│   │   └── auth.ts               ← TypeScript interfaces
│   ├── layouts/
│   │   ├── default.vue           ← Main layout
│   │   └── blank.vue             ← Auth layout
│   └── assets/css/
│       └── main.css              ← Global styles
├── backend/
│   ├── migrations/
│   │   └── 001_create_auth_tables.sql  ← Database schema
│   ├── routes/
│   │   └── auth/
│   │       ├── login.ts
│   │       ├── forgot-password.ts
│   │       └── reset-password.ts
│   └── models/
│       ├── User.ts
│       ├── Tenant.ts
│       └── PasswordResetToken.ts
└── package.json
```

**Key Files for This Module:**
- **Frontend Pages**: `app/pages/auth/login.vue` (implemented), forgot-password, reset-password, verify-email
- **State Management**: `app/composables/auth/useAuthLogin.ts` & `useAuthState.ts`
- **Type Definitions**: `app/types/auth.ts`
- **Backend**: `backend/routes/auth/` and `backend/models/` for API endpoints and database models

---

## 1. Purpose
Secure login system for users to access the platform using tenant identifier, email, and password. No self-signup; users are invited by company owners. Multi-step authentication with email verification and password recovery.

## 2. Routes / Pages
- `/auth/login` - Main login page
- `/auth/forgot-password` - Password recovery initiation
- `/auth/reset-password` - Password reset with token
- `/auth/verify-email` - Email verification (post-signup)

## 3. Actors & Roles
- **Anonymous User** - Unauthenticated visitor accessing login
- **Invited User** - User invited by company owner (can create account via email link)
- **Existing User** - Already registered user logging in

## 4. Database Tables

### `users`
```
id (PK)
email (UNIQUE)
password_hash
first_name
last_name
avatar_url
phone
status (active | inactive | pending)
email_verified_at
created_at
updated_at
```

### `tenants`
```
id (PK)
name
subdomain (UNIQUE) or code (UNIQUE)
status (active | inactive)
created_at
```

### `tenant_users`
```
id (PK)
tenant_id (FK)
user_id (FK)
created_at
UNIQUE(tenant_id, user_id)
```

### `companies`
```
id (PK)
tenant_id (FK)
owner_user_id (FK) → users.id
name
status (active | inactive)
created_at
```

### `company_users`
```
id (PK)
company_id (FK)
user_id (FK)
role_id (FK)
status (active | inactive)
created_at
UNIQUE(company_id, user_id)
```

### `password_reset_tokens`
```
id (PK)
user_id (FK)
token (UNIQUE)
expires_at
created_at
```

### `user_invitations`
```
id (PK)
tenant_id (FK)
company_id (FK)
email (UNIQUE per company)
invited_by_user_id (FK)
invitation_token (UNIQUE)
accepted_at
expires_at
created_at
```

## 5. Relationships
- `tenant_users.tenant_id` → `tenants.id`
- `tenant_users.user_id` → `users.id`
- `companies.tenant_id` → `tenants.id`
- `companies.owner_user_id` → `users.id`
- `company_users.company_id` → `companies.id`
- `company_users.user_id` → `users.id`
- `company_users.role_id` → `roles.id`
- `password_reset_tokens.user_id` → `users.id`
- `user_invitations.tenant_id` → `tenants.id`
- `user_invitations.company_id` → `companies.id`
- `user_invitations.invited_by_user_id` → `users.id`

## 6. API Endpoints

### Login
```
POST /api/auth/login
Body: {
  email: string,
  password: string,
  tenant_identifier: string (subdomain or code)
}
Response: {
  access_token: string,
  refresh_token: string,
  user: { id, email, first_name, last_name },
  tenant: { id, name },
  company: { id, name },
  role: { id, name, permissions: [...] }
}
```

### Forgot Password
```
POST /api/auth/forgot-password
Body: {
  email: string,
  tenant_identifier: string
}
Response: {
  message: "Reset link sent to email"
}
```

### Reset Password
```
POST /api/auth/reset-password
Body: {
  token: string,
  new_password: string,
  confirm_password: string
}
Response: {
  message: "Password reset successfully"
}
```

### Verify Email
```
POST /api/auth/verify-email
Body: {
  token: string
}
Response: {
  message: "Email verified successfully"
}
```

### Refresh Token
```
POST /api/auth/refresh
Body: {
  refresh_token: string
}
Response: {
  access_token: string,
  refresh_token: string
}
```

### Logout
```
POST /api/auth/logout
Headers: Authorization: Bearer {token}
Response: {
  message: "Logged out successfully"
}
```

### Check Auth Status
```
GET /api/auth/me
Headers: Authorization: Bearer {token}
Response: {
  user: { id, email, first_name, last_name },
  company: { id, name },
  role: { id, name, permissions: [...] }
}
```

## 7. Page Flow (Step-by-Step)

### Login Flow
1. User lands on `/auth/login`
2. User enters: email, password, tenant identifier (dropdown or code input)
3. Form validates locally (email format, password length)
4. User clicks "Sign In"
5. Frontend sends `POST /api/auth/login`
6. Backend validates:
   - Tenant exists with identifier
   - User exists with email
   - Password matches hash
   - User is in tenant_users
   - User is in company_users with active status
7. Backend validates company owner relationship
8. Backend generates access_token & refresh_token
9. Response includes auth context: tenant_id, company_id, user_id, role_id
10. Frontend stores tokens in httpOnly cookies (or secure storage)
11. Frontend redirects to dashboard (`/`)
12. Auth context set in global state

### Forgot Password Flow
1. User clicks "Forgot Password" on login
2. Redirects to `/auth/forgot-password`
3. User enters email & tenant identifier
4. User clicks "Send Reset Link"
5. Backend checks if email + tenant exists
6. Backend generates unique reset token with 1-hour expiry
7. Backend sends email with reset link: `yourdomain.com/auth/reset-password?token={token}`
8. User clicks link in email
9. Redirects to `/auth/reset-password?token={token}`
10. User enters new password
11. Frontend sends `POST /api/auth/reset-password` with token + password
12. Backend validates token not expired
13. Backend hashes new password
14. Backend invalidates all refresh tokens (force re-login on all devices)
15. Redirects to login with success message

### Email Verification Flow
1. User is invited by company owner
2. User receives email with invite link: `yourdomain.com/auth/verify-email?token={token}`
3. User clicks link
4. Frontend redirects to `/auth/verify-email?token={token}`
5. Backend validates token exists & not expired
6. Backend sets `email_verified_at` on user
7. Backend sets user status to `active`
8. Frontend redirects to login page

## 8. Business Rules

### Hard Constraints
- **No Self-Signup**: Users cannot create accounts independently
- **Tenant Required at Login**: Every login requires tenant identifier
- **Email Uniqueness**: One email per tenant
- **Password Requirements**: Minimum 8 chars, mix of upper/lower/numbers/special chars
- **Single Company Default**: User invited to one company initially (can be added to more later)
- **Status Check**: Only `active` users in tenant_users can login
- **Company Active Check**: User's company_users record must be `active`
- **Owner Cannot Be Deleted**: Owner relationship preserved indefinitely
- **Token Expiry**: Reset tokens & invite tokens expire after 24-72 hours
- **No Duplicate Invites**: Only one active invite per email per company at a time
- **Email Verified Before Access**: User cannot access system until email_verified_at is set

### Soft Constraints
- Users should verify email within 24 hours
- Reset token expires after 1 hour (configurable)
- Invitation tokens expire after 7 days (configurable)
- Failed login attempts locked after 5 tries (15-min cooldown)
- All auth events logged with IP, device, timestamp

## 9. Edge Cases

### Invalid Scenarios
- Email not in any company of tenant → Reject
- User pending (not in company_users yet) → Reject with "Please complete signup"
- User invited but not yet accepted → Reject with "Check email for invitation"
- Tenant doesn't exist → Generic error: "Invalid tenant"
- Wrong password 5+ times → Lock account 15 minutes
- Reset token expired → "Link expired, request new reset"
- Invite token expired → "Invitation expired, ask company owner for new invite"
- User attempting to login from previously blocked IP → Additional verification
- Concurrent login from different devices → Allow (no single-session limit)
- Reset password while logged in → Allow, invalidates all sessions

### Recovery Paths
- Locked account → Owner can unlock from settings OR user waits 15 mins
- Forgot tenant identifier → Lookup form: "Enter email, get list of tenants"
- Forgot email → If user has access to original email, use "Forgot Password" feature
- Multiple company access → After login to first company, show: "You have access to X companies, switch?"

## 10. Security Notes

### Authentication & Authorization
- Passwords hashed with bcrypt (cost 12+)
- Tokens use HS256 or RS256 (JWT)
- Access tokens valid 15 minutes
- Refresh tokens valid 7 days
- Tokens stored in httpOnly, Secure cookies
- CSRF protection on all POST endpoints
- Rate limiting: 5 login attempts per IP per 15 minutes

### Tenant Isolation
- User can only access own tenant
- All queries filtered by tenant_id at API layer
- No cross-tenant data leakage possible

### Validation
- Tenant identifier case-insensitive (normalize on input)
- Email case-insensitive (normalize to lowercase)
- Password never logged, never sent in response
- All password operations use secure comparison
- All tokens use cryptographically secure random generation

### Audit Logging
- Log all login attempts (success & failure)
- Log all password changes
- Log all email verifications
- Log all invite acceptances
- Include: user_id, tenant_id, IP, user_agent, timestamp, status

### Social/SSO (Future)
- Structure allows OAuth2/OIDC integration
- Email verified automatically on SSO
- Tenant assigned via custom claim or lookup
