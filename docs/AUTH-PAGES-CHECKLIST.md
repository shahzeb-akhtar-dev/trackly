# Authentication Pages - Pre-Build Checklist ✅

## Project Analysis Summary

### Current State
✅ **Existing Files:**
- `app/pages/auth/login.vue` - Already implemented
- `app/composables/auth/useAuthLogin.ts` - Basic auth logic (TODO: API integration)
- `app/composables/auth/useAuthState.ts` - User state management
- `app/types/auth.ts` - AuthForm, AuthResponse types
- `app/layouts/blank.vue` - Auth layout (no header/sidebar)
- `app/assets/css/main.css` - CSS variables & design tokens

✅ **Design System in Place:**
- Color tokens: `--color-primary`, `--color-primary-soft`, `--color-primary-strong`, etc.
- Shadow tokens: `--shadow-soft`, `--shadow-strong`
- Radius tokens: `--radius-lg`, `--radius-full`
- Typography: Poppins font family

✅ **Global Theme:**
- Primary blue: `#0052cc` (main), `#228bfc` (light), `#154cb9` (dark)
- Surface white: `rgb(255 255 255)`
- Text colors: `rgb(17 24 39)` (main), `rgb(107 114 128)` (muted)
- Nuxt UI components available

---

## Pages to Create

### 1️⃣ `/auth/login.vue` - ✅ DONE
**Status**: Already implemented with split-screen design

**What it has:**
- Brand logo and gradient background
- Email/password form
- Remember me checkbox
- Forgot password link
- Demo credentials display
- Error handling
- Loading states

**Theme**: Card-based, blue primary colors, simple grid layout

---

### 2️⃣ `/auth/forgot-password.vue` - ❌ TODO
**Purpose**: User enters email to initiate password reset

**Required Elements:**
- Same header/footer as login
- Single form field: email input
- Submit button: "Send Reset Link"
- Success message: "Check your email for reset instructions"
- Error handling: "Email not found" or validation errors
- Link back to login
- Estimated wait time message

**Business Rules (from module):**
- User enters email + tenant identifier
- Backend generates reset token (1-hour expiry)
- Sends reset link via email
- Success message should not reveal if email exists (security)

**Theme**: Should match login page design (card, same colors, same typography)

---

### 3️⃣ `/auth/reset-password.vue` - ❌ TODO
**Purpose**: User resets password using token from email

**Required Elements:**
- Extract token from URL query params: `?token={token}`
- Two password fields: "New Password" + "Confirm Password"
- Password strength indicator
- Show/hide password toggles
- Submit button: "Reset Password"
- Validation errors
- Success message: "Password reset successfully, redirecting to login..."
- Error if token expired: "Link expired, request new reset"
- Error if tokens don't match

**Business Rules (from module):**
- Token must be valid and not expired
- Password must meet requirements: 8+ chars, upper/lower/numbers/special
- Passwords must match
- After reset, all refresh tokens invalidated (force re-login on all devices)
- After success, redirect to login after 2-3 seconds

**Theme**: Same as login/forgot-password (consistency)

---

### 4️⃣ `/auth/verify-email.vue` - ❌ TODO
**Purpose**: User verifies email after accepting invite

**Required Elements:**
- Extract token from URL query params: `?token={token}`
- Display: "Verifying your email..."
- On success: "Email verified! Creating your account..."
- Auto-redirect to login after 2-3 seconds with success message
- On error: "Verification link expired" with link to request new invite
- Loading spinner
- No form input needed (auto-verify on mount)

**Business Rules (from module):**
- Invitation token must be valid and not expired (7 days)
- Sets `email_verified_at` on user
- Sets user status to `active`
- Auto-redirect to login with success message

**Theme**: Simple, minimal, centered card with spinner

---

## Type System Check

### Current Types (app/types/auth.ts)
```typescript
interface AuthForm {
  email: string
  password: string
  rememberMe: boolean
}

interface AuthResponse {
  token: string
  user: { id, email, name }
}
```

### Types to Add/Update
```typescript
// Forgot password request
interface ForgotPasswordForm {
  email: string
  tenant_identifier: string
}

// Reset password request
interface ResetPasswordForm {
  password: string
  confirm_password: string
  token: string
}

// Password validation result
interface PasswordValidation {
  isValid: boolean
  errors: string[]
  strength: 'weak' | 'medium' | 'strong'
}

// Email verification
interface VerifyEmailResponse {
  message: string
  success: boolean
}
```

---

## Composable Functions Needed

### For forgot-password.vue
- `useAuthForgotPassword()`
  - `loading`, `error`, `success` state
  - `handleForgotPassword(email, tenant_identifier)` method
  - Email validation
  - Error handling

### For reset-password.vue
- `useAuthResetPassword()`
  - `loading`, `error`, `success` state
  - `handleResetPassword(token, password, confirmPassword)` method
  - Password validation (strength, requirements, match)
  - Error handling (token expired, validation errors)

### For verify-email.vue
- `useAuthVerifyEmail(token)`
  - `loading`, `error`, `success` state
  - Auto-verification on mount
  - Error handling (token expired, already verified)
  - Auto-redirect logic

---

## UI/Component Pattern Check

### From login.vue, we should maintain:
✅ Card design with padding `p-8`
✅ Blue primary color: `bg-blue-600`, `text-blue-600`, hover states
✅ Border styling: `border border-gray-200`
✅ Rounded corners: `rounded-lg`
✅ Input styling: custom inputs with blue focus ring
✅ Button styling: full-width, blue background, hover effects
✅ Error messages: red background `bg-red-50 border border-red-200`
✅ Dividers: `border-t border-gray-300`
✅ Typography: bold headings, muted subtitles
✅ Spacing: consistent gap patterns `gap-3`, `mb-6`, `space-y-4`

### Should use Nuxt UI components OR maintain consistency
- ⚠️ **Decision needed**: Login.vue uses custom HTML inputs, should we:
  1. Keep custom inputs for consistency across all auth pages, OR
  2. Switch to Nuxt UI `UInput`, `UButton`, etc.?

**Recommendation**: Keep custom inputs for consistency with login.vue, but ensure accessibility

---

## CSS Variables to Use

From `main.css`, these are available:
```css
--color-primary: #0052cc
--color-primary-soft: #228bfc
--color-primary-strong: #154cb9
--color-surface: rgb(255 255 255)
--color-surface-alt: rgb(245 247 250)
--color-border-subtle: rgb(229 231 235)
--color-border-strong: rgb(209 213 219)
--color-text-main: rgb(17 24 39)
--color-text-muted: rgb(107 114 128)
--color-text-on-primary: rgb(255 255 255)
--ui-color-success-500: rgb(34 197 94)
--ui-color-error-500: rgb(239 68 68)
--radius-lg: 20px
--radius-full: 9999px
--shadow-soft: 0 6px 20px rgb(13 92 208 / 0.25)
--shadow-strong: 0 12px 32px rgb(9 60 160 / 0.35)
```

**Action**: Update auth pages to use CSS variables instead of hard-coded colors

---

## Layout Check

All auth pages should use:
```typescript
definePageMeta({ layout: 'blank' })
```

This ensures no header/sidebar shows on auth routes.

---

## Security Checklist

### For all auth pages:
- ✅ Validate inputs on client
- ✅ Never display passwords in logs
- ✅ Use HTTPS only (production)
- ✅ CSRF tokens on forms (backend)
- ✅ Rate limiting (backend)
- ✅ Never reveal if email exists (generic errors)
- ✅ Token expiry checks
- ✅ Secure token generation (backend)

---

## File Locations & Naming

```
app/
├── pages/
│   └── auth/
│       ├── login.vue ✅ DONE
│       ├── forgot-password.vue ❌ TODO
│       ├── reset-password.vue ❌ TODO
│       └── verify-email.vue ❌ TODO
├── composables/
│   └── auth/
│       ├── useAuthLogin.ts ✅ EXISTS
│       ├── useAuthState.ts ✅ EXISTS
│       ├── useAuthForgotPassword.ts ❌ TODO
│       ├── useAuthResetPassword.ts ❌ TODO
│       └── useAuthVerifyEmail.ts ❌ TODO
└── types/
    └── auth.ts ✅ UPDATE with new types
```

---

## Build Order (Recommended)

1. **Update types** (`auth.ts`) - Add new interfaces
2. **Create composables** - Logic before UI
   - `useAuthForgotPassword.ts`
   - `useAuthResetPassword.ts`
   - `useAuthVerifyEmail.ts`
3. **Create pages** - UI using composables
   - `forgot-password.vue`
   - `reset-password.vue`
   - `verify-email.vue`
4. **Update ai-prompt.md** - Document patterns used
5. **Test flows** - Verify all pages work together

---

## What's NOT Missing

✅ Layouts configured
✅ CSS variables defined
✅ Design tokens ready
✅ Composable pattern established
✅ Type system started
✅ Login page as reference
✅ Nuxt UI installed
✅ Tailwind configured

---

## What We'll Build

1. 🔐 Enhanced auth type system (5-6 new interfaces)
2. 🎯 3 new composable functions for forgot/reset/verify
3. 📄 3 new auth pages with consistent design
4. 📚 Update ai-prompt.md with all auth page specs
5. ✅ Keep login.vue as-is (already follows pattern)

---

## Design Consistency

All auth pages will:
- Use `blank` layout
- Center content with card design
- Use CSS variables for colors
- Match login.vue typography
- Include error handling
- Show loading states
- Have back-to-login options
- Use consistent spacing/shadows

---

## Ready to Build? ✅

**Before we start, confirm:**
1. ✅ Keep custom HTML inputs (not Nuxt UI components) for consistency?
2. ✅ Use CSS variables throughout all pages?
3. ✅ Include password strength indicator on reset-password?
4. ✅ Auto-redirect on verify-email success?

**Default answers (unless you say otherwise):**
- Yes to all above
- Build in order: types → composables → pages
- Update ai-prompt.md after all pages complete
